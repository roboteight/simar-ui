// Demo page only: builds the search index from the page itself (each component's title, its group and
// the panels in it) as a <datalist>, so nothing needs updating when a section is added. The library's
// autocomplete then turns it into the themed list. Choosing a result goes to that section.
(() => {
  const input = document.getElementById('site-search');
  const datalist = document.getElementById('site-index');
  if (!input || !datalist) return;
  const entries = [];
  let group = '';
  for (const node of document.querySelectorAll('main h2.group, main section[aria-labelledby]')) {
    if (node.matches('h2')) { group = node.textContent.trim(); continue; }
    const heading = node.querySelector('h3');
    if (!heading) continue;
    const panels = [...node.querySelectorAll('.panel > legend')].map((l) => l.textContent.trim()).join(' ');
    const note = node.querySelector('.note')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 400) ?? '';
    entries.push({ id: heading.id, title: heading.textContent.trim(), group, keywords: `${panels} ${note}` });
  }
  for (const entry of entries) {
    const option = document.createElement('option');
    option.value = entry.title;
    option.label = entry.group;
    option.dataset.keywords = entry.keywords;
    datalist.append(option);
  }
  input.closest('search').hidden = false;

  const go = () => {
    const entry = entries.find((e) => e.title.toLowerCase() === input.value.trim().toLowerCase());
    if (!entry) return;
    const target = document.getElementById(entry.id);
    // A normal anchor jump (it honours the page's scroll padding under the header); then move focus
    // to the heading so a screen reader starts reading there.
    location.hash = entry.id;
    target.tabIndex = -1;
    target.focus({ preventScroll: true });
    input.value = '';
  };
  input.addEventListener('change', go);

  // Ctrl or Cmd + K focuses the search from anywhere. (A modifier key, so it never fires while
  // someone is just typing; WCAG 2.1.4.)
  addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      input.focus();
      input.select();
    }
  });
})();
