/*
 * FOX NATION DASHBOARD — CONFIG
 * -----------------------------------------------------------------
 * Once you've published the PTO Google Sheet to the web as CSV
 * (File > Share > Publish to web > select the tab > CSV > Publish),
 * paste the resulting link below. The dashboard will then fetch it
 * live on every page load. Leave it blank to use the built-in seed
 * data in data.js instead.
 *
 * Example:
 * const PTO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv";
 * -----------------------------------------------------------------
 */

const PTO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRSOgVRHKZaDCXjQqXYilYeXFOaGQsiUnPFD8HxUyKtBTmteLhqfdX8XKcnduUEX65d5wtMpg_mFyLS/pub?gid=935647697&single=true&output=csv";

/*
 * HUDDLE NOTES — shared backend (Google Apps Script Web App URL)
 * -----------------------------------------------------------------
 * Deploy the Apps Script bound to a Google Sheet (see README) and paste
 * the resulting /exec Web App URL below. Once set, Huddle Notes are
 * read from and written to that shared sheet for every visitor, with
 * localStorage used only as an offline fallback/cache. Leave blank to
 * keep Huddle Notes local-only (each browser separate, not shared).
 *
 * Example:
 * const HUDDLE_API_URL = "https://script.google.com/macros/s/AKfycb.../exec";
 * -----------------------------------------------------------------
 */

const HUDDLE_API_URL = "https://script.google.com/macros/s/AKfycbzS5PN1MdmdJ350qSYAQKSy3v-b4dNGbnuWltz0Hp8ywS3738FXW0ZCM_3hjsVo23eD/exec";
