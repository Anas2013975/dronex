// Local development server — no dependencies required.
// Serves the static site + the same API handlers used on Vercel.
const http = require('http');
const fs = require('fs');
const path = require('path');
const { handlePublic, handleLogin, handleAdmin } = require('./lib/handlers');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};

function serveStatic(req, res, pathname) {
  let filePath = path.join(ROOT, pathname === '/' ? 'index.html' : pathname);
  // directory -> index.html
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }
  const ext = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('<h1 style="font-family:sans-serif">404 — Not Found</h1>');
      return;
    }
    res.statusCode = 200;
    res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream');
    if (ext === '.html') res.setHeader('Cache-Control', 'no-cache');
    else res.setHeader('Cache-Control', 'public, max-age=3600');
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  try {
    if (pathname === '/api/public') return await handlePublic(req, res);
    if (pathname === '/api/login') return await handleLogin(req, res);
    if (pathname === '/api/admin') return await handleAdmin(req, res);
  } catch (e) {
    console.error(e);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify({ error: 'Internal server error' }));
  }

  // basic path traversal guard
  if (pathname.includes('..')) {
    res.statusCode = 400;
    return res.end('Bad request');
  }
  serveStatic(req, res, pathname);
});

server.listen(PORT, () => {
  console.log(`DronexMC website running at http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin  (footer -> DronexMC)`);
});
