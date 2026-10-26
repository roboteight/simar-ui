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
      const how = dialog.returnValue;
      const form = dialog.querySelector('form');
      const values = form && !['', 'cancel', 'dismissed'].includes(how) ? [...new FormData(form).values()] : [];
      out.value = values.length ? `${how}: ${values.join(', ')}` : how;
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

// ---- Checkboxes ------------------------------------------------------------------------

// A checkbox's mixed state exists only as a property, never an attribute, so data-indeterminate
// sets it. Pressing the box clears it, as a native checkbox does.
const enhanceChecks = (claim) => {
  for (const box of claim('input[type="checkbox"][data-indeterminate]')) box.indeterminate = true;
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
    if (e.target.closest('button, summary')) haptic(e.target, 'click');
  });
  document.addEventListener('change', (e) => {
    if (e.target.matches('input[type="radio"]')) haptic(e.target, 'click');
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
  enhanceTooltips(scope);
  audit(scope);
};

window.SimarUI = { init, audit };

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => init());
else init();
