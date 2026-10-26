# ARIA: strict, and only where needed

- First rule of ARIA: use the native element (`button`, `input`, `select`, `details`, `dialog`, `meter`) and add no ARIA that
  the element already provides. No ARIA is better than wrong ARIA.
- Where no native element exists (tabs, menu, listbox, combobox, tooltip), follow the matching pattern in the
  WAI-ARIA Authoring Practices Guide exactly: the roles, the required states and properties, the keyboard keys and the focus
  management. Note the pattern in the component's comments.
- Every role comes with its required parts: a `tab` is in a `tablist` and controls a `tabpanel`; a `menuitem` is in a
  `menu`; an `option` is in a `listbox`; `aria-expanded`, `aria-selected`, `aria-controls` and `aria-activedescendant`
  reflect the real state and point at elements that exist.
- Decorative things (icons, ornaments, generated marks) are hidden from assistive tech; don't hide anything focusable.
- Names: visible text first, then `aria-labelledby`, then `aria-label`. The name must contain the visible label.
- Live regions only for real status messages, and keep them in the page from the start.
- Run axe with every ARIA rule on, assert the accessibility tree for each component (roles, names, states), and test
  the keys the pattern requires. Say what a screen reader pass hasn't confirmed.
