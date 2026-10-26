// Demo page only: the "Page settings" strip (highlight colour and haptics).
// Both are plain HTML attributes on <html>, which the library reads: data-lit and data-haptic.

for (const radio of document.querySelectorAll('input[name="lit"]')) {
  radio.addEventListener('change', () => { document.documentElement.dataset.lit = radio.value; });
}

if ('vibrate' in navigator) {
  document.getElementById('haptics-setting').hidden = false;
  for (const radio of document.querySelectorAll('input[name="haptics"]')) {
    radio.addEventListener('change', () => { document.documentElement.dataset.haptic = radio.value; });
  }
} else {
  document.getElementById('haptics-note').hidden = false;
}

// Theme: Auto follows the system (no data-theme on <html>); Light and Dark set it, which the
// library reads. The choice is remembered, and applied before first paint by a script in <head>.
const root = document.documentElement;
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

// Preloader demo: a Pause key (an aria-pressed toggle) freezes the motion, as WCAG 2.2.2 asks.
const pause = document.getElementById('pause-motion');
if (pause) {
  pause.addEventListener('click', () => {
    const paused = pause.getAttribute('aria-pressed') !== 'true';
    pause.setAttribute('aria-pressed', String(paused));
    document.getElementById('loader-demo').toggleAttribute('data-paused', paused);
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
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(spy); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  spy();
}
