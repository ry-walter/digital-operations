/* FOX NATION DASHBOARD - SHARED APP LOGIC */

const LS_EVENTS = "fnd_events_v1";
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

function getEvents() {
  let events = loadJSON(LS_EVENTS, null);
  if (!events) {
    events = SEED_EVENTS.slice();
    saveJSON(LS_EVENTS, events);
  }
  return events;
}
function saveEvents(events) { saveJSON(LS_EVENTS, events); }

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

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const joined = row.join(" ");

    // Month/year header, e.g. "AUGUST 2026"
    const monthMatch = MONTH_NAMES.find(m => joined.toUpperCase().includes(m.toUpperCase()));
    const yearMatch = joined.match(/\b(20\d{2})\b/);
    if (monthMatch && yearMatch && row.length <= 2) {
      month = MONTH_NAMES.indexOf(monthMatch);
      year = parseInt(yearMatch[1], 10);
      continue;
    }

    // A "day number" row: within the first 7 (weekday) columns, every
    // non-blank cell is a bare integer 1-31, and at least one is present.
    // (Restricting to 7 cols means an extra trailing "LINKS" column, which
    // often contains text, doesn't disqualify the row. Requiring ALL
    // weekday cells to be numeric-or-blank avoids false positives on
    // content rows that merely contain a number somewhere.)
    function isDayRow(r) {
      const weekCols = r.slice(0, 7);
      let count = 0;
      for (const cell of weekCols) {
        if (cell === "") continue;
        if (/^\d{1,2}$/.test(cell) && parseInt(cell,10) >= 1 && parseInt(cell,10) <= 31) { count++; continue; }
        return { ok: false, count: 0 };
      }
      return { ok: count >= 1, count };
    }
    function dayColsOf(r) {
      return r.slice(0,7).map((cell, idx) => ({ idx, num: /^\d{1,2}$/.test(cell) ? parseInt(cell,10) : null }))
        .filter(c => c.num !== null && c.num >= 1 && c.num <= 31);
    }

    const thisIsDayRow = isDayRow(row);

    if (thisIsDayRow.ok && month !== null) {
      const dayCols = dayColsOf(row);
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
        const looksLikeHeader = !!(nextMonthMatch && nextYearMatch && nextRow.length <= 2);
        if (isDayRow(nextRow).ok || looksLikeHeader) break;
        contentRows.push(nextRow);
        j++;
      }

      // Scan content rows for "<Name> Out" patterns, matched to the day column
      contentRows.forEach(cRow => {
        cRow.forEach((cell, idx) => {
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
