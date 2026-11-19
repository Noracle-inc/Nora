const http = require('http');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const { authenticateRequest, AuthenticationError } = require('./services/firebase-auth');
const { handleAssistantRequest, RequestError } = require('./routes/assistant');
const { applySecurityHeaders } = require('./security/headers');

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.join(__dirname, '..');
const MAX_BODY_BYTES = 16 * 1024;
const DEFAULT_ORIGINS = ['http://localhost:8000', 'http://127.0.0.1:8000', 'http://localhost:3000'];

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.txt': 'text/plain; charset=utf-8'
};

function respondJson(res, status, payload) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(payload));
}

function allowedOrigins() {
  const configured = (process.env.ALLOWED_ORIGINS || '').split(',').map((item) => item.trim()).filter(Boolean);
  return configured.length ? configured : DEFAULT_ORIGINS;
}

function readJsonBody(req, maxBytes = MAX_BODY_BYTES) {
  return new Promise((resolve, reject) => {
    let size = 0;
    let oversized = false;
    const chunks = [];
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxBytes) {
        oversized = true;
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (oversized) {
        reject(new RequestError(413, 'request_too_large', 'Request body exceeds the allowed size.'));
        return;
      }
      if (size === 0) return resolve({});
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if (!body || typeof body !== 'object' || Array.isArray(body)) {
          return reject(new RequestError(400, 'invalid_body', 'Expected a JSON object.'));
        }
        resolve(body);
      } catch (_error) {
        reject(new RequestError(400, 'invalid_json', 'Request body must contain valid JSON.'));
      }
    });
    req.on('error', reject);
  });
}

function serveFile(filePath, res) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      respondJson(res, 404, { error: { code: 'not_found', message: 'Not found.' } });
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'X-Content-Type-Options': 'nosniff'
    });
    res.end(data);
  });
}

async function handleApi(req, res, pathname) {
  if (pathname === '/api/health' && req.method === 'GET') {
    respondJson(res, 200, { status: 'ok', app: 'Noracle' });
    return;
  }
  if (pathname !== '/api/assistant' || req.method !== 'POST') {
    respondJson(res, 404, { error: { code: 'not_found', message: 'API route not found.' } });
    return;
  }

  try {
    // Verify identity before parsing or forwarding any user content.
    const user = await authenticateRequest(req);
    const body = await readJsonBody(req);
    const result = await handleAssistantRequest(body, user.uid);
    respondJson(res, 200, result);
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof RequestError) {
      respondJson(res, error.status, { error: { code: error.code, message: error.message } });
      return;
    }
    console.error('Assistant request failed:', error.code || error.name || 'unknown');
    const status = error.status || 502;
    respondJson(res, status, {
      error: {
        code: error.code || 'assistant_unavailable',
        message: status >= 500 ? 'The assistant is temporarily unavailable. Please try again later.' : error.message
      }
    });
  }
}

const server = http.createServer(async (req, res) => {
  applySecurityHeaders(res);
  const origin = req.headers.origin;
  const origins = allowedOrigins();
  if (origin && origins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  }

  if (req.method === 'OPTIONS') {
    if (origin && !origins.includes(origin)) {
      respondJson(res, 403, { error: { code: 'origin_not_allowed', message: 'Origin is not allowed.' } });
      return;
    }
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, 'http://localhost');
  if (url.pathname.startsWith('/api/')) {
    await handleApi(req, res, url.pathname);
    return;
  }

  if (req.method !== 'GET' && req.method !== 'HEAD') {
    respondJson(res, 405, { error: { code: 'method_not_allowed', message: 'Method not allowed.' } });
    return;
  }
  let requested;
  try {
    requested = url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname);
  } catch (_error) {
    respondJson(res, 400, { error: { code: 'invalid_path', message: 'Request path is invalid.' } });
    return;
  }
  const segments = requested.split('/').filter(Boolean);
  const blockedPaths = new Set(['backend', 'docs', 'tests', 'node_modules']);
  if (segments.some((segment) => segment.startsWith('.'))
    || blockedPaths.has(segments[0])
    || ['package.json', 'package-lock.json', 'firebase.json', 'firestore.rules'].includes(segments[0])) {
    respondJson(res, 404, { error: { code: 'not_found', message: 'Not found.' } });
    return;
  }
  const filePath = path.resolve(ROOT, `.${requested}`);
  if (!filePath.startsWith(`${ROOT}${path.sep}`) && filePath !== ROOT) {
    respondJson(res, 403, { error: { code: 'forbidden', message: 'Forbidden.' } });
    return;
  }
  fs.stat(filePath, (error, stats) => {
    if (error || !stats.isFile()) {
      serveFile(path.join(ROOT, 'index.html'), res);
      return;
    }
    serveFile(filePath, res);
  });
});

if (require.main === module) {
  server.listen(PORT, () => console.log(`Noracle server listening on port ${PORT}`));
}

module.exports = { server, readJsonBody, allowedOrigins };
