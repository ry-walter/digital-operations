/* FOX NATION DASHBOARD — huddle notes page logic */

let currentHuddleDate = todayISO();

function renderHuddle() {
  document.getElementById("huddle-date-label").textContent = fmtLong(currentHuddleDate);
  const notes = getHuddleNotes();
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
      const notes = getHuddleNotes();
      if (!notes[currentHuddleDate]) notes[currentHuddleDate] = {};
      notes[currentHuddleDate][ta.getAttribute("data-slot")] = ta.value;
      saveHuddleNotes(notes);
    });
  });
}

function escapeHTMLAttr(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  renderHuddle();
  document.getElementById("huddle-prev").addEventListener("click", () => {
    currentHuddleDate = addDays(currentHuddleDate, -1);
    renderHuddle();
  });
  document.getElementById("huddle-next").addEventListener("click", () => {
    currentHuddleDate = addDays(currentHuddleDate, 1);
    renderHuddle();
  });
});
