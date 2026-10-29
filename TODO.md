# To do

Build queue, in order. One component at a time; check in between.

1. [x] Check list (Forms): checkbox items, select-all with indeterminate, "x of y done" status.
2. [x] Sticky bars: top and bottom app bars (with an optional collapsible mobile menu), sticky table headers and footers; the docs header now uses the component.
3. [x] Carousel and photo gallery (works with no JS: scroll-snap row plus jump links; script adds keys, status, optional auto-play with Pause).
4. [ ] Icon dropdown. Chris (2026-10-29): choose whatever topics fit the rest of the page for the options (so no framework brand logos needed; use the Lucide icons already in the library).
5. [ ] Material/Android set: bottom navigation, top app bar, bottom sheet, chips, search bar, time picker.
6. [ ] Suggested flows (sign-in, checkout, onboarding, empty and error pages) and the components they need.
7. [ ] Copy pass: unify default option labels ("Default", "Theme default", "Flat (default)", "Auto") and the Theme/Appearance/Style words, then read all explanatory text for one voice.
8. [ ] Other browsers LAST (Chris, 2026-10-29: get it right in Chrome first, then patch): run the puppeteer tests (keyboard, axe, WCAG 2.2) against Firefox, then Edge; fix what differs.

## Naming items to audit before the next major version

See `.claude/rules/naming.md`: `sheet`, `day`/`cal`/`daterange`, `check`/`switch`, `loader` vs `spinner`, `.sent`.

## Not verified

Screen readers, real touch devices, Firefox and Safari.
