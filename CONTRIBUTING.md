# Contributing to simar-ui

Thanks for helping. simar-ui is free to use and held to a high bar for accessibility, so a change is only ready when it
comes with tests at the same standard as the rest of the project.

## Every change to the library needs tests

If you change anything in `src/` or `scss/`, the pull request must also change something in `tests/`, and `npm test`
must pass. The check runs automatically on every pull request; a library change with no test change is rejected.

A new or changed component needs all of these:

1. **Native first.** A real HTML element underneath, working without JavaScript where it can.
2. **Accessibility, tested.** Keyboard operation, accessible names, visible focus, 24px targets, contrast in light and dark
   (and with every highlight and palette), reduced motion and forced colors. Follow the WAI-ARIA pattern exactly where
   there is one. The target is WCAG 2.2 AA, 100%. Do not switch a rule off to get a green test; fix the cause.
3. **Tests in `tests/`.** The axe run (`tests/a11y.mjs`) covers every state the component can be in; `tests/wcag22.mjs`
   covers its behavior and keys; `tests/keyboard.mjs` tabs through it. Add the component's states to them.
4. **Responsive.** It works from a 320px phone to a desktop, with no sideways scrolling.
5. **Themed.** Colors, fonts and shadows come from tokens in `scss/themes/`, never hard-coded in a component.
6. **Docs.** A demo section in `index.html` with HTML and tag examples, a contents link, a README entry and a screenshot
   (`npm run screenshots`).
7. **Names.** Use the words in `.claude/rules/naming.md`; don't invent a second word for something that has one.

## Before you open a pull request

```
npm install
npm run build     # compiles dist/ (it is committed, so commit the result)
npm test          # build, axe, contrast, WCAG 2.2, keyboard in light and dark
```

Say in the description what you tested by hand that automation can't cover (screen readers, touch devices, other
browsers). If you used AI tools, that's fine; the tests and the review are what count.

By contributing you agree your work is released under the project's MIT license.
