/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-corporate.js
  function parse(element, { document }) {
    const bgImage = element.querySelector(":scope > img, :scope img");
    const taglineSpan = element.querySelector(".hero_desc span.final_position, .hero_desc .final_position, .hero_desc span");
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (taglineSpan) {
      const heading = document.createElement("h1");
      heading.innerHTML = taglineSpan.innerHTML;
      contentCell.push(heading);
    }
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const importer = window.WebImporter || WebImporter;
    const block = importer.Blocks.createBlock(document, { name: "hero-corporate", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-awards.js
  function parse2(element, { document }) {
    const slides = element.querySelectorAll(".award_slider__slide:not(.slick-cloned)");
    const cells = [];
    slides.forEach((slide) => {
      const img = slide.querySelector("img");
      if (!img) return;
      const link = slide.querySelector("a");
      if (link) {
        cells.push([link, ""]);
      } else {
        cells.push([img, ""]);
      }
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "carousel-awards", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-news.js
  function parse3(element, { document }) {
    const cells = [];
    if (element.classList.contains("large_news_block")) {
      const image = element.querySelector(".article_container img");
      const contentContainer = element.querySelector(".news_block_content");
      const textCell = [];
      if (contentContainer) {
        const category = contentContainer.querySelector(".article_category");
        if (category) {
          const p = document.createElement("p");
          p.textContent = category.textContent.trim();
          textCell.push(p);
        }
        const date = contentContainer.querySelector(".article_date");
        if (date) {
          const p = document.createElement("p");
          p.textContent = date.textContent.trim();
          textCell.push(p);
        }
        const title = contentContainer.querySelector(".large_article_title");
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          textCell.push(h3);
        }
        const description = contentContainer.querySelector("#firstBlogDescription, span");
        if (description) {
          const p = document.createElement("p");
          p.textContent = description.textContent.trim();
          textCell.push(p);
        }
        const ctaElement = contentContainer.querySelector(".news_read_more");
        if (ctaElement) {
          const href = ctaElement.getAttribute("href");
          if (href) {
            const a = document.createElement("a");
            a.href = href;
            a.textContent = ctaElement.textContent.trim() || "Keep Reading";
            textCell.push(a);
          }
        }
      }
      cells.push([image || "", textCell]);
    }
    if (element.classList.contains("small_block_container")) {
      const cards = element.querySelectorAll(":scope > a.small_news_block");
      cards.forEach((card) => {
        const image = card.querySelector(".article_pic img");
        const textCell = [];
        const category = card.querySelector(".article_category");
        if (category) {
          const p = document.createElement("p");
          p.textContent = category.textContent.trim();
          textCell.push(p);
        }
        const date = card.querySelector(".article_date");
        if (date) {
          const p = document.createElement("p");
          p.textContent = date.textContent.trim();
          textCell.push(p);
        }
        const title = card.querySelector(".article_title");
        if (title) {
          const h3 = document.createElement("h3");
          h3.textContent = title.textContent.trim();
          textCell.push(h3);
        }
        const desc = card.querySelector(".article_desc");
        if (desc) {
          const p = document.createElement("p");
          p.textContent = desc.textContent.trim();
          textCell.push(p);
        }
        const href = card.getAttribute("href");
        if (href) {
          const a = document.createElement("a");
          a.href = href;
          a.textContent = "Keep Reading";
          textCell.push(a);
        }
        cells.push([image || "", textCell]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-news", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-social.js
  function parse4(element, { document }) {
    const socialText = element.querySelector(".social_text");
    if (!socialText) {
      const block2 = WebImporter.Blocks.createBlock(document, { name: "columns-social", cells: [] });
      element.replaceWith(block2);
      return;
    }
    const brandLogos = Array.from(socialText.querySelectorAll("img.light_bg"));
    const allSocialLinks = Array.from(socialText.querySelectorAll("a.social-widget__links"));
    const followUsLink = element.querySelector(".social_info_block a");
    const unumLogo = brandLogos.length > 0 ? brandLogos[0] : null;
    const colonialLogo = brandLogos.length > 1 ? brandLogos[1] : null;
    const unumLinks = [];
    const colonialLinks = [];
    if (colonialLogo) {
      allSocialLinks.forEach((link) => {
        const position = link.compareDocumentPosition(colonialLogo);
        if (position & Node.DOCUMENT_POSITION_FOLLOWING) {
          unumLinks.push(link);
        } else {
          colonialLinks.push(link);
        }
      });
    } else {
      unumLinks.push(...allSocialLinks);
    }
    const col1 = document.createElement("div");
    if (unumLogo) {
      const logoImg = document.createElement("img");
      logoImg.src = unumLogo.src;
      logoImg.alt = unumLogo.alt || "Unum Logo";
      col1.appendChild(logoImg);
    }
    unumLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      col1.appendChild(p);
    });
    if (followUsLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = followUsLink.href;
      a.textContent = followUsLink.textContent.trim();
      p.appendChild(a);
      col1.appendChild(p);
    }
    const col2 = document.createElement("div");
    if (colonialLogo) {
      const logoImg = document.createElement("img");
      logoImg.src = colonialLogo.src;
      logoImg.alt = colonialLogo.alt || "Colonial Life Logo";
      col2.appendChild(logoImg);
    }
    colonialLinks.forEach((link) => {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = link.href;
      a.textContent = link.textContent.trim();
      p.appendChild(a);
      col2.appendChild(p);
    });
    if (followUsLink) {
      const p = document.createElement("p");
      const a = document.createElement("a");
      a.href = followUsLink.href;
      a.textContent = followUsLink.textContent.trim();
      p.appendChild(a);
      col2.appendChild(p);
    }
    const cells = [[col1, col2]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/embed-social.js
  function parse5(element, { document }) {
    const iframe = element.querySelector("iframe[src], iframe[data-src]");
    if (!iframe) {
      return;
    }
    const iframeSrc = iframe.getAttribute("src") || iframe.getAttribute("data-src");
    if (!iframeSrc) {
      return;
    }
    const link = document.createElement("a");
    link.href = iframeSrc;
    link.textContent = iframeSrc;
    const cells = [
      [link]
    ];
    const block = WebImporter.Blocks.createBlock(document, { name: "embed-social", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/unumgroup-cleanup.js
  var H = { before: "beforeTransform", after: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === H.before) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        ".uwy.userway_p5",
        "#goog-gt-tt",
        ".VIpgJd-ZVi9od-aZ2wEe-wOHMyf",
        "iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd",
        "#banner",
        "#theme-toggle"
      ]);
    }
    if (hookName === H.after) {
      WebImporter.DOMUtils.remove(element, [
        "nav.navbar",
        ".mobile_menu",
        "nav.breadcrumb-container",
        "footer",
        "a.skiplink",
        ".back_to_top",
        "#afterHeader",
        "#google_translate_element",
        ".styling-context.rich-text",
        "iframe",
        "noscript",
        "link"
      ]);
    }
  }

  // tools/importer/transformers/unumgroup-sections.js
  var H2 = { before: "beforeTransform", after: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === H2.after) {
      const { document } = element.ownerDocument ? { document: element.ownerDocument } : { document: element };
      const doc = element.ownerDocument || document;
      const sections = payload && payload.template && payload.template.sections;
      if (!sections || sections.length < 2) return;
      const reversedSections = [...sections].reverse();
      reversedSections.forEach((section, reversedIndex) => {
        const originalIndex = sections.length - 1 - reversedIndex;
        const selectors = Array.isArray(section.selector) ? section.selector : [section.selector];
        let sectionElement = null;
        for (const sel of selectors) {
          sectionElement = element.querySelector(sel);
          if (sectionElement) break;
        }
        if (!sectionElement) return;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (sectionElement.nextElementSibling) {
            sectionElement.parentNode.insertBefore(sectionMetadataBlock, sectionElement.nextElementSibling);
          } else {
            sectionElement.parentNode.appendChild(sectionMetadataBlock);
          }
        }
        if (originalIndex > 0) {
          const hr = doc.createElement("hr");
          sectionElement.parentNode.insertBefore(hr, sectionElement);
        }
      });
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-corporate": parse,
    "carousel-awards": parse2,
    "cards-news": parse3,
    "columns-social": parse4,
    "embed-social": parse5
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "Unum Group corporate homepage with hero, awards carousel, news cards, social media links, and embedded social feed",
    urls: [
      "https://www.unumgroup.com/"
    ],
    blocks: [
      {
        name: "hero-corporate",
        instances: [".hero_image"]
      },
      {
        name: "carousel-awards",
        instances: [".award_slider_container"]
      },
      {
        name: "cards-news",
        instances: [".large_news_block", ".small_block_container"]
      },
      {
        name: "columns-social",
        instances: [".social_media_block"]
      },
      {
        name: "embed-social",
        instances: [".ig_slider"]
      }
    ],
    sections: [
      {
        id: "section-hero",
        name: "Hero",
        selector: ".hero_image",
        style: "dark",
        blocks: ["hero-corporate"],
        defaultContent: []
      },
      {
        id: "section-mission",
        name: "Mission Statement",
        selector: ".hero_info",
        style: null,
        blocks: [],
        defaultContent: [".hero_info .col-lg-10"]
      },
      {
        id: "section-awards",
        name: "Awards & Recognition",
        selector: [".awards_text", ".award_slider_container"],
        style: null,
        blocks: ["carousel-awards"],
        defaultContent: [".awards_text h2", ".awards_text p"]
      },
      {
        id: "section-news",
        name: "News & Stories",
        selector: ".newsfeed",
        style: null,
        blocks: ["cards-news"],
        defaultContent: [".newsfeed h2", ".newsroom-action-link"]
      },
      {
        id: "section-social",
        name: "Stay Connected",
        selector: ".social_media_block",
        style: "light-grey",
        blocks: ["columns-social", "embed-social"],
        defaultContent: [".social_media_block h2"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
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
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, html, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
