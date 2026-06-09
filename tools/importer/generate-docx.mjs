// Generates index.docx from the already-migrated content/index.plain.html
// Loads the EDS plain HTML in a browser, injects helix-importer, and runs html2docx.
import { readFileSync, writeFileSync } from 'fs';
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const repoRoot = '/backups/carahtron/edssite/repo';

const SCRIPTS_DIR = '/home/node/.excat-marketplace/excat/skills/excat-content-import/scripts';
const helixImporter = readFileSync(join(SCRIPTS_DIR, 'static', 'inject', 'helix-importer.js'), 'utf-8');
const plainHtml = readFileSync(join(repoRoot, 'content', 'index.plain.html'), 'utf-8');

const outPath = join(repoRoot, 'content', 'index.docx');
const pageUrl = 'https://www.unumgroup.com/';

// Pre-fetch all <img> sources in Node (no CORS restriction) and inline them as
// data URIs so the docx embeds the images instead of relying on cross-origin fetch.
async function inlineImages(html) {
  const srcRegex = /<img\b[^>]*?\bsrc="([^"]+)"/g;
  const urls = new Set();
  let m;
  while ((m = srcRegex.exec(html)) !== null) {
    const raw = m[1].replace(/&amp;/g, '&');
    if (/^https?:\/\//.test(raw)) urls.add(raw);
  }
  const map = new Map();
  await Promise.all([...urls].map(async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) return;
      const ct = res.headers.get('content-type') || 'image/png';
      const buf = Buffer.from(await res.arrayBuffer());
      map.set(url, `data:${ct};base64,${buf.toString('base64')}`);
    } catch {
      // leave original URL if fetch fails
    }
  }));
  let out = html;
  for (const [url, dataUri] of map) {
    const escaped = url.replace(/&/g, '&amp;');
    out = out.split(`src="${escaped}"`).join(`src="${dataUri}"`);
    out = out.split(`src="${url}"`).join(`src="${dataUri}"`);
  }
  return out;
}

const browser = await chromium.launch();
const context = await browser.newContext({ bypassCSP: true });
const page = await context.newPage();

page.on('console', (msg) => {
  if (msg.type() === 'error') console.error('[browser]', msg.text());
});

// Inline images as data URIs to bypass browser CORS during docx embedding.
const inlinedHtml = await inlineImages(plainHtml);

// Build a full HTML document whose <main> holds our migrated content.
const fullDoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>UnumGroup | Helping the working world thrive throughout life's moments</title></head><body><main>${inlinedHtml}</main></body></html>`;

await page.setContent(fullDoc, { waitUntil: 'domcontentloaded' });

// Inject the helix-importer UMD bundle.
await page.evaluate((script) => {
  const el = document.createElement('script');
  el.textContent = script;
  document.head.appendChild(el);
}, helixImporter);

await page.waitForFunction(() => typeof window.WebImporter !== 'undefined' && typeof window.WebImporter.html2docx === 'function', { timeout: 10000 });

const base64 = await page.evaluate(async (url) => {
  const config = {
    transform: ({ document }) => {
      const main = document.querySelector('main');
      const WI = window.WebImporter;

      // Known EDS block class names in this project.
      const BLOCK_CLASSES = ['hero-corporate', 'carousel-awards', 'cards-news', 'columns-social', 'embed-social'];

      // Convert each block div into an EDS block table:
      //   row 1 = block name, following rows = the block's existing row divs (cells = inner divs).
      BLOCK_CLASSES.forEach((cls) => {
        main.querySelectorAll(`.${cls}`).forEach((block) => {
          const rows = [];
          // Block name header row
          rows.push([cls]);
          // Each direct child div is a content row; its child divs are the cells.
          [...block.children].forEach((rowDiv) => {
            const cells = [...rowDiv.children];
            if (cells.length === 0) {
              rows.push([rowDiv]);
            } else {
              rows.push(cells);
            }
          });
          const table = WI.DOMUtils.createTable(rows, document);
          block.replaceWith(table);
        });
      });

      // Convert the metadata div into a Metadata table (already a .metadata div).
      main.querySelectorAll('.metadata').forEach((meta) => {
        const rows = [['Metadata']];
        [...meta.children].forEach((rowDiv) => {
          const cells = [...rowDiv.children];
          rows.push(cells.length ? cells : [rowDiv]);
        });
        const table = WI.DOMUtils.createTable(rows, document);
        meta.replaceWith(table);
      });

      return [{
        element: main,
        path: '/index',
      }];
    },
  };
  const result = await window.WebImporter.html2docx(url, document, config, {
    toDocx: true,
    toMd: true,
    originalURL: url,
  });
  // result.docx may be a Blob, ArrayBuffer, or Uint8Array
  const docx = result.docx;
  let bytes;
  if (docx instanceof Blob) {
    bytes = new Uint8Array(await docx.arrayBuffer());
  } else if (docx instanceof ArrayBuffer) {
    bytes = new Uint8Array(docx);
  } else if (docx && docx.buffer) {
    bytes = new Uint8Array(docx.buffer);
  } else if (Array.isArray(docx)) {
    bytes = new Uint8Array(docx);
  } else {
    throw new Error('Unexpected docx type: ' + Object.prototype.toString.call(docx));
  }
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}, pageUrl);

writeFileSync(outPath, Buffer.from(base64, 'base64'));
console.log('Wrote', outPath, Buffer.from(base64, 'base64').length, 'bytes');

await browser.close();
