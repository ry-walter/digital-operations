/* FOX NATION DASHBOARD — huddle notes page logic */

let currentHuddleDate = todayISO();
let liveActiveHuddle = false;      // true once a live fetch from HUDDLE_API_URL has succeeded
let huddleNotesCache = null;        // last-known full notes object (local or remote)
const huddleSaveTimers = {};        // per-slot debounce timers
const HUDDLE_POLL_MS = 20000;       // how often to check for other people's updates
const HUDDLE_SAVE_DEBOUNCE_MS = 800;

function setHuddleLiveIndicator(isLive) {
  const label = document.getElementById("huddle-live-indicator");
  const dot = document.getElementById("huddle-live-dot");
  if (label) label.textContent = isLive ? "LIVE SYS" : "LOCAL";
  if (dot) {
    dot.classList.toggle("bg-green-500", isLive);
    dot.classList.toggle("bg-zinc-400", !isLive);
  }
}

async function loadHuddleNotes() {
  const remote = await fetchRemoteHuddleNotes();
  if (remote) {
    huddleNotesCache = remote;
    liveActiveHuddle = true;
    // Keep localStorage as an up-to-date offline cache/fallback.
    saveHuddleNotes(remote);
  } else {
    huddleNotesCache = getHuddleNotes();
    liveActiveHuddle = false;
  }
  setHuddleLiveIndicator(liveActiveHuddle);
  return huddleNotesCache;
}

function renderHuddle() {
  document.getElementById("huddle-date-label").textContent = fmtLong(currentHuddleDate);
  const notes = huddleNotesCache || getHuddleNotes();
  const dayNotes = notes[currentHuddleDate] || {};
  const container = document.getElementById("huddle-cards");
  container.innerHTML = HUDDLE_SLOTS.map(slot => `
    <div class="rounded-xl border border-zinc-200 bg-white">
      <div class="flex items-center gap-2 border-b border-zinc-100 px-4 py-3 text-sm font-medium text-zinc-700">
        <span>🕐</span><span>${slot}</span>
      </div>
      <textarea data-slot="${slot}"
        class="h-64 w-full resize-none rounded-b-xl p-4 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
        placeholder="Enter notes for the ${slot} huddle...">${dayNotes[slot] ? escapeHTMLAttr(dayNotes[slot]) : ""}</textarea>
    </div>
  `).join("");

  container.querySelectorAll("textarea").forEach(ta => {
    ta.addEventListener("input", () => {
      const slot = ta.getAttribute("data-slot");
      commitHuddleNote(currentHuddleDate, slot, ta.value, { debounce: true });
    });
    ta.addEventListener("blur", () => {
      const slot = ta.getAttribute("data-slot");
      commitHuddleNote(currentHuddleDate, slot, ta.value, { debounce: false });
    });
  });
}

// Saves a note locally right away (so nothing is ever lost), and pushes it
// to the shared backend either immediately (on blur) or after a short
// debounce (while actively typing), so we're not hammering the API on
// every keystroke.
function commitHuddleNote(date, slot, value, { debounce }) {
  const notes = huddleNotesCache || getHuddleNotes();
  if (!notes[date]) notes[date] = {};
  notes[date][slot] = value;
  huddleNotesCache = notes;
  saveHuddleNotes(notes);

  const key = date + "|" + slot;
  if (huddleSaveTimers[key]) clearTimeout(huddleSaveTimers[key]);

  const flush = () => {
    delete huddleSaveTimers[key];
    saveRemoteHuddleNote(date, slot, value);
  };

  if (debounce) {
    huddleSaveTimers[key] = setTimeout(flush, HUDDLE_SAVE_DEBOUNCE_MS);
  } else {
    flush();
  }
}

// Polls the shared backend periodically so notes someone else just typed
// show up here too. Skips updating any textarea the user is actively
// focused in/editing, so we never clobber what they're mid-typing.
function startHuddlePolling() {
  setInterval(async () => {
    if (!HUDDLE_API_URL) return;
    const remote = await fetchRemoteHuddleNotes();
    if (!remote) {
      liveActiveHuddle = false;
      setHuddleLiveIndicator(false);
      return;
    }
    liveActiveHuddle = true;
    setHuddleLiveIndicator(true);
    huddleNotesCache = remote;
    saveHuddleNotes(remote);

    const dayNotes = remote[currentHuddleDate] || {};
    document.querySelectorAll('#huddle-cards textarea').forEach(ta => {
      if (document.activeElement === ta) return; // don't clobber active typing
      const slot = ta.getAttribute("data-slot");
      const value = dayNotes[slot] || "";
      if (ta.value !== value) ta.value = value;
    });
  }, HUDDLE_POLL_MS);
}

function escapeHTMLAttr(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", async () => {
  markActiveNav();
  await loadHuddleNotes();
  renderHuddle();
  startHuddlePolling();

  document.getElementById("huddle-prev").addEventListener("click", async () => {
    currentHuddleDate = addDays(currentHuddleDate, -1);
    renderHuddle();
  });
  document.getElementById("huddle-next").addEventListener("click", async () => {
    currentHuddleDate = addDays(currentHuddleDate, 1);
    renderHuddle();
  });
});
