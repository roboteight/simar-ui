# To do

Build queue, in order. One component at a time; check in between. Standing rules: native HTML and CSS first (script only adds extras), controls are ordinary keys like pagination, browsers last. Last commit when saved: `af6f807` (pushed up to `c2347aa`; bottom navigation and chips are local only).

1. [x] Check list (Forms): checkbox items, select-all with indeterminate, "x of y done" status.
2. [x] Sticky bars: top and bottom app bars (with an optional collapsible mobile menu), sticky table headers and footers; the docs header now uses the component.
3. [x] Carousel and photo gallery (works with no JS: scroll-snap row plus jump links; script adds keys, status, optional auto-play with Pause).
4. [x] Icon dropdown: `data-icon` on the options of a `data-picker` select (Appearance with monitor/sun/moon, Alert type with the alert icons); plain native select without JS.
5. [ ] Mobile UI set (Material/Android and iOS-style patterns), one component at a time, each working without JS where it can. Done: bottom navigation (`149942b`), chips (`af6f807`), bottom sheet (`a2e28ab`), search bar. Next, in this order: time picker, speed dial (the floating button's menu), swipe-to-reveal list actions, list tiles with avatar and trailing action, avatar and avatar group, skeleton loader, empty state, rating, stepper (wizard) with step list, pull-to-refresh (script only, with a visible Refresh key as the real control). Check first whether the button group already covers the segmented control and the toasts the snackbar with an action (the button group does cover it with radio keys; toasts have no action key yet).
6. [ ] Alien content pass (Chris, 2026-10-29): rewrite all sample content, names, captions, images' alt text and copy so it sounds like it comes from the film Alien (Nostromo, Mother, Weyland-Yutani, LV-426, Ripley, Dallas, Kane, Ash, Lambert, Parker, Brett, Jones), replacing the punk and horror mix. Do it in one pass with a word list, update tests that read the sample text, regenerate screenshots. Keep names fictional film characters (sample emails stay @chrissimari.com).
7. [ ] Suggested flows (sign-in, checkout, onboarding, empty and error pages) and the components they need.
8. [ ] Copy pass: unify default option labels ("Default", "Theme default", "Flat (default)", "Auto") and the Theme/Appearance/Style words, then read all explanatory text for one voice.
9. [ ] Other browsers LAST (Chris, 2026-10-29: get it right in Chrome first, then patch): run the puppeteer tests (keyboard, axe, WCAG 2.2) against Firefox, then Edge; fix what differs.

## Naming items to audit before the next major version

See `.claude/rules/naming.md`: `sheet`, `day`/`cal`/`daterange`, `check`/`switch`, `loader` vs `spinner`, `.sent`.

## Not verified

Screen readers, real touch devices, Firefox and Safari.
