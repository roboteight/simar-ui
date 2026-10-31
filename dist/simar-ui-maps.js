(() => {
  // src/maps.js
  (() => {
    let made = 0;
    const el = (tag, className, parent) => {
      const node = document.createElement(tag);
      if (className) node.className = className;
      parent?.append(node);
      return node;
    };
    const icon = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
    const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const key = (parent, label, iconName, onPress) => {
      const well = el("span", "well", parent);
      const button = el("button", "key key--sq", well);
      button.type = "button";
      button.setAttribute("aria-label", label);
      button.innerHTML = icon(iconName);
      button.addEventListener("click", onPress);
      return button;
    };
    const draw = (figure) => {
      const L = window.L;
      if (!L || figure.hasAttribute("data-map-made")) return;
      const places = [...figure.querySelectorAll(".map__places > li[data-lat][data-lng]")].map((li) => ({
        li,
        lat: Number(li.dataset.lat),
        lng: Number(li.dataset.lng),
        name: li.querySelector(".map__place-name")?.textContent.trim() ?? li.textContent.trim().slice(0, 60),
        text: li.querySelector(".map__place-text")?.textContent.trim() ?? ""
      })).filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng));
      const lat = Number(figure.dataset.lat), lng = Number(figure.dataset.lng);
      if (!places.length && !(Number.isFinite(lat) && Number.isFinite(lng))) return;
      figure.setAttribute("data-map-made", "");
      const id = `simar-map-${++made}`;
      const title = figure.querySelector(".map__title");
      if (title && !title.id) title.id = `${id}-title`;
      const frame = el("div", "map__frame");
      const canvas = el("div", "map__canvas", frame);
      canvas.id = id;
      canvas.setAttribute("role", "region");
      canvas.setAttribute("aria-label", title?.textContent.trim() ?? "Map");
      const help = el("p", "visually-hidden");
      help.id = `${id}-help`;
      help.textContent = "Map. Arrow keys move the map, plus and minus zoom. The pins are buttons: press Enter to open a place. The same places are listed below the map.";
      canvas.setAttribute("aria-describedby", help.id);
      (title ?? figure).after(frame);
      frame.after(help);
      const status = el("p", "visually-hidden");
      status.setAttribute("role", "status");
      help.after(status);
      const quiet = calm();
      const map = L.map(canvas, {
        center: Number.isFinite(lat) && Number.isFinite(lng) ? [lat, lng] : [places[0].lat, places[0].lng],
        zoom: Number(figure.dataset.zoom) || 13,
        zoomControl: false,
        // our own keys, below
        scrollWheelZoom: false,
        // the wheel scrolls the page; zoom with the keys or the buttons
        dragging: !L.Browser.mobile,
        // on a touch screen one finger scrolls the page
        keyboard: true,
        zoomAnimation: !quiet,
        fadeAnimation: !quiet,
        markerZoomAnimation: !quiet
      });
      map.attributionControl.setPrefix('<a href="https://leafletjs.com">Leaflet</a>');
      L.tileLayer(figure.dataset.tiles || "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: figure.dataset.attribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      for (const place of places) {
        const pin = L.marker([place.lat, place.lng], {
          icon: L.divIcon({ className: "map__pin", html: icon("map-pin"), iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -30] }),
          title: place.name,
          keyboard: true
        }).addTo(map);
        pin.getElement()?.setAttribute("aria-label", place.name);
        const popup = el("div", "map__popup");
        el("strong", "", popup).textContent = place.name;
        if (place.text) el("p", "", popup).textContent = place.text;
        pin.bindPopup(popup, { autoPanPadding: [16, 16] });
        place.pin = pin;
      }
      const showAll = () => {
        const reserve = (figure.querySelector(".map__controls")?.offsetWidth ?? 0) + 12;
        if (places.length > 1) map.fitBounds(L.latLngBounds(places.map((p) => [p.lat, p.lng])), { paddingTopLeft: [48, 48], paddingBottomRight: [48 + reserve, 48], animate: !quiet });
        else if (places.length === 1) map.setView([places[0].lat, places[0].lng], Number(figure.dataset.zoom) || 15, { animate: !quiet });
      };
      const wanted = (figure.dataset.controls || "zoom pan reset").split(/\s+/);
      const controls = el("div", "map__controls", frame);
      const said = () => {
        status.textContent = `Zoom level ${map.getZoom()} of ${map.getMaxZoom()}`;
      };
      let zoomIn, zoomOut;
      if (wanted.includes("zoom")) {
        const group = el("div", "well key-group key-group--vertical", controls);
        group.setAttribute("role", "group");
        group.setAttribute("aria-label", "Zoom");
        const add = (label, iconName, onPress) => {
          const button = el("button", "key key--sq", group);
          button.type = "button";
          button.setAttribute("aria-label", label);
          button.innerHTML = icon(iconName);
          button.addEventListener("click", () => {
            onPress();
            setTimeout(said, 300);
          });
          return button;
        };
        zoomIn = add("Zoom in", "plus", () => map.zoomIn());
        zoomOut = add("Zoom out", "minus", () => map.zoomOut());
        const limits = () => {
          zoomIn.disabled = map.getZoom() >= map.getMaxZoom();
          zoomOut.disabled = map.getZoom() <= map.getMinZoom();
        };
        map.on("zoomend", limits);
        limits();
      }
      if (wanted.includes("reset") && places.length) key(controls, places.length > 1 ? "Show all places" : "Back to the place", "locate-fixed", showAll);
      if (wanted.includes("pan")) {
        const pad = el("div", "map__pan", controls);
        pad.setAttribute("role", "group");
        pad.setAttribute("aria-label", "Move the map");
        const step = () => Math.round(Math.min(canvas.clientWidth, canvas.clientHeight) * 0.4);
        const arrows = [["Move up", "chevron-up", () => [0, -step()], "up"], ["Move left", "chevron-left", () => [-step(), 0], "left"], ["Move right", "chevron-right", () => [step(), 0], "right"], ["Move down", "chevron-down", () => [0, step()], "down"]];
        for (const [label, iconName, delta, where] of arrows) {
          const button = el("button", `key key--sq map__pan-${where}`, pad);
          button.type = "button";
          button.setAttribute("aria-label", label);
          button.innerHTML = icon(iconName);
          button.addEventListener("click", () => map.panBy(delta(), { animate: !quiet }));
        }
      }
      if (places.length > 1 && !figure.dataset.lat) showAll();
      for (const place of places) {
        const actions = place.li.querySelector(".map__place-actions") ?? el("div", "map__place-actions", place.li);
        const button = el("button", "key", actions);
        button.type = "button";
        button.textContent = "Show on map";
        button.setAttribute("aria-label", `Show on map: ${place.name}`);
        button.addEventListener("click", () => {
          map.setView([place.lat, place.lng], Math.max(map.getZoom(), 15), { animate: !quiet });
          place.pin.openPopup();
          place.pin.getElement()?.focus();
        });
      }
      let opener = null;
      map.on("popupopen", (e) => {
        opener = e.popup._source ?? null;
      });
      canvas.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || !canvas.querySelector(".leaflet-popup")) return;
        e.stopPropagation();
        map.closePopup();
        opener?.getElement()?.focus();
      });
      if ("ResizeObserver" in window) new ResizeObserver(() => map.invalidateSize()).observe(canvas);
      figure.simarMap = map;
    };
    const init = (scope = document) => scope.querySelectorAll("figure.map[data-map]").forEach(draw);
    window.SimarUIMaps = { init };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
    else init();
  })();
})();
