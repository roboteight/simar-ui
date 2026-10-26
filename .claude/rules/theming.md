# All styling is a theme

The current look is the first theme. More will follow, so components describe structure and read colors, fonts and shadows from tokens.

- No hard-coded colors in components. Add or change tokens in `scss/themes/_default.scss`; a new theme is a copy of that file.
- Highlight presets, button color variants, whole-page palettes and font choices all live in the theme file.
- Keep the current look intact as a style; do not overwrite it when adding another.
- Every highlight and palette must pass the contrast test in light and dark.
