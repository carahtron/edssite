/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: unumgroup sections
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 *
 * Sections from page-templates.json (homepage template):
 *   1. Hero - selector: .hero_image, style: "dark"
 *   2. Mission Statement - selector: .hero_info, style: null
 *   3. Awards & Recognition - selector: [".awards_text", ".award_slider_container"], style: null
 *   4. News & Stories - selector: .newsfeed, style: null
 *   5. Stay Connected - selector: .social_media_block, style: "light-grey"
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.after) {
    const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
    const doc = element.ownerDocument || document;
    const sections = payload && payload.template && payload.template.sections;

    if (!sections || sections.length < 2) return;

    // Process sections in reverse order to avoid offset issues when inserting elements
    const reversedSections = [...sections].reverse();

    reversedSections.forEach((section, reversedIndex) => {
      const originalIndex = sections.length - 1 - reversedIndex;

      // Determine the selector - could be a string or array
      const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
      let sectionElement = null;

      for (const sel of selectors) {
        sectionElement = element.querySelector(sel);
        if (sectionElement) break;
      }

      if (!sectionElement) return;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        // Insert section metadata after the last element of this section
        // (before the next section break or at the end of the section content)
        if (sectionElement.nextElementSibling) {
          sectionElement.parentNode.insertBefore(sectionMetadataBlock, sectionElement.nextElementSibling);
        } else {
          sectionElement.parentNode.appendChild(sectionMetadataBlock);
        }
      }

      // Insert <hr> before each section except the first
      if (originalIndex > 0) {
        const hr = doc.createElement('hr');
        sectionElement.parentNode.insertBefore(hr, sectionElement);
      }
    });
  }
}
