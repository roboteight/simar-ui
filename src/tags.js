// Declarative tags. Write <simar-knob label="Volume" max="11"> and it is replaced with the
// full native markup the stylesheet expects, so the page keeps working as plain HTML
// (inputs, labels, form submission) once expanded. Every option is an attribute.

const esc = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
const attr = (node, name, as = name) => (node.hasAttribute(name) ? ` ${as}="${esc(node.getAttribute(name))}"` : '');
const flag = (node, name) => (node.hasAttribute(name) ? ` ${name}` : '');
const icon = (name) => `<svg class="icon icon--lead" aria-hidden="true"><use href="#i-${esc(name)}"/></svg>`;

const escText = (text) => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Remove the indentation the code was written with, so it sits flush in the block.
const dedent = (text) => {
  const lines = text.replace(/^\s*\n/, '').replace(/\s+$/, '').split('\n');
  const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length), Infinity);
  return lines.map((line) => line.slice(Number.isFinite(indent) ? indent : 0)).join('\n');
};

let uid = 0;
const nextId = (prefix) => `simar-${prefix}-${++uid}`;

// What every tag passes through to its root element: class, style, data-*, and the short
// forms lit="blue" and haptic="off".
const rootAttrs = (node, base) => {
  const classes = [base, node.getAttribute('class')].filter(Boolean).join(' ');
  let out = classes ? ` class="${esc(classes)}"` : '';
  out += attr(node, 'style') + attr(node, 'lit', 'data-lit') + attr(node, 'haptic', 'data-haptic') + flag(node, 'hidden');
  for (const { name, value } of node.attributes) {
    if (name.startsWith('data-')) out += ` ${name}="${esc(value)}"`;
  }
  return out;
};

// The drawing inside each spinner variant (one SVG, so it is crisp at any size on any background).
const SPINNERS = {
  ticks: Array.from({ length: 12 }, (_, i) => `<line class="spinner__tick" x1="26" y1="2.6" x2="26" y2="14" transform="rotate(${i * 30} 26 26)"/>`).join(''),
  ring: '<circle class="spinner__track" cx="26" cy="26" r="21"/><circle class="spinner__arc" cx="26" cy="26" r="21" pathLength="100"/>',
  dots: [11, 26, 41].map((x) => `<circle class="spinner__dot" cx="${x}" cy="26" r="4.6"/>`).join(''),
  bars: [8, 17.5, 27, 36.5].map((x) => `<rect class="spinner__bar" x="${x}" y="8" width="6" height="36" rx="3"/>`).join(''),
};

// Native range attributes plus the library's data-* options.
const rangeAttrs = (node) =>
  ['min', 'max', 'step', 'value', 'name', 'list'].map((name) => attr(node, name)).join('') +
  flag(node, 'disabled') +
  attr(node, 'unit', 'data-unit') +
  attr(node, 'prefix', 'data-prefix');

const swap = (node, html) => {
  const template = document.createElement('template');
  template.innerHTML = html.trim();
  node.replaceWith(template.content);
};

const each = (scope, tag, build) => scope.querySelectorAll(tag).forEach((node) => swap(node, build(node)));

// A checkbox or a switch: the native input in a well, a key as its face, and the label beside it.
const checkLike = (node, isSwitch) => {
  const label = node.getAttribute('label') ?? '';
  const faces = isSwitch
    ? ''
    : '<svg class="icon icon--check" aria-hidden="true"><use href="#i-check"/></svg><svg class="icon icon--minus" aria-hidden="true"><use href="#i-minus"/></svg>';
  const attrs = ['name', 'value', 'form'].map((a) => attr(node, a)).join('')
    + flag(node, 'checked') + flag(node, 'disabled') + flag(node, 'required')
    + (node.hasAttribute('indeterminate') ? ' data-indeterminate' : '')
    + attr(node, 'tooltip', 'data-tooltip')
    + (isSwitch ? ' role="switch"' : '');
  return `<label${rootAttrs(node, 'check')}><span class="well${isSwitch ? ' switch' : ''}"><input type="checkbox"${attrs}><span class="key ${
    isSwitch ? 'key--round' : 'key--box'}">${faces}</span></span>${label ? `<span class="check__text">${esc(label)}</span>` : ''}</label>`;
};

