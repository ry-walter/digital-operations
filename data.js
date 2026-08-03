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
  { date: "2026-07-27", title: "VOD: TPUSA: Make Heaven Crowded Tour- Anchorage, AK", category: "Fox Nation" },
  { date: "2026-07-27", title: "9:00am: Lindsay Clancy Trial", category: "Live Stream" },
  { date: "2026-07-27", title: "11:50am: Pres Trump departs for Michigan", category: "Live Stream" },
  { date: "2026-07-27", title: "2:50pm: The President delivers remarks at General Motors", category: "Live Stream" },
  { date: "2026-07-27", title: "1:55pm: The President views a Drag Race and Vehicle Demonstration in Milford, MI", category: "Live Stream" },
  { date: "2026-07-27", title: "2:10pm: The President participates in a Tour and Gift Ceremony in Milford, MI", category: "Live Stream" },
  { date: "2026-07-28", title: "9:30am: Lindsay Graham Memorial in Capitol Rotunda", category: "Live Stream" },
  { date: "2026-07-28", title: "2:00pm: Lindsay Graham Funeral at Washington Cathedral", category: "Live Stream" },
  { date: "2026-07-28", title: "TBD 9:30am: The President participates in a meeting with President Zelenskyy of Ukraine", category: "Live Stream" },
  { date: "2026-07-28", title: "TBD 11:00am: The Presidents participates in a meeting with Israeli Prime Minister Benjamin Netanyahu", category: "Live Stream" },
  { date: "2026-07-28", title: "6:30pm: Senate Confirmation Vote Jay Clayton DNI", category: "Live Stream" },
  { date: "2026-07-28", title: "VOD A F&F Interview with Pres Trump", category: "Fox Nation" },
  { date: "2026-07-28", title: "A Sean Hannity Interview with Netanyahu", category: "Fox Nation" },
  { date: "2026-07-28", title: "A Sean Hannity Interview with Zelenskyy", category: "Fox Nation" },
  { date: "2026-07-29", title: "10:45am: Lindsay Graham Funeral in South Carolina", category: "Live Stream" },
  { date: "2026-07-29", title: "8:30am: Senate Hearing: Fauci", category: "Live Stream" },
  { date: "2026-07-29", title: "9:00am: Lindsay Clancy Trial", category: "Live Stream" },
  { date: "2026-07-29", title: "TBD 10:30am: Pres Trump greets the Montana State University FCS National Champions", category: "Live Stream" },
  { date: "2026-07-29", title: "VOD 2:30pm: Federal Reserve Board Chairman Kevin Warsh holds a news conference following a Federal Open Market Committee meeting", category: "Fox Nation" },
  { date: "2026-07-29", title: "9:30am: HHS Sec. Robert F. Kennedy, Jr. hosts health care leaders and behavioral health experts who pledge to strengthen the nation’s behavioral health system", category: "Live Stream" },
  { date: "2026-07-29", title: "2:00pm: Senate GOP leadership pressers.", category: "Live Stream" },
  { date: "2026-07-29", title: "3:00pm: The President makes an Announcement with the Secretary of Transportation - Oval Office", category: "Live Stream" },
  { date: "2026-07-30", title: "7:00pm: A Call to Unbreakable Courage", category: "Live Stream" },
  { date: "2026-07-30", title: "TBD 11:00am: Secretary Brooke Rollins of the U.S. Department of Agriculture, FBI Director Kash Patel, Assistant Attorney General Colin McDonald, and 40 state partners from the Southeast will participate in a roundtable and press conference", category: "Live Stream" },
  { date: "2026-07-30", title: "TBD 10:30am: White House Internship Program Class Photo", category: "Live Stream" },
  { date: "2026-07-30", title: "TBD 1:30pm: The President makes an Announcement on Freedom Haulers", category: "Live Stream" },
  { date: "2026-07-30", title: "2:00pm: News conference on upcoming U.S. Spacewalks at the International Space Station", category: "Live Stream" },
  { date: "2026-07-30", title: "TBD 3:00pm: The President participates in Signing Time - Oval Office", category: "Live Stream" },
  { date: "2026-07-31", title: "TBD 3:30pm: Kouri Richins Restitution Hearing", category: "Live Stream" },
  { date: "2026-07-31", title: "3:00pm The Weekly Rap Sheet with Paul Mauro", category: "Live Stream" },
  { date: "2026-07-31", title: "11:00am: Western Conservative Summit Morning Day 1", category: "Live Stream" },
  { date: "2026-07-31", title: "9:00pm: Western Conservative Summit Evening Day 1", category: "Live Stream" },
  { date: "2026-07-31", title: "11:00am: President Trump to host his 13th cabinet meeting of this term at Camp David", category: "Live Stream" },
  { date: "2026-08-01", title: "11:00am: Western Conservative Summit Morning Day 2", category: "Live Stream" },
  { date: "2026-08-01", title: "9:00pm: Western Conservative Summit Evening Day 2", category: "Live Stream" },
  { date: "2026-08-01", title: "A Lara Trump Interview with Sec Marco Rubio", category: "Fox Nation" },
  { date: "2026-08-01", title: "11:30am: US Senate Stump Stop with Alan Wilson, Darline Graham and others — Lexington SC", category: "Live Stream" },
  { date: "2026-08-02", title: "Live with Robert Jeffress and First Baptist Dallas (10:00 AM ET) WEEKLY", category: "Fox Nation" },
  { date: "2026-08-03", title: "Unexplained Mysteries of Faith", category: "Series Fox Nation" },
  { date: "2026-08-03", title: "9:00am: Lindsay Clancy Trial", category: "Live Stream" },
  { date: "2026-08-03", title: "A Trey Gowdy Interview with Sen Darline Graham", category: "Fox Nation" },
  { date: "2026-08-03", title: "10:00am: Joint Task Force DC holds a virtual round table to discuss the National Guard’s contributions to the Make DC Safe and Beautiful mission", category: "Live Stream" },
  { date: "2026-08-03", title: "TBD 3:15pm: Congressman Derrick Van Orden (R-WI) will host FBI Director Kash Patel on Monday in Eau Claire, WI for a discussion with law enforcement officers from across Wisconsin’s Third Congressional District.", category: "Live Stream" },
  { date: "2026-08-03", title: "1:30pm: The President signs an Executive Order - Oval Office", category: "Live Stream" },
  { date: "2026-08-04", title: "TBD TIME: Tiger Woods Hearing", category: "Live Stream" },
  { date: "2026-08-05", title: "TBD LIVE OR VOD 10:00pm: TPUSA Make Heaven Crowded Tour- PHOENIX", category: "Live Stream" },
  { date: "2026-08-05", title: "2:30pm: Senate Hearing: \"Hidden in Plain Sight: Confronting the Muslim Brotherhood Network in America.\"", category: "Live Stream" },
  { date: "2026-08-06", title: "Final Flight: The Men of Extortion 17", category: "Series Fox Nation" },
  { date: "2026-08-07", title: "COPs: Florida Man Special Season 3801-3803", category: "Series Fox Nation" },
  { date: "2026-08-07", title: "3:00pm The Weekly Rap Sheet with Paul Mauro", category: "Live Stream" },
  { date: "2026-08-10", title: "Immaculate Concussion: Havana Syndrome", category: "Fox Nation" },
  { date: "2026-08-10", title: "9:00am: Lindsay Clancy Trial", category: "Live Stream" },
  { date: "2026-08-11", title: "Dirty Money with Brantley Gilbert", category: "Lifestyle" },
  { date: "2026-08-13", title: "GOD. FAMILY. FOOTBALL. (S3)", category: "Fox Nation" },
  { date: "2026-08-14", title: "COPs: Florida Man Special Season 3804", category: "Series Fox Nation" },
  { date: "2026-08-14", title: "3:00pm The Weekly Rap Sheet with Paul Mauro", category: "Live Stream" },
  { date: "2026-08-14", title: "TBD TIME: Alex Murdaugh Pretrial Hearing", category: "Live Stream" },
  { date: "2026-08-17", title: "The Earhart Files", category: "Special Fox Nation" },
  { date: "2026-08-17", title: "9:00am: Lindsay Clancy Trial", category: "Live Stream" },
  { date: "2026-08-19", title: "Russia! Russia! Russia! The Plot to Stop Trump", category: "Series" },
  { date: "2026-08-20", title: "GOD. FAMILY. FOOTBALL. (S3)", category: "Fox Nation" },
  { date: "2026-08-21", title: "COPs: Florida Man Special Season 3805", category: "Series Fox Nation" },
  { date: "2026-08-21", title: "2:45pm: RAF12- Cleveland Press Conference", category: "Live Stream" },
  { date: "2026-08-21", title: "3:00pm The Weekly Rap Sheet with Paul Mauro", category: "Live Stream" },
  { date: "2026-08-22", title: "7:45pm: RAF12- Cleveland", category: "Live Stream" },
  { date: "2026-08-23", title: "2:00pm: RAF Next Gen 02", category: "Live Stream" },
  { date: "2026-08-24", title: "Operation Homeland", category: "Fox Nation" },
  { date: "2026-08-24", title: "TBD TIME: Lindsay Clancy Trial", category: "Live Stream" },
  { date: "2026-08-26", title: "Ambush at ABBEY GATE", category: "Fox Nation Special" },
  { date: "2026-08-27", title: "GOD. FAMILY. FOOTBALL. (S3)", category: "Fox Nation" },
  { date: "2026-08-28", title: "COPs: Season 38 Episode 6", category: "Series Fox Nation" },
  { date: "2026-08-28", title: "3:00pm The Weekly Rap Sheet with Paul Mauro", category: "Live Stream" },
  { date: "2026-08-29", title: "TBD TIME: TPUSA Make Heaven Crowded Tour- EL PASO, TX", category: "Live Stream" },
  { date: "2026-08-31", title: "Lockerbie: Justice for Pan Am 103", category: "Fox Nation Series" },
  { date: "2026-09-01", title: "The Enemy on Campus w/ Maria Bartiromo", category: "Fox Nation" },
  { date: "2026-09-01", title: "12:00pm: Tyler Robinson Oral Arguments", category: "Live Stream" },
  { date: "2026-09-01", title: "TBD 7:00pm: The Murder of Charlie Kirk LIVE SHOW", category: "Live Stream" },
  { date: "2026-09-03", title: "GOD. FAMILY. FOOTBALL. (S3)", category: "Fox Nation" },
  { date: "2026-09-04", title: "COPs: Season 38 Episode 7", category: "Series Fox Nation" },
  { date: "2026-09-04", title: "Paul Mauro's Notes From Ground Zero", category: "Special" },
  { date: "2026-09-04", title: "3:00pm The Weekly Rap Sheet with Paul Mauro", category: "Live Stream" },
  { date: "2026-09-04", title: "TBD TIME: RAF Moscow Press Conference", category: "Live Stream" },
  { date: "2026-09-05", title: "TBD TIME: RAF Moscow", category: "Live Stream" }
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
