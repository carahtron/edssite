# Unum Group Homepage Migration Plan

## Overview

Migrate the Unum Group homepage to AEM Edge Delivery Services, including both content structure and visual design/styling.

**Source URL:** https://www.unumgroup.com/  
**Scope:** Single page — Content + Design  
**Target:** AEM Edge Delivery Services (document-based authoring)

---

## Migration Phases

### Phase 1: Page Analysis
- Analyze the Unum Group homepage structure (sections, blocks, content sequences)
- Capture screenshots and computed styles from the original
- Identify block variants and authoring decisions (hero, cards, CTAs, etc.)
- Produce cleaned HTML and analysis artifacts

### Phase 2: Block Mapping & Import Infrastructure
- Map identified content blocks to EDS block types
- Create block parsers for each variant found on the page
- Generate page transformers (cleanup, sections, metadata)
- Build the import script bundle

### Phase 3: Content Import
- Execute the import script against https://www.unumgroup.com/
- Generate EDS-compatible HTML content files
- Verify content structure and block tables render correctly

### Phase 4: Design Migration
- Extract design tokens (colors, typography, spacing) from Unum Group's site
- Write site-level CSS (fonts, variables, base styles)
- Style each block variant to match the original design
- Visual comparison and iteration until styling matches

### Phase 5: Verification
- Preview the migrated page in the local dev server
- Compare against the original Unum Group homepage visually
- Fix any rendering issues or styling discrepancies
- Final QA pass

---

## Checklist

- [x] Obtain source page URL from user
- [ ] Run page analysis on https://www.unumgroup.com/
- [ ] Review analysis results (sections, blocks, variants)
- [ ] Create block mappings in page template
- [ ] Generate block parsers for identified variants
- [ ] Generate page transformers (cleanup, sections, metadata)
- [ ] Bundle and execute import script
- [ ] Verify imported content renders correctly
- [ ] Extract and apply site-level design (fonts, colors, spacing)
- [ ] Style individual block variants
- [ ] Visual comparison against original
- [ ] Iterate on styling fixes until match is acceptable
- [ ] Final verification and QA

---

## Prerequisites

- [x] **Source URL:** https://www.unumgroup.com/
- Local EDS project is set up in the workspace
- Preview server available for verification

---

> **Ready for execution.** Switch to Execute mode to begin the migration starting with page analysis of the Unum Group homepage.
