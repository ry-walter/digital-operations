/* FOX NATION DASHBOARD — dashboard page logic */

let liveActivePTO = false; // true once a live CSV fetch has succeeded

function renderStats(events, pto) {
  document.getElementById("stat-events").textContent = events.length;
  const ptoDays = Object.values(pto).reduce((sum, names) => sum + names.length, 0);
  document.getElementById("stat-pto").textContent = ptoDays;
}

function groupEvents(events) {
  const today = todayISO();
  const tomorrow = addDays(today, 1);
  const todayDow = parseISO(today).getDay(); // 0=Sun
  const weekStart = addDays(today, -todayDow);
  const weekEnd = addDays(weekStart, 6);

  const sorted = events.slice().sort((a,b) => a.date.localeCompare(b.date));
  const groups = []; // { key, label, items: [] }
  const groupIndex = {};

  function pushTo(key, label, ev) {
    if (!groupIndex[key]) {
      groupIndex[key] = { key, label, items: [] };
      groups.push(groupIndex[key]);
    }
    groupIndex[key].items.push(ev);
  }

  sorted.forEach(ev => {
    if (ev.date < today) return; // don't show past events
    if (ev.date === today) pushTo("today", "Today", ev);
    else if (ev.date === tomorrow) pushTo("tomorrow", "Tomorrow", ev);
    else if (ev.date > tomorrow && ev.date <= weekEnd) pushTo("thisweek", "This Week", ev);
    else pushTo(ev.date, `${weekdayOf(ev.date)}, ${fmtShort(ev.date).split(", ")[1]}`, ev);
  });

  return groups;
}

function eventRowHTML(ev) {
  const d = parseISO(ev.date);
  const dayNum = String(d.getDate()).padStart(2,"0");
  return `
  <div class="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4 group">
    <div class="flex h-12 w-12 flex-none items-center justify-center rounded-lg bg-red-50 text-red-800 font-semibold">
      ${dayNum}
    </div>
    <div class="min-w-0 flex-1">
      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <span>${fmtShort(ev.date)}</span>
        ${ev.time ? `<span class="inline-flex items-center gap-1">· ${ev.time}</span>` : ""}
      </div>
      <div class="font-medium text-zinc-900">${escapeHTML(ev.title)}</div>
      <div class="mt-0.5 text-xs text-zinc-500">${escapeHTML(ev.category || "")}</div>
    </div>
    <button data-remove-event="${ev.date}|${encodeURIComponent(ev.title)}"
      class="opacity-0 group-hover:opacity-100 text-zinc-300 hover:text-red-600 transition">✕</button>
  </div>`;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderEvents(events) {
  const groups = groupEvents(events);
  const container = document.getElementById("events-list");
  if (groups.length === 0) {
    container.innerHTML = `<p class="text-sm text-zinc-400">No upcoming events.</p>`;
    return;
  }
  container.innerHTML = groups.map(g => `
    <div class="mb-6">
      <div class="mb-2 flex items-center gap-2">
        <span class="text-xs font-semibold uppercase tracking-wide text-zinc-500">${g.label}</span>
        <span class="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-100 px-1.5 text-xs text-zinc-600">${g.items.length}</span>
      </div>
      <div class="space-y-2">
        ${g.items.map(eventRowHTML).join("")}
      </div>
    </div>
  `).join("");
}

function renderPTO(pto) {
  const container = document.getElementById("pto-list");
  const dates = Object.keys(pto).sort();
  const addBtn = document.getElementById("pto-add-btn");
  if (addBtn) addBtn.style.display = liveActivePTO ? "none" : "";

  if (dates.length === 0) {
    container.innerHTML = `<p class="text-sm text-zinc-400">No PTO scheduled.</p>`;
    return;
  }
  container.innerHTML = dates.map(iso => `
    <div class="border-b border-zinc-100 py-3 last:border-0">
      <div class="flex items-center justify-between text-xs text-zinc-500">
        <span class="font-medium text-zinc-700">${fmtLong(iso)}</span>
        <span>${weekdayOf(iso).toLowerCase()}</span>
      </div>
      <div class="mt-2 flex flex-wrap gap-1.5">
        ${pto[iso].map(name => `
          <span class="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
            ${escapeHTML(name)}
            ${liveActivePTO ? "" : `<button data-remove-pto="${iso}|${encodeURIComponent(name)}" class="text-zinc-400 hover:text-red-600">✕</button>`}
          </span>
        `).join("")}
      </div>
    </div>
  `).join("");
}

function wireEventHandlers() {
  document.getElementById("add-event-btn").addEventListener("click", () => {
    const date = prompt("Event date (YYYY-MM-DD)?", todayISO());
    if (!date) return;
    const title = prompt("Event title?");
    if (!title) return;
    const category = prompt("Category (e.g. Fox Nation Series, Live Stream)?", "Fox Nation Series") || "";
    const time = prompt("Time (optional, e.g. 7:00pm)?", "") || undefined;
    addEvent({ date, title, category, time });
    refreshDashboard();
  });

  document.getElementById("events-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-event]");
    if (!btn) return;
    const [date, encTitle] = btn.getAttribute("data-remove-event").split("|");
    const title = decodeURIComponent(encTitle);
    removeEvent(date, title);
    refreshDashboard();
  });

  const addPtoBtn = document.getElementById("pto-add-btn");
  if (addPtoBtn) {
    addPtoBtn.addEventListener("click", () => {
      if (liveActivePTO) return;
      const date = prompt("PTO date (YYYY-MM-DD)?", todayISO());
      if (!date) return;
      const name = prompt("Name?");
      if (!name) return;
      const pto = getLocalPTO();
      if (!pto[date]) pto[date] = [];
      if (!pto[date].includes(name)) pto[date].push(name);
      saveLocalPTO(pto);
      refreshDashboard();
    });
  }

  document.getElementById("pto-list").addEventListener("click", (e) => {
    const btn = e.target.closest("[data-remove-pto]");
    if (!btn || liveActivePTO) return;
    const [date, encName] = btn.getAttribute("data-remove-pto").split("|");
    const name = decodeURIComponent(encName);
    const pto = getLocalPTO();
    if (pto[date]) {
      pto[date] = pto[date].filter(n => n !== name);
      if (pto[date].length === 0) delete pto[date];
    }
    saveLocalPTO(pto);
    refreshDashboard();
  });
}

function futureOnly(pto) {
  const today = todayISO();
  const filtered = {};
  Object.keys(pto).forEach(iso => {
    if (iso >= today) filtered[iso] = pto[iso];
  });
  return filtered;
}

async function refreshDashboard() {
  const events = getEvents();
  const livePTO = await fetchLivePTO();
  const pto = futureOnly(livePTO || getLocalPTO());
  liveActivePTO = !!livePTO;
  document.getElementById("live-indicator").textContent = liveActivePTO ? "LIVE SYS" : "LOCAL";
  renderStats(events, pto);
  renderEvents(events);
  renderPTO(pto);
}

document.addEventListener("DOMContentLoaded", () => {
  markActiveNav();
  wireEventHandlers();
  refreshDashboard();
});
