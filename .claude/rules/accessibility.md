# Accessibility is mandatory

Adhere strictly to ADA accessibility guidelines. The ADA itself names no technical standard for web content;
courts and the Department of Justice point to WCAG, so the working standard here is WCAG 2.2 AA (a superset of
the 2.1 AA that the 2024 DOJ rule for state and local government sites requires, and of Section 508's 2.0 AA).
Meet it at 100%, and never describe the library as "ADA compliant" or legally certified: say "tested against
WCAG 2.2 AA" and list what was and wasn't verified.

Target WCAG 2.2 AA, 100%. Never switch a rule off to get a green test; fix the cause.

- Keyboard operable, real accessible names, visible focus, sufficient contrast (gradients included), 24px targets.
- Respect `prefers-reduced-motion` and `forced-colors`. Anything draggable needs a non-dragging alternative.
- A tooltip is never a control's only name: keep `aria-label` in the markup.
- Disabled controls are held to 4.5:1 too, even though WCAG exempts them.
- Test it, don't assert it. Say plainly what automation can't verify: screen readers, touch devices, Firefox and Safari.
- Keep the Accessibility section of the README current: what is tested, how, and what is not verified (screen readers, real touch devices, other browsers).
- Content too: plain-language text, the page language set, descriptive link text, and form errors that say what to fix.
