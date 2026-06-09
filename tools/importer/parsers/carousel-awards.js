/* eslint-disable */
/* global WebImporter */

/**
 * Parser: carousel-awards
 * Base block: carousel
 * Source: https://www.unumgroup.com/
 * Selector: .award_slider_container
 * Description: Horizontal sliding gallery of award/certification logos.
 *   Each slide contains an award logo image, optionally wrapped in a link.
 *   Slick slider clones are excluded to avoid duplicate slides.
 * Generated: 2026-06-03
 */
export default function parse(element, { document }) {
  // Select only non-cloned slides to avoid duplicates from slick slider
  const slides = element.querySelectorAll('.award_slider__slide:not(.slick-cloned)');

  const cells = [];

  slides.forEach((slide) => {
    const img = slide.querySelector('img');
    if (!img) return; // skip empty slides

    const link = slide.querySelector('a');

    // Each row: first cell is the image (or linked image), second cell is empty
    // Award logos have no associated text content
    if (link) {
      // Preserve the anchor wrapping the image as a single unit
      cells.push([link, '']);
    } else {
      cells.push([img, '']);
    }
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-awards', cells });
  element.replaceWith(block);
}
