// Demo page only. Decides whether the library runs, so the page can be viewed exactly as it
// downgrades without JavaScript: the toggle is a plain link to ?js=off, and when that is set
// no script is loaded at all (which is what a browser with JavaScript disabled sees too).
//
// The toggle reloads the page, so it also remembers what was at the top of the screen and
// puts the reader back there, instead of dropping them at the top of the page.

(() => {
  const KEY = 'simar-ui:scroll';
  const root = document.documentElement;

  // Elements worth anchoring to: each section and each panel, named by its heading.
  const anchors = () => [...document.querySelectorAll('main > section[aria-labelledby], main .panel')]
    .filter((node) => node.getClientRects().length)
    .map((node) => ({ node, name: (node.querySelector('h2, legend')?.textContent ?? '').trim() }))
    .filter(({ name }) => name);

  const remember = () => {
    // The last anchor whose top has reached the top of the screen is where the reader is.
    const here = anchors().filter(({ node }) => node.getBoundingClientRect().top <= 100).pop();
    if (!here) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify({ name: here.name, top: here.node.getBoundingClientRect().top }));
    } catch { /* storage can be unavailable; the page just opens at the top */ }
  };

  const saved = (() => {
    try {
      const value = JSON.parse(sessionStorage.getItem(KEY));
      sessionStorage.removeItem(KEY);
      return value;
    } catch { return null; }
  })();

  // Hide the page until the reader is back where they were, so there is no jump.
  const reveal = () => { root.style.visibility = ''; };
  if (saved) {
    root.style.visibility = 'hidden';
    setTimeout(reveal, 2000); // never leave the page hidden if something goes wrong
  }
  const restore = () => {
    const target = saved && anchors().find(({ name }) => name === saved.name);
    if (target) scrollBy(0, target.node.getBoundingClientRect().top - saved.top);
    reveal();
  };
  // After the load event, so the controls the library builds have taken their final size.
  if (document.readyState === 'complete') restore();
  else addEventListener('load', restore);

  const off = new URLSearchParams(location.search).get('js') === 'off';

  const toggle = document.getElementById('js-toggle');
  const note = document.getElementById('js-note');
  if (toggle) {
    toggle.textContent = off ? 'Turn JS on' : 'Turn JS off';
    toggle.href = off ? location.pathname : '?js=off';
    toggle.dataset.tooltip = off ? 'Reload with JavaScript on' : 'Reload with JavaScript off, to see how this page downgrades';
    toggle.addEventListener('click', remember);
  }
  if (note) {
    note.hidden = !off;
    note.textContent = 'JavaScript is off for this view. This is the plain HTML fallback: native controls, styled by CSS alone.';
  }
  if (off) return;

  // async = false keeps these in order: snippets must read the markup before the library
  // expands tags or builds controls.
  for (const src of ['docs/snippets.js', 'docs/search.js', 'dist/simar-ui.js', 'docs/page.js']) {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    document.body.append(script);
  }
})();
