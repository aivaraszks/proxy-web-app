/**
 * Serves static files from ./public on all interfaces so phones on the same Wi‑Fi can connect.
 */
const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");

const PORT = Number(process.env.PORT) || 9280;
const PUBLIC_DIR = path.join(__dirname, "public");

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
};

// * In-app browsers cache aggressively; disable caching for local dev.
const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
  Pragma: "no-cache",
  Expires: "0",
};

function assetBuildId(callback) {
  const names = ["app.js", "styles.css"];
  let pending = names.length;
  let maxMtime = 0;

  if (pending === 0) {
    callback(String(Date.now()));
    return;
  }

  for (const name of names) {
    fs.stat(path.join(PUBLIC_DIR, name), (err, st) => {
      if (!err && st.mtimeMs > maxMtime) {
        maxMtime = st.mtimeMs;
      }
      pending -= 1;
      if (pending === 0) {
        callback(String(Math.floor(maxMtime || Date.now())));
      }
    });
  }
}

function listLanIPv4() {
  const nets = os.networkInterfaces();
  const out = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        out.push({ name, address: net.address });
      }
    }
  }
  return out;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "text/plain; charset=utf-8", ...headers });
  res.end(body);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent(new URL(req.url || "/", `http://${req.headers.host}`).pathname);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(PUBLIC_DIR, path.normalize(urlPath).replace(/^(\.\.(\/|\\|$))+/, ""));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    send(res, 403, "Forbidden");
    return;
  }

  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) {
      send(res, 404, "Not found");
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    const cacheHeaders = [".html", ".js", ".css"].includes(ext) ? NO_CACHE_HEADERS : {};

    if (ext === ".html") {
      fs.readFile(filePath, "utf8", (readErr, content) => {
        if (readErr) {
          send(res, 500, "Internal Server Error");
          return;
        }
        assetBuildId((buildId) => {
          const html = content.replace(/__BUILD_ID__/g, buildId);
          res.writeHead(200, { "Content-Type": type, ...cacheHeaders });
          res.end(html);
        });
      });
      return;
    }

    res.writeHead(200, { "Content-Type": type, ...cacheHeaders });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, "0.0.0.0", () => {
  const addrs = listLanIPv4();
  console.log("");
  console.log("Open on this PC:    http://127.0.0.1:{0}".replace("{0}", String(PORT)));
  if (addrs.length) {
    console.log("Open on your phone (same Wi‑Fi):");
    for (const { name, address } of addrs) {
      console.log("  http://{0}:{1}  ({2})".replace("{0}", address).replace("{1}", String(PORT)).replace("{2}", name));
    }
  } else {
    console.log("No non-loopback IPv4 found; use your machine IP manually.");
  }
  console.log("");
});
