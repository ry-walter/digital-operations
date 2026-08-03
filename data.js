/*
 * FOX NATION DASHBOARD — DATA
 * -----------------------------------------------------------------
 * EVENTS: manual snapshot pulled from the Airtable "NATION AIR TABLE"
 *   (appYVkKcbQKscED3w) as of 2026-08-03. Update this array by hand
 *   whenever the Airtable calendar changes — just add/edit/remove
 *   objects below. Each event: { date: "YYYY-MM-DD", title, category, time? }
 *
 * PTO: seed/fallback data parsed from the "2026 DOPS MGMT PTO & Event
 *   Calendar" Google Sheet. If PTO_CSV_URL (see config.js) is set to a
 *   published-to-web CSV link, the live sheet data will be fetched and
 *   this seed is only used as a fallback / before that link is set up.
 * -----------------------------------------------------------------
 */

const SEED_EVENTS = [
  { date: "2026-08-03", title: "Unexplained Mysteries of Faith", category: "Fox Nation Series" },
  { date: "2026-08-04", title: "Tiger Woods Hearing", category: "Live Stream" },
  { date: "2026-08-05", title: "TPUSA Make Heaven Crowded Tour — Phoenix", category: "Live Stream", time: "10:00pm" },
  { date: "2026-08-06", title: "Final Flight: The Men of Extortion 17", category: "Fox Nation History Special" },
  { date: "2026-08-07", title: "COPs: Florida Man Special Season 3801-3803", category: "Fox Nation Series" },
  { date: "2026-08-10", title: "Immaculate Concussion: Havana Syndrome", category: "Fox Nation" },
  { date: "2026-08-11", title: "Dirty Money with Brantley Gilbert", category: "Fox Nation Lifestyle" },
  { date: "2026-08-13", title: "GOD. FAMILY. FOOTBALL. (S3) Ep 1: Get Your Hopes Up", category: "Fox Nation Series" },
  { date: "2026-08-14", title: "COPs: Florida Man Special Season 3804", category: "Fox Nation Series" },
  { date: "2026-08-17", title: "The Earhart Files", category: "Fox Nation History Special" },
  { date: "2026-08-19", title: "Russia! Russia! Russia! The Plot to Stop Trump", category: "Fox Nation Series" },
  { date: "2026-08-20", title: "GOD. FAMILY. FOOTBALL. (S3) Ep 4: Coming Home", category: "Fox Nation Series" },
  { date: "2026-08-21", title: "COPs: Florida Man Special Season 3805", category: "Fox Nation Series" },
  { date: "2026-08-22", title: "RAF12 — Cleveland", category: "Live Stream", time: "7:45pm" },
  { date: "2026-08-23", title: "RAF Next Gen 02", category: "Live Stream", time: "2:00pm" },
  { date: "2026-08-24", title: "Operation Homeland", category: "Fox Nation Special" },
  { date: "2026-08-26", title: "Ambush at Abbey Gate", category: "Fox Nation Special" },
  { date: "2026-08-27", title: "GOD. FAMILY. FOOTBALL. (S3) Ep 5: Choose Your Hard", category: "Fox Nation Series" },
  { date: "2026-08-28", title: "COPs: Season 38 Episode 6", category: "Fox Nation Series" },
  { date: "2026-08-29", title: "TPUSA Make Heaven Crowded Tour — El Paso, TX", category: "Live Stream" },
  { date: "2026-08-31", title: "Lockerbie: Justice for Pan Am 103", category: "Fox Nation Series" },
  { date: "2026-09-01", title: "The Enemy on Campus w/ Maria Bartiromo", category: "Fox Nation" }
];

// date -> array of names on PTO that day
const SEED_PTO = {
  "2026-08-02": ["Rickey"],
  "2026-08-03": ["Rickey"],
  "2026-08-04": ["Rickey"],
  "2026-08-05": ["Dan Fillimon", "Rickey"],
  "2026-08-06": ["Rickey"],
  "2026-08-07": ["Monique", "Rickey"],
  "2026-08-08": ["Rickey"],
  "2026-08-10": ["Monique"],
  "2026-08-13": ["Monique"],
  "2026-08-14": ["Monique"],
  "2026-08-15": ["Peter B"],
  "2026-08-16": ["Peter B"],
  "2026-08-17": ["Monique"],
  "2026-08-18": ["Monique"],
  "2026-08-19": ["Monique"],
  "2026-08-21": ["Mark Schwarz"],
  "2026-08-22": ["Mark Schwarz"],
  "2026-08-23": ["Mark Schwarz"],
  "2026-08-24": ["Mark Schwarz"],
  "2026-08-25": ["Mark Schwarz"],
  "2026-08-26": ["Mark Schwarz"],
  "2026-08-28": ["Rylee"]
};

// Seed huddle notes: { "YYYY-MM-DD": { "10:00 AM": "text", "4:00 PM": "text", "8:15 PM": "text" } }
const SEED_HUDDLE_NOTES = {
  "2026-08-03": {
    "10:00 AM": "- Big plus season started today\n- Stay ahead of the Nation schedule and VOD postings\n- Team needs to stay on top of sweeps\n- Scheduler should be in everyone's OKTA accounts\n- Nation Jira Cloud rollout postponed",
    "4:00 PM": "",
    "8:15 PM": ""
  }
};

const HUDDLE_SLOTS = ["10:00 AM", "4:00 PM", "8:15 PM"];
