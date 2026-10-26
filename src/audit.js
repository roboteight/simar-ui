// Accessibility safeguards. After the page is enhanced, check that every control a person has
// to operate can be named by a screen reader, and say so loudly when one can't.
//
// A problem is reported three ways: a console warning naming the element, a data-a11y-issue
// attribute on it, and (on localhost, file: pages, or with ?a11y in the URL) a dashed red
// outline. The outline is development-only; the warning and attribute always stay.

const seen = new WeakSet();

const hasName = (node) => {
  if (node.getAttribute('aria-label')?.trim()) return true;
  const by = node.getAttribute('aria-labelledby');
  if (by && by.split(/\s+/).some((id) => document.getElementById(id)?.textContent.trim())) return true;
  if (node.labels && [...node.labels].some((label) => label.textContent.trim())) return true;
  if (node.matches('button, summary') && node.textContent.trim()) return true;
  return Boolean(node.getAttribute('title')?.trim());
};

export const report = (node, problem) => {
  if (seen.has(node)) return;
  seen.add(node);
  node.setAttribute('data-a11y-issue', problem);
  console.warn(`[simar-ui] accessibility: ${problem}`, node);
};

const checks = [
  ['input[type="range"], input[type="date"], input[type="radio"], input[type="checkbox"], select, textarea',
    'has no accessible name. Add a label (a <label for>, a wrapping <label>, or aria-label), or give the tag a label attribute.'],
  ['button, summary',
    'has no accessible name. Icon-only buttons need an aria-label (or a label attribute on the tag).'],
  ['dialog',
    'has no accessible name. Add aria-labelledby pointing at its heading, or aria-label.'],
];

export const audit = (scope = document) => {
  const hidden = (node) => node.closest('[hidden], [aria-hidden="true"], template, script, .needs-js:not([data-js] *)');
  let problems = 0;

  for (const [selector, problem] of checks) {
    for (const node of scope.querySelectorAll(selector)) {
      if (hidden(node) || hasName(node)) continue;
      report(node, problem);
      problems++;
    }
  }

  // A scrolling code block can only be read by keyboard users if it can take focus.
  for (const pre of scope.querySelectorAll('.code pre')) {
    if (pre.hasAttribute('tabindex')) continue;
    report(pre, 'scrolls but cannot take keyboard focus. Add tabindex="0" to the <pre>.');
    problems++;
  }

  // Show the red outlines while developing; never on a live site unless asked.
  const local = location.protocol === 'file:' || ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname);
  if ((local || location.search.includes('a11y')) && !document.documentElement.dataset.a11y) {
    document.documentElement.dataset.a11y = 'show';
  }
  return problems;
};
