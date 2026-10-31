# To do

Build queue, in order. One component at a time; check in between. Standing rules: native HTML and CSS first (script only adds extras), controls are ordinary keys like pagination, browsers last. Last commit when saved: `af6f807` (pushed up to `c2347aa`; bottom navigation and chips are local only).

1. [x] Check list (Forms): checkbox items, select-all with indeterminate, "x of y done" status.
2. [x] Sticky bars: top and bottom app bars (with an optional collapsible mobile menu), sticky table headers and footers; the docs header now uses the component.
3. [x] Carousel and photo gallery (works with no JS: scroll-snap row plus jump links; script adds keys, status, optional auto-play with Pause).
4. [x] Icon dropdown: `data-icon` on the options of a `data-picker` select (Appearance with monitor/sun/moon, Alert type with the alert icons); plain native select without JS.
5. [x] Mobile UI set (Material/Android and iOS-style patterns), each working without JS where it can: bottom navigation, chips, bottom sheet, search bar, time picker, speed dial, swipe list, avatar and avatar group, tile list, skeleton, empty state, rating, steps and wizard (the stepper name stays with the number field), refreshable list. Segmented control is the button group; the snackbar with an action key is still open (toasts have no action key yet).
6. [x] Alien content pass: names, captions, alt text, quotes, charts, timeline, map and images now come from the film (Nostromo, Mother, LV-426, Ripley, Dallas, Kane, Ash, Lambert, Parker, Brett, Jones). The Volume, Reverb, Tone and Band control labels stay, because they name what a control does.
7. [x] Suggested flows: `docs/flows.html` (sign in, checkout, onboarding, empty and error pages), tested in `tests/flows.mjs`. Components they needed (wizard, steps, empty state, tile list) were built in step 5.
8. [x] Copy pass: the "no override" option is "Default" everywhere ("Default (flat)" for Style), Auto stays only for Appearance, "our own" became "part of the map", and the settings words are in the glossary.
9. [ ] Other browsers LAST (Chris, 2026-10-29: get it right in Chrome first, then patch): run the puppeteer tests (keyboard, axe, WCAG 2.2) against Firefox, then Edge; fix what differs.

## Naming items to audit before the next major version

See `.claude/rules/naming.md`: `sheet`, `day`/`cal`/`daterange`, `check`/`switch`, `loader` vs `spinner`, `.sent`.

## Not verified

Screen readers, real touch devices, Firefox and Safari.
