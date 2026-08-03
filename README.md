# FOX Nation Dashboard (static, GitHub Pages)

A free, static rebuild of the Fox Nation Ops dashboard — two pages (Dashboard + Huddle Notes),
no server, no Replit token limits. Runs entirely in the browser using localStorage,
with an optional live PTO feed from a published Google Sheet.

## What's inside

- `index.html` — Dashboard (Operations Command banner, Upcoming Events, PTO Tracking)
- `huddle.html` — Huddle Notes (date-nav'd 3x daily note cards)
- `data.js` — seed data: events snapshot (from Airtable) + PTO seed/fallback + huddle note seed
- `config.js` — set `PTO_CSV_URL` here to enable live PTO syncing
- `app.js` — shared logic (dates, storage, CSV parsing/fetch)
- `dashboard.js` / `huddle.js` — page-specific rendering

## Updating events (Airtable snapshot)

Per your call, events are a manual snapshot rather than a live Airtable feed (no API
token needed). To update: open `data.js` and edit the `SEED_EVENTS` array — add, edit,
or remove `{ date, title, category, time }` objects. Save, commit, push — GitHub Pages
picks it up automatically. If you'd like this to sync live from Airtable later, that's
doable with a Personal Access Token + a scheduled GitHub Action; just say the word.

## Turning on live PTO sync from Google Sheets

1. Open the **"2026 DOPS MGMT PTO & Event Calendar"** Google Sheet.
2. Go to the tab (month) you want to sync — e.g. "Aug".
3. **File → Share → Publish to web**.
4. Under "Link", choose the specific sheet/tab (not "Entire document"), and format **CSV**.
5. Click **Publish**, copy the generated link.
6. Paste it into `config.js`:
   ```js
   const PTO_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?output=csv";
   ```
   You can also pass an array of URLs (one per month tab) if you want more than the
   current month covered:
   ```js
   const PTO_CSV_URL = ["https://.../pub?output=csv&gid=AUG", "https://.../pub?output=csv&gid=SEP"];
   ```
7. Commit and push. The Dashboard will now fetch and parse that sheet's "Name Out"
   entries live on every page load, keyed to the correct date. The manual "+" add
   button on the PTO panel is disabled while live sync is active (the sheet is the
   source of truth), but you can always edit the sheet directly.

**Heads up:** publishing to web makes that sheet's data fetchable by anyone with the
link (not searchable, but not private either). That's the trade-off for a
zero-credential live sync — you agreed this was fine for event/PTO scheduling info.

## Deploying to GitHub Pages (free)

1. Create a new **public** GitHub repository (e.g. `fox-nation-dashboard`).
2. Add these files to the repo root (drag-and-drop via GitHub's web UI works fine —
   "Add file → Upload files" — or `git push` if you're comfortable with git).
3. In the repo, go to **Settings → Pages**.
4. Under "Build and deployment", set **Source** to `Deploy from a branch`, branch
   `main`, folder `/ (root)`. Save.
5. GitHub will give you a URL like `https://<your-username>.github.io/fox-nation-dashboard/`
   within a minute or two. That's your live site — free, no token limits, no build step.

## Notes on data persistence

- **Events** and **local PTO** (when not live-synced) are stored in each browser's
  localStorage — edits made via "+ Add Event" persist on that device/browser only,
  not shared across visitors. For a shared team dashboard, the Airtable-snapshot /
  Google-Sheet-live approach above is the source of truth; localStorage is just a
  personal scratch layer on top.
- **Huddle Notes** are also localStorage-only right now (the original app's backend
  isn't something we have external access to). If you want huddle notes shared across
  the team too, we'd need a small shared backend (e.g. a free Airtable table or a
  Google Sheet written to via Apps Script) — let me know if you want that added.
