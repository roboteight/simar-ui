// simar-ui v1. Buttons, radio keys, accordions and dialogs are CSS-only; this script
// enhances faders, knobs, ranges and date ranges, and adds haptics. Every control is built
// on a native element, so the page still works if this never runs.
//
// It starts itself. Call SimarUI.init(element) after inserting new markup dynamically.

import sprite from './icons.svg';
import { expandTags } from './tags.js';
import { audit, report } from './audit.js';

const ARC = 270; // degrees of knob travel, centred on straight up
const START = -ARC / 2;

const el = (tag, className, parent) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (parent) parent.append(node);
  return node;
};

const num = (value, fallback) => (value === '' || Number.isNaN(+value) ? fallback : +value);

// Angle of the pointer around a dial's centre, in degrees clockwise from straight up.
const pointerAngle = (dial, e) => {
  const box = dial.getBoundingClientRect();
  const dx = e.clientX - (box.left + box.width / 2);
  const dy = e.clientY - (box.top + box.height / 2);
  return (Math.atan2(dx, -dy) * 180) / Math.PI;
};

const metrics = (input) => {
  const min = num(input.min, 0);
  const max = num(input.max, 100);
  const step = num(input.step, 1);
  return { min, max, step, span: max - min };
};

const readout = (input, labels) => {
  const { min, step } = metrics(input);
  const value = +input.value;
  const text = labels ? labels[Math.round((value - min) / step)] : value;
  return `${input.dataset.prefix || ''}${text}${labels ? '' : input.dataset.unit || ''}`;
};

// Snap a raw value to the input's step and bounds.
const snap = ({ min, max, step }, raw) => {
  const clamped = Math.min(max, Math.max(min, raw));
  return +(Math.round((clamped - min) / step) * step + min).toFixed(6);
};

