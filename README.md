# MARS Website

Static multi-page website for **MARS — Modern Analytics & Research Solutions**.

## Included pages

- `index.html` — Home
- `solutions.html` — Services and capabilities
- `about.html` — Company approach and process
- `insights.html` — Insight index
- `research-design.html`, `mixed-methods.html`, `decision-ready-reporting.html` — Insight articles
- `contact.html` — Project inquiry form
- `privacy-policy.html` — Privacy policy
- `404.html` — GitHub Pages error page

## Deployment

The site requires no build step. Commit the contents of this directory to the root of the `main` branch in `DataByMARS/mars-logic-site`. `CNAME` preserves `www.mars-logic.com`.

## Forms

GitHub Pages cannot process forms by itself. The contact and newsletter forms use JavaScript to prepare a prefilled email to `dstone@mars-logic.com`. No form data is stored by the website.

## External media

The Poppins font is loaded from Google Fonts. Three template media assets remain hosted by Wix because they are part of the supplied visual reference. Branded local fallback artwork is displayed if any of those assets cannot load. For a fully self-hosted deployment, replace the remote URLs with approved local media files and update the corresponding `src` and `poster` values.

## Brand palette

- Martian Red: `#a21e24`
- Stellar Grey: `#676767`
- Deep Space: `#1e1853`
- Star Dust: `#f0eeea`

No CSS gradients are used.

## Quality review

See `QUALITY-ASSURANCE.md` for the visual, accessibility, link, syntax, and responsive checks completed on this package.
