// Demo page only: the "Page settings" strip (highlight colour and haptics).
// Both are plain HTML attributes on <html>, which the library reads: data-lit and data-haptic.

// Highlight and haptics: the panel at the top and the tab on the right edge are two views of the
// same two settings. Changing either sets the attribute on <html> and updates the other.
const root = document.documentElement;
const mirror = (name, value) => {
  for (const radio of document.querySelectorAll(`input[name="${name}"], input[name="${name}-tab"]`)) radio.checked = radio.value === value;
};
const setLit = (value) => {
  if (value) root.dataset.lit = value;
  else delete root.dataset.lit;
  mirror('lit', value);
  for (const select of document.querySelectorAll('#lit-select-tab')) select.value = value;
};
for (const radio of document.querySelectorAll('input[name="lit"]')) radio.addEventListener('change', () => setLit(radio.value));
document.getElementById('lit-select-tab')?.addEventListener('change', (e) => setLit(e.target.value));

// Themes: a palette retints the whole page and brings its own highlight, so choosing one clears
// the highlight choice; picking a highlight afterwards overrides the palette's.
const setPalette = (value) => {
  if (value) root.dataset.palette = value;
  else delete root.dataset.palette;
  for (const select of document.querySelectorAll('#theme-select-tab')) select.value = value;
  for (const radio of document.querySelectorAll('input[name="palette"]')) radio.checked = radio.value === value;
  setLit('');
  try {
    if (value) localStorage.setItem('simar-ui:palette', value);
    else localStorage.removeItem('simar-ui:palette');
  } catch { /* the choice just isn't remembered */ }
};
document.getElementById('theme-select-tab')?.addEventListener('change', (e) => setPalette(e.target.value));
for (const radio of document.querySelectorAll('input[name="palette"]')) radio.addEventListener('change', () => setPalette(radio.value));
try {
  const saved = localStorage.getItem('simar-ui:palette');
  if (saved) setPalette(saved);
} catch { /* nothing remembered */ }
if ('vibrate' in navigator) {
  for (const id of ['haptics-setting', 'haptics-setting-tab']) document.getElementById(id).hidden = false;
  for (const radio of document.querySelectorAll('input[name="haptics"], input[name="haptics-tab"]')) {
    radio.addEventListener('change', () => {
      root.dataset.haptic = radio.value;
      mirror('haptics', radio.value);
    });
  }
} else {
  for (const id of ['haptics-note', 'haptics-note-tab']) document.getElementById(id).hidden = false;
}

// The settings tab appears once the Page settings panel has scrolled out of view above, and goes
// again when you return to it. Esc closes the drawer and returns to the tab, and so does moving
// focus out of it.
const settingsTab = document.querySelector('.settings-tab');
if (settingsTab) {
  const toggle = settingsTab.querySelector('.settings-tab__toggle');
  const drawer = settingsTab.querySelector('.settings-tab__drawer');
  const original = document.getElementById('page-settings');
  const setOpen = (open) => {
    drawer.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  };
  let queued = false;
  const check = () => {
    queued = false;
    const past = original.getBoundingClientRect().bottom < 0;
    if (!past) setOpen(false);
    settingsTab.hidden = !past;
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(check); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  toggle.addEventListener('click', () => setOpen(drawer.hidden));
  settingsTab.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || drawer.hidden) return;
    setOpen(false);
    toggle.focus();
  });
  // Pressing a label inside the drawer moves focus to nowhere for a moment before the click lands, so
  // don't treat that as leaving.
  let pressing = false;
  settingsTab.addEventListener('pointerdown', () => { pressing = true; });
  addEventListener('pointerup', () => setTimeout(() => { pressing = false; }));
  settingsTab.addEventListener('focusout', (e) => {
    if (pressing || settingsTab.contains(e.relatedTarget)) return;
    setOpen(false);
  });
  check();
}

