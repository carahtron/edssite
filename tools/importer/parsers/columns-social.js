/* eslint-disable */
/* global WebImporter */

/**
 * Parser: columns-social
 * Base block: columns
 * Source: https://www.unumgroup.com/
 * Selector: .social_media_block
 * Generated: 2026-06-03
 *
 * Extracts a two-column layout with brand logos and social media links.
 * Column 1: Unum brand logo + social links (Instagram, Facebook, LinkedIn)
 * Column 2: Colonial Life brand logo + social links (Instagram, Facebook, LinkedIn)
 * Each column also includes a "Follow Us" CTA link.
 */
export default function parse(element, { document }) {
  // Get the social_text container that holds both brand sections
  const socialText = element.querySelector('.social_text');
  if (!socialText) {
    // Fallback: create empty block if structure not found
    const block = WebImporter.Blocks.createBlock(document, { name: 'columns-social', cells: [] });
    element.replaceWith(block);
    return;
  }

  // Find all brand logo images (light_bg class, non-SVG data URI sources)
  // These are direct children of .social_text with class light_bg
  const brandLogos = Array.from(socialText.querySelectorAll('img.light_bg'));

  // Find all social links
  const allSocialLinks = Array.from(socialText.querySelectorAll('a.social-widget__links'));

  // Find the "Follow Us" link from social_info_block
  const followUsLink = element.querySelector('.social_info_block a');

  // Split content into two brand columns based on DOM order
  // Brand 1 (Unum): first logo + links that appear before second logo
  // Brand 2 (Colonial Life): second logo + remaining links
  const unumLogo = brandLogos.length > 0 ? brandLogos[0] : null;
  const colonialLogo = brandLogos.length > 1 ? brandLogos[1] : null;

  // Determine which social links belong to each brand
  // Using compareDocumentPosition to check DOM order relative to Colonial Life logo
  const unumLinks = [];
  const colonialLinks = [];

  if (colonialLogo) {
    allSocialLinks.forEach((link) => {
      // Node.DOCUMENT_POSITION_FOLLOWING (4) means colonialLogo comes after link
      const position = link.compareDocumentPosition(colonialLogo);
      if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
        // link comes before colonialLogo in DOM
        unumLinks.push(link);
      } else {
        // link comes after colonialLogo in DOM
        colonialLinks.push(link);
      }
    });
  } else {
    // All links go to first brand if only one logo found
    unumLinks.push(...allSocialLinks);
  }

  // Build Column 1: Unum brand
  const col1 = document.createElement('div');
  if (unumLogo) {
    const logoImg = document.createElement('img');
    logoImg.src = unumLogo.src;
    logoImg.alt = unumLogo.alt || 'Unum Logo';
    col1.appendChild(logoImg);
  }
  unumLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    col1.appendChild(p);
  });
  if (followUsLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = followUsLink.href;
    a.textContent = followUsLink.textContent.trim();
    p.appendChild(a);
    col1.appendChild(p);
  }

  // Build Column 2: Colonial Life brand
  const col2 = document.createElement('div');
  if (colonialLogo) {
    const logoImg = document.createElement('img');
    logoImg.src = colonialLogo.src;
    logoImg.alt = colonialLogo.alt || 'Colonial Life Logo';
    col2.appendChild(logoImg);
  }
  colonialLinks.forEach((link) => {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.textContent.trim();
    p.appendChild(a);
    col2.appendChild(p);
  });
  if (followUsLink) {
    const p = document.createElement('p');
    const a = document.createElement('a');
    a.href = followUsLink.href;
    a.textContent = followUsLink.textContent.trim();
    p.appendChild(a);
    col2.appendChild(p);
  }

  // Columns block: single row with two cells (one per brand column)
  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-social', cells });
  element.replaceWith(block);
}
