import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Identify the image cell (the row that contains a picture/img) and the
  // content cell (everything else). This is tolerant of the extra cell
  // wrapper divs that document authoring produces.
  let imageRow = rows.find((row) => row.querySelector('picture, img'));
  let contentRow = rows.find((row) => row !== imageRow);
  if (!imageRow && rows.length) [imageRow, contentRow] = rows;

  if (imageRow) {
    imageRow.className = 'teaser-image';
    const picture = imageRow.querySelector('picture');
    const img = imageRow.querySelector('img');

    // Hoist the picture to be a direct child so height/object-fit apply cleanly.
    if (picture && picture.parentElement !== imageRow) {
      imageRow.textContent = '';
      imageRow.append(picture);
    }

    if (img) {
      // EDS optimization only works for same-origin media-bus images.
      const sameOrigin = img.src.startsWith('/')
        || img.src.startsWith(window.location.origin)
        || img.src.startsWith('./')
        || img.src.includes('/media_');
      if (sameOrigin) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1000' }]);
        imageRow.querySelector('picture')?.replaceWith(optimized);
      }
    }
  }

  if (contentRow) {
    contentRow.className = 'teaser-content';

    // Flatten any cell-wrapper divs so the content elements (p, headings, a)
    // become direct children, regardless of how the doc nested them.
    const items = [...contentRow.querySelectorAll(':scope > div')];
    if (items.length) {
      const flattened = [];
      items.forEach((wrapper) => {
        const kids = [...wrapper.children];
        if (kids.length) flattened.push(...kids);
        else if (wrapper.textContent.trim()) flattened.push(wrapper);
      });
      contentRow.replaceChildren(...flattened);
    }

    // Assign semantic classes by order so CSS doesn't depend on element type.
    const parts = [...contentRow.children];
    const cta = contentRow.querySelector('a');
    parts.forEach((el, i) => {
      if (cta && el.contains(cta)) {
        el.className = 'teaser-cta';
      } else if (i === 0) {
        el.className = 'teaser-eyebrow';
      } else if (i === 1) {
        el.className = 'teaser-date';
      } else if (i === 2) {
        el.className = 'teaser-title';
      } else {
        el.className = 'teaser-desc';
      }
    });

    // Make the whole teaser clickable when the content has a link.
    if (cta) {
      block.dataset.href = cta.getAttribute('href');
      block.classList.add('teaser-linked');
      block.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        window.location.href = block.dataset.href;
      });
    }
  }
}