// Change a value the way a user would, so listeners (readouts, haptics, forms) hear it.
const setValue = (input, value) => {
  if (String(value) === input.value) return;
  input.value = value;
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

// ---- Faders ----------------------------------------------------------------------------

// Faders need --frac for the lit track and an LCD readout. data-marks draws a tick at every
// step (or at N evenly spaced points) the cap can snap to.
const enhanceFaders = (claim) => {
  for (const input of claim('input.fader')) {
    if (input.closest('[data-range]')) continue;
    const head = input.closest('.field')?.querySelector('.field__head');
    const out = head && el('output', 'lcd', head);
    out?.setAttribute('aria-hidden', 'true'); // the input announces its own value
    const sync = () => {
      const { min, span } = metrics(input);
      input.style.setProperty('--frac', (input.value - min) / span);
      if (out) out.value = readout(input);
    };
    input.addEventListener('input', sync);
    sync();

    if ('marks' in input.dataset) {
      const { step, span } = metrics(input);
      const count = num(input.dataset.marks, Math.round(span / step) + 1);
      const marks = el('div', 'marks', input.closest('.field'));
      for (let i = 0; i < count; i++) el('i', '', marks).style.setProperty('--f', i / (count - 1));
    }
  }
};

// Dual-handle ranges: the handles may touch but never cross.
const enhanceRanges = (claim) => {
  for (const root of claim('[data-range]')) {
    const [lower, upper] = root.querySelectorAll('input[type="range"]');
    const head = root.closest('.field')?.querySelector('.field__head');
    const out = head && el('output', 'lcd', head);
    out?.setAttribute('aria-hidden', 'true'); // the inputs announce their own values
    const { prefix = '', unit = '' } = root.dataset;
    root.classList.add('is-enhanced');

    const sync = (changed) => {
      const { min, span } = metrics(lower);
      if (+lower.value > +upper.value) changed.value = (changed === lower ? upper : lower).value;
      const lo = (lower.value - min) / span;
      root.style.setProperty('--lo', lo);
      root.style.setProperty('--hi', (upper.value - min) / span);
      // Whichever handle has room to move stays on top when they meet.
      lower.style.zIndex = lo > 0.5 ? 2 : 1;
      upper.style.zIndex = lo > 0.5 ? 1 : 2;
      if (out) out.value = `${prefix}${lower.value}${unit} – ${prefix}${upper.value}${unit}`;
    };
    lower.addEventListener('input', () => sync(lower));
    upper.addEventListener('input', () => sync(upper));
    sync(lower);

    // WCAG 2.5.7: dragging is never the only way. A click on the groove moves the nearest handle.
    root.addEventListener('pointerdown', (e) => {
      if (e.target !== root) return; // the caps drag themselves
      const bounds = metrics(lower);
      const box = root.getBoundingClientRect();
      const cap = 30; // matches --thumb-w
      const frac = Math.min(1, Math.max(0, (e.clientX - box.left - cap / 2) / (box.width - cap)));
      const raw = bounds.min + frac * bounds.span;
      const [lo, hi] = [+lower.value, +upper.value];
      // When the handles are together, the click's side decides which one moves.
      const target = lo === hi ? (raw > lo ? upper : lower) : Math.abs(raw - lo) <= Math.abs(raw - hi) ? lower : upper;
      const held = target === lower ? Math.min(raw, hi) : Math.max(raw, lo);
      setValue(target, snap(bounds, held));
      target.focus({ preventScroll: true });
      target.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
};

// ---- Knobs -----------------------------------------------------------------------------

// Rotary ranges: two handles on a 270-degree arc. Dragging follows the pointer's angle
// around the dial; the gap at the bottom is a dead zone the handle can't cross.
const enhanceRangeKnobs = (claim) => {
  for (const root of claim('[data-range-knob]')) {
    const [lower, upper] = root.querySelectorAll('input[type="range"]');
    const label = root.querySelector('.rknob__label');
    const bounds = metrics(lower);
    const { min, span } = bounds;
    const { prefix = '', unit = '' } = root.dataset;
    const fmt = (value) => `${prefix}${value}${unit}`;
    root.classList.add('is-enhanced');

    const arc = 'M43.43 156.57A80 80 0 1 1 156.57 156.57';
    const dial = el('div', 'rknob__dial');
    dial.setAttribute('aria-hidden', 'true');
    dial.innerHTML = `<svg class="rknob__arc" viewBox="0 0 200 200">
      <path class="rknob__lip" d="${arc}"/><path class="rknob__groove" d="${arc}"/>
      <path class="rknob__floor" d="${arc}"/><path class="rknob__lit" pathLength="270" d="${arc}"/>
    </svg>`;
    const lit = dial.querySelector('.rknob__lit');
    const out = el('output', 'lcd', dial); // inside the dial, which is already aria-hidden
    [fmt(min), fmt(bounds.max)].forEach((text, i) => {
      const bound = el('span', 'rknob__bound', dial);
      bound.style.left = i ? '78.3%' : '21.7%';
      bound.textContent = text;
    });
    const handles = [lower, upper].map((input, i) => {
      const handle = el('div', `rknob__handle rknob__handle--${i ? 'hi' : 'lo'}`, dial);
      el('div', 'rknob__cap', handle);
      return handle;
    });
    label.before(dial);

    // WCAG 2.5.7: a click on the arc moves the nearest handle, no dragging needed.
    dial.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.rknob__handle')) return; // the handles drag themselves
      const angle = pointerAngle(dial, e);
      if (Math.abs(angle) > ARC / 2) return; // the gap at the bottom
      const raw = min + ((angle - START) / ARC) * span;
      const [lo, hi] = [+lower.value, +upper.value];
      const target = lo === hi ? (raw > lo ? upper : lower) : Math.abs(raw - lo) <= Math.abs(raw - hi) ? lower : upper;
      const held = target === lower ? Math.min(raw, hi) : Math.max(raw, lo);
      setValue(target, snap(bounds, held));
      target.focus({ preventScroll: true });
      target.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const render = () => {
      const lo = (lower.value - min) / span;
      const hi = (upper.value - min) / span;
      [lo, hi].forEach((frac, i) => handles[i].style.setProperty('--a', `${START + ARC * frac}deg`));
      lit.style.strokeDasharray = `${ARC * (hi - lo)} 1000`;
      lit.style.strokeDashoffset = -ARC * lo;
      // Whichever handle has room to move stays on top when they meet.
      handles[0].style.zIndex = lo > 0.5 ? 2 : 1;
      handles[1].style.zIndex = lo > 0.5 ? 1 : 2;
      out.value = `${fmt(lower.value)}–${fmt(upper.value)}`;
      lower.setAttribute('aria-valuetext', fmt(lower.value));
      upper.setAttribute('aria-valuetext', fmt(upper.value));
    };

    const moveTo = (input, raw) => {
      const held = input === lower ? Math.min(raw, +upper.value) : Math.max(raw, +lower.value);
      setValue(input, snap(bounds, held));
    };

    [lower, upper].forEach((input, i) => {
      const handle = handles[i];
      let angle = null;
      input.addEventListener('input', () => {
        // Keyboard changes can cross; hold the handles at the same value instead.
        if (+lower.value > +upper.value) (input === lower ? upper : lower).value = input.value;
        render();
      });
      handle.addEventListener('pointerdown', (e) => {
        handle.setPointerCapture(e.pointerId);
        handle.classList.add('is-active');
        input.focus({ preventScroll: true });
        angle = START + ARC * ((input.value - min) / span);
      });
      handle.addEventListener('pointermove', (e) => {
        if (angle === null) return;
        const pointer = pointerAngle(dial, e);
        // In the dead zone, stay on whichever end the handle was last on.
        angle = Math.abs(pointer) <= ARC / 2 ? pointer : Math.sign(angle) * (ARC / 2);
        moveTo(input, min + ((angle - START) / ARC) * span);
      });
      const end = () => {
        if (angle === null) return;
        angle = null;
        handle.classList.remove('is-active');
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    });

    render();
  }
};

// Knobs: drag up or right to turn up (Shift for fine), double-click to reset, wheel when
// focused. data-labels makes a stepped selector; data-ticks sets the tick count.
const enhanceKnobs = (claim) => {
  for (const root of claim('[data-knob]')) {
    const input = root.querySelector('input[type="range"]');
    const label = root.querySelector('label');
    const bounds = metrics(input);
    const { min, step, span } = bounds;
    const labels = input.dataset.labels?.split(',');
    const count = labels ? labels.length : num(input.dataset.ticks, 11);
    const stepped = Boolean(labels);

    root.classList.add('is-enhanced');
    root.classList.toggle('is-stepped', stepped);

    const dial = el('div', 'knob__dial');
    dial.setAttribute('aria-hidden', 'true');
    const ticks = [];
    const tickLabels = [];
    for (let i = 0; i < count; i++) {
      const angle = START + (ARC * i) / (count - 1);
      const tick = el('span', 'knob__tick', dial);
      tick.style.setProperty('--t', `${angle}deg`);
      ticks.push(tick);
      if (labels) {
        const text = el('span', 'knob__tick-label', dial);
        text.style.setProperty('--t', `${angle}deg`);
        text.textContent = labels[i];
        tickLabels.push(text);
      }
    }
    const well = el('div', 'knob__well', dial);
    const cap = el('div', 'knob__cap', well);
    el('div', 'knob__face', cap);
    el('div', 'knob__dish', cap);

    const out = el('output', 'lcd');
    out.setAttribute('aria-hidden', 'true'); // the input announces its own value (aria-valuetext)
    label.before(dial, out);

    const render = () => {
      const frac = (input.value - min) / span;
      dial.style.setProperty('--a', `${START + ARC * frac}deg`);
      const text = readout(input, labels);
      out.value = text;
      if (labels || input.dataset.unit || input.dataset.prefix) input.setAttribute('aria-valuetext', text);
      ticks.forEach((tick, i) => {
        const at = i / (count - 1);
        tick.classList.toggle('is-lit', stepped ? Math.abs(at - frac) < 1e-6 : at <= frac + 1e-6);
      });
      tickLabels.forEach((tickLabel, i) => {
        tickLabel.classList.toggle('is-active', Math.abs(i / (count - 1) - frac) < 1e-6);
      });
    };

    const set = (raw) => setValue(input, snap(bounds, raw));

    // Drag distance that covers the full range, in px.
    const travel = stepped ? 50 * (count - 1) : 220;
    let drag = null;

    dial.addEventListener('pointerdown', (e) => {
      // Clicking a label turns the knob straight to it.
      const picked = tickLabels.indexOf(e.target.closest('.knob__tick-label'));
      if (picked >= 0) {
        input.focus({ preventScroll: true });
        set(min + picked * step);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
      // WCAG 2.5.7: a click on the ring around the cap sets the value at that angle, no dragging.
      if (!e.target.closest('.knob__well')) {
        const angle = pointerAngle(dial, e);
        if (Math.abs(angle) <= ARC / 2) {
          input.focus({ preventScroll: true });
          set(min + ((angle - START) / ARC) * span);
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
        return;
      }
      dial.setPointerCapture(e.pointerId);
      input.focus({ preventScroll: true });
      drag = { x: e.clientX, y: e.clientY, from: +input.value };
    });
    dial.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const pixels = e.clientX - drag.x - (e.clientY - drag.y);
      set(drag.from + (pixels / (travel * (e.shiftKey ? 4 : 1))) * span);
    });
    const end = () => {
      if (!drag) return;
      drag = null;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    dial.addEventListener('pointerup', end);
    dial.addEventListener('pointercancel', end);
    dial.addEventListener('dblclick', () => set(num(input.defaultValue, min)));
    dial.addEventListener('wheel', (e) => {
      if (document.activeElement !== input) return;
      e.preventDefault();
      set(+input.value + (e.deltaY < 0 ? step : -step));
    }, { passive: false });

    input.addEventListener('input', render);
    render();
  }
};

// ---- Dialogs ---------------------------------------------------------------------------

// <button command="show-modal" commandfor="id"> opens a dialog natively where supported;
// data-dialog-open covers browsers without invoker commands. <output for="id"> shows how
// the dialog was closed.
const enhanceDialogs = (claim) => {
  if (!('command' in HTMLButtonElement.prototype)) {
    for (const trigger of claim('[data-dialog-open]')) {
      trigger.addEventListener('click', () => document.getElementById(trigger.dataset.dialogOpen).showModal());
    }
  }

  for (const dialog of claim('dialog')) {
    const out = dialog.id && document.querySelector(`output[for="${dialog.id}"]`);
    // The dialog box has no padding, so a click that lands on it directly hit the backdrop.
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) dialog.close('dismissed');
    });
    dialog.addEventListener('cancel', () => { dialog.returnValue = 'dismissed'; });
    dialog.addEventListener('close', () => {
      if (!out) return;
      // Esc straight after opening closes it without a cancel event (browsers only send one once you have
      // interacted with the dialog), so no button ever set a value: that is a dismissal too.
      const how = dialog.returnValue || 'dismissed';
      const form = dialog.querySelector('form');
      const values = form && !['', 'cancel', 'dismissed'].includes(how) ? [...new FormData(form).values()] : [];
      out.value = values.length ? `${how}: ${values.join(', ')}` : how;
    });
  }
};

// ---- Embeds ----------------------------------------------------------------------------

// A frame (an iframe, embed or object) takes keyboard focus as a tab stop, but once focus is inside the frame's
// own page nothing in this page's CSS can tell (:focus, :focus-within and :focus-visible are all false on it), so
// the frame would show no focus ring. Mark the embed while its frame is the active element, and the CSS draws it.
const enhanceEmbeds = (claim) => {
  for (const embed of claim('.embed')) {
    const frame = embed.querySelector(':scope > iframe, :scope > embed, :scope > object');
    if (!frame) continue;
    const sync = () => embed.classList.toggle('is-focused', document.activeElement === frame);
    addEventListener('blur', () => setTimeout(sync));
    addEventListener('focus', sync);
    document.addEventListener('focusin', sync);
    frame.addEventListener('focus', sync);
    frame.addEventListener('blur', sync);
  }
};

// ---- Side menu -------------------------------------------------------------------------

// A tab on the screen edge that opens a panel beside it (a disclosure, not a modal). The tab carries
// aria-expanded and aria-controls; Esc closes the panel and returns focus to the tab, and so does moving focus
// out of it. data-close-on-select closes it when a link inside is chosen. side-menu--docked keeps the panel open
// as a column from 75rem up. A page can also open or close one with the "side-menu:open" and "side-menu:close"
// events on the element. Without the script the panel is just content in the page.
const enhanceSideMenus = (claim) => {
  for (const menu of claim('[data-side-menu]')) {
    const toggle = menu.querySelector('.side-menu__toggle');
    const panel = menu.querySelector('.side-menu__panel');
    if (!toggle || !panel) continue;
    const docked = menu.classList.contains('side-menu--docked') ? matchMedia('(min-width: 75rem)') : null;
    const isDocked = () => Boolean(docked?.matches);
    const set = (open) => {
      panel.hidden = !open && !isDocked();
      toggle.setAttribute('aria-expanded', String(!panel.hidden && !isDocked()));
    };
    menu.classList.add('is-enhanced');
    set(false);
    docked?.addEventListener('change', () => set(false));
    toggle.addEventListener('click', () => set(panel.hidden));
    menu.addEventListener('side-menu:open', () => set(true));
    menu.addEventListener('side-menu:close', () => set(false));
    menu.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || panel.hidden || isDocked()) return;
      set(false);
      toggle.focus();
    });
    if (menu.hasAttribute('data-close-on-select')) {
      panel.addEventListener('click', (e) => { if (e.target.closest('a') && !isDocked()) set(false); });
    }
    // Pressing a label inside moves focus to nowhere for a moment before the click lands: not leaving.
    let pressing = false;
    menu.addEventListener('pointerdown', () => { pressing = true; });
    addEventListener('pointerup', () => setTimeout(() => { pressing = false; }));
    menu.addEventListener('focusout', (e) => {
      if (pressing || isDocked() || panel.hidden || menu.contains(e.relatedTarget)) return;
      set(false);
    });
  }
};

// ---- Date ranges -----------------------------------------------------------------------

// Two native date inputs stay the source of truth; the calendar is a popover.
// Dates are handled as local-time Date objects and ISO strings (YYYY-MM-DD).
const pad = (n) => String(n).padStart(2, '0');
const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parseISO = (text) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
  const [y, m, d] = text.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const monthStart = (d, offset = 0) => new Date(d.getFullYear(), d.getMonth() + offset, 1);
const daysBetween = (a, b) => Math.round((b - a) / 864e5);
const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;

