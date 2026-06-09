/* eslint-disable */
/* global WebImporter */

/**
 * Parser for embed-social
 * Base block: embed
 * Source: https://www.unumgroup.com/
 * Selector: .ig_slider
 * Generated: 2026-06-03
 *
 * Extracts an embedded social media feed iframe and produces an Embed block
 * with a single row containing a link to the iframe source URL.
 */
export default function parse(element, { document }) {
  // Extract the iframe element - validate against source.html which shows
  // an iframe with src="https://embedsocial.com/..." inside .ig_slider
  const iframe = element.querySelector('iframe[src], iframe[data-src]');

  if (!iframe) {
    // No iframe found, nothing to embed
    return;
  }

  // Get the iframe source URL (prefer src, fallback to data-src for lazy-loaded iframes)
  const iframeSrc = iframe.getAttribute('src') || iframe.getAttribute('data-src');

  if (!iframeSrc) {
    return;
  }

  // Create a link element pointing to the iframe source URL
  const link = document.createElement('a');
  link.href = iframeSrc;
  link.textContent = iframeSrc;

  // Build cells: single row with the link to the embed source
  const cells = [
    [link],
  ];

  const block = WebImporter.Blocks.createBlock(document, { name: 'embed-social', cells });
  element.replaceWith(block);
}
