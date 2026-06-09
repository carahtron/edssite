# Create the Google Drive Authoring Document (Unum Homepage)

## Goal

Produce the **authoring document** for the migrated Unum Group homepage as a Word `.docx` file, then place it in the **Google Drive** folder that the site is mounted to. In Edge Delivery Services doc-based authoring, authors edit a document in the mounted Drive folder — that document is the source of truth that renders as the page.

## What we have to work from

The migration produced an EDS HTML representation, and all infrastructure is intact:
- `tools/importer/import-homepage.bundle.js` (bundled import script) ✓
- `tools/importer/page-templates.json` (URL + block mappings) ✓
- `migration-work/cleaned.html` (scraped source) ✓
- Block parsers/transformers + the two manual fixes (cards-news images, de-duplicated news) ✓

The earlier import was run with `toDocx: false` (HTML/markdown only), so **no `.docx` was generated yet**. We need to produce one.

---

## How the document gets created

The importer that built the page can also emit a Word document. To get a Drive-ready file we re-run the import with **DOCX output enabled** (`toDocx: true`) against `https://www.unumgroup.com/`. That yields `index.docx` containing:
- The hero tagline + image
- Awards block table
- News & Stories cards table (with the corrected thumbnails)
- Stay Connected columns table
- Page metadata table

Block tables in the `.docx` use the EDS convention (block name in the first row), so they round-trip correctly when authors edit and re-publish.

---

## Placing it in Google Drive

The site's mount is defined in `fstab.yaml` — the active mount is the Google Drive folder:
`https://drive.google.com/drive/folders/1r0hG9nMdtQ-QRf0yooA13cvhhsfZZGy9`

Once the `.docx` exists:
1. **Upload** `index.docx` into that Drive folder, OR open it in Google Docs and paste the content. Placing it at the folder root makes it the homepage (`/`).
2. Ensure the Drive folder is shared with the AEM Helix/Franklin service account (so the platform can read it).
3. Preview/publish via the AEM sidekick or admin so it goes live.

> Note: I can generate the `.docx` locally, but I **cannot upload directly to your Google Drive** — that step you (or someone with Drive access) will do manually, since it requires your Google account. I'll hand you the ready file.

---

## Checklist

- [ ] Confirm the document maps to `/` (homepage) at the Drive folder root
- [ ] Re-run the import with DOCX output enabled to generate `index.docx` from the Unum homepage
- [ ] Verify the manual fixes are reflected (cards-news thumbnails present, no duplicated news content)
- [ ] Open/inspect `index.docx` locally to confirm block tables and content are correct
- [ ] Provide the finished `index.docx` for you to upload to the mounted Google Drive folder
- [ ] (You) Upload `index.docx` to the Drive folder root and confirm sharing with the service account
- [ ] (You) Preview/publish via sidekick and confirm the page renders correctly
- [ ] (Optional) Commit the generated `.docx` / `content/index.plain.html` to git as a backup

---

## Recommendation

Re-run the importer with DOCX output enabled to regenerate `index.docx` (the two news-card fixes will be re-applied so the document is complete), verify it locally, then you upload it to the root of the mounted Google Drive folder so it becomes the live homepage.

> Execution requires Execute mode. When you switch, I'll generate and verify the `index.docx`, then hand it to you with exact upload instructions for the Drive folder.
