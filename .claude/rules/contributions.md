# Outside contributions

The repo is public. Any commit or pull request from outside must include tests to the same standard as the rest of the
project, or it is not merged.

- A change to `src/` or `scss/` must also change `tests/`; the `pr-checks` workflow enforces it and CONTRIBUTING.md
  explains it. Don't weaken the tests, delete a check or switch a rule off to make a contribution pass.
- Review a contribution against `CONTRIBUTING.md`: native first, ARIA pattern, keyboard, contrast, responsive, themed,
  naming, docs and a rebuilt `dist/`. Run `npm test` yourself before merging.
- Be kind to first-time contributors and say exactly what is missing.
