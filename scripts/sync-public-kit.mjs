#!/usr/bin/env node
/**
 * Mirror repo kit docs into public/ for static serving on Cloudflare Pages.
 * Source of truth: docs/loop-engineering/, loops/README.md
 */
import { cp, mkdir, rm, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcKit = path.join(root, 'docs/loop-engineering');
const destKit = path.join(root, 'public/docs/loop-engineering');
const destLoops = path.join(root, 'public/loops');

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Loop Engineering Toolkit — SloppyXBaby</title>
  <meta http-equiv="refresh" content="0; url=/docs/loop-engineering/README.md" />
  <link rel="canonical" href="https://sloppyxbaby.com/docs/loop-engineering/README.md" />
</head>
<body>
  <p><a href="/docs/loop-engineering/README.md">Loop Engineering Toolkit</a></p>
</body>
</html>
`;

function shouldCopyKitEntry(name) {
  if (name === 'audit-results') return false;
  return true;
}

async function syncKit() {
  await rm(destKit, { recursive: true, force: true });
  await mkdir(destKit, { recursive: true });

  const { readdir } = await import('fs/promises');
  for (const entry of await readdir(srcKit, { withFileTypes: true })) {
    if (!shouldCopyKitEntry(entry.name)) continue;
    const from = path.join(srcKit, entry.name);
    const to = path.join(destKit, entry.name);
    await cp(from, to, { recursive: true });
  }

  await writeFile(path.join(destKit, 'index.html'), INDEX_HTML);
}

async function syncLoops() {
  await mkdir(destLoops, { recursive: true });
  await cp(path.join(root, 'loops/README.md'), path.join(destLoops, 'README.md'));
}

await syncKit();
await syncLoops();
console.log('sync-public-kit: public/docs/loop-engineering + public/loops/README.md');