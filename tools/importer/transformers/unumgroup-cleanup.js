/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: unumgroup cleanup
 * Removes non-authorable site-wide elements from unumgroup.com pages.
 * All selectors verified against captured DOM in migration-work/cleaned.html.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // OneTrust cookie consent SDK (line 1185 in cleaned.html)
    // UserWay accessibility widget (line 2 in cleaned.html)
    // Google Translate tooltip and widget (line 1130 in cleaned.html)
    // Site notification banner (line 45 in cleaned.html: #banner)
    // Theme toggle button (line 59 in cleaned.html: #theme-toggle)
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '.uwy.userway_p5',
      '#goog-gt-tt',
      '.VIpgJd-ZVi9od-aZ2wEe-wOHMyf',
      'iframe.VIpgJd-ZVi9od-xl07Ob-OEVmcd',
      '#banner',
      '#theme-toggle',
    ]);
  }

  if (hookName === H.after) {
    // Navigation bar (line 64: nav.navbar)
    // Mobile menu (line 256: .mobile_menu)
    // Breadcrumb navigation (line 385: nav.breadcrumb-container)
    // Footer (line 990: <footer>)
    // Skip-to-content link (line 42: a.skiplink)
    // Back-to-top button (line 379: .back_to_top)
    // afterHeader empty div (line 377: #afterHeader)
    // Google Translate element in nav (line 82: #google_translate_element)
    // Styling-context wrapper around banner (line 44: .styling-context.rich-text) - contains only banner/theme-toggle
    // Remaining iframes (UserWay, Google Translate, OneTrust resize)
    // Noscript and link elements
    WebImporter.DOMUtils.remove(element, [
      'nav.navbar',
      '.mobile_menu',
      'nav.breadcrumb-container',
      'footer',
      'a.skiplink',
      '.back_to_top',
      '#afterHeader',
      '#google_translate_element',
      '.styling-context.rich-text',
      'iframe',
      'noscript',
      'link',
    ]);
  }
}
