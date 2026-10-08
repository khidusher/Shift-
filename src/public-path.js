const publicPages = new Map([
  ['/', 'index.html'],
  ['/index.html', 'index.html'],
  ['/privacy', 'privacy.html'],
  ['/privacy.html', 'privacy.html'],
  ['/terms', 'terms.html'],
  ['/terms.html', 'terms.html'],
  ['/404.html', '404.html'],
  ['/styles.css', 'styles.css'],
  ['/favicon.svg', 'favicon.svg'],
  ['/og-image.png', 'og-image.png'],
  ['/robots.txt', 'robots.txt'],
]);

const publicModules = new Set([
  'countdown.js',
  'event-data.js',
  'escape-html.js',
  'main.js',
  'selection.js',
  'spotlight.js',
]);

export function resolvePublicAsset(pathname) {
  if (typeof pathname !== 'string' || pathname.includes('\\') || pathname.includes('\0')) return null;

  let decodedPath;
  try {
    decodedPath = decodeURIComponent(pathname);
  } catch {
    return null;
  }

  if (decodedPath.includes('\\') || decodedPath.includes('\0')) return null;
  const page = publicPages.get(decodedPath);
  if (page) return page;

  const moduleMatch = /^\/src\/([a-z-]+\.js)$/.exec(decodedPath);
  if (moduleMatch && publicModules.has(moduleMatch[1])) return `src/${moduleMatch[1]}`;
  return null;
}