let dateRanges = 0;

const enhanceDateRanges = (claim) => {
  for (const root of claim('[data-daterange]')) {
    const index = dateRanges++;
    const [startInput, endInput] = root.querySelectorAll('input[type="date"]');
    const months = num(root.dataset.months, 1);
    const firstDay = num(root.dataset.firstDay, 0);
    const maxSpan = num(root.dataset.maxSpan, Infinity);
    const minDate = parseISO(startInput.min);
    const maxDate = parseISO(endInput.max) ?? parseISO(startInput.max);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lang = document.documentElement.lang || undefined;
    const monthName = new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' });
    const shortDate = new Intl.DateTimeFormat(lang, { month: 'short', day: 'numeric' });
    const weekday = new Intl.DateTimeFormat(lang, { weekday: 'short' });
    const fullDate = new Intl.DateTimeFormat(lang, { dateStyle: 'full' });

    let start = parseISO(startInput.value);
    let end = parseISO(endInput.value);
    let pending = Boolean(start && !end);
    let view = monthStart(start ?? (minDate && minDate > today ? minDate : today));

    root.classList.add('is-enhanced');
    const tools = el('div', 'daterange__tools', root);
    const toggleWell = el('span', 'well', tools);
    const toggle = el('button', 'key key--sq', toggleWell);
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Choose dates');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.dataset.tooltip = 'Choose dates';
    toggle.innerHTML = icon('calendar');
    const summary = el('output', 'lcd', tools);

    const pop = el('div', 'daterange__pop cal', root);
    pop.id = `daterange-${index}`;
    pop.setAttribute('popover', '');
    pop.setAttribute('role', 'dialog');
    pop.setAttribute('aria-label', 'Choose dates');
    toggle.setAttribute('popovertarget', pop.id);
    const body = el('div', 'cal__months', pop);
    const foot = el('div', 'cal__foot', pop);
    foot.innerHTML = `<span class="well"><button type="button" class="key" data-clear>Clear</button></span>
      <span class="well"><button type="button" class="key key--accent" data-done>Done</button></span>`;

    const inBounds = (d) => (!minDate || d >= minDate) && (!maxDate || d <= maxDate);
    // While choosing an end date, days past the maximum span are unavailable.
    const allowed = (d) => inBounds(d) && (!pending || d < start || daysBetween(start, d) < maxSpan);

    const describe = () => {
      if (!start) return 'no dates';
      if (!end) return `${shortDate.format(start)} – …`;
      const days = daysBetween(start, end) + 1;
      return `${shortDate.format(start)} – ${shortDate.format(end)} · ${days} ${days === 1 ? 'day' : 'days'}`;
    };

    const writeInputs = () => {
      startInput.value = start ? iso(start) : '';
      endInput.value = end ? iso(end) : '';
      endInput.min = start ? iso(start) : startInput.min;
      summary.value = describe();
      for (const input of [startInput, endInput]) input.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const dayButton = (d) => {
      const isStart = start && +d === +start;
      const isEnd = end && +d === +end;
      const inRange = start && end && d > start && d < end;
      // The ends of a multi-day range sit flush against the band between them.
      const multiDay = start && end && +start !== +end;
      const classes = ['day', isStart && 'is-start', isEnd && 'is-end', inRange && 'is-range',
        isStart && multiDay && 'is-range-start', isEnd && multiDay && 'is-range-end', +d === +today && 'is-today']
        .filter(Boolean)
        .join(' ');
      return `<button type="button" class="${classes}" data-date="${iso(d)}" tabindex="-1"
        aria-pressed="${Boolean(isStart || isEnd)}" aria-label="${fullDate.format(d)}"${allowed(d) ? '' : ' disabled'}>${d.getDate()}</button>`;
    };

    const nav = (dir) => `<span class="well"><button type="button" class="key key--sq" data-nav="${dir}"
      aria-label="${dir < 0 ? 'Previous' : 'Next'} month">${icon(dir < 0 ? 'chevron-left' : 'chevron-right')}</button></span>`;

    const cell = (key) => body.querySelector(`[data-date="${key}"]:not(:disabled)`);

    let navTips = [];
    const render = (focusKey) => {
      const parts = [];
      for (let m = 0; m < months; m++) {
        const first = monthStart(view, m);
        const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
        let cells = '';
        for (let i = 0; i < 7; i++) {
          cells += `<span class="cal__dow" aria-hidden="true">${weekday.format(new Date(2023, 0, 1 + ((firstDay + i) % 7)))}</span>`;
        }
        cells += '<span></span>'.repeat((first.getDay() - firstDay + 7) % 7);
        for (let n = 1; n <= length; n++) cells += dayButton(new Date(first.getFullYear(), first.getMonth(), n));
        const title = monthName.format(first);
        parts.push(`<div class="cal__month"><div class="cal__head">${m === 0 ? nav(-1) : '<span></span>'}
          <span class="cal__title">${title}</span>${m === months - 1 ? nav(1) : '<span></span>'}</div>
          <div class="cal__grid" role="group" aria-label="${title}">${cells}</div></div>`);
      }
      body.innerHTML = parts.join('');
      for (const old of navTips) {
        if (showing === old) showing = null;
        old.remove();
      }
      navTips = enhanceTooltips(body);
      // One day is tabbable; the arrow keys move between days.
      const target = cell(focusKey) ?? cell(start && iso(start)) ?? cell(iso(today)) ?? body.querySelector('.day:not(:disabled)');
      if (target) {
        target.tabIndex = 0;
        if (focusKey) target.focus({ preventScroll: true });
      }
    };

    const choose = (d) => {
      if (!pending) {
        start = d;
        end = null;
        pending = true;
      } else if (d < start) {
        start = d;
      } else {
        end = d;
        pending = false;
      }
      writeInputs();
      render(iso(d));
    };

    const readInputs = () => {
      start = parseISO(startInput.value);
      end = parseISO(endInput.value);
      if (start && end && end < start) end = start;
      if (start && end && daysBetween(start, end) >= maxSpan) end = addDays(start, maxSpan - 1);
      pending = Boolean(start && !end);
      // Show the corrected value if typing produced an end before the start or past the span.
      if (end && endInput.value !== iso(end)) endInput.value = iso(end);
      endInput.min = start ? iso(start) : startInput.min;
      if (start) view = monthStart(start);
      summary.value = describe();
      render();
    };
    startInput.addEventListener('input', readInputs);
    endInput.addEventListener('input', readInputs);

    pop.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (!button) return;
      if (button.dataset.nav) {
        view = monthStart(view, +button.dataset.nav);
        render();
        pop.querySelector(`[data-nav="${button.dataset.nav}"]`)?.focus();
      } else if (button.classList.contains('day')) {
        choose(parseISO(button.dataset.date));
      } else if ('clear' in button.dataset) {
        start = end = null;
        pending = false;
        writeInputs();
        render();
      } else if ('done' in button.dataset) {
        pop.hidePopover();
      }
    });

    const clearPreview = () => body.querySelectorAll('.is-preview').forEach((node) => node.classList.remove('is-preview'));
    body.addEventListener('pointerover', (e) => {
      clearPreview();
      const button = e.target.closest('.day');
      if (!pending || !button) return;
      const hover = parseISO(button.dataset.date);
      for (const day of body.querySelectorAll('.day')) {
        const d = parseISO(day.dataset.date);
        if (d > start && d <= hover) day.classList.add('is-preview');
      }
    });
    body.addEventListener('pointerleave', clearPreview);

    body.addEventListener('keydown', (e) => {
      const button = e.target.closest('.day');
      if (!button) return;
      const d = parseISO(button.dataset.date);
      const offset = (d.getDay() - firstDay + 7) % 7;
      const moves = {
        ArrowLeft: addDays(d, -1),
        ArrowRight: addDays(d, 1),
        ArrowUp: addDays(d, -7),
        ArrowDown: addDays(d, 7),
        PageUp: new Date(d.getFullYear(), d.getMonth() - 1, d.getDate()),
        PageDown: new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()),
        Home: addDays(d, -offset),
        End: addDays(d, 6 - offset),
      };
      const next = moves[e.key];
      if (!next) return;
      e.preventDefault();
      if (!allowed(next)) return;
      if (next < view) view = monthStart(next);
      else if (next >= monthStart(view, months)) view = monthStart(next, 1 - months);
      render(iso(next));
    });

    // The popover is fixed to the viewport, so keep it beneath its component as the page moves.
    const place = () => {
      if (!pop.matches(':popover-open')) return;
      const anchor = root.getBoundingClientRect();
      const size = pop.getBoundingClientRect();
      pop.style.top = `${Math.max(8, Math.min(anchor.bottom + 8, innerHeight - size.height - 8))}px`;
      pop.style.left = `${Math.max(8, Math.min(anchor.left, innerWidth - size.width - 8))}px`;
    };
    pop.addEventListener('toggle', (e) => {
      toggle.setAttribute('aria-expanded', String(e.newState === 'open'));
      if (e.newState !== 'open') return;
      view = monthStart(start ?? (minDate && minDate > today ? minDate : today));
      render(start ? iso(start) : iso(today));
      place();
    });
    addEventListener('scroll', place, { passive: true });
    addEventListener('resize', place);

    summary.value = describe();
    render();
  }
};