// Fonts: Default uses the visitor's own system fonts and loads nothing. Sans, Serif and Both load
// Google Fonts (Inter, Source Serif 4 and JetBrains Mono for code) the first time one is chosen,
// and the page falls back to system fonts while they arrive or if they can't load.
const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Inter:wght@300..700&family=JetBrains+Mono:wght@400..700&family=Source+Serif+4:opsz,wght@8..60,300..700&display=swap';
let fontsLinked = false;
const linkFonts = () => {
  if (fontsLinked) return;
  fontsLinked = true;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = FONTS_URL;
  document.head.append(link);
};
const setFont = (value, remember = true) => {
  if (value) { root.dataset.font = value; linkFonts(); }
  else delete root.dataset.font;
  for (const radio of document.querySelectorAll('input[name="font"]')) radio.checked = radio.value === value;
  const select = document.getElementById('font-select-tab');
  if (select) select.value = value;
  if (!remember) return;
  try {
    if (value) localStorage.setItem('simar-ui:font', value);
    else localStorage.removeItem('simar-ui:font');
  } catch { /* the choice just isn't remembered */ }
};
for (const radio of document.querySelectorAll('input[name="font"]')) radio.addEventListener('change', () => setFont(radio.value));
document.getElementById('font-select-tab')?.addEventListener('change', (e) => setFont(e.target.value));
setFont(root.dataset.font ?? '', false);

// Theme: Auto follows the system (no data-theme on <html>); Light and Dark set it, which the
// library reads. The choice is remembered, and applied before first paint by a script in <head>.
const themeSelect = document.getElementById('appearance');
if (themeSelect) {
  themeSelect.value = root.dataset.theme ?? 'auto';
  themeSelect.addEventListener('change', () => {
    if (themeSelect.value === 'auto') delete root.dataset.theme;
    else root.dataset.theme = themeSelect.value;
    try {
      if (themeSelect.value === 'auto') localStorage.removeItem('simar-ui:theme');
      else localStorage.setItem('simar-ui:theme', themeSelect.value);
    } catch { /* the choice just isn't remembered */ }
  });
}

// Style: the shape and depth of everything (data-style on <html>). The panel and the settings tab
// each have a select; both show the same choice, which is remembered and applied before first paint.
const styleSelects = document.querySelectorAll('#style-select, #style-select-tab');
const setStyle = (value) => {
  if (value) root.dataset.style = value;
  else delete root.dataset.style;
  for (const select of styleSelects) select.value = value;
  try {
    if (value) localStorage.setItem('simar-ui:style', value);
    else localStorage.removeItem('simar-ui:style');
  } catch { /* the choice just isn't remembered */ }
};
for (const select of styleSelects) select.addEventListener('change', () => setStyle(select.value));
for (const select of styleSelects) select.value = root.dataset.style ?? '';

// Spinners: the chosen style replaces the artwork in the two live spinners.
const spinnerPick = document.getElementById('spinner-pick');
if (spinnerPick) {
  spinnerPick.addEventListener('change', () => {
    const template = document.getElementById(`spinner-art-${spinnerPick.value}`);
    for (const live of document.querySelectorAll('#spinner-live, #spinner-live-small')) {
      live.classList.remove('spinner--ring', 'spinner--dots', 'spinner--bars');
      if (spinnerPick.value !== 'ticks') live.classList.add(`spinner--${spinnerPick.value}`);
      live.querySelector('.spinner__art').replaceWith(template.content.querySelector('.spinner__art').cloneNode(true));
    }
  });
}

// Loading demos: a Pause key (an aria-pressed toggle) freezes the motion in its own panel, as
// WCAG 2.2.2 asks.
for (const pause of document.querySelectorAll('[data-pause]')) {
  pause.addEventListener('click', () => {
    const paused = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(paused));
    pause.closest('.panel').toggleAttribute('data-paused', paused);
  });
}

