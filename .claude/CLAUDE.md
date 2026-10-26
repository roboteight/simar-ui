# simar-ui

A public, MIT-licensed, dependency-free library of form controls and page components built on native HTML.
Detailed rules are in `.claude/rules/`; read the ones that apply before changing code.

- Build: `npm run build` (SCSS to `dist/`, esbuild bundle, docs CSS). `dist/` is committed because the CDN serves it.
- Test: `npm test` (build, axe, contrast, WCAG 2.2, keyboard in light and dark). It must pass before every commit.
- Demo and docs: `index.html` (with `docs/`). Screenshots: `npm run screenshots`.
