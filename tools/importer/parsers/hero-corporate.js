/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-corporate
 * Base block: hero
 * Source: https://www.unumgroup.com/
 * Selector: .hero_image
 * Generated: 2026-06-03
 *
 * Source structure:
 *   .hero_image
 *     img (background image)
 *     .hero_desc
 *       span.final_position (tagline text with optional <sup>)
 *
 * Target structure (hero block library):
 *   Row 1: Background image
 *   Row 2: Heading/tagline content
 */
export default function parse(element, { document }) {
  // Extract background image - validated against source.html: direct img child of .hero_image
  const bgImage = element.querySelector(':scope > img, :scope img');

  // Extract tagline text - validated against source.html: .hero_desc > span.final_position
  const taglineSpan = element.querySelector('.hero_desc span.final_position, .hero_desc .final_position, .hero_desc span');

  // Build cells array matching hero block library structure:
  // Row 1: Background image (optional per library spec)
  // Row 2: Content (title/tagline)
  const cells = [];

  // Row 1: Background image
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 2: Content cell - wrap tagline in heading for semantic structure
  const contentCell = [];
  if (taglineSpan) {
    // Create an h1 element to give the tagline proper heading semantics
    const heading = document.createElement('h1');
    heading.innerHTML = taglineSpan.innerHTML;
    contentCell.push(heading);
  }

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  // Use window.WebImporter to handle UMD edge case on sites that define module/exports
  const importer = window.WebImporter || WebImporter;
  const block = importer.Blocks.createBlock(document, { name: 'hero-corporate', cells });
  element.replaceWith(block);
}
