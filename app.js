/* FOX NATION DASHBOARD — SHARED APP LOGIC */

const LS_EVENTS = "fnd_events_v1"; // legacy full-snapshot key (migrated away from)
const LS_EVENTS_ADDED = "fnd_events_added_v1";
const LS_EVENTS_REMOVED = "fnd_events_removed_v1";
const LS_PTO = "fnd_pto_v1";
const LS_HUDDLE = "fnd_huddle_v1";

const WEEKDAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_ABBR = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ---------- date helpers ----------
function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function parseISO(iso) {
  const [y,m,d] = iso.split("-").map(Number);
  return new Date(y, m-1, d);
}
function toISO(dateObj) {
  return `${dateObj.getFullYear()}-${String(dateObj.getMonth()+1).padStart(2,"0")}-${String(dateObj.getDate()).padStart(2,"0")}`;
}
function addDays(iso, n) {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}
function weekdayOf(iso) { return WEEKDAY_NAMES[parseISO(iso).getDay()]; }
function fmtShort(iso) {
  const d = parseISO(iso);
  return `${WEEKDAY_NAMES[d.getDay()].slice(0,3)}, ${MONTH_ABBR[d.getMonth()]} ${d.getDate()}`;
}
function fmtLong(iso) {
  const d = parseISO(iso);
  return `${MONTH_ABBR[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// ---------- storage ----------
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) { return fallback; }
}
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Events are stored as an OVERLAY on top of SEED_EVENTS (from data.js), not a
// full snapshot copy. This means updating SEED_EVENTS (e.g. re-syncing from
// Airtable) always takes effect immediately for every visitor — only the
// user's own manual additions/removals are persisted in localStorage.
function eventKey(ev) { return `${ev.date}|${ev.title}`; }

function getEvents() {
  // One-time migration: drop the old full-snapshot key if present so it
  // can never mask updated SEED_EVENTS data again.
  if (localStorage.getItem(LS_EVENTS) !== null) {
    localStorage.removeItem(LS_EVENTS);
  }
  const added = loadJSON(LS_EVENTS_ADDED, []);
  const removed = new Set(loadJSON(LS_EVENTS_REMOVED, []));
  const base = SEED_EVENTS.filter(ev => !removed.has(eventKey(ev)));
  return base.concat(added);
}

function addEvent(ev) {
  const added = loadJSON(LS_EVENTS_ADDED, []);
  added.push(ev);
  saveJSON(LS_EVENTS_ADDED, added);
}

function removeEvent(date, title) {
  const isSeed = SEED_EVENTS.some(ev => ev.date === date && ev.title === title);
  if (isSeed) {
    const removed = loadJSON(LS_EVENTS_REMOVED, []);
    const key = `${date}|${title}`;
    if (!removed.includes(key)) removed.push(key);
    saveJSON(LS_EVENTS_REMOVED, removed);
  } else {
    let added = loadJSON(LS_EVENTS_ADDED, []);
    added = added.filter(ev => !(ev.date === date && ev.title === title));
    saveJSON(LS_EVENTS_ADDED, added);
  }
}

function getLocalPTO() {
  let pto = loadJSON(LS_PTO, null);
  if (!pto) {
    pto = Object.assign({}, SEED_PTO);
    saveJSON(LS_PTO, pto);
  }
  return pto;
}
function saveLocalPTO(pto) { saveJSON(LS_PTO, pto); }

function getHuddleNotes() {
  let notes = loadJSON(LS_HUDDLE, null);
  if (!notes) {
    notes = JSON.parse(JSON.stringify(SEED_HUDDLE_NOTES));
    saveJSON(LS_HUDDLE, notes);
  }
  return notes;
}
function saveHuddleNotes(notes) { saveJSON(LS_HUDDLE, notes); }

// ---------- CSV parsing for the wall-calendar PTO sheet ----------
// Parses one or more published CSV tabs of the "DOPS MGMT PTO & Event
// Calendar" style sheet (month grid with merged cells) into
// { "YYYY-MM-DD": ["Name", ...] }
function parseCSVLine(line) {
  const cells = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i+1] === '"') { cur += '"'; i++; }
        else { inQuotes = false; }
      } else { cur += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { cells.push(cur); cur = ""; }
      else cur += c;
    }
  }
  cells.push(cur);
  return cells.map(s => s.trim());
}

function parseWallCalendarCSV(csvText) {
  const lines = csvText.split(/\r?\n/);
  const rows = lines.map(parseCSVLine);
  const result = {};

  let year = new Date().getFullYear();
  let month = null; // 0-11
  let weekdayCols = null; // exact column indices for [Sun,Mon,Tue,Wed,Thu,Fri,Sat]
  // (Google Sheets CSV export duplicates merged cells' worth of columns as
  // blanks — e.g. a "Sunday" header merged across 2 columns exports as
  // "Sunday,,Monday,,...". So weekday columns are NOT reliably 0-6; we must
  // detect their real positions from the header row itself.)

  function nonBlankCount(r) { return r.filter(c => c.trim() !== "").length; }

  function findWeekdayHeaderCols(r) {
    const idxOf = name => r.findIndex(c => c.trim().toLowerCase() === name);
    const order = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    const cols = order.map(idxOf);
    if (cols.every(i => i !== -1) && cols.every((v,k) => k === 0 || v > cols[k-1])) return cols;
    return null;
  }

  function isDayRow(r, cols) {
    if (!cols) return { ok: false, count: 0 };
    let count = 0;
    for (const idx of cols) {
      const cell = (r[idx] || "").trim();
      if (cell === "") continue;
      if (/^\d{1,2}$/.test(cell) && parseInt(cell,10) >= 1 && parseInt(cell,10) <= 31) { count++; continue; }
      return { ok: false, count: 0 };
    }
    return { ok: count >= 1, count };
  }
  function dayColsOf(r, cols) {
    return cols.map(idx => ({ idx, num: /^\d{1,2}$/.test((r[idx]||"").trim()) ? parseInt(r[idx].trim(),10) : null }))
      .filter(c => c.num !== null && c.num >= 1 && c.num <= 31);
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const joined = row.join(" ");

    // Month/year header, e.g. "AUGUST 2026" (only 1-2 non-blank cells, even
    // though the row may have many trailing blank columns from merges).
    const monthMatch = MONTH_NAMES.find(m => joined.toUpperCase().includes(m.toUpperCase()));
    const yearMatch = joined.match(/\b(20\d{2})\b/);
    if (monthMatch && yearMatch && nonBlankCount(row) <= 2) {
      month = MONTH_NAMES.indexOf(monthMatch);
      year = parseInt(yearMatch[1], 10);
      weekdayCols = null; // must re-detect for this month's header row
      continue;
    }

    // Weekday header row, e.g. "Sunday,,Monday,,Tuesday,,...,,LINKS"
    const foundCols = findWeekdayHeaderCols(row);
    if (foundCols) {
      weekdayCols = foundCols;
      continue;
    }

    const thisIsDayRow = isDayRow(row, weekdayCols);

    if (thisIsDayRow.ok && month !== null && weekdayCols) {
      const dayCols = dayColsOf(row, weekdayCols);
      // Collect content rows until the next day-number row or month header
      const dateByCol = {};
      dayCols.forEach(c => { dateByCol[c.idx] = c.num; });

      let j = i + 1;
      const contentRows = [];
      while (j < rows.length) {
        const nextRow = rows[j];
        const nextJoined = nextRow.join(" ");
        // Only treat as a new month header if it's a short row that's
        // essentially just "MONTH YYYY" — matching a month name anywhere
        // in a longer row (e.g. an event titled "... every Fri in August")
        // would otherwise falsely truncate the week's content rows.
        const nextMonthMatch = MONTH_NAMES.find(m => nextJoined.toUpperCase().includes(m.toUpperCase()));
        const nextYearMatch = nextJoined.match(/\b(20\d{2})\b/);
        const looksLikeHeader = !!(nextMonthMatch && nextYearMatch && nonBlankCount(nextRow) <= 2);
        if (isDayRow(nextRow, weekdayCols).ok || looksLikeHeader) break;
        contentRows.push(nextRow);
        j++;
      }

      // Scan content rows for "<Name> Out" patterns, matched to the day column
      contentRows.forEach(cRow => {
        weekdayCols.forEach(idx => {
          const cell = (cRow[idx] || "").trim();
          const m = cell.match(/^(.*?)\s+[Oo]ut\b/);
          if (m && dateByCol[idx] !== undefined) {
            const name = m[1].trim();
            if (!name) return;
            const dd = String(dateByCol[idx]).padStart(2,"0");
            const mm = String(month+1).padStart(2,"0");
            const iso = `${year}-${mm}-${dd}`;
            if (!result[iso]) result[iso] = [];
            if (!result[iso].includes(name)) result[iso].push(name);
          }
        });
      });

      i = j - 1;
    }
  }
  return result;
}

async function fetchLivePTO() {
  const urls = Array.isArray(PTO_CSV_URL) ? PTO_CSV_URL.filter(Boolean) : (PTO_CSV_URL ? [PTO_CSV_URL] : []);
  if (urls.length === 0) return null;
  try {
    const merged = {};
    for (const url of urls) {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error("CSV fetch failed: " + res.status);
      const text = await res.text();
      const parsed = parseWallCalendarCSV(text);
      Object.assign(merged, parsed);
    }
    return merged;
  } catch (e) {
    console.warn("Live PTO fetch failed, falling back to local data:", e);
    return null;
  }
}

// ---------- sidebar active state ----------
function markActiveNav() {
  const path = window.location.pathname;
  document.querySelectorAll("[data-nav]").forEach(el => {
    const target = el.getAttribute("data-nav");
    const isHuddle = path.includes("huddle");
    if ((target === "huddle") === isHuddle) {
      el.classList.add("bg-red-50", "text-red-800");
      el.classList.remove("text-zinc-300");
    }
  });
}
