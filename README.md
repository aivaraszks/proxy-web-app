# Local deeplink helper

Run this on your PC. On your **phone** (same Wi‑Fi), you open the page in a browser, enter an email, and the page tries to open your **mobile app** using a **deeplink** (custom URL) that includes a **random user id**.

---

## Open this app on your mobile phone (step by step)

### 1. One-time setup on the PC

1. Install [Node.js](https://nodejs.org/) 18 or newer if you do not have it.
2. Edit `public/app.js` and set `DEEPLINK_TEMPLATE` to your real app URL scheme (see [Configure your deeplink](#configure-your-deeplink) below).

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

1. Enter your email and tap **Open app**.
2. The browser should switch to your installed app via the deeplink.
3. If nothing happens, tap **“open in app”** on the page (some browsers require a user tap for custom URL schemes).

Default port is **9280**. To use another port, then use that number in the phone URL:

```powershell
set PORT=5000
npm start
```

Example phone URL: `http://192.168.1.50:5000`

---

## Configure your deeplink

Edit `public/app.js` and set `DEEPLINK_TEMPLATE` to match what your app registers, for example:

- `mybrand://auth?userId={userId}&email={email}`
- `mybrand://users/{userId}?email={email}`

Placeholders:

- `{userId}` — random id (UUID when the browser supports it).
- `{email}` — URL-encoded email from the form.

---

## Security note

This is for **local development / demos** only. Do not expose it to the public internet without hardening (HTTPS, auth, rate limits, etc.).
