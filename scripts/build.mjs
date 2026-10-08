import { cp, mkdir, rm } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(fileURLToPath(new URL('../', import.meta.url)));
const outputDirectory = resolve(projectRoot, 'dist');
const outputFromRoot = relative(projectRoot, outputDirectory);
if (!outputFromRoot || outputFromRoot === '..' || outputFromRoot.startsWith(`..${sep}`)) {
  throw new Error('Build output must stay inside the project root.');
}

const publicFiles = [
  '404.html',
  'favicon.svg',
  'index.html',
  'privacy.html',
  'robots.txt',
  'styles.css',
  'terms.html',
];
const publicModules = ['countdown.js', 'event-data.js', 'escape-html.js', 'main.js', 'selection.js', 'spotlight.js'];

await rm(outputDirectory, { recursive: true, force: true });
await mkdir(resolve(outputDirectory, 'src'), { recursive: true });
for (const file of publicFiles) await cp(resolve(projectRoot, file), resolve(outputDirectory, file));
for (const file of publicModules) await cp(resolve(projectRoot, 'src', file), resolve(outputDirectory, 'src', file));

console.log(`Built ${publicFiles.length + publicModules.length} public files into dist/.`);