// ---- Code ------------------------------------------------------------------------------

// The Clipboard API needs a secure context and permission; fall back to a hidden textarea and
// the older copy command where it refuses.
const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch { /* fall through */ }
  const area = el('textarea', '', document.body);
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.cssText = 'position:fixed;top:0;left:0;opacity:0';
  area.select();
  try {
    return document.execCommand('copy');
  } finally {
    area.remove();
  }
};

// .code blocks get an icon-only copy button (leave it off with data-nocopy).
const enhanceCode = (claim) => {
  for (const block of claim('.code')) {
    const body = block.querySelector('.code__body');
    const pre = block.querySelector('pre');
    if (!body || !pre) continue;

    // Line numbers: one span per line, with the newlines kept between them so the text is unchanged.
    const code = pre.querySelector('code');
    if (code && !block.hasAttribute('data-nolines') && !code.querySelector('.code__line')) {
      const lines = code.textContent.split('\n');
      if (lines.length > 1) {
        code.replaceChildren(...lines.flatMap((text, i) => {
          const line = el('span', 'code__line');
          line.textContent = text;
          return i < lines.length - 1 ? [line, document.createTextNode('\n')] : [line];
        }));
        pre.style.setProperty('--code-gutter', `${String(lines.length).length}ch`);
      }
    }

    if (block.hasAttribute('data-nocopy')) continue;

    const button = el('button', 'code__copy', body);
    button.type = 'button';
    button.setAttribute('aria-label', 'Copy code');
    button.dataset.tooltip = 'Copy code';
    const status = el('span', 'code__status', body);
    status.setAttribute('role', 'status');

    const show = (name) => { button.innerHTML = icon(name); };
    show('copy');
    button.addEventListener('click', async () => {
      const ok = await copyText(pre.textContent);
      status.textContent = ok ? 'Copied' : 'Press Command or Control C to copy';
      if (!ok) return;
      show('check');
      setTimeout(() => { show('copy'); status.textContent = ''; }, 1500);
    });
  }
};

// ---- Form controls ----------------------------------------------------------------------

// Number stepper: the keys call the input's own stepUp/stepDown, so min, max and step apply. A
// screen reader can't see the number change when a key is pressed, so the new value is announced.
//
// The field is a native number input, which is a spinbutton, but browsers differ on whether the arrow
// keys step it, so the script does it too, following the ARIA spinbutton pattern: Up and Down step by
// one, Page Up and Page Down by ten (min and max are kept). Home and End are left to the caret, as the
// pattern makes them optional and this is a field you can type in.
const keyedSteppers = new WeakSet();
const stepFromKeyboard = (input) => {
  if (keyedSteppers.has(input)) return;
  keyedSteppers.add(input);
  const by = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
  input.addEventListener('keydown', (e) => {
    if (!(e.key in by) || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || input.readOnly || input.disabled) return;
    e.preventDefault(); // so a browser that steps by itself doesn't step twice
    const n = by[e.key];
    const before = input.value;
    try { if (n > 0) input.stepUp(n); else input.stepDown(-n); } catch { /* no valid step from here */ }
    if (input.value !== before) {
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
};

const enhanceSteppers = (claim) => {
  for (const key of claim('[data-step]')) {
    const input = document.getElementById(key.getAttribute('aria-controls'));
    if (!input) continue;
    stepFromKeyboard(input);
    const stepper = key.closest('.stepper');
    stepper.classList.add('is-enhanced');
    let status = stepper.querySelector('.stepper__status');
    if (!status) {
      status = el('span', 'stepper__status', stepper);
      status.setAttribute('role', 'status');
      status.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)';
    }
    key.addEventListener('click', () => {
      const by = +key.dataset.step;
      try { if (by > 0) input.stepUp(by); else input.stepDown(-by); } catch { /* no valid step from here */ }
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      status.textContent = `${input.labels?.[0]?.textContent.trim() ?? 'Value'}: ${input.value}`;
    });
  }
};

// Password reveal: toggles the field between password and text. aria-pressed and the label say which.
const enhanceReveal = (claim) => {
  for (const button of claim('[data-reveal]')) {
    const input = document.getElementById(button.getAttribute('aria-controls'));
    if (!input) continue;
    button.closest('.input-reveal')?.classList.add('is-enhanced');
    button.addEventListener('click', () => {
      const show = input.type === 'password';
      input.type = show ? 'text' : 'password';
      button.setAttribute('aria-pressed', String(show));
      button.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
      button.innerHTML = icon(show ? 'eye-off' : 'eye');
    });
  }
};

// Tabs: builds the tab row from the panel headings and shows one panel at a time. The tabs follow
// the ARIA tabs pattern: one tab stop for the row, arrows/Home/End move and select, and the panel
// takes the next tab stop so keyboard users can scroll it.
let tabsMade = 0;
const enhanceTabs = (claim) => {
  for (const root of claim('[data-tabs]')) {
    const panels = [...root.querySelectorAll(':scope > .tabs__panel')];
    if (!panels.length) continue;
    const id = `simar-tabs-${++tabsMade}`;
    const list = el('div', 'tabs__list');
    list.setAttribute('role', 'tablist');
    if (root.dataset.label) list.setAttribute('aria-label', root.dataset.label);
    const tabs = panels.map((panel, i) => {
      const title = panel.querySelector('.tabs__title');
      const tab = el('button', 'key', list);
      tab.type = 'button';
      tab.id = `${id}-tab-${i}`;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', `${id}-panel-${i}`);
      tab.textContent = title?.textContent ?? `Tab ${i + 1}`;
      panel.id = `${id}-panel-${i}`;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      return tab;
    });
    const select = (index, focus = false) => {
      tabs.forEach((tab, i) => {
        tab.setAttribute('aria-selected', String(i === index));
        tab.tabIndex = i === index ? 0 : -1;
        panels[i].hidden = i !== index;
      });
      if (focus) tabs[index].focus();
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', (e) => {
        const last = tabs.length - 1;
        const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
        if (next === undefined) return;
        e.preventDefault();
        select(next, true);
      });
    });
    root.prepend(list);
    root.classList.add('is-enhanced');
    select(Math.max(0, panels.findIndex((p) => p.hasAttribute('data-selected'))));
  }
};

// Menu: the popover attribute already opens and closes the list. This adds the menu roles, moves
// focus into the list when it opens, and handles arrows, Home, End, letters, Esc and Tab (the
// ARIA menu button pattern). A disabled item stays in the arrow order but does nothing.
const enhanceMenus = (claim) => {
  for (const root of claim('.menu')) {
    const button = root.querySelector('[popovertarget]');
    const list = button && document.getElementById(button.getAttribute('popovertarget'));
    if (!list) continue;
    const items = () => [...list.querySelectorAll('.menu__item')];
    list.setAttribute('role', 'menu');
    if (!list.getAttribute('aria-label') && !list.getAttribute('aria-labelledby')) list.setAttribute('aria-labelledby', button.id ||= `${list.id}-button`);
    for (const li of list.querySelectorAll('li')) li.setAttribute('role', li.querySelector('.menu__item') ? 'none' : 'separator');
    for (const item of items()) {
      item.setAttribute('role', 'menuitem');
      item.tabIndex = -1;
      if (item.matches('[aria-disabled="true"]')) item.addEventListener('click', (e) => e.preventDefault());
    }
    button.setAttribute('aria-haspopup', 'menu');
    button.setAttribute('aria-expanded', 'false');

    const place = () => {
      const box = button.getBoundingClientRect();
      list.style.left = `${Math.max(8, Math.min(box.left, innerWidth - list.offsetWidth - 8))}px`;
      const below = innerHeight - box.bottom;
      list.style.top = `${below >= list.offsetHeight + 8 || box.top < list.offsetHeight ? box.bottom + 4 : box.top - list.offsetHeight - 4}px`;
    };
    let focusEnd = false;
    list.addEventListener('toggle', (e) => {
      const open = e.newState === 'open';
      button.setAttribute('aria-expanded', String(open));
      // aria-controls only while the list is showing: a pointer to a hidden element is invalid.
      if (open) button.setAttribute('aria-controls', list.id);
      else button.removeAttribute('aria-controls');
      if (!open) return;
      place();
      const all = items();
      (focusEnd ? all.at(-1) : all[0])?.focus();
      focusEnd = false;
    });
    button.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      focusEnd = e.key === 'ArrowUp';
      list.showPopover();
    });
    list.addEventListener('click', (e) => {
      const item = e.target.closest('.menu__item');
      if (item && item.getAttribute('aria-disabled') !== 'true') list.hidePopover();
    });
    list.addEventListener('keydown', (e) => {
      const all = items();
      const at = all.indexOf(document.activeElement);
      if (e.key === 'Tab') { list.hidePopover(); return; }
      const next = { ArrowDown: (at + 1) % all.length, ArrowUp: (at - 1 + all.length) % all.length, Home: 0, End: all.length - 1 }[e.key];
      if (next !== undefined) { e.preventDefault(); all[next].focus(); return; }
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const letter = e.key.toLowerCase();
        const found = [...all.slice(at + 1), ...all.slice(0, at + 1)].find((n) => n.textContent.trim().toLowerCase().startsWith(letter));
        if (found) { e.preventDefault(); found.focus(); }
      }
    });
  }
};

