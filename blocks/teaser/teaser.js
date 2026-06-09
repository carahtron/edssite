import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];

  // Row 1: image. Row 2: text content (category, date, title, description, CTA).
  const [imageRow, contentRow] = rows;

  if (imageRow) {
    imageRow.className = 'teaser-image';
    const img = imageRow.querySelector('img');
    if (img) {
      // EDS image optimization only works for media-bus images on the same origin.
      // For external/cross-origin sources, leave the original <picture> untouched.
      const sameOrigin = img.src.startsWith('/')
        || img.src.startsWith(window.location.origin)
        || img.src.startsWith('./');
      if (sameOrigin) {
        const optimized = createOptimizedPicture(img.src, img.alt, false, [{ width: '1000' }]);
        img.closest('picture')?.replaceWith(optimized);
      }
    }
  }

  if (contentRow) {
    contentRow.className = 'teaser-content';

    // The whole teaser is clickable if the content has a link.
    const link = contentRow.querySelector('a');
    if (link) {
      block.dataset.href = link.getAttribute('href');
      block.classList.add('teaser-linked');
      block.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        window.location.href = block.dataset.href;
      });
    }
  }
}
