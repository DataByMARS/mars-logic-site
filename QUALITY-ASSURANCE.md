# Quality Assurance Review

Review completed against the supplied MARS site package and the approved Wix-template structure.

## Visual review

- Reviewed the Home, Solutions, About, Insights, Contact, Privacy Policy, three article pages, and 404 page.
- Reviewed representative desktop and mobile renders at 1440 px and 390 px widths.
- Confirmed consistent use of Poppins, Martian Red, Stellar Grey, Deep Space, Star Dust, white, and near-black text.
- Confirmed that the site contains no CSS gradients.
- Corrected low-contrast red text and buttons on Deep Space backgrounds.
- Replaced temporary letter-based header symbols with clean vector-style icons.
- Added branded local media fallbacks for remote template images and video.
- Standardized secondary neutral panels to the Star Dust brand color.

## Structural and functional review

- Verified that all internal page, stylesheet, script, image, manifest, sitemap, and policy references resolve.
- Verified unique HTML IDs and labels for form controls.
- Verified image alternative text coverage.
- Verified that all pages parse without HTML errors.
- Verified that the stylesheet parses without CSS errors.
- Verified JavaScript syntax with `node --check`.
- Verified the Home page has no horizontal overflow at desktop width.
- Verified visible Home-page text meets normal or large-text contrast thresholds after corrections.

## Deployment note

The template photographs and hero video remain hosted by Wix. The site now provides local MARS-branded fallback artwork if a remote media request fails. Replace those remote media URLs with approved local copies when they become available for a fully self-hosted site.