// Autocomplete: an <input data-autocomplete list="id"> keeps its datalist as the no-script fallback.
// The script reads the options, takes the list attribute off (so the browser's own popup doesn't
// compete) and shows a themed listbox that filters as you type. This is the ARIA editable combobox
// with list autocomplete: focus stays in the input, aria-activedescendant names the current option,
// Down/Up move, Enter picks, Esc closes, and a live region says how many suggestions there are.
let suggestions = 0;
const enhanceAutocomplete = (claim) => {
  for (const input of claim('input[data-autocomplete][list]')) {
    const datalist = document.getElementById(input.getAttribute('list'));
    if (!datalist) continue;
    const id = `simar-suggest-${++suggestions}`;
    const all = [...datalist.options].map((o) => ({ value: o.value, label: o.label && o.label !== o.value ? o.label : '', keywords: o.dataset.keywords ?? '' }));
    const label = input.id ? document.querySelector(`label[for="${input.id}"]`) : null;

    const list = el('ul', 'picker__list suggest', input.closest('main, dialog, [role="dialog"], [popover]') ?? document.body); // inside a landmark
    list.id = `${id}-list`;
    list.setAttribute('role', 'listbox');
    list.setAttribute('popover', 'manual');
    if (label) { label.id ||= `${id}-label`; list.setAttribute('aria-labelledby', label.id); }
    else if (input.getAttribute('aria-label')) list.setAttribute('aria-label', input.getAttribute('aria-label'));
    const status = el('span', 'suggest__status', input.parentNode);
    status.setAttribute('role', 'status');

    input.removeAttribute('list');
    input.setAttribute('role', 'combobox');
    input.setAttribute('aria-autocomplete', 'list');
    input.setAttribute('aria-expanded', 'false');
    input.setAttribute('aria-controls', list.id);
    input.autocomplete = 'off';

    let shown = [];
    let active = -1;
    const isOpen = () => list.matches(':popover-open');
    const close = () => {
      if (isOpen()) list.hidePopover();
      input.setAttribute('aria-expanded', 'false');
      input.removeAttribute('aria-activedescendant');
      active = -1;
    };
    const highlight = (i) => {
      active = i;
      [...list.children].forEach((item, n) => item.classList.toggle('is-active', n === i));
      if (i < 0) { input.removeAttribute('aria-activedescendant'); return; }
      input.setAttribute('aria-activedescendant', list.children[i].id);
      list.children[i].scrollIntoView({ block: 'nearest' });
    };
    const choose = (i) => {
      input.value = shown[i].value;
      close();
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const render = () => {
      const query = input.value.trim().toLowerCase();
      shown = all.filter((o) => !query || `${o.value} ${o.label} ${o.keywords}`.toLowerCase().includes(query))
        .sort((a, b) => Number(b.value.toLowerCase().startsWith(query)) - Number(a.value.toLowerCase().startsWith(query)))
        .slice(0, 8);
      list.replaceChildren();
      shown.forEach((o, i) => {
        const item = el('li', 'picker__option', list);
        item.id = `${id}-option-${i}`;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', 'false');
        const text = el('span', 'picker__text', item);
        const at = query ? o.value.toLowerCase().indexOf(query) : -1;
        if (at >= 0) {
          text.append(o.value.slice(0, at));
          el('mark', '', text).textContent = o.value.slice(at, at + query.length);
          text.append(o.value.slice(at + query.length));
        } else text.textContent = o.value;
        if (o.label) el('span', 'suggest__hint', item).textContent = o.label;
        item.addEventListener('pointerdown', (e) => e.preventDefault()); // keep focus in the input
        item.addEventListener('click', () => choose(i));
        item.addEventListener('pointermove', () => highlight(i));
      });
      if (shown.length && !(shown.length === 1 && shown[0].value.toLowerCase() === query)) {
        const box = input.getBoundingClientRect();
        list.style.minWidth = `${box.width}px`;
        list.style.left = `${box.left}px`;
        if (!isOpen()) list.showPopover();
        const below = innerHeight - box.bottom;
        list.style.top = `${below >= list.offsetHeight + 8 || box.top < list.offsetHeight ? box.bottom + 4 : box.top - list.offsetHeight - 4}px`;
        input.setAttribute('aria-expanded', 'true');
        status.textContent = `${shown.length} suggestion${shown.length === 1 ? '' : 's'} available. Use the up and down arrows to review.`;
      } else {
        close();
        status.textContent = query && !shown.length ? 'No suggestions.' : '';
      }
      active = -1;
      input.removeAttribute('aria-activedescendant');
    };

    input.addEventListener('input', render);
    input.addEventListener('focus', () => { if (input.value) render(); });
    input.addEventListener('blur', () => { close(); status.textContent = ''; });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        if (!isOpen()) render();
        if (!isOpen()) return;
        e.preventDefault();
        const n = shown.length;
        highlight(e.key === 'ArrowDown' ? (active + 1) % n : (active - 1 + n) % n);
      } else if (e.key === 'Enter' && isOpen() && (active >= 0 || input.dataset.autocomplete === 'first')) {
        e.preventDefault();
        choose(Math.max(active, 0)); // data-autocomplete="first": Enter with nothing highlighted takes the top result
      } else if (e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        close();
      }
    });
    addEventListener('resize', close);
  }
};

// Alerts and toasts. A dismissible alert (data-dismissible) gets a close button. A toast is an alert
// shown in a live region: SimarUI.toast("Saved", { variant: "success" }), or put data-toast="Saved" on
// a button. It disappears after a few seconds (data-duration / the duration option, in ms; 0 keeps it),
// waits while the pointer or focus is on it, and can always be dismissed. Esc dismisses the toast with focus.
const ALERT_ICONS = { info: 'info', success: 'circle-check', warning: 'triangle-alert', danger: 'circle-alert' };
const closeButton = (label = 'Dismiss') => {
  const button = el('button', 'alert__close');
  button.type = 'button';
  button.setAttribute('aria-label', label);
  button.innerHTML = icon('x');
  return button;
};
const enhanceAlerts = (claim) => {
  for (const alert of claim('.alert[data-dismissible]')) {
    const button = closeButton();
    alert.append(button);
    button.addEventListener('click', () => {
      const stack = alert.closest('.alert-stack') ?? alert.parentElement;
      alert.remove();
      stack.tabIndex = -1; // focus has to go somewhere when the focused button disappears
      stack.focus({ preventScroll: true });
    });
  }
};

const toastRegion = () => {
  let region = document.querySelector('.toasts');
  if (!region) {
    region = el('div', 'toasts', document.body);
    region.setAttribute('role', 'region');
    region.setAttribute('aria-label', 'Notifications');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-relevant', 'additions');
  }
  return region;
};

const toast = (message, { variant = 'info', title = '', duration = 6000 } = {}) => {
  const kind = ALERT_ICONS[variant] ? variant : 'info';
  const node = el('div', `alert alert--${kind} toast`, toastRegion());
  if (kind === 'danger') node.setAttribute('role', 'alert'); // errors interrupt; the rest wait their turn
  node.innerHTML = `${icon(ALERT_ICONS[kind]).replace('class="icon"', 'class="icon alert__icon"')}<div class="alert__body"></div>`;
  const body = node.querySelector('.alert__body');
  const label = { info: 'Information', success: 'Success', warning: 'Warning', danger: 'Error' }[kind];
  el('p', 'alert__title', body).textContent = title || label;
  if (message) el('p', 'alert__text', body).textContent = message;
  const button = closeButton();
  node.append(button);

  let timer;
  let waiting = false;
  const remove = () => { clearTimeout(timer); node.remove(); };
  const start = () => {
    clearTimeout(timer);
    if (duration > 0) timer = setTimeout(() => { if (!waiting) remove(); else start(); }, duration);
  };
  button.addEventListener('click', remove);
  node.addEventListener('keydown', (e) => { if (e.key === 'Escape') remove(); });
  for (const type of ['pointerenter', 'focusin']) node.addEventListener(type, () => { waiting = true; });
  for (const type of ['pointerleave', 'focusout']) node.addEventListener(type, () => { waiting = false; start(); });
  start();
  return node;
};

const enhanceToastTriggers = (claim) => {
  for (const trigger of claim('[data-toast]')) {
    trigger.addEventListener('click', () => toast(trigger.dataset.toast, {
      variant: trigger.dataset.toastVariant,
      title: trigger.dataset.toastTitle,
      duration: trigger.dataset.duration === undefined ? undefined : +trigger.dataset.duration,
    }));
  }
};

