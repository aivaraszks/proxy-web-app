# Local proxy web app

Run this on your PC or on **GitHub Pages**. Enter a valid email and tap **Open app**; the link `href` is your app’s Matrix callback deep link (`com.seca.myanalytics://…`) with `code` and `state` for local debugging (same idea as `adb shell am start -a android.intent.action.VIEW -d "…"`).

---

## Open this app on your mobile phone (step by step)

### 1. One-time setup on the PC

1. Install [Node.js](https://nodejs.org/) 18 or newer if you do not have it.
2. Optional: edit `public/app.js` — `APP_DEEPLINK_BASE`, `CALLBACK_CODE`, and `CALLBACK_STATE` (see [Configure the Open app link](#configure-the-open-app-link) below).

### 2. Start the server on the PC

Open PowerShell or Command Prompt on the PC where the project folder is:

```powershell
cd c:\Users\ZakarauskasA\Documents\code-local\proxy-web-app
npm start
```

Leave this window **open** while you use the phone.

### 3. Get the URL to type on your phone

When the server starts, it prints lines like:

- **On this PC only:** `http://127.0.0.1:9280`
- **On your phone:** `http://10.x.x.x:9280` or `http://192.168.x.x:9280` (your **LAN** address)

Use the **`http://<LAN-IP>:9280`** line that matches your normal Wi‑Fi or Ethernet adapter (not a virtual adapter like “Default Switch” if you are unsure).

**If you do not see a good IP:** on Windows, run `ipconfig` and look for **IPv4 Address** under the adapter you use for the same network as the phone (often starts with `192.168.` or `10.`).

### 4. Connect the phone

1. Connect the phone to the **same Wi‑Fi network** as the PC (not a “guest” Wi‑Fi if that isolates devices).
2. On the phone, open **Chrome**, **Safari**, or another browser.
3. In the address bar, type exactly: `http://` then the **LAN IP** then `:` then the port **`9280`**  
   Example: `http://192.168.1.50:9280`
4. You should see the page with the email field.

### 5. If the phone cannot load the page

- **Firewall:** Windows may block incoming connections the first time. Allow **Node.js** (or “private networks”) when Windows asks, or temporarily allow inbound TCP on port **9280** for private networks.
- **Wrong network:** PC on Ethernet and phone on Wi‑Fi is fine **only if** they are the same home/office LAN.
- **VPN:** Turn off VPN on the PC or phone for testing; VPNs can block local access.

### 6. Use the form and open the app

1. Enter your email and tap **Open app** (navigates via `href` to `com.seca.myanalytics://myAnalytics/auth/matrix/callback?code=…&state=…`).
2. Tap **Open Google** if you want the separate Google shortcut.

Default port is **9280**. To use another port, then use that number in the phone URL:

```powershell
set PORT=5000
npm start
```

Example phone URL: `http://192.168.1.50:5000`

---

## Configure the Open app link

In `public/app.js`:

- **`APP_DEEPLINK_BASE`** — custom-scheme URL without query string (must match your Android intent filter / Capacitor config).
- **`CALLBACK_CODE`** / **`CALLBACK_STATE`** — query values for local tests (defaults mirror `code=test&state=test` from adb).

Example `href`:

`com.seca.myanalytics://myAnalytics/auth/matrix/callback?code=test&state=test`

The email field is still required before the link leaves `#` so you do not trigger the intent with an empty form by mistake. To pass the email into `state` (or another param), extend `buildOpenAppHref()` accordingly.

---

## Host on GitHub Pages (Source: GitHub Actions)

1. Push this repository to GitHub.
2. In the repo: **Settings** → **Pages** (under **Code and automation** in the left sidebar).
3. Under **Build and deployment** → **Source**, select **GitHub Actions**.
4. Commit and push the workflow file `.github/workflows/deploy-pages.yml` (it publishes the **`public/`** folder). Or go to **Actions** → workflow **“Deploy static site to Pages”** → **Run workflow**.

After a successful run, **Settings** → **Pages** shows the site URL (usually `https://<username>.github.io/<repository>/`).

**Notes**

- You do **not** run `npm start` on GitHub; only files in **`public/`** are published.
- Local testing is unchanged: `npm start` still serves the same **`public/`** folder.
- If a run fails with permissions, try **Settings** → **Actions** → **General** → **Workflow permissions** → **Read and write** (only if GitHub suggests it).
- The first time you deploy, GitHub may ask you to approve the **`github-pages`** environment (green **Review deployments** button on the workflow run).

---

## Security note

This is for **local development / demos** only. A GitHub Pages URL is **public**. Do not rely on this for secrets or production without hardening (HTTPS, auth, rate limits, etc.).
