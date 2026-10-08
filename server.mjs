import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolvePublicAsset } from './src/public-path.js';
import { securityHeaders } from './src/security-headers.js';

const root = resolve(fileURLToPath(new URL('.', import.meta.url)));
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
};
async function writeFileResponse(response, status, filePath, headOnly = false) {
  const body = await readFile(filePath);
  response.writeHead(status, {
    ...securityHeaders,
    'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
    'Content-Length': body.length,
  });
  response.end(headOnly ? undefined : body);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    request.resume();
    response.writeHead(405, { ...securityHeaders, Allow: 'GET, HEAD', Connection: 'close' }).end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = new URL(request.url, 'http://localhost').pathname;
  } catch {
    response.writeHead(400, securityHeaders).end('Bad request');
    return;
  }

  const publicAsset = resolvePublicAsset(pathname);
  if (!publicAsset) {
    await writeFileResponse(response, 404, resolve(root, '404.html'), request.method === 'HEAD');
    return;
  }

  try {
    const requestedPath = resolve(root, publicAsset);
    const actualPath = await realpath(requestedPath);
    const pathFromRoot = relative(root, actualPath);
    if (!pathFromRoot || pathFromRoot.startsWith(`..${sep}`) || pathFromRoot === '..') throw new Error('Invalid public path');
    await writeFileResponse(response, 200, actualPath, request.method === 'HEAD');
  } catch {
    await writeFileResponse(response, 404, resolve(root, '404.html'), request.method === 'HEAD');
  }
});

const port = Number(process.env.PORT) || 4173;
server.listen(port, '127.0.0.1', () => {
  console.log(`SHIFT 1.0 is available at http://127.0.0.1:${port}`);
});
