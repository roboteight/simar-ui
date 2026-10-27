// Demo page only. Puts an "HTML" key under every component. Pressing it shows how that
// component was added to the page: its markup exactly as written, plus a tab for each
// <script type="text/plain" data-example="Label"> authored inside it (the <simar-*> tag
// form, JavaScript, theming). Loaded before the library so it captures the HTML before tags
// are expanded and controls are built. The blocks use the library's own code component.

const dedent = (text) => {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length));
  return lines.map((line) => line.slice(indent)).join('\n');
};

// outerHTML begins at the tag itself, so its first line has no indentation of its own: take
// the indentation to remove from the lines after it, and drop the blank lines left behind
// where example scripts were removed.
const dedentOuter = (html) => {
  const [first, ...rest] = html.split('\n').filter((line) => line.trim());
  const indent = Math.min(...rest.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length), Infinity);
  return [first, ...rest.map((line) => line.slice(Number.isFinite(indent) ? indent : 0))].join('\n');
};

const el = (tag, className, parent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.append(node);
  return node;
};

let blocks = 0;

// Build the HTML key and its tabbed panels for one component (a panel, or a whole section).
const addCode = (unit, { isSection }) => {
  const tabs = [];
  const examples = [...unit.querySelectorAll('script[data-example]')];

  if (!unit.hasAttribute('data-no-html')) {
    const copy = unit.cloneNode(true);
    copy.querySelectorAll('script[data-example], .snippet').forEach((node) => node.remove());
    if (isSection) copy.querySelectorAll('h2, h3, .note, .panel').forEach((node) => node.remove());
    const code = isSection
      ? dedent(copy.outerHTML.replace(/^<section[^>]*>|<\/section>$/g, ''))
      : dedentOuter(copy.outerHTML);
    if (code.trim()) tabs.push({ label: 'HTML', code });
  }
  for (const example of examples) tabs.push({ label: example.dataset.example, code: dedent(example.textContent) });
  if (!tabs.length) return;

  const id = blocks++;
  const details = el('details', 'snippet');
  const summary = el('summary', '', details);
  summary.dataset.tooltip = 'Show how this is written';
  summary.innerHTML = '<span class="well"><span class="key"><svg class="icon icon--lead" aria-hidden="true"><use href="#i-code"/></svg>HTML</span></span>';

  const bar = el('div', 'snippet__tabs well-row', details);
  bar.setAttribute('role', 'radiogroup');
  bar.setAttribute('aria-label', 'Example');
  const panels = tabs.map(({ label, code }, i) => {
    const well = el('label', 'well', bar);
    const radio = el('input', '', well);
    radio.type = 'radio';
    radio.name = `example-${id}`;
    radio.checked = i === 0;
    el('span', 'key', well).textContent = label;

    const panel = el('div', 'snippet__panel', details);
    panel.hidden = i !== 0;
    // The library's own code component; it adds the copy button when it enhances the page.
    const body = el('div', 'code__body', el('figure', 'code', panel));
    const pre = el('pre', '', body);
    pre.tabIndex = 0;
    el('code', '', pre).textContent = code;

    radio.addEventListener('change', () => panels.forEach((other, j) => { other.hidden = j !== i; }));
    return panel;
  });

  if (isSection) unit.append(details);
  else unit.after(details);
};

document.querySelectorAll('main > section:not([aria-labelledby="config"])').forEach((section) => {
  // Each panel of controls is a component; a section with no panels is one component itself.
  // (Some sit inside a <form>, so look at all of them, but not the ones inside a dialog or a side menu.)
  const panels = [...section.querySelectorAll('.panel')].filter((panel) => !panel.closest('dialog, .side-menu'));
  panels.forEach((panel) => addCode(panel, { isSection: false }));
  if (!panels.length) addCode(section, { isSection: true });
});
