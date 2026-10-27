(() => {
  // src/charts.js
  (() => {
    let made = 0;
    const el = (tag, className, parent) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      parent?.append(node);
      return node;
    };
    const number = (cell) => {
      const n = parseFloat(String(cell?.dataset.value ?? cell?.textContent ?? "").replace(/[^\d.+-]/g, ""));
      return Number.isNaN(n) ? null : n;
    };
    const read = (table) => {
      const rows = [...table.querySelectorAll("tbody tr")];
      const names = [...table.querySelectorAll("thead th")].slice(1).map((th) => th.textContent.trim());
      return {
        names,
        labels: rows.map((row) => row.querySelector("th")?.textContent.trim() ?? ""),
        series: names.map((_, i) => rows.map((row) => number(row.querySelectorAll("td")[i])))
      };
    };
    const draw = (figure) => {
      const lib = window.Chartist;
      const table = figure.querySelector("table");
      if (!lib || !table || figure.hasAttribute("data-chart-made")) return;
      const type = figure.dataset.chart;
      const { names, labels, series } = read(table);
      if (!series.length || !labels.length) return;
      figure.setAttribute("data-chart-made", "");
      const id = `simar-chart-${++made}`;
      const title = figure.querySelector(".chart__title") ?? table.querySelector("caption");
      if (title && !title.id) title.id = `${id}-title`;
      const canvas = el("div", "chart__canvas ct-golden-section");
      canvas.id = id;
      canvas.setAttribute("role", "img");
      if (title) canvas.setAttribute("aria-labelledby", title.id);
      const summary = el("p", "visually-hidden");
      summary.id = `${id}-summary`;
      const kind = type === "donut" ? "Donut" : type[0].toUpperCase() + type.slice(1);
      summary.textContent = figure.dataset.summary ?? `${kind} chart of ${series.length} ${series.length === 1 ? "series" : "series"} over ${labels.length} ${labels.length === 1 ? "point" : "points"}. The data is in the table below.`;
      canvas.setAttribute("aria-describedby", summary.id);
      (title ?? figure).after(canvas);
      canvas.after(summary);
      const legend = el("ul", "chart__legend");
      legend.setAttribute("aria-label", "Legend");
      const pie = type === "pie" || type === "donut";
      const entries = pie ? labels.map((label, i) => `${label} (${series[0][i] ?? 0})`) : names;
      entries.forEach((text, i) => {
        const item = el("li", "", legend);
        const swatch = el("span", `chart__swatch chart__swatch--dash-${String.fromCharCode(97 + i % 8)}`, item);
        swatch.style.setProperty("--swatch", `var(--chart-${i % 8 + 1})`);
        swatch.setAttribute("aria-hidden", "true");
        item.append(text);
      });
      summary.after(legend);
      const details = el("details", "chart__table");
      el("summary", "", details).textContent = "Data table";
      const wrap = el("div", "table-wrap", details);
      wrap.setAttribute("role", "region");
      wrap.tabIndex = 0;
      if (title) wrap.setAttribute("aria-labelledby", title.id);
      table.replaceWith(details);
      wrap.append(table);
      const data = pie ? { labels, series: series[0].map((v) => v ?? 0) } : { labels, series };
      const options = {
        line: { fullWidth: true, lineSmooth: false, chartPadding: { top: 16, right: 24 }, low: 0, axisY: { onlyInteger: true } },
        bar: { low: 0, stackBars: figure.hasAttribute("data-stacked"), chartPadding: { top: 16 }, axisY: { onlyInteger: true } },
        pie: { showLabel: false },
        donut: { donut: true, donutWidth: 36, showLabel: false }
      }[type] ?? {};
      const chart = { line: lib.lineChart, bar: lib.barChart, pie: lib.pieChart, donut: lib.pieChart }[type];
      if (!chart) return;
      const handle = chart(canvas, data, options);
      if ("ResizeObserver" in window) {
        let frame = 0;
        new ResizeObserver(() => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => handle.update(data, options));
        }).observe(canvas);
      }
    };
    const init = (scope = document) => scope.querySelectorAll("figure.chart[data-chart]").forEach(draw);
    window.SimarUICharts = { init };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
    else init();
  })();
})();
