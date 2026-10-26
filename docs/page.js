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
const themeChoices = document.querySelectorAll('input[name="theme"]');
const savedTheme = root.dataset.theme ?? 'auto';
for (const radio of themeChoices) {
  radio.checked = radio.value === savedTheme;
  radio.addEventListener('change', () => {
    if (radio.value === 'auto') delete root.dataset.theme;
    else root.dataset.theme = radio.value;
    try {
      if (radio.value === 'auto') localStorage.removeItem('simar-ui:theme');
      else localStorage.setItem('simar-ui:theme', radio.value);
    } catch { /* the choice just isn't remembered */ }
  });
}

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
  const spy = () => {
    queued = false;
    // The last heading that has reached the upper part of the screen is the current section.
    let current = targets[0]?.[1];
    for (const [heading, link] of targets) if (heading.getBoundingClientRect().top <= innerHeight * 0.3) current = link;
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
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  spy();
}