// Demo forms never really submit (that would reload the page). A valid submit swaps the form for
// the "sent" confirmation and moves focus to its title; "Send another" brings the form back.
for (const form of document.querySelectorAll('form[data-demo-form]')) {
  const sent = document.getElementById(`${form.id}-sent`);
  form.addEventListener('submit', (e) => {
    const invalid = e.defaultPrevented; // the library already stopped an invalid form
    e.preventDefault();
    if (invalid || !sent) return;
    const email = form.querySelector('input[type="email"]')?.value;
    if (email) sent.querySelector('[data-sent-email]').textContent = email;
    form.hidden = true;
    sent.hidden = false;
    sent.querySelector('.sent__title').focus();
  });
  sent?.querySelector('[data-sent-again]').addEventListener('click', () => {
    form.reset();
    sent.hidden = true;
    form.hidden = false;
    form.querySelector('input, select, textarea')?.focus();
  });
}

// Contents drawer: below 76rem the list folds into a drawer opened from an icon on the left edge.
// Without JavaScript it simply stays above the page. Esc closes it and returns focus to the icon,
// choosing a link closes it, and so does moving focus out of it.
const tocNav = document.querySelector('.toc');
const tocToggle = document.querySelector('.toc-toggle');
if (tocNav && tocToggle) {
  const narrow = matchMedia('(max-width: 75.99rem)');
  const setTocOpen = (open) => {
    tocNav.hidden = !open;
    tocToggle.setAttribute('aria-expanded', String(open));
  };
  const apply = () => {
    tocNav.classList.toggle('toc--drawer', narrow.matches);
    tocToggle.hidden = !narrow.matches;
    if (narrow.matches) setTocOpen(false);
    else { tocNav.hidden = false; tocToggle.setAttribute('aria-expanded', 'false'); }
  };
  narrow.addEventListener('change', apply);
  apply();
  tocToggle.addEventListener('click', () => setTocOpen(tocNav.hidden));
  const inDrawer = () => tocNav.classList.contains('toc--drawer');
  tocNav.addEventListener('click', (e) => { if (inDrawer() && e.target.closest('a')) setTocOpen(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !inDrawer() || tocNav.hidden) return;
    setTocOpen(false);
    tocToggle.focus();
  });
  let tocPressing = false;
  for (const part of [tocNav, tocToggle]) part.addEventListener('pointerdown', () => { tocPressing = true; });
  addEventListener('pointerup', () => setTimeout(() => { tocPressing = false; }));
  document.addEventListener('focusout', (e) => {
    if (!inDrawer() || tocNav.hidden || tocPressing) return;
    if (tocNav.contains(e.relatedTarget) || e.relatedTarget === tocToggle) return;
    if (tocNav.contains(e.target)) setTocOpen(false);
  });
}

// Table of contents: mark the link for the section being read with aria-current="location".
// The links themselves are plain anchors and work without any of this.
const toc = document.querySelector('.toc');
if (toc) {
  const links = [...toc.querySelectorAll('a[href^="#"]')];
  const targets = links.map((a) => [document.getElementById(a.getAttribute('href').slice(1)), a]).filter(([heading]) => heading);
  let queued = false;
  // A link you pick is the current one straight away and stays so until you scroll yourself, because the
  // section can't always scroll to the top (near the end of the page), and the reading position alone would
  // then pick a different one.
  let picked = null;
  const spy = () => {
    queued = false;
    // The last heading that has reached the upper part of the screen is the current section.
    let current = targets[0]?.[1];
    for (const [heading, link] of targets) if (heading.getBoundingClientRect().top <= innerHeight * 0.3) current = link;
    if (picked) current = picked;
    for (const link of links) {
      if (link === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    // The list scrolls on its own when it is taller than the window: keep the current item showing.
    if (current && toc.scrollHeight > toc.clientHeight) {
      const item = current.getBoundingClientRect();
      const box = toc.getBoundingClientRect();
      if (item.top < box.top + 8) toc.scrollTop -= box.top + 8 - item.top;
      else if (item.bottom > box.bottom - 8) toc.scrollTop += item.bottom - (box.bottom - 8);
    }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(spy); } };
  for (const link of links) link.addEventListener('click', () => { picked = link; queue(); });
  const unpick = () => { if (picked) { picked = null; queue(); } };
  addEventListener('wheel', unpick, { passive: true });
  addEventListener('touchmove', unpick, { passive: true });
  addEventListener('keydown', (e) => { if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(e.key) && !toc.contains(document.activeElement)) unpick(); });
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  spy();
}

