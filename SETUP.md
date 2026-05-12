# Jess & Conner Engagement Invite — Setup

Step-by-step. Do these in order.

## 1. Set up the Google Sheet + Apps Script backend (do this FIRST)

The RSVP form needs somewhere to send responses. Apps Script is free.

1. Go to https://sheets.google.com → **+ Blank** to make a new sheet
2. Name it something like **"Engagement RSVPs"**
3. In that sheet: **Extensions → Apps Script**
4. Delete any boilerplate `function myFunction() {}` code
5. Open `apps-script.gs` from this repo, copy ALL of it, paste into the Apps Script editor
6. Click the **Save** icon (cmd/ctrl + S works too)
7. Click **Deploy → New deployment**
8. Click the gear icon next to "Select type" → choose **Web app**
9. Fill in:
   - **Description**: anything, doesn't matter
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** ← important, don't skip
10. Click **Deploy**
11. Click **Authorize access** → pick your Google account → "Advanced" → "Go to (Unsafe)" → Allow. (Google warns you because the script isn't verified — that's normal for personal scripts.)
12. **Copy the Web app URL.** It looks like `https://script.google.com/macros/s/AKfyc.../exec`
13. Open `rsvp.html`, find this line near the bottom:
    ```js
    const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_URL_HERE';
    ```
    Paste your URL between the quotes.

**Test it**: paste the URL into your browser — it should respond with "RSVP endpoint is live."

## 2. Create the GitHub repo

1. Go to https://github.com/new
2. **Repository name**: `jc-ep-invite`
3. **Public** (required — GitHub Pages on free accounts only works on public repos)
4. **Do not** initialize with a README (we have our own files)
5. Click **Create repository**

## 3. Push the files

From this folder on your machine (after pasting the Apps Script URL into rsvp.html):

```bash
cd path/to/jc-ep-invite
git init
git add .
git commit -m "engagement invite"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/jc-ep-invite.git
git push -u origin main
```

## 4. Turn on GitHub Pages

1. In the repo on github.com: **Settings → Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main`, folder `/ (root)`
4. **Save**
5. Wait ~1–2 minutes. The URL will be:
   ```
   https://YOUR_USERNAME.github.io/jc-ep-invite/
   ```

## 5. Test the whole flow

Visit your live URL and:
- [ ] Invite renders correctly
- [ ] "RSVP" button goes to the form
- [ ] Submit a test "yes" RSVP with your own info
- [ ] Confirm you get an email at jessicasourbeer@gmail.com
- [ ] Confirm the row shows up in your Google Sheet
- [ ] Confirm the "yes" page shows the address + Add to Calendar works
- [ ] Submit a test "no" RSVP and confirm that page too
- [ ] Open the calendar file — verify date/time look right

## 6. Send the link to people

Share the GitHub Pages URL.

## 7. Taking it down (in ~1 month)

Two options:

**Option A — just turn off Pages, keep the repo:**
- Repo Settings → Pages → set Source to "None" → Save
- The URL stops working immediately

**Option B — delete the whole repo:**
- Repo Settings → scroll to bottom → "Delete this repository"
- Cleaner. Address and form URL go away entirely.

**Either way, also revoke the Apps Script** so the form URL can't be hit anymore:
- script.google.com → your project → Deploy → Manage deployments → Archive

---

## Notes & gotchas

- **Address is on `yes.html`** — public but unlinked. Only people who RSVP yes hit it. Search engines are blocked by `<meta name="robots" content="noindex, nofollow">` on every page, but it's still technically findable if someone knows the URL or guesses it. If that's not okay, tell me and I can gate it behind a click-through or move it to the email Apps Script sends after a yes.
- **The form uses `mode: 'no-cors'`** which means the browser can't read the response. That's why we always redirect to yes.html/no.html regardless of server response, and stash the answers in sessionStorage as a backup. If you don't get an email after a test submit, check the Sheet first — if the row is there, the email permission probably needs re-authorizing.
- **End time on the calendar event** is set to 11:00 PM as a default 4-hour block. You said don't include one, but `.ics` events with no DTEND tend to render weirdly. If you want it removed entirely, let me know and I'll switch to a 1-hour default or all-day.
- **Parking note** in yes.html is a placeholder — edit before sharing.
