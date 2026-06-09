/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-news
 * Base block: cards
 * Source: https://www.unumgroup.com/
 * Generated: 2026-06-03
 *
 * Handles two instance types:
 * 1. .large_news_block - Featured article with large image and text content
 * 2. .small_block_container - Grid of smaller article cards (a.small_news_block)
 *
 * Target table: 2-column Cards block
 *   Row per card: [image] | [heading, description, CTA link]
 */
export default function parse(element, { document }) {
  const cells = [];

  // Instance 1: .large_news_block (single featured article)
  if (element.classList.contains('large_news_block')) {
    // Extract image from .article_container
    const image = element.querySelector('.article_container img');

    // Extract text content from .news_block_content
    const contentContainer = element.querySelector('.news_block_content');

    const textCell = [];

    if (contentContainer) {
      // Category as eyebrow text
      const category = contentContainer.querySelector('.article_category');
      if (category) {
        const p = document.createElement('p');
        p.textContent = category.textContent.trim();
        textCell.push(p);
      }

      // Date
      const date = contentContainer.querySelector('.article_date');
      if (date) {
        const p = document.createElement('p');
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }

      // Title as heading
      const title = contentContainer.querySelector('.large_article_title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }

      // Description
      const description = contentContainer.querySelector('#firstBlogDescription, span');
      if (description) {
        const p = document.createElement('p');
        p.textContent = description.textContent.trim();
        textCell.push(p);
      }

      // CTA link - .news_read_more is a <p> with href attribute (non-standard HTML)
      const ctaElement = contentContainer.querySelector('.news_read_more');
      if (ctaElement) {
        const href = ctaElement.getAttribute('href');
        if (href) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = ctaElement.textContent.trim() || 'Keep Reading';
          textCell.push(a);
        }
      }
    }

    cells.push([image || '', textCell]);
  }

  // Instance 2: .small_block_container (grid of small article cards)
  if (element.classList.contains('small_block_container')) {
    // Select only the direct a.small_news_block children (not slick clones)
    const cards = element.querySelectorAll(':scope > a.small_news_block');

    cards.forEach((card) => {
      // Extract image
      const image = card.querySelector('.article_pic img');

      const textCell = [];

      // Category
      const category = card.querySelector('.article_category');
      if (category) {
        const p = document.createElement('p');
        p.textContent = category.textContent.trim();
        textCell.push(p);
      }

      // Date
      const date = card.querySelector('.article_date');
      if (date) {
        const p = document.createElement('p');
        p.textContent = date.textContent.trim();
        textCell.push(p);
      }

      // Title as heading
      const title = card.querySelector('.article_title');
      if (title) {
        const h3 = document.createElement('h3');
        h3.textContent = title.textContent.trim();
        textCell.push(h3);
      }

      // Description
      const desc = card.querySelector('.article_desc');
      if (desc) {
        const p = document.createElement('p');
        p.textContent = desc.textContent.trim();
        textCell.push(p);
      }

      // CTA link - the card itself is an <a> element with the href
      const href = card.getAttribute('href');
      if (href) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = 'Keep Reading';
        textCell.push(a);
      }

      cells.push([image || '', textCell]);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-news', cells });
  element.replaceWith(block);
}