// Sortable table: <th data-sort> gets a button; clicking sorts the rows by that column (numbers by
// number, otherwise by text; a cell's data-value overrides what is shown). aria-sort says which
// column is sorted and which way, and only one column carries it.
const enhanceTables = (claim) => {
  for (const table of claim('table[data-sortable]')) {
    const heads = [...table.querySelectorAll('thead th')];
    const body = table.tBodies[0];
    if (!body) continue;
    const value = (row, i) => {
      const cell = row.cells[i];
      const raw = (cell.dataset.value ?? cell.textContent).trim();
      const number = parseFloat(raw.replace(/[^0-9.\-]/g, ''));
      return raw !== '' && !Number.isNaN(number) && /^[-+$€£]?[0-9.,\s]+%?$/.test(raw) ? number : raw.toLowerCase();
    };
    heads.forEach((th, i) => {
      if (!th.hasAttribute('data-sort')) return;
      const button = el('button', 'table__sort');
      button.type = 'button';
      button.append(...th.childNodes);
      th.append(button);
      th.setAttribute('aria-sort', 'none');
      button.addEventListener('click', () => {
        const next = th.getAttribute('aria-sort') === 'ascending' ? 'descending' : 'ascending';
        for (const other of heads) if (other.hasAttribute('aria-sort')) other.setAttribute('aria-sort', 'none');
        th.setAttribute('aria-sort', next);
        const sign = next === 'ascending' ? 1 : -1;
        const rows = [...body.rows].sort((a, b) => {
          const x = value(a, i);
          const y = value(b, i);
          return (typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y), undefined, { numeric: true })) * sign;
        });
        body.append(...rows);
      });
    });
  }
};

// Picker: a <select data-picker> whose list can show more than text, such as a moving spinner. The
// select stays in the form and keeps the value; a select-only combobox (the ARIA pattern) is built
// over it. An option points at a <template> with data-art, and that is drawn beside its words.
// Keys: Down/Up/Enter/Space open it; arrows, Home, End and letters move; Enter or Space picks;
// Esc closes. Focus stays on the button and aria-activedescendant names the current option.
let pickers = 0;
const enhancePickers = (claim) => {
  for (const select of claim('select[data-picker]')) {
    const id = `simar-picker-${++pickers}`;
    const label = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
    const options = [...select.options];
    const art = (option) => {
      const template = option.dataset.art && document.getElementById(option.dataset.art);
      return template ? template.content.cloneNode(true) : null;
    };
    const fill = (target, option) => {
      const holder = el('span', 'picker__art', target);
      holder.setAttribute('aria-hidden', 'true');
      holder.append(art(option) ?? '');
      el('span', 'picker__text', target).textContent = option.textContent;
    };

    const wrap = el('div', 'picker');
    const button = el('button', 'input picker__button', wrap);
    button.type = 'button';
    button.id = `${id}-button`;
    button.setAttribute('role', 'combobox');
    button.setAttribute('aria-haspopup', 'listbox');
    button.setAttribute('aria-expanded', 'false');
    if (label) {
      label.setAttribute('for', button.id);
      label.id ||= `${id}-label`;
      button.setAttribute('aria-labelledby', `${label.id} ${button.id}`);
    } else if (select.getAttribute('aria-label')) {
      button.setAttribute('aria-label', select.getAttribute('aria-label'));
    }
    const shown = el('span', 'picker__shown', button);
    button.insertAdjacentHTML('beforeend', icon('chevron-down').replace('class="icon"', 'class="icon picker__icon"'));

    const list = el('ul', 'picker__list', wrap);
    list.id = `${id}-list`;
    list.setAttribute('role', 'listbox');
    list.setAttribute('popover', 'auto');
    if (label) list.setAttribute('aria-labelledby', label.id);
    const items = options.map((option, i) => {
      const item = el('li', 'picker__option', list);
      item.id = `${id}-option-${i}`;
      item.setAttribute('role', 'option');
      fill(item, option);
      item.addEventListener('pointerdown', (e) => e.preventDefault()); // keep focus on the button
      item.addEventListener('click', () => { choose(i); close(); });
      item.addEventListener('pointermove', () => highlight(i));
      return item;
    });

    let active = select.selectedIndex;
    const isOpen = () => list.matches(':popover-open');
    const highlight = (i) => {
      active = Math.max(0, Math.min(items.length - 1, i));
      items.forEach((item, n) => item.classList.toggle('is-active', n === active));
      button.setAttribute('aria-activedescendant', items[active].id);
      items[active].scrollIntoView({ block: 'nearest' });
    };
    const render = () => {
      shown.replaceChildren();
      fill(shown, select.options[select.selectedIndex]);
      items.forEach((item, n) => item.setAttribute('aria-selected', String(n === select.selectedIndex)));
    };
    const choose = (i) => {
      if (select.selectedIndex === i) return;
      select.selectedIndex = i;
      render();
      select.dispatchEvent(new Event('input', { bubbles: true }));
      select.dispatchEvent(new Event('change', { bubbles: true }));
    };
    const open = () => {
      if (isOpen() || button.disabled) return;
      const box = button.getBoundingClientRect();
      list.style.minWidth = `${box.width}px`;
      list.style.left = `${box.left}px`;
      list.showPopover();
      const below = innerHeight - box.bottom;
      const height = list.offsetHeight;
      list.style.top = `${below >= height + 8 || box.top < height ? box.bottom + 4 : box.top - height - 4}px`;
      highlight(select.selectedIndex);
    };
    const close = () => { if (isOpen()) list.hidePopover(); };
    list.addEventListener('toggle', () => {
      button.setAttribute('aria-expanded', String(isOpen()));
      // aria-controls only while the list is showing: a pointer to a hidden element is invalid.
      if (isOpen()) button.setAttribute('aria-controls', list.id);
      else { button.removeAttribute('aria-controls'); button.removeAttribute('aria-activedescendant'); }
    });

    button.addEventListener('click', () => (isOpen() ? close() : open()));
    button.addEventListener('keydown', (e) => {
      const key = e.key;
      if (!isOpen()) {
        if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(key)) { e.preventDefault(); open(); }
        else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const next = options.findIndex((o, n) => n > select.selectedIndex && o.textContent.toLowerCase().startsWith(key.toLowerCase()));
          if (next >= 0) { e.preventDefault(); choose(next); }
        }
        return;
      }
      if (key === 'ArrowDown') highlight(active + 1);
      else if (key === 'ArrowUp') highlight(active - 1);
      else if (key === 'Home') highlight(0);
      else if (key === 'End') highlight(items.length - 1);
      else if (key === 'Enter' || key === ' ') { choose(active); close(); }
      else if (key === 'Tab') { choose(active); close(); return; }
      else if (key === 'Escape') { close(); }
      else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const next = options.findIndex((o, n) => n > active && o.textContent.toLowerCase().startsWith(key.toLowerCase()));
        if (next >= 0) highlight(next);
      } else return;
      e.preventDefault();
    });
    select.addEventListener('change', render); // the value was set from outside

    const host = select.closest('.select') ?? select; // the chevron wrapper goes too: the picker has its own
    host.hidden = true;
    host.after(wrap);
    render();
  }
};

// Color: the readout beside the swatch follows it.
const enhanceColors = (claim) => {
  for (const input of claim('.color input[type="color"]')) {
    const out = input.closest('.color').querySelector('output');
    const sync = () => { if (out) out.value = input.value; };
    input.addEventListener('input', sync);
    sync();
  }
};

// Validation. <form data-validate> swaps the browser's pop-up bubbles for messages in the page:
// words with an icon under each field, linked to it with aria-describedby and aria-invalid, a
// summary announced at the top, and focus sent to the first problem (WCAG 3.3.1 and 3.3.3). The
// text is the control's data-error, or the browser's own validationMessage. Without JavaScript
// the browser's native validation still applies.
const CHECKABLE = 'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]):not([type="radio"]), select, textarea';
let errorCount = 0;

const enhanceForms = (claim) => {
  for (const form of claim('form[data-validate]')) {
    form.noValidate = true;
    let summary = form.querySelector('.form__summary');
    if (!summary) {
      summary = el('div', 'form__summary');
      summary.hidden = true;
      summary.setAttribute('role', 'alert');
      summary.tabIndex = -1;
      form.prepend(summary);
    }

    const nameOf = (control) => control.labels?.[0]?.textContent.replace(/\s+/g, ' ').trim() || control.getAttribute('aria-label') || control.name;

    const errorNode = (control) => {
      if (!control.id) control.id = `simar-field-${++errorCount}`;
      let node = document.getElementById(`${control.id}-error`);
      if (!node) {
        node = el('p', 'field__error');
        node.id = `${control.id}-error`;
        node.hidden = true;
        node.innerHTML = `${icon('circle-alert')}<span></span>`;
        const check = !control.closest('.field') && control.closest('.check');
        if (check) check.after(node);
        else (control.closest('.field') ?? control.parentElement).append(node);
      }
      return node;
    };

    const setError = (control, message) => {
      const node = errorNode(control);
      const ids = (control.getAttribute('aria-describedby') ?? '').split(/\s+/).filter((id) => id && id !== node.id);
      if (message) {
        node.querySelector('span').textContent = message;
        node.hidden = false;
        control.setAttribute('aria-invalid', 'true');
        control.setAttribute('aria-describedby', [...ids, node.id].join(' '));
      } else {
        node.hidden = true;
        control.removeAttribute('aria-invalid');
        if (ids.length) control.setAttribute('aria-describedby', ids.join(' '));
        else control.removeAttribute('aria-describedby');
      }
    };

    const check = (control) => {
      setError(control, control.validity.valid ? '' : control.dataset.error || control.validationMessage);
      return control.validity.valid;
    };

    const controls = () => [...form.elements].filter((c) => c.matches(CHECKABLE) && c.willValidate);

    const refreshSummary = () => {
      const bad = controls().filter((c) => !c.validity.valid && c.getAttribute('aria-invalid') === 'true');
      if (!bad.length) { summary.hidden = true; summary.textContent = ''; return; }
      summary.textContent = `${bad.length} ${bad.length === 1 ? 'field needs' : 'fields need'} attention: ${bad.map(nameOf).join(', ')}.`;
      summary.hidden = false;
    };

    form.addEventListener('submit', (e) => {
      const bad = controls().filter((c) => !check(c));
      if (!bad.length) { summary.hidden = true; return; }
      e.preventDefault();
      refreshSummary();
      bad[0].focus();
    });
    form.addEventListener('change', (e) => { if (e.target.matches?.(CHECKABLE)) { check(e.target); refreshSummary(); } });
    // while fixing a field that is flagged, clear the flag as soon as it is valid
    form.addEventListener('input', (e) => {
      if (e.target.matches?.(CHECKABLE) && e.target.getAttribute('aria-invalid') === 'true') { check(e.target); refreshSummary(); }
    });
    form.addEventListener('reset', () => { controls().forEach((c) => setError(c, '')); summary.hidden = true; });
  }
};