// The label row, control, hint and flag shared by every form-control tag.
const NATIVE_INPUT_ATTRS = ['type', 'name', 'value', 'placeholder', 'min', 'max', 'step', 'minlength', 'maxlength', 'pattern',
  'autocomplete', 'inputmode', 'list', 'accept', 'size', 'rows', 'cols', 'form'];
const controlAttrs = (node) => NATIVE_INPUT_ATTRS.map((a) => attr(node, a)).join('')
  + ['required', 'disabled', 'readonly', 'multiple'].map((a) => flag(node, a)).join('')
  + attr(node, 'error', 'data-error') + attr(node, 'tooltip', 'data-tooltip');

const fieldShell = (node, kind, control) => {
  const id = node.getAttribute('id') ?? nextId(kind);
  const hint = node.getAttribute('hint');
  const hintId = hint ? `${id}-hint` : '';
  return `<div${rootAttrs(node, 'field')}><div class="field__head"><label class="field__label" for="${esc(id)}">${esc(
    node.getAttribute('label') ?? '')}</label>${node.hasAttribute('required') ? '<span class="field__flag">Required</span>' : ''}</div>${
    control(esc(id), hintId ? ` aria-describedby="${hintId}"` : '')}${hint ? `<p class="field__hint" id="${hintId}">${esc(hint)}</p>` : ''}</div>`;
};
const svgIcon = (name, cls = '') => `<svg class="icon${cls ? ` ${cls}` : ''}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

const builders = {
  // <simar-button icon="play" variant="accent|round|sq" label="Play">Text</simar-button>
  'simar-button': (node) => {
    const text = node.textContent.trim();
    const variant = node.getAttribute('variant');
    const classes = ['key', variant && `key--${variant}`].filter(Boolean).join(' ');
    const name = node.getAttribute('icon');
    const label = node.getAttribute('label') ?? (name && !text ? name : null);
    const extra = ['type', 'name', 'value', 'command', 'commandfor', 'popovertarget', 'form']
      .map((a) => attr(node, a))
      .join('') + attr(node, 'tooltip', 'data-tooltip');
    const type = node.hasAttribute('type') ? '' : ' type="button"';
    return `<span class="well"${rootAttrs(node, '').replace(' class=""', '')}><button class="${classes}"${type}${extra}${flag(node, 'disabled')}${
      label ? ` aria-label="${esc(label)}"` : ''}>${name ? icon(name) : ''}${esc(text)}</button></span>`;
  },

  // <simar-keys name="mode" legend="Mode" size="sq"><simar-key value="a" checked>Auto</simar-key></simar-keys>
  'simar-keys': (node) => {
    const name = node.getAttribute('name') ?? nextId('keys');
    const size = node.getAttribute('size');
    const keys = [...node.querySelectorAll('simar-key')].map((key) => {
      const text = key.textContent.trim();
      const iconName = key.getAttribute('icon');
      const label = key.getAttribute('label') ?? (iconName && !text ? iconName : null);
      return `<label class="well"><input type="radio" name="${esc(name)}"${attr(key, 'value')}${attr(key, 'tooltip', 'data-tooltip')}${flag(key, 'checked')}${flag(key, 'disabled')}${
        label ? ` aria-label="${esc(label)}"` : ''}><span class="key${size ? ` key--${esc(size)}` : ''}">${
        iconName ? icon(iconName).replace(' icon--lead', '') : ''}${esc(text)}</span></label>`;
    });
    const legend = node.getAttribute('legend');
    return legend
      ? `<fieldset${rootAttrs(node, 'panel')}><legend>${esc(legend)}</legend><div class="well-row">${keys.join('')}</div></fieldset>`
      : `<div${rootAttrs(node, 'well-row')} role="radiogroup"${attr(node, 'label', 'aria-label')}>${keys.join('')}</div>`;
  },

  // <simar-fader label="Brightness" min="0" max="100" value="40" unit="%" marks>
  'simar-fader': (node) => {
    const id = node.getAttribute('id') ?? nextId('fader');
    return `<div${rootAttrs(node, 'field')}><div class="field__head"><label class="field__label" for="${esc(id)}">${esc(
      node.getAttribute('label') ?? '')}</label></div><input class="fader" id="${esc(id)}" type="range"${rangeAttrs(node)}${
      attr(node, 'marks', 'data-marks')}></div>`;
  },

  // <simar-knob label="Tone" max="3" labels="Flat,Warm,Bright,Punch">
  'simar-knob': (node) => {
    const id = node.getAttribute('id') ?? nextId('knob');
    return `<div${rootAttrs(node, 'knob')} data-knob><input id="${esc(id)}" type="range"${rangeAttrs(node)}${
      attr(node, 'ticks', 'data-ticks')}${attr(node, 'labels', 'data-labels')}><label for="${esc(id)}">${esc(
      node.getAttribute('label') ?? '')}</label></div>`;
  },

  // <simar-range label="Price" min="0" max="500" low="120" high="340" prefix="$" name="price">
  'simar-range': (node) => {
    const labelId = nextId('label');
    const label = node.getAttribute('label') ?? '';
    const name = node.getAttribute('name');
    const bounds = ['min', 'max', 'step'].map((a) => attr(node, a)).join('') + flag(node, 'disabled');
    const input = (side) => `<input class="fader" type="range" aria-label="${esc(`${label} ${side}`.trim())}"${bounds}${
      attr(node, side, 'value')}${name ? ` name="${esc(name)}-${side}"` : ''}>`;
    return `<div${rootAttrs(node, 'field')}><div class="field__head"><span class="field__label" id="${labelId}">${esc(label)}</span></div>
      <div class="range2" role="group" aria-labelledby="${labelId}" data-range${attr(node, 'unit', 'data-unit')}${
      attr(node, 'prefix', 'data-prefix')}>${input('low')}${input('high')}</div></div>`;
  },

  // <simar-range-knob label="Band" low="25" high="70" unit="%">
  'simar-range-knob': (node) => {
    const labelId = nextId('label');
    const label = node.getAttribute('label') ?? '';
    const name = node.getAttribute('name');
    const bounds = ['min', 'max', 'step'].map((a) => attr(node, a)).join('') + flag(node, 'disabled');
    const input = (side) => `<input type="range" aria-label="${esc(`${label} ${side}`.trim())}"${bounds}${
      attr(node, side, 'value')}${name ? ` name="${esc(name)}-${side}"` : ''}>`;
    return `<div${rootAttrs(node, 'rknob')} data-range-knob role="group" aria-labelledby="${labelId}"${
      attr(node, 'unit', 'data-unit')}${attr(node, 'prefix', 'data-prefix')}>${input('low')}${input('high')
      }<span class="rknob__label" id="${labelId}">${esc(label)}</span></div>`;
  },

  // <simar-tabs label="Project"><simar-tab title="Overview">…</simar-tab><simar-tab title="Details" selected>…</simar-tab></simar-tabs>
  'simar-tabs': (node) => {
    const panels = [...node.querySelectorAll('simar-tab')].map((tab) => {
      const body = tab.innerHTML.trim();
      const content = tab.children.length ? body : `<p>${body}</p>`;
      return `<section class="tabs__panel"${tab.hasAttribute('selected') ? ' data-selected' : ''}><h4 class="tabs__title">${esc(tab.getAttribute('title') ?? '')}</h4>${content}</section>`;
    });
    return `<div${rootAttrs(node, 'tabs')} data-tabs${attr(node, 'label', 'data-label')}>${panels.join('')}</div>`;
  },

  // <simar-menu label="Actions"><simar-menu-item>Edit</simar-menu-item><simar-menu-item href="/x">Export</simar-menu-item>
  //   <simar-menu-item danger>Delete</simar-menu-item><simar-menu-separator></simar-menu-separator></simar-menu>
  'simar-menu': (node) => {
    const id = nextId('menu');
    const rows = [...node.children].map((child) => {
      if (child.localName === 'simar-menu-separator') return '<li role="separator"></li>';
      const cls = `menu__item${child.hasAttribute('danger') ? ' menu__item--danger' : ''}`;
      const dis = child.hasAttribute('disabled') ? ' aria-disabled="true"' : '';
      const inner = esc(child.textContent.trim());
      return child.getAttribute('href') ? `<li><a class="${cls}" href="${esc(child.getAttribute('href'))}"${dis}>${inner}</a></li>` : `<li><button type="button" class="${cls}"${dis}>${inner}</button></li>`;
    });
    return `<div${rootAttrs(node, 'menu')}><span class="well"><button type="button" class="key" id="${id}-button" popovertarget="${id}">${esc(node.getAttribute('label') ?? 'Menu')}<svg class="icon icon--lead icon--chevron-down" aria-hidden="true"><use href="#i-chevron-down"/></svg></button></span><ul class="menu__list" id="${id}" popover>${rows.join('')}</ul></div>`;
  },

  // <simar-accordion name="faq"><simar-item title="What is it?" open>Answer…</simar-item></simar-accordion>
  // Items open one at a time (sharing `name`) unless `multiple` is set.
  'simar-accordion': (node) => {
    const group = node.hasAttribute('multiple') ? null : node.getAttribute('name') ?? nextId('accordion');
    const items = [...node.querySelectorAll('simar-item')].map((item) => {
      const body = item.innerHTML.trim();
      // Plain text gets a paragraph; markup is used as written.
      const content = item.children.length ? body : `<p>${body}</p>`;
      return `<details class="accordion__item"${group ? ` name="${esc(group)}"` : ''}${flag(item, 'open')}><summary><span class="well"><span class="key"><svg class="icon icon--lead icon--chevron" aria-hidden="true"><use href="#i-chevron-right"/></svg>${esc(
        item.getAttribute('title') ?? '')}</span></span></summary><div class="accordion__body">${content}</div></details>`;
    });
    return `<div${rootAttrs(node, 'accordion')}>${items.join('')}</div>`;
  },

  // <simar-checkbox label="Send me the newsletter" name="news" checked>   (indeterminate for a mixed state)
  // <simar-switch label="Notifications" name="notify">
  'simar-checkbox': (node) => checkLike(node, false),
  'simar-switch': (node) => checkLike(node, true),

  // <simar-input label="Email" type="email" name="email" required hint="Used for receipts" error="Enter an email like name@chrissimari.com">
  // type="password" with reveal adds a show/hide button; type can be text, email, tel, url, search, number,
  // date, time, datetime-local, month or week.
  'simar-input': (node) => {
    const password = node.getAttribute('type') === 'password' && node.hasAttribute('reveal');
    return fieldShell(node, 'input', (id, describedby) => {
      const input = `<input class="input" id="${id}"${controlAttrs(node)}${describedby}>`;
      return password
        ? `<span class="input-reveal">${input}<button type="button" class="input-reveal__button" aria-label="Show password" aria-pressed="false" aria-controls="${id}" data-reveal>${
          svgIcon('eye')}</button></span>`
        : input;
    });
  },

  // <simar-textarea label="Message" name="message" rows="5" maxlength="500">Starting text</simar-textarea>
  'simar-textarea': (node) => fieldShell(node, 'textarea', (id, describedby) =>
    `<textarea class="input" id="${id}"${controlAttrs(node)}${describedby}>${escText(node.textContent.trim())}</textarea>`),

  // <simar-select label="Size" name="size"><simar-option value="s">Small</simar-option>...</simar-select>
  // multiple makes a list box; <simar-group label="Group"> makes an optgroup.
  'simar-select': (node) => {
    const options = (parent) => [...parent.children].map((child) => {
      if (child.tagName === 'SIMAR-GROUP') return `<optgroup label="${esc(child.getAttribute('label') ?? '')}">${options(child)}</optgroup>`;
      return `<option${attr(child, 'value')}${flag(child, 'selected')}${flag(child, 'disabled')}>${escText(child.textContent.trim())}</option>`;
    }).join('');
    const multiple = node.hasAttribute('multiple');
    return fieldShell(node, 'select', (id, describedby) => {
      const select = `<select class="input" id="${id}"${controlAttrs(node)}${describedby}>${options(node)}</select>`;
      return multiple ? select : `<span class="select">${select}${svgIcon('chevron-down', 'select__icon')}</span>`;
    });
  },

  // <simar-number label="Quantity" name="qty" min="1" max="10" value="2">  (keys on each side; the input still works alone)
  'simar-number': (node) => fieldShell(node, 'number', (id, describedby) => {
    const key = (step, label, icon) => `<span class="well"><button type="button" class="key key--sq" aria-label="${label}" aria-controls="${id}" data-step="${step}">${svgIcon(icon)}</button></span>`;
    return `<div class="stepper">${key(-1, 'Decrease', 'minus')}<input class="input" id="${id}" type="number"${controlAttrs(node).replace(/ type="[^"]*"/, '')}${describedby}>${key(1, 'Increase', 'plus')}</div>`;
  }),

  // <simar-color label="Accent" name="accent" value="#36d27a">
  'simar-color': (node) => fieldShell(node, 'color', (id, describedby) => {
    const value = node.getAttribute('value') ?? '#000000';
    return `<span class="color"><input id="${id}" type="color"${controlAttrs(node).replace(/ type="[^"]*"/, '')}${describedby}><output class="lcd" for="${id}">${esc(value)}</output></span>`;
  }),

  // <simar-file label="Attachment" name="file" accept="image/*" multiple>
  'simar-file': (node) => fieldShell(node, 'file', (id, describedby) => `<input class="input" id="${id}" type="file"${controlAttrs(node).replace(/ type="[^"]*"/, '')}${describedby}>`),

  // <simar-meter label="Disk used" value="72" min="0" max="100" low="30" high="80" optimum="100">
  'simar-meter': (node) => {
    const id = node.getAttribute('id') ?? nextId('meter');
    const attrs = ['value', 'min', 'max', 'low', 'high', 'optimum'].map((a) => attr(node, a)).join('');
    return `<div${rootAttrs(node, 'field')}><div class="field__head"><label class="field__label" for="${esc(id)}">${esc(node.getAttribute('label') ?? '')}</label></div><meter class="meter" id="${esc(id)}"${attrs}>${esc(node.getAttribute('value') ?? '')}</meter></div>`;
  },

  // <simar-loader label="Uploading" value="64" max="100">   (leave value off for an unknown length)
  'simar-loader': (node) => `<progress${rootAttrs(node, 'loader')} aria-label="${esc(node.getAttribute('label') ?? 'Loading')}"${
    attr(node, 'value')}${attr(node, 'max')}></progress>`,

  // <simar-spinner label="Loading results" variant="ring">   variant: ticks (default), ring, dots, bars
  'simar-spinner': (node) => {
    const variant = SPINNERS[node.getAttribute('variant')] ? node.getAttribute('variant') : 'ticks';
    const base = variant === 'ticks' ? 'spinner' : `spinner spinner--${variant}`;
    return `<span${rootAttrs(node, base)} role="status"><svg class="spinner__art" viewBox="0 0 52 52" aria-hidden="true" focusable="false">${
      SPINNERS[variant]}</svg><span class="spinner__label">${esc(node.getAttribute('label') ?? 'Loading')}</span></span>`;
  },

  // <simar-code lang="html" label="Example">…</simar-code>
  // Put the code in a <template> or <script type="text/plain"> child to write it unescaped;
  // plain text works too (escape < as &lt;). Add `nocopy` to leave the copy button off, `nolines` the line numbers.
  'simar-code': (node) => {
    const source = node.querySelector(':scope > template, :scope > script[type="text/plain"]');
    const raw = source
      ? (source.tagName === 'TEMPLATE' ? source.innerHTML : source.textContent)
      : (node.children.length ? node.innerHTML : node.textContent);
    const lang = node.getAttribute('lang');
    const label = node.getAttribute('label') ?? (lang ? lang.toUpperCase() : '');
    return `<figure${rootAttrs(node, 'code')}${flag(node, 'nocopy').replace(' nocopy', ' data-nocopy')}${flag(node, 'nolines').replace(' nolines', ' data-nolines')}>${
      label ? `<figcaption class="code__label">${esc(label)}</figcaption>` : ''}<div class="code__body"><pre tabindex="0"${
      lang ? ` data-lang="${esc(lang)}"` : ''}><code>${escText(dedent(raw))}</code></pre></div></figure>`;
  },

  // <simar-date-range from="2026-11-02" to="2026-11-09" min="2026-10-26" months="2" max-span="14" name="stay">
  'simar-date-range': (node) => {
    const name = node.getAttribute('name');
    const field = (side, label) => `<label class="daterange__field"><span class="field__label">${esc(
      node.getAttribute(`${side}-label`) ?? label)}</span><input type="date"${attr(node, 'min')}${attr(node, 'max')}${
      attr(node, side, 'value')}${name ? ` name="${esc(name)}-${side}"` : ''}${flag(node, 'required')}></label>`;
    return `<div${rootAttrs(node, 'daterange')} data-daterange${attr(node, 'months', 'data-months')}${
      attr(node, 'max-span', 'data-max-span')}${attr(node, 'first-day', 'data-first-day')}>${field('from', 'From')}${
      field('to', 'To')}</div>`;
  },
};

export const expandTags = (scope = document) => {
  for (const [tag, build] of Object.entries(builders)) each(scope, tag, build);
};
