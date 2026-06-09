/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroCorporateParser from './parsers/hero-corporate.js';
import carouselAwardsParser from './parsers/carousel-awards.js';
import cardsNewsParser from './parsers/cards-news.js';
import columnsSocialParser from './parsers/columns-social.js';
import embedSocialParser from './parsers/embed-social.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/unumgroup-cleanup.js';
import sectionsTransformer from './transformers/unumgroup-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-corporate': heroCorporateParser,
  'carousel-awards': carouselAwardsParser,
  'cards-news': cardsNewsParser,
  'columns-social': columnsSocialParser,
  'embed-social': embedSocialParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'Unum Group corporate homepage with hero, awards carousel, news cards, social media links, and embedded social feed',
  urls: [
    'https://www.unumgroup.com/'
  ],
  blocks: [
    {
      name: 'hero-corporate',
      instances: ['.hero_image']
    },
    {
      name: 'carousel-awards',
      instances: ['.award_slider_container']
    },
    {
      name: 'cards-news',
      instances: ['.large_news_block', '.small_block_container']
    },
    {
      name: 'columns-social',
      instances: ['.social_media_block']
    },
    {
      name: 'embed-social',
      instances: ['.ig_slider']
    }
  ],
  sections: [
    {
      id: 'section-hero',
      name: 'Hero',
      selector: '.hero_image',
      style: 'dark',
      blocks: ['hero-corporate'],
      defaultContent: []
    },
    {
      id: 'section-mission',
      name: 'Mission Statement',
      selector: '.hero_info',
      style: null,
      blocks: [],
      defaultContent: ['.hero_info .col-lg-10']
    },
    {
      id: 'section-awards',
      name: 'Awards & Recognition',
      selector: ['.awards_text', '.award_slider_container'],
      style: null,
      blocks: ['carousel-awards'],
      defaultContent: ['.awards_text h2', '.awards_text p']
    },
    {
      id: 'section-news',
      name: 'News & Stories',
      selector: '.newsfeed',
      style: null,
      blocks: ['cards-news'],
      defaultContent: ['.newsfeed h2', '.newsroom-action-link']
    },
    {
      id: 'section-social',
      name: 'Stay Connected',
      selector: '.social_media_block',
      style: 'light-grey',
      blocks: ['columns-social', 'embed-social'],
      defaultContent: ['.social_media_block h2']
    }
  ]
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach(blockDef => {
    blockDef.instances.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach(element => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, html, params } = payload;

    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach(block => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index'
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map(b => b.name),
      }
    }];
  }
};