// ---- Checkboxes ------------------------------------------------------------------------

// A checkbox's mixed state exists only as a property, never an attribute, so data-indeterminate
// sets it. Pressing the box clears it, as a native checkbox does.
const enhanceChecks = (claim) => {
  for (const box of claim('input[type="checkbox"][data-indeterminate]')) box.indeterminate = true;
};

// A check list: data-checklist on a fieldset of checkboxes. Script adds a "select all" box on top (checked when
// every item is, mixed when some are, aria-controls the items; the WAI-ARIA "Checkbox (Mixed-State)" pattern) and
// a polite status below ("2 of 4 done"). Disabled items are left out of the count and of select all. The select-all
// box has no name, so it is not submitted. data-all sets its label, data-done the word after "x of y".
let checklistCount = 0;
const enhanceChecklists = (claim) => {
  for (const set of claim('[data-checklist]')) {
    const n = ++checklistCount;
    const items = () => [...set.querySelectorAll('input[type="checkbox"]')].filter((box) => box !== all && !box.disabled);
    const all = document.createElement('input');
    all.type = 'checkbox';
    const row = document.createElement('label');
    row.className = 'check checklist__all';
    row.innerHTML = '<span class="well"><span class="key key--box"><svg class="icon icon--check" aria-hidden="true"><use href="#i-check"/></svg><svg class="icon icon--minus" aria-hidden="true"><use href="#i-minus"/></svg></span></span><span class="check__text"></span>';
    row.querySelector('.check__text').textContent = set.dataset.all || 'Select all';
    row.querySelector('.well').prepend(all);
    const status = document.createElement('p');
    status.className = 'checklist__status';
    status.setAttribute('role', 'status');
    const legend = set.querySelector(':scope > legend');
    legend ? legend.after(row) : set.prepend(row);
    set.append(status);
    items().forEach((box, i) => { box.id ||= `simar-checklist-${n}-${i + 1}`; });
    all.setAttribute('aria-controls', items().map((box) => box.id).join(' '));

    const refresh = () => {
      const list = items();
      const done = list.filter((box) => box.checked).length;
      all.checked = list.length > 0 && done === list.length;
      all.indeterminate = done > 0 && done < list.length;
      all.disabled = list.length === 0;
      status.textContent = `${done} of ${list.length} ${set.dataset.done || 'done'}`;
    };
    all.addEventListener('change', () => {
      const on = all.checked;
      for (const box of items()) {
        if (box.checked === on) continue;
        box.checked = on;
        box.dispatchEvent(new Event('change', { bubbles: true }));
      }
      refresh();
    });
    set.addEventListener('change', (e) => { if (e.target !== all) refresh(); });
    set.closest('form')?.addEventListener('reset', () => setTimeout(refresh));
    refresh();
  }
};

// An app bar with a collapsible menu: data-menu on the bar, a <nav class="appbar__nav"> inside. Script adds a Menu
// key that discloses the links (aria-expanded, aria-controls, the WAI-ARIA disclosure pattern); the stylesheet decides
// when they fold (below md, or the breakpoint named in data-menu, or "always"). Esc closes the menu and returns focus
// to the key; choosing a link closes it too. Without script the links just wrap in the bar.
let appbarCount = 0;
const enhanceAppBars = (claim) => {
  for (const bar of claim('.appbar[data-menu]')) {
    const nav = bar.querySelector('.appbar__nav');
    if (!nav) continue;
    nav.id ||= `simar-appbar-nav-${++appbarCount}`;
    const well = document.createElement('span');
    well.className = 'well appbar__menu';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'key';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', nav.id);
    toggle.innerHTML = '<svg class="icon icon--lead" aria-hidden="true"><use href="#i-list"/></svg>';
    toggle.append(bar.dataset.menuLabel || 'Menu');
    well.append(toggle);
    // After the actions, else after the name, else first: so the key sits where the links would have started.
    const anchor = bar.querySelector('.appbar__actions') ?? bar.querySelector('.appbar__brand, .appbar__title');
    if (anchor) anchor.after(well); else bar.prepend(well);
    const set = (open) => {
      bar.toggleAttribute('data-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    bar.classList.add('is-enhanced');
    toggle.addEventListener('click', () => set(!bar.hasAttribute('data-open')));
    nav.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    bar.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape' || !bar.hasAttribute('data-open') || !toggle.offsetParent) return;
      set(false);
      toggle.focus();
    });
    // Folded or not is the stylesheet's call, so close whenever the width changes.
    addEventListener('resize', () => { if (bar.hasAttribute('data-open') && !toggle.offsetParent) set(false); });
  }
};

// A carousel or gallery (.carousel): the slides, the scrolling and the jump links all work without script. This adds
// Previous and Next keys (they wrap around), a polite "Slide 2 of 3" status that speaks only when the person moves,
// aria-current on the jump link of the slide in view, and, only if data-autoplay="5000" (milliseconds) is set, auto-
// play with a Pause key. Auto-play stops while the pointer or focus is inside and never starts under reduced motion.
// Pattern: WAI-ARIA APG "Carousel".
const enhanceCarousels = (claim) => {
  const calm = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A plain key, like the ones in pagination.
  const key = (label, icon) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'key key--sq';
    button.setAttribute('aria-label', label);
    button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${icon}"/></svg>`;
    return button;
  };
  for (const root of claim('.carousel')) {
    const track = root.querySelector('.carousel__track');
    const slides = [...root.querySelectorAll('.carousel__slide')];
    if (!track || slides.length < 2) continue;
    const links = [...root.querySelectorAll('.carousel__nav a')];
    let bar = root.querySelector('.carousel__bar');
    if (!bar) { bar = document.createElement('div'); bar.className = 'carousel__bar'; root.append(bar); }
    const status = document.createElement('p');
    status.className = 'visually-hidden';
    status.setAttribute('role', 'status');
    bar.after(status);

    const left = (i) => slides[i].offsetLeft - slides[0].offsetLeft;
    const nearest = () => {
      const at = Math.abs(track.scrollLeft);
      return slides.reduce((best, _, i) => (Math.abs(left(i) - at) < Math.abs(left(best) - at) ? i : best), 0);
    };
    let current = 0;
    let speak = false; // only a person's own move is announced, never the auto-play
    let timer;
    const show = (i) => {
      current = i;
      slides.forEach((slide, k) => slide.toggleAttribute('data-active', k === i));
      links.forEach((link, k) => (k === i ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current')));
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (speak) status.textContent = `Slide ${i + 1} of ${slides.length}`;
        speak = false;
      }, 250);
    };
    // Quick presses build on each other: they count from where the last one was heading, not from where the row is now.
    let target = 0;
    const go = (i, byPerson = true) => {
      target = (i + slides.length) % slides.length;
      speak = byPerson;
      track.scrollTo({ left: left(target), behavior: calm() ? 'auto' : 'smooth' });
    };
    let frame;
    let idle;
    track.addEventListener('scroll', () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => { const i = nearest(); if (i !== current) show(i); });
      clearTimeout(idle);
      idle = setTimeout(() => { target = nearest(); }, 150); // once it stops, drags and arrow keys count too
    }, { passive: true });
    // The arrow keys scroll a focused row on their own; Home and End only scroll up and down the page, so they are added.
    track.addEventListener('keydown', (e) => {
      speak = true;
      if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); go(e.key === 'Home' ? 0 : slides.length - 1); }
    });
    links.forEach((link, i) => link.addEventListener('click', (e) => { e.preventDefault(); go(i); }));

    const prev = key('Previous slide', 'chevron-left');
    const next = key('Next slide', 'chevron-right');
    bar.prepend(prev);
    bar.append(next);
    prev.addEventListener('click', () => go(target - 1));
    next.addEventListener('click', () => go(target + 1));

    const ms = Number(root.dataset.autoplay);
    if (ms >= 3000) {
      const play = key('Pause slides', 'pause');
      const button = play;
      bar.append(play);
      let running = false;
      let inside = false;
      let chosen = !calm(); // the person's own choice: play (true) or pause (false)
      const tick = () => go(target + 1, false);
      const sync = () => {
        const should = chosen && !inside;
        if (should && !running) timer2 = setInterval(tick, ms);
        if (!should && running) clearInterval(timer2);
        running = should;
        const use = button.querySelector('use');
        button.setAttribute('aria-label', chosen ? 'Pause slides' : 'Play slides');
        use.setAttribute('href', chosen ? '#i-pause' : '#i-play');
      };
      let timer2;
      button.addEventListener('click', () => { chosen = !chosen; sync(); });
      root.addEventListener('pointerenter', () => { inside = true; sync(); });
      root.addEventListener('pointerleave', () => { inside = false; sync(); });
      root.addEventListener('focusin', () => { inside = true; sync(); });
      root.addEventListener('focusout', (e) => { if (!root.contains(e.relatedTarget)) { inside = false; sync(); } });
      sync();
    }
    show(nearest());
    status.textContent = '';
  }
};