// Offline and installable: register the service worker (docs only). When a new version has been
// fetched in the background, say so and offer to reload. It only runs on https and localhost.
if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  navigator.serviceWorker.register('sw.js').then((registration) => {
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller && window.SimarUI) {
          window.SimarUI.toast('Reload the page to get the latest version.', { title: 'New version ready', duration: 0 });
        }
      });
    });
  }).catch(() => { /* the page works the same without it */ });
}

// Button group demo: the toggle keys flip aria-pressed (the library styles it; the page decides what it means).
document.querySelectorAll('[data-toggle-group] [aria-pressed]').forEach((key) => {
  key.addEventListener('click', () => key.setAttribute('aria-pressed', String(key.getAttribute('aria-pressed') !== 'true')));
});

// Design tokens: the theme builder. Each slider sets one token on the preview only; the textarea shows the
// CSS for whatever differs from the current style's values, ready to paste into a project.
const tokenPreview = document.getElementById('token-preview');
if (tokenPreview) {
  const sliders = [...document.querySelectorAll('[data-token]')];
  const cssBox = document.getElementById('tb-css');
  const tbStatus = document.getElementById('tb-status');
  const defaults = new Map();
  let syncing = false;
  const valueOf = (slider) => `${slider.value}${slider.dataset.unit ?? ''}`;
  const update = () => {
    const lines = [];
    for (const slider of sliders) {
      if (slider.value !== defaults.get(slider)) {
        tokenPreview.style.setProperty(slider.dataset.token, valueOf(slider));
        lines.push(`  ${slider.dataset.token}: ${valueOf(slider)};`);
      } else {
        tokenPreview.style.removeProperty(slider.dataset.token);
      }
    }
    cssBox.value = lines.length ? `:root {\n${lines.join('\n')}\n}` : '/* No changes: these are the current style\'s values. */';
  };
  // Start from what the page uses now (it differs by style), and show it on the sliders.
  const readDefaults = () => {
    syncing = true;
    tokenPreview.removeAttribute('style');
    for (const slider of sliders) {
      const now = parseFloat(getComputedStyle(tokenPreview).getPropertyValue(slider.dataset.token));
      if (!Number.isNaN(now)) slider.value = String(now);
      defaults.set(slider, slider.value);
      slider.dispatchEvent(new Event('input', { bubbles: true })); // so the fader's readout follows
    }
    syncing = false;
    update();
    tbStatus.textContent = '';
  };
  for (const slider of sliders) slider.addEventListener('input', () => { if (!syncing) update(); });
  document.getElementById('tb-reset').addEventListener('click', () => { readDefaults(); tbStatus.textContent = 'Back to the current style.'; });
  document.getElementById('tb-copy').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(cssBox.value);
      tbStatus.textContent = 'CSS copied.';
    } catch {
      cssBox.focus();
      cssBox.select();
      tbStatus.textContent = 'Press Ctrl+C or Cmd+C to copy the selected CSS.';
    }
  });
  // A different style changes the starting values.
  for (const select of document.querySelectorAll('#style-select, #style-select-tab')) select.addEventListener('change', () => requestAnimationFrame(readDefaults));
  readDefaults();
}

// Keep the focused control clear of the sticky header (WCAG 2.4.11, Focus Not Obscured). scroll-padding handles
// most cases, but a control that is already partly in view when focus reaches it can be left under the header.
const stickyHeader = document.querySelector('header.topbar');
if (stickyHeader) {
  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (!(target instanceof Element) || stickyHeader.contains(target) || target.closest('dialog, [popover]')) return;
    // After the browser's own scroll-into-view, which runs once the focus events have finished.
    requestAnimationFrame(() => {
      const gap = target.getBoundingClientRect().top - stickyHeader.getBoundingClientRect().bottom;
      if (gap < 12) scrollBy({ top: gap - 24, behavior: 'instant' });
    });
  });
}