// ---- Tooltips --------------------------------------------------------------------------

// data-tooltip="Text" on a button, link or radio key. The text becomes a popover shown on mouse
// hover (after a short wait) and on keyboard focus. It follows WCAG 1.4.13: Esc dismisses it, the
// pointer can move onto it without it vanishing, and it stays until you leave or dismiss it. It is
// connected with aria-describedby unless it only repeats the control's own name, and an icon-only
// control with no name is named from the tooltip text.
const tipped = new WeakSet();
let tipCount = 0;
let showing = null; // the tooltip currently open

const enhanceTooltips = (scope) => {
  // A key with no visible words gets its label as a tooltip, so mouse users aren't left guessing.
  // data-tooltip="" on a control opts it out.
  for (const control of scope.querySelectorAll('button.key, input[type="radio"]')) {
    if (control.hasAttribute('data-tooltip')) continue;
    const face = control.matches('input') ? control.nextElementSibling : control;
    const label = control.getAttribute('aria-label')?.trim();
    if (label && face && !face.textContent.trim()) control.dataset.tooltip = label;
  }

  const created = [];
  for (const trigger of scope.querySelectorAll('[data-tooltip]')) {
    const text = trigger.dataset.tooltip.trim();
    if (tipped.has(trigger) || !text) continue;
    tipped.add(trigger);

    // Inside a modal dialog (or another popover) the tooltip has to live there too: the rest of
    // the page is inert, and an inert tooltip could not be hovered.
    // Otherwise it goes in the nearest landmark or region, so it is never page content outside one.
    const host = trigger.closest('dialog, [popover], main, nav, aside, header, footer, section[aria-label], section[aria-labelledby]') ?? document.body;
    const tip = el('span', 'tooltip', host);
    created.push(tip);
    tip.id = `simar-tip-${++tipCount}`;
    tip.setAttribute('role', 'tooltip');
    tip.setAttribute('popover', 'manual');
    tip.textContent = text;

    const name = (trigger.getAttribute('aria-label') ?? trigger.textContent ?? '').trim();
    if (!name) {
      // Still named, but only while this script runs. Without it the control has no name.
      trigger.setAttribute('aria-label', text);
      report(trigger, 'is named only by its tooltip, which needs JavaScript. Add an aria-label in the markup so it is named without it.');
    }
    else if (name.toLowerCase() !== text.toLowerCase()) {
      trigger.setAttribute('aria-describedby', [trigger.getAttribute('aria-describedby'), tip.id].filter(Boolean).join(' '));
    }

    // A radio key's input is hidden, so measure and listen on the visible key instead.
    const anchor = trigger.matches('input') ? trigger.nextElementSibling ?? trigger : trigger;
    const hoverArea = anchor.closest('.well') ?? anchor;
    let timer;
    const later = (fn, ms) => { clearTimeout(timer); timer = setTimeout(fn, ms); };

    const place = () => {
      if (!tip.matches(':popover-open')) return;
      const a = anchor.getBoundingClientRect();
      const t = tip.getBoundingClientRect();
      const gap = 10;
      const above = a.top - t.height - gap >= 8;
      const left = Math.max(8, Math.min(a.left + a.width / 2 - t.width / 2, innerWidth - t.width - 8));
      tip.style.top = `${above ? a.top - t.height - gap : a.bottom + gap}px`;
      tip.style.left = `${left}px`;
      tip.style.setProperty('--arrow', `${a.left + a.width / 2 - left}px`);
      tip.dataset.side = above ? 'above' : 'below';
    };
    const show = () => {
      clearTimeout(timer);
      if (showing && showing !== tip) showing.hidePopover();
      if (!tip.matches(':popover-open')) tip.showPopover();
      showing = tip;
      tip.place = place;
      place();
    };
    const hide = () => {
      clearTimeout(timer);
      if (tip.matches(':popover-open')) tip.hidePopover();
      if (showing === tip) showing = null;
    };

    hoverArea.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') later(show, 450); });
    hoverArea.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') later(hide, 150); });
    tip.addEventListener('pointerenter', () => clearTimeout(timer)); // hoverable
    tip.addEventListener('pointerleave', () => later(hide, 150));
    // One tick later: focus often lands while a dialog or the calendar is itself opening, and a
    // browser refuses to show one popover in the middle of another's show.
    trigger.addEventListener('focus', () => { if (trigger.matches(':focus-visible')) later(show, 0); });
    trigger.addEventListener('blur', hide);
    trigger.addEventListener('pointerdown', hide);
  }
  return created;
};

// Registered once: Esc dismisses the open tooltip (a second Esc then closes a dialog), and an
// open tooltip stays attached to its key as the page moves.
const listenForTooltips = () => {
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !showing) return;
    showing.hidePopover();
    showing = null;
    e.preventDefault();
  }, true);
  const follow = () => showing?.place?.();
  addEventListener('scroll', follow, { passive: true });
  addEventListener('resize', follow);
};

// ---- Haptics ---------------------------------------------------------------------------

// Haptics use the built-in Vibration API, so there is nothing to install. It works on
// Android browsers; iOS Safari doesn't implement it, so the calls are skipped there.
// Configure with data-haptic on any element (it applies to everything inside it):
// on, off, tick, click, heavy, or milliseconds such as "10,30,10".
const BUZZ = { tick: 8, click: 14, heavy: 28 };
let lastBuzz = 0;

const haptic = (target, kind) => {
  if (!('vibrate' in navigator)) return;
  const setting = target.closest('[data-haptic]')?.dataset.haptic || 'on';
  if (setting === 'off') return;
  const now = performance.now();
  if (now - lastBuzz < 25) return;
  lastBuzz = now;
  const custom = /^[\d,\s]+$/.test(setting) ? setting.split(',').map(Number) : null;
  navigator.vibrate(custom ?? BUZZ[setting] ?? BUZZ[kind]);
};

// Registered once, on the document, so they also cover markup added later.
const listenForHaptics = () => {
  document.addEventListener('click', (e) => {
    // Buttons and summaries, and links drawn as keys (a floating button, a page link).
    if (e.target.closest('button, summary, a.key')) haptic(e.target, 'click');
  });
  document.addEventListener('change', (e) => {
    // Radios, checkboxes and switches click; choosing from a select ticks.
    if (e.target.matches('input[type="radio"], input[type="checkbox"]')) haptic(e.target, 'click');
    else if (e.target.matches('select')) haptic(e.target, 'tick');
  });
  document.addEventListener('input', (e) => {
    if (e.target.matches('input[type="range"]')) haptic(e.target, 'tick');
  });
};

// ---- Start-up --------------------------------------------------------------------------

// Icons the page doesn't already define are injected (a page can carry its own sprite so its
// icons also show with JavaScript off).
const injectIcons = () => {
  const holder = el('div');
  holder.innerHTML = sprite;
  const svg = holder.querySelector('svg');
  const missing = [...svg.querySelectorAll('symbol')].filter((symbol) => !document.getElementById(symbol.id));
  if (!missing.length) return;
  svg.replaceChildren(...missing); // only the icons the page doesn't already define
  document.body.prepend(svg);
};

let started = false;

const init = (scope = document) => {
  document.documentElement.dataset.js = 'on'; // lets CSS style the with-JS and without-JS cases
  if (!started) {
    started = true;
    injectIcons();
    listenForHaptics();
    listenForTooltips();
  }
  expandTags(scope);

  // Each control is claimed once, so init() can be called again on new markup.
  const claim = (selector) => [...scope.querySelectorAll(selector)].filter((node) => {
    if (node.hasAttribute('data-simar')) return false;
    node.setAttribute('data-simar', '');
    return true;
  });

  enhanceFaders(claim);
  enhanceRanges(claim);
  enhanceRangeKnobs(claim);
  enhanceKnobs(claim);
  enhanceDialogs(claim);
  enhanceDateRanges(claim);
  enhanceCode(claim);
  enhanceChecks(claim);
  enhanceChecklists(claim);
  enhanceAppBars(claim);
  enhanceCarousels(claim);
  enhanceTabs(claim);
  enhanceSideMenus(claim);
  enhanceEmbeds(claim);
  enhanceMenus(claim);
  enhanceAlerts(claim);
  enhanceTables(claim);
  enhanceToastTriggers(claim);
  enhanceAutocomplete(claim);
  enhanceSteppers(claim);
  enhanceReveal(claim);
  enhanceColors(claim);
  enhancePickers(claim);
  enhanceForms(claim);
  enhanceTooltips(scope);
  audit(scope);
};

window.SimarUI = { init, audit, toast };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
else init();
