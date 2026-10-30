(() => {
  // src/icons.svg
  var icons_default = '<svg xmlns="http://www.w3.org/2000/svg" hidden>\n  <symbol id="i-power" viewBox="0 0 24 24"><path d="M12 2v10" /><path d="M18.4 6.6a9 9 0 1 1-12.77.04" /></symbol>\n  <symbol id="i-play" viewBox="0 0 24 24"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></symbol>\n  <symbol id="i-pause" viewBox="0 0 24 24"><rect x="14" y="3" width="5" height="18" rx="1" /><rect x="5" y="3" width="5" height="18" rx="1" /></symbol>\n  <symbol id="i-skip-back" viewBox="0 0 24 24"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" /><path d="M3 20V4" /></symbol>\n  <symbol id="i-skip-forward" viewBox="0 0 24 24"><path d="M21 4v16" /><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" /></symbol>\n  <symbol id="i-volume-2" viewBox="0 0 24 24"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></symbol>\n  <symbol id="i-list" viewBox="0 0 24 24"><path d="M3 12h.01" /><path d="M3 18h.01" /><path d="M3 6h.01" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M8 6h13" /></symbol>\n  <symbol id="i-circle-check" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></symbol>\n  <symbol id="i-triangle-alert" viewBox="0 0 24 24"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></symbol>\n  <symbol id="i-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></symbol>\n  <symbol id="i-settings" viewBox="0 0 24 24"><path d="M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915" /><circle cx="12" cy="12" r="3" /></symbol>\n  <symbol id="i-align-left" viewBox="0 0 24 24"><path d="M21 5H3" /><path d="M15 12H3" /><path d="M17 19H3" /></symbol>\n  <symbol id="i-align-center" viewBox="0 0 24 24"><path d="M21 5H3" /><path d="M17 12H7" /><path d="M19 19H5" /></symbol>\n  <symbol id="i-align-right" viewBox="0 0 24 24"><path d="M21 5H3" /><path d="M21 12H9" /><path d="M21 19H7" /></symbol>\n  <symbol id="i-align-justify" viewBox="0 0 24 24"><path d="M3 5h18" /><path d="M3 12h18" /><path d="M3 19h18" /></symbol>\n  <symbol id="i-chevron-right" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6" /></symbol>\n  <symbol id="i-chevron-left" viewBox="0 0 24 24"><path d="m15 18-6-6 6-6" /></symbol>\n  <symbol id="i-calendar" viewBox="0 0 24 24"><path d="M8 2v3" /><path d="M16 2v3" /><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /></symbol>\n  <symbol id="i-code" viewBox="0 0 24 24"><path d="m16 18 6-6-6-6" /><path d="m8 6-6 6 6 6" /></symbol>\n  <symbol id="i-copy" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></symbol>\n  <symbol id="i-check" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></symbol>\n  <symbol id="i-monitor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></symbol>\n  <symbol id="i-minus" viewBox="0 0 24 24"><path d="M5 12h14" /></symbol>\n  <symbol id="i-eye" viewBox="0 0 24 24"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></symbol>\n  <symbol id="i-eye-off" viewBox="0 0 24 24"><path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" /><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" /><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" /><path d="m2 2 20 20" /></symbol>\n  <symbol id="i-search" viewBox="0 0 24 24"><path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" /></symbol>\n  <symbol id="i-plus" viewBox="0 0 24 24"><path d="M5 12h14" /><path d="M12 5v14" /></symbol>\n  <symbol id="i-chevron-down" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" /></symbol>\n  <symbol id="i-map-pin" viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></symbol>\n  <symbol id="i-chevron-up" viewBox="0 0 24 24"><path d="m18 15-6-6-6 6" /></symbol>\n  <symbol id="i-locate-fixed" viewBox="0 0 24 24"><line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" /><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" /></symbol>\n  <symbol id="i-circle-alert" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></symbol>\n  <symbol id="i-upload" viewBox="0 0 24 24"><path d="M12 3v12" /><path d="m17 8-5-5-5 5" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /></symbol>\n  <symbol id="i-info" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></symbol>\n  <symbol id="i-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></symbol>\n  <symbol id="i-moon" viewBox="0 0 24 24"><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" /></symbol>\n  <symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></symbol>\n  <symbol id="i-ellipsis" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></symbol>\n  <symbol id="i-star" viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" /></symbol>\n  <symbol id="i-x" viewBox="0 0 24 24"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></symbol>\n</svg>\n';

  // src/tags.js
  var esc = (text) => String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  var attr = (node, name, as = name) => node.hasAttribute(name) ? ` ${as}="${esc(node.getAttribute(name))}"` : "";
  var flag = (node, name) => node.hasAttribute(name) ? ` ${name}` : "";
  var icon = (name) => `<svg class="icon icon--lead" aria-hidden="true"><use href="#i-${esc(name)}"/></svg>`;
  var escText = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  var dedent = (text) => {
    const lines = text.replace(/^\s*\n/, "").replace(/\s+$/, "").split("\n");
    const indent = Math.min(...lines.filter((line) => line.trim()).map((line) => line.match(/^ */)[0].length), Infinity);
    return lines.map((line) => line.slice(Number.isFinite(indent) ? indent : 0)).join("\n");
  };
  var uid = 0;
  var nextId = (prefix) => `simar-${prefix}-${++uid}`;
  var rootAttrs = (node, base) => {
    const classes = [base, node.getAttribute("class")].filter(Boolean).join(" ");
    let out = classes ? ` class="${esc(classes)}"` : "";
    out += attr(node, "style") + attr(node, "lit", "data-lit") + attr(node, "haptic", "data-haptic") + flag(node, "hidden");
    for (const { name, value } of node.attributes) {
      if (name.startsWith("data-")) out += ` ${name}="${esc(value)}"`;
    }
    return out;
  };
  var SPINNERS = {
    ticks: Array.from({ length: 12 }, (_, i) => `<line class="spinner__tick" x1="26" y1="2.6" x2="26" y2="14" transform="rotate(${i * 30} 26 26)"/>`).join(""),
    ring: '<circle class="spinner__track" cx="26" cy="26" r="21"/><circle class="spinner__arc" cx="26" cy="26" r="21" pathLength="100"/>',
    dots: [11, 26, 41].map((x) => `<circle class="spinner__dot" cx="${x}" cy="26" r="4.6"/>`).join(""),
    bars: [8, 17.5, 27, 36.5].map((x) => `<rect class="spinner__bar" x="${x}" y="8" width="6" height="36" rx="3"/>`).join("")
  };
  var rangeAttrs = (node) => ["min", "max", "step", "value", "name", "list"].map((name) => attr(node, name)).join("") + flag(node, "disabled") + attr(node, "unit", "data-unit") + attr(node, "prefix", "data-prefix");
  var swap = (node, html) => {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    node.replaceWith(template.content);
  };
  var each = (scope, tag, build) => scope.querySelectorAll(tag).forEach((node) => swap(node, build(node)));
  var checkLike = (node, isSwitch) => {
    const label = node.getAttribute("label") ?? "";
    const faces = isSwitch ? "" : '<svg class="icon icon--check" aria-hidden="true"><use href="#i-check"/></svg><svg class="icon icon--minus" aria-hidden="true"><use href="#i-minus"/></svg>';
    const attrs = ["name", "value", "form"].map((a) => attr(node, a)).join("") + flag(node, "checked") + flag(node, "disabled") + flag(node, "required") + (node.hasAttribute("indeterminate") ? " data-indeterminate" : "") + attr(node, "tooltip", "data-tooltip") + (isSwitch ? ' role="switch"' : "");
    return `<label${rootAttrs(node, "check")}><span class="well${isSwitch ? " switch" : ""}"><input type="checkbox"${attrs}><span class="key ${isSwitch ? "key--round" : "key--box"}">${faces}</span></span>${label ? `<span class="check__text">${esc(label)}</span>` : ""}</label>`;
  };
  var NATIVE_INPUT_ATTRS = [
    "type",
    "name",
    "value",
    "placeholder",
    "min",
    "max",
    "step",
    "minlength",
    "maxlength",
    "pattern",
    "autocomplete",
    "inputmode",
    "list",
    "accept",
    "size",
    "rows",
    "cols",
    "form"
  ];
  var controlAttrs = (node) => NATIVE_INPUT_ATTRS.map((a) => attr(node, a)).join("") + ["required", "disabled", "readonly", "multiple"].map((a) => flag(node, a)).join("") + attr(node, "error", "data-error") + attr(node, "tooltip", "data-tooltip");
  var fieldShell = (node, kind, control) => {
    const id = node.getAttribute("id") ?? nextId(kind);
    const hint = node.getAttribute("hint");
    const hintId = hint ? `${id}-hint` : "";
    return `<div${rootAttrs(node, "field")}><div class="field__head"><label class="field__label" for="${esc(id)}">${esc(
      node.getAttribute("label") ?? ""
    )}</label>${node.hasAttribute("required") ? '<span class="field__flag">Required</span>' : ""}</div>${control(esc(id), hintId ? ` aria-describedby="${hintId}"` : "")}${hint ? `<p class="field__hint" id="${hintId}">${esc(hint)}</p>` : ""}</div>`;
  };
  var svgIcon = (name, cls = "") => `<svg class="icon${cls ? ` ${cls}` : ""}" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  var builders = {
    // <simar-button icon="play" variant="accent|round|sq" label="Play">Text</simar-button>
    "simar-button": (node) => {
      const text = node.textContent.trim();
      const variant = node.getAttribute("variant");
      const classes = ["key", variant && `key--${variant}`].filter(Boolean).join(" ");
      const name = node.getAttribute("icon");
      const label = node.getAttribute("label") ?? (name && !text ? name : null);
      const extra = ["type", "name", "value", "command", "commandfor", "popovertarget", "form"].map((a) => attr(node, a)).join("") + attr(node, "tooltip", "data-tooltip");
      const type = node.hasAttribute("type") ? "" : ' type="button"';
      return `<span class="well"${rootAttrs(node, "").replace(' class=""', "")}><button class="${classes}"${type}${extra}${flag(node, "disabled")}${label ? ` aria-label="${esc(label)}"` : ""}>${name ? icon(name) : ""}${esc(text)}</button></span>`;
    },
    // <simar-keys name="mode" legend="Mode" size="sq"><simar-key value="a" checked>Auto</simar-key></simar-keys>
    "simar-keys": (node) => {
      const name = node.getAttribute("name") ?? nextId("keys");
      const size = node.getAttribute("size");
      const keys = [...node.querySelectorAll("simar-key")].map((key) => {
        const text = key.textContent.trim();
        const iconName = key.getAttribute("icon");
        const label = key.getAttribute("label") ?? (iconName && !text ? iconName : null);
        return `<label class="well"><input type="radio" name="${esc(name)}"${attr(key, "value")}${attr(key, "tooltip", "data-tooltip")}${flag(key, "checked")}${flag(key, "disabled")}${label ? ` aria-label="${esc(label)}"` : ""}><span class="key${size ? ` key--${esc(size)}` : ""}">${iconName ? icon(iconName).replace(" icon--lead", "") : ""}${esc(text)}</span></label>`;
      });
      const legend = node.getAttribute("legend");
      return legend ? `<fieldset${rootAttrs(node, "panel")}><legend>${esc(legend)}</legend><div class="well-row">${keys.join("")}</div></fieldset>` : `<div${rootAttrs(node, "well-row")} role="radiogroup"${attr(node, "label", "aria-label")}>${keys.join("")}</div>`;
    },
    // <simar-fader label="Brightness" min="0" max="100" value="40" unit="%" marks>
    "simar-fader": (node) => {
      const id = node.getAttribute("id") ?? nextId("fader");
      return `<div${rootAttrs(node, "field")}><div class="field__head"><label class="field__label" for="${esc(id)}">${esc(
        node.getAttribute("label") ?? ""
      )}</label></div><input class="fader" id="${esc(id)}" type="range"${rangeAttrs(node)}${attr(node, "marks", "data-marks")}></div>`;
    },
    // <simar-knob label="Tone" max="3" labels="Flat,Warm,Bright,Punch">
    "simar-knob": (node) => {
      const id = node.getAttribute("id") ?? nextId("knob");
      return `<div${rootAttrs(node, "knob")} data-knob><input id="${esc(id)}" type="range"${rangeAttrs(node)}${attr(node, "ticks", "data-ticks")}${attr(node, "labels", "data-labels")}><label for="${esc(id)}">${esc(
        node.getAttribute("label") ?? ""
      )}</label></div>`;
    },
    // <simar-range label="Price" min="0" max="500" low="120" high="340" prefix="$" name="price">
    "simar-range": (node) => {
      const labelId = nextId("label");
      const label = node.getAttribute("label") ?? "";
      const name = node.getAttribute("name");
      const bounds = ["min", "max", "step"].map((a) => attr(node, a)).join("") + flag(node, "disabled");
      const input = (side) => `<input class="fader" type="range" aria-label="${esc(`${label} ${side}`.trim())}"${bounds}${attr(node, side, "value")}${name ? ` name="${esc(name)}-${side}"` : ""}>`;
      return `<div${rootAttrs(node, "field")}><div class="field__head"><span class="field__label" id="${labelId}">${esc(label)}</span></div>
      <div class="range2" role="group" aria-labelledby="${labelId}" data-range${attr(node, "unit", "data-unit")}${attr(node, "prefix", "data-prefix")}>${input("low")}${input("high")}</div></div>`;
    },
    // <simar-range-knob label="Band" low="25" high="70" unit="%">
    "simar-range-knob": (node) => {
      const labelId = nextId("label");
      const label = node.getAttribute("label") ?? "";
      const name = node.getAttribute("name");
      const bounds = ["min", "max", "step"].map((a) => attr(node, a)).join("") + flag(node, "disabled");
      const input = (side) => `<input type="range" aria-label="${esc(`${label} ${side}`.trim())}"${bounds}${attr(node, side, "value")}${name ? ` name="${esc(name)}-${side}"` : ""}>`;
      return `<div${rootAttrs(node, "rknob")} data-range-knob role="group" aria-labelledby="${labelId}"${attr(node, "unit", "data-unit")}${attr(node, "prefix", "data-prefix")}>${input("low")}${input("high")}<span class="rknob__label" id="${labelId}">${esc(label)}</span></div>`;
    },
    // <simar-tabs label="Project"><simar-tab title="Overview">…</simar-tab><simar-tab title="Details" selected>…</simar-tab></simar-tabs>
    "simar-tabs": (node) => {
      const panels = [...node.querySelectorAll("simar-tab")].map((tab) => {
        const body = tab.innerHTML.trim();
        const content = tab.children.length ? body : `<p>${body}</p>`;
        return `<section class="tabs__panel"${tab.hasAttribute("selected") ? " data-selected" : ""}><h4 class="tabs__title">${esc(tab.getAttribute("title") ?? "")}</h4>${content}</section>`;
      });
      return `<div${rootAttrs(node, "tabs")} data-tabs${attr(node, "label", "data-label")}>${panels.join("")}</div>`;
    },
    // <simar-menu label="Actions"><simar-menu-item>Edit</simar-menu-item><simar-menu-item href="/x">Export</simar-menu-item>
    //   <simar-menu-item danger>Delete</simar-menu-item><simar-menu-separator></simar-menu-separator></simar-menu>
    "simar-menu": (node) => {
      const id = nextId("menu");
      const rows = [...node.children].map((child) => {
        if (child.localName === "simar-menu-separator") return '<li role="separator"></li>';
        const cls = `menu__item${child.hasAttribute("danger") ? " menu__item--danger" : ""}`;
        const dis = child.hasAttribute("disabled") ? ' aria-disabled="true"' : "";
        const inner = esc(child.textContent.trim());
        return child.getAttribute("href") ? `<li><a class="${cls}" href="${esc(child.getAttribute("href"))}"${dis}>${inner}</a></li>` : `<li><button type="button" class="${cls}"${dis}>${inner}</button></li>`;
      });
      return `<div${rootAttrs(node, "menu")}><span class="well"><button type="button" class="key" id="${id}-button" popovertarget="${id}">${esc(node.getAttribute("label") ?? "Menu")}<svg class="icon icon--lead icon--chevron-down" aria-hidden="true"><use href="#i-chevron-down"/></svg></button></span><ul class="menu__list" id="${id}" popover>${rows.join("")}</ul></div>`;
    },
    // <simar-alert variant="success" title="Saved" dismissible>Your changes are in.</simar-alert>
    // variant: info (default), success, warning, danger. danger is announced at once (role="alert").
    "simar-alert": (node) => {
      const variant = ["info", "success", "warning", "danger"].includes(node.getAttribute("variant")) ? node.getAttribute("variant") : "info";
      const iconName = { info: "info", success: "circle-check", warning: "triangle-alert", danger: "circle-alert" }[variant];
      const label = { info: "Information", success: "Success", warning: "Warning", danger: "Error" }[variant];
      const body = node.innerHTML.trim();
      const text = node.children.length ? body : `<p class="alert__text">${body}</p>`;
      return `<div${rootAttrs(node, `alert alert--${variant}`)} role="${variant === "danger" ? "alert" : "status"}"${node.hasAttribute("dismissible") ? " data-dismissible" : ""}><svg class="icon alert__icon" aria-hidden="true"><use href="#i-${iconName}"/></svg><div class="alert__body"><p class="alert__title">${esc(node.getAttribute("title") ?? label)}</p>${text}</div></div>`;
    },
    // <simar-badge variant="success">New</simar-badge>   variant: neutral (default), info, success, warning, danger
    // <simar-badge count>3<span class="visually-hidden"> unread</span></simar-badge>
    "simar-badge": (node) => {
      const variant = ["info", "success", "warning", "danger"].includes(node.getAttribute("variant")) ? ` badge--${node.getAttribute("variant")}` : "";
      return `<span${rootAttrs(node, `badge${variant}${node.hasAttribute("count") ? " badge--count" : ""}`)}>${node.innerHTML}</span>`;
    },
    // <simar-avatars label="On watch"><simar-avatar name="Ellen Ripley"></simar-avatar> … </simar-avatars>
    "simar-avatars": (node) => `<ul${rootAttrs(node, "avatar-group")} role="list" aria-label="${esc(node.getAttribute("label") ?? "")}">${[...node.children].map((child) => `<li>${child.outerHTML}</li>`).join("")}</ul>`,
    // (before simar-avatar, so its avatars are still tags when it builds)
    // <simar-avatar name="Ellen Ripley" initials="ER" size="lg" src="ripley.jpg" square decorative></simar-avatar>
    // A photo (src) or initials (they default to the first letters of the name). decorative hides it from assistive tech,
    // for when the name is written next to it.
    "simar-avatar": (node) => {
      const name = node.getAttribute("name") ?? "";
      const size = ["sm", "lg", "xl"].includes(node.getAttribute("size")) ? ` avatar--${node.getAttribute("size")}` : "";
      const classes = `avatar${size}${node.hasAttribute("square") ? " avatar--square" : ""}`;
      const decorative = node.hasAttribute("decorative");
      if (node.hasAttribute("src")) {
        return `<img${rootAttrs(node, classes)} src="${esc(node.getAttribute("src"))}" alt="${decorative ? "" : esc(name)}">`;
      }
      const initials = node.getAttribute("initials") ?? name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
      return `<span${rootAttrs(node, classes)}${decorative ? ' aria-hidden="true"' : ""}><span aria-hidden="true">${esc(initials)}</span>${decorative ? "" : `<span class="visually-hidden">${esc(name)}</span>`}</span>`;
    },
    // <simar-accordion name="faq"><simar-item title="What is it?" open>Answer…</simar-item></simar-accordion>
    // Items open one at a time (sharing `name`) unless `multiple` is set.
    "simar-accordion": (node) => {
      const group = node.hasAttribute("multiple") ? null : node.getAttribute("name") ?? nextId("accordion");
      const items = [...node.querySelectorAll("simar-item")].map((item) => {
        const body = item.innerHTML.trim();
        const content = item.children.length ? body : `<p>${body}</p>`;
        return `<details class="accordion__item"${group ? ` name="${esc(group)}"` : ""}${flag(item, "open")}><summary><span class="well"><span class="key"><svg class="icon icon--lead icon--chevron" aria-hidden="true"><use href="#i-chevron-right"/></svg>${esc(
          item.getAttribute("title") ?? ""
        )}</span></span></summary><div class="accordion__body">${content}</div></details>`;
      });
      return `<div${rootAttrs(node, "accordion")}>${items.join("")}</div>`;
    },
    // <simar-bottom-nav label="Main"><simar-link href="/crew" icon="eye" current>Crew</simar-link> …</simar-bottom-nav>
    // Three to five places; icon is the name of any library icon. mobile shows it only below the md breakpoint.
    "simar-bottom-nav": (node) => {
      const links = [...node.querySelectorAll("simar-link")].map((link) => `<li><a class="key"${attr(link, "href")}${link.hasAttribute("current") ? ' aria-current="page"' : ""}>${link.hasAttribute("icon") ? `<svg class="icon" aria-hidden="true"><use href="#i-${esc(link.getAttribute("icon"))}"/></svg>` : ""}${escText(link.textContent.trim())}</a></li>`).join("");
      return `<nav${rootAttrs(node, `bottom-nav${node.hasAttribute("mobile") ? " bottom-nav--mobile" : ""}`)} aria-label="${esc(node.getAttribute("label") ?? "Main")}"><ul class="bottom-nav__list">${links}</ul></nav>`;
    },
    // <simar-checklist label="Packing list" all="Select all" done="done"><simar-checkbox label="Passport" name="a"></simar-checkbox>…</simar-checklist>
    "simar-checklist": (node) => {
      const items = [...node.querySelectorAll("simar-checkbox")].map((box) => checkLike(box, false)).join("");
      return `<fieldset${rootAttrs(node, "panel checklist")} data-checklist${attr(node, "all", "data-all")}${attr(node, "done", "data-done")}><legend>${esc(node.getAttribute("label") ?? "")}</legend><div class="check-list">${items}</div></fieldset>`;
    },
    // (before simar-checkbox, so its checkboxes are still tags when it builds)
    // <simar-chips label="Show crew" type="filter" name="show"><simar-chip value="medical" checked>Medical</simar-chip> …</simar-chips>
    // type is filter (checkboxes, the default), choice (radios, one name) or input (values with a Remove key).
    "simar-chips": (node) => {
      const type = node.getAttribute("type") ?? "filter";
      const label = esc(node.getAttribute("label") ?? "");
      const chips = [...node.querySelectorAll("simar-chip")];
      if (type === "input") {
        const items2 = chips.map((chip) => {
          const text = chip.textContent.trim();
          return `<li class="well chip chip--input"><span class="chip__text">${escText(text)}</span><button type="button" class="key key--sq chip__remove" aria-label="Remove ${esc(text)}"><svg class="icon" aria-hidden="true"><use href="#i-x"/></svg></button></li>`;
        }).join("");
        return `<ul${rootAttrs(node, "chips")} aria-label="${label}" data-chips>${items2}</ul>`;
      }
      const radio = type === "choice";
      const name = esc(node.getAttribute("name") ?? nextId("chips"));
      const items = chips.map((chip) => `<label class="chip"><input type="${radio ? "radio" : "checkbox"}" name="${name}"${attr(chip, "value")}${flag(chip, "checked")}${flag(chip, "disabled")}><span class="key">${escText(chip.textContent.trim())}</span></label>`).join("");
      return `<div${rootAttrs(node, "chips")} role="${radio ? "radiogroup" : "group"}" aria-label="${label}">${items}</div>`;
    },
    // <simar-search label="Search the crew" name="q" action="/crew" placeholder="Name or role" value="" button="Search"></simar-search>
    // A search bar: the native <search> landmark and form, with a Search key. The script adds the Clear key.
    "simar-search": (node) => {
      const id = node.getAttribute("id") ?? nextId("search");
      const label = esc(node.getAttribute("label") ?? "Search");
      const action = node.hasAttribute("action") ? ` action="${esc(node.getAttribute("action"))}"` : "";
      return `<search${rootAttrs(node, "searchbar")} aria-label="${label}"><form${action}${attr(node, "method")}><label class="visually-hidden" for="${esc(id)}">${label}</label><span class="searchbar__field">${svgIcon("search", "searchbar__icon")}<input class="input" id="${esc(id)}" name="${esc(node.getAttribute("name") ?? "q")}" type="search"${attr(node, "placeholder")}${attr(node, "value")}${flag(node, "required")} enterkeyhint="search" autocomplete="off"><button type="button" class="searchbar__clear" aria-label="Clear search" aria-controls="${esc(id)}" data-clear hidden>${svgIcon("x")}</button></span><span class="well"><button class="key key--accent" type="submit">${esc(node.getAttribute("button") ?? "Search")}</button></span></form></search>`;
    },
    // <simar-checkbox label="Send me the newsletter" name="news" checked>   (indeterminate for a mixed state)
    // <simar-switch label="Notifications" name="notify">
    "simar-checkbox": (node) => checkLike(node, false),
    "simar-switch": (node) => checkLike(node, true),
    // <simar-input label="Email" type="email" name="email" required hint="Used for receipts" error="Enter an email like name@chrissimari.com">
    // type="password" with reveal adds a show/hide button; type can be text, email, tel, url, search, number,
    // date, time, datetime-local, month or week.
    // Give it <simar-option value="Lisbon"> children (a label is optional) for native suggestions.
    "simar-input": (node) => {
      const password = node.getAttribute("type") === "password" && node.hasAttribute("reveal");
      const options = [...node.querySelectorAll("simar-option")];
      const listId = options.length ? nextId("list") : null;
      const datalist = listId ? `<datalist id="${listId}">${options.map((o) => `<option value="${esc(o.getAttribute("value") ?? o.textContent.trim())}"${o.getAttribute("label") ? ` label="${esc(o.getAttribute("label"))}"` : ""}></option>`).join("")}</datalist>` : "";
      return fieldShell(node, "input", (id, describedby) => {
        const input = `<input class="input" id="${id}"${controlAttrs(node)}${listId ? ` list="${listId}"` : ""}${node.hasAttribute("suggest") ? " data-autocomplete" : ""}${describedby}>${datalist}`;
        if (node.getAttribute("type") === "time" && node.hasAttribute("picker")) {
          return `<div class="timepicker" data-timepicker${attr(node, "minute-step", "data-minute-step")}${attr(node, "hour12", "data-hour12")}>${input}</div>`;
        }
        return password ? `<span class="input-reveal">${input}<button type="button" class="input-reveal__button" aria-label="Show password" aria-pressed="false" aria-controls="${id}" data-reveal>${svgIcon("eye")}</button></span>` : input;
      });
    },
    // <simar-textarea label="Message" name="message" rows="5" maxlength="500">Starting text</simar-textarea>
    "simar-textarea": (node) => fieldShell(node, "textarea", (id, describedby) => `<textarea class="input" id="${id}"${controlAttrs(node)}${describedby}>${escText(node.textContent.trim())}</textarea>`),
    // <simar-select label="Size" name="size"><simar-option value="s">Small</simar-option>...</simar-select>
    // multiple makes a list box; <simar-group label="Group"> makes an optgroup. picker with icon="sun" on the options
    // draws a themed list with an icon beside each choice.
    "simar-select": (node) => {
      const options = (parent) => [...parent.children].map((child) => {
        if (child.tagName === "SIMAR-GROUP") return `<optgroup label="${esc(child.getAttribute("label") ?? "")}">${options(child)}</optgroup>`;
        return `<option${attr(child, "value")}${flag(child, "selected")}${flag(child, "disabled")}${attr(child, "icon", "data-icon")}>${escText(child.textContent.trim())}</option>`;
      }).join("");
      const multiple = node.hasAttribute("multiple");
      return fieldShell(node, "select", (id, describedby) => {
        const select = `<select class="input" id="${id}"${controlAttrs(node)}${flag(node, "picker").replace("picker", "data-picker")}${describedby}>${options(node)}</select>`;
        return multiple ? select : `<span class="select">${select}${svgIcon("chevron-down", "select__icon")}</span>`;
      });
    },
    // <simar-number label="Quantity" name="qty" min="1" max="10" value="2">  (keys on each side; the input still works alone)
    "simar-number": (node) => fieldShell(node, "number", (id, describedby) => {
      const key = (step, label, icon3) => `<span class="well"><button type="button" class="key key--sq" aria-label="${label}" aria-controls="${id}" data-step="${step}">${svgIcon(icon3)}</button></span>`;
      return `<div class="stepper">${key(-1, "Decrease", "minus")}<input class="input" id="${id}" type="number"${controlAttrs(node).replace(/ type="[^"]*"/, "")}${describedby}>${key(1, "Increase", "plus")}</div>`;
    }),
    // <simar-color label="Accent" name="accent" value="#36d27a">
    "simar-color": (node) => fieldShell(node, "color", (id, describedby) => {
      const value = node.getAttribute("value") ?? "#000000";
      return `<span class="color"><input id="${id}" type="color"${controlAttrs(node).replace(/ type="[^"]*"/, "")}${describedby}><output class="lcd" for="${id}">${esc(value)}</output></span>`;
    }),
    // <simar-file label="Attachment" name="file" accept="image/*" multiple>
    "simar-file": (node) => fieldShell(node, "file", (id, describedby) => `<input class="input" id="${id}" type="file"${controlAttrs(node).replace(/ type="[^"]*"/, "")}${describedby}>`),
    // <simar-meter label="Disk used" value="72" min="0" max="100" low="30" high="80" optimum="100">
    "simar-meter": (node) => {
      const id = node.getAttribute("id") ?? nextId("meter");
      const attrs = ["value", "min", "max", "low", "high", "optimum"].map((a) => attr(node, a)).join("");
      return `<div${rootAttrs(node, "field")}><div class="field__head"><label class="field__label" for="${esc(id)}">${esc(node.getAttribute("label") ?? "")}</label></div><meter class="meter" id="${esc(id)}"${attrs}>${esc(node.getAttribute("value") ?? "")}</meter></div>`;
    },
    // <simar-loader label="Uploading" value="64" max="100">   (leave value off for an unknown length)
    "simar-loader": (node) => `<progress${rootAttrs(node, "loader")} aria-label="${esc(node.getAttribute("label") ?? "Loading")}"${attr(node, "value")}${attr(node, "max")}></progress>`,
    // <simar-spinner label="Loading results" variant="ring">   variant: ticks (default), ring, dots, bars
    "simar-spinner": (node) => {
      const variant = SPINNERS[node.getAttribute("variant")] ? node.getAttribute("variant") : "ticks";
      const base = variant === "ticks" ? "spinner" : `spinner spinner--${variant}`;
      return `<span${rootAttrs(node, base)} role="status"><svg class="spinner__art" viewBox="0 0 52 52" aria-hidden="true" focusable="false">${SPINNERS[variant]}</svg><span class="spinner__label">${esc(node.getAttribute("label") ?? "Loading")}</span></span>`;
    },
    // <simar-code lang="html" label="Example">…</simar-code>
    // Put the code in a <template> or <script type="text/plain"> child to write it unescaped;
    // plain text works too (escape < as &lt;). Add `nocopy` to leave the copy button off, `nolines` the line numbers.
    "simar-code": (node) => {
      const source = node.querySelector(':scope > template, :scope > script[type="text/plain"]');
      const raw = source ? source.tagName === "TEMPLATE" ? source.innerHTML : source.textContent : node.children.length ? node.innerHTML : node.textContent;
      const lang = node.getAttribute("lang");
      const label = node.getAttribute("label") ?? (lang ? lang.toUpperCase() : "");
      return `<figure${rootAttrs(node, "code")}${flag(node, "nocopy").replace(" nocopy", " data-nocopy")}${flag(node, "nolines").replace(" nolines", " data-nolines")}>${label ? `<figcaption class="code__label">${esc(label)}</figcaption>` : ""}<div class="code__body"><pre tabindex="0"${lang ? ` data-lang="${esc(lang)}"` : ""}><code>${escText(dedent(raw))}</code></pre></div></figure>`;
    },
    // <simar-date-range from="2026-11-02" to="2026-11-09" min="2026-10-26" months="2" max-span="14" name="stay">
    "simar-date-range": (node) => {
      const name = node.getAttribute("name");
      const field = (side, label) => `<label class="daterange__field"><span class="field__label">${esc(
        node.getAttribute(`${side}-label`) ?? label
      )}</span><input type="date"${attr(node, "min")}${attr(node, "max")}${attr(node, side, "value")}${name ? ` name="${esc(name)}-${side}"` : ""}${flag(node, "required")}></label>`;
      return `<div${rootAttrs(node, "daterange")} data-daterange${attr(node, "months", "data-months")}${attr(node, "max-span", "data-max-span")}${attr(node, "first-day", "data-first-day")}>${field("from", "From")}${field("to", "To")}</div>`;
    }
  };
  var expandTags = (scope = document) => {
    for (const [tag, build] of Object.entries(builders)) each(scope, tag, build);
  };

  // src/audit.js
  var seen = /* @__PURE__ */ new WeakSet();
  var hasName = (node) => {
    if (node.getAttribute("aria-label")?.trim()) return true;
    const by = node.getAttribute("aria-labelledby");
    if (by && by.split(/\s+/).some((id) => document.getElementById(id)?.textContent.trim())) return true;
    if (node.labels && [...node.labels].some((label) => label.textContent.trim())) return true;
    if (node.matches("button, summary") && node.textContent.trim()) return true;
    return Boolean(node.getAttribute("title")?.trim());
  };
  var report = (node, problem) => {
    if (seen.has(node)) return;
    seen.add(node);
    node.setAttribute("data-a11y-issue", problem);
    console.warn(`[simar-ui] accessibility: ${problem}`, node);
  };
  var checks = [
    [
      'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]), select, textarea, meter, progress',
      "has no accessible name. Add a label (a <label for>, a wrapping <label>, or aria-label), or give the tag a label attribute."
    ],
    [
      "button, summary",
      "has no accessible name. Icon-only buttons need an aria-label (or a label attribute on the tag)."
    ],
    [
      "dialog",
      "has no accessible name. Add aria-labelledby pointing at its heading, or aria-label."
    ]
  ];
  var audit = (scope = document) => {
    const hidden = (node) => node.closest('[hidden], [aria-hidden="true"], template, script, .needs-js:not([data-js] *)');
    let problems = 0;
    for (const [selector, problem] of checks) {
      for (const node of scope.querySelectorAll(selector)) {
        if (hidden(node) || hasName(node)) continue;
        report(node, problem);
        problems++;
      }
    }
    for (const pre of scope.querySelectorAll(".code pre")) {
      if (pre.hasAttribute("tabindex")) continue;
      report(pre, 'scrolls but cannot take keyboard focus. Add tabindex="0" to the <pre>.');
      problems++;
    }
    const local = location.protocol === "file:" || ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
    if ((local || location.search.includes("a11y")) && !document.documentElement.dataset.a11y) {
      document.documentElement.dataset.a11y = "show";
    }
    return problems;
  };

  // src/simar-ui.js
  var ARC = 270;
  var START = -ARC / 2;
  var el = (tag, className, parent) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (parent) parent.append(node);
    return node;
  };
  var num = (value, fallback) => value === "" || Number.isNaN(+value) ? fallback : +value;
  var pointerAngle = (dial, e) => {
    const box = dial.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    return Math.atan2(dx, -dy) * 180 / Math.PI;
  };
  var metrics = (input) => {
    const min = num(input.min, 0);
    const max = num(input.max, 100);
    const step = num(input.step, 1);
    return { min, max, step, span: max - min };
  };
  var readout = (input, labels) => {
    const { min, step } = metrics(input);
    const value = +input.value;
    const text = labels ? labels[Math.round((value - min) / step)] : value;
    return `${input.dataset.prefix || ""}${text}${labels ? "" : input.dataset.unit || ""}`;
  };
  var snap = ({ min, max, step }, raw) => {
    const clamped = Math.min(max, Math.max(min, raw));
    return +(Math.round((clamped - min) / step) * step + min).toFixed(6);
  };
  var setValue = (input, value) => {
    if (String(value) === input.value) return;
    input.value = value;
    input.dispatchEvent(new Event("input", { bubbles: true }));
  };
  var enhanceFaders = (claim) => {
    for (const input of claim("input.fader")) {
      if (input.closest("[data-range]")) continue;
      const head = input.closest(".field")?.querySelector(".field__head");
      const out = head && el("output", "lcd", head);
      out?.setAttribute("aria-hidden", "true");
      const sync = () => {
        const { min, span } = metrics(input);
        input.style.setProperty("--frac", (input.value - min) / span);
        if (out) out.value = readout(input);
      };
      input.addEventListener("input", sync);
      sync();
      if ("marks" in input.dataset) {
        const { step, span } = metrics(input);
        const count = num(input.dataset.marks, Math.round(span / step) + 1);
        const marks = el("div", "marks", input.closest(".field"));
        for (let i = 0; i < count; i++) el("i", "", marks).style.setProperty("--f", i / (count - 1));
      }
    }
  };
  var enhanceRanges = (claim) => {
    for (const root of claim("[data-range]")) {
      const [lower, upper] = root.querySelectorAll('input[type="range"]');
      const head = root.closest(".field")?.querySelector(".field__head");
      const out = head && el("output", "lcd", head);
      out?.setAttribute("aria-hidden", "true");
      const { prefix = "", unit = "" } = root.dataset;
      root.classList.add("is-enhanced");
      const sync = (changed) => {
        const { min, span } = metrics(lower);
        if (+lower.value > +upper.value) changed.value = (changed === lower ? upper : lower).value;
        const lo = (lower.value - min) / span;
        root.style.setProperty("--lo", lo);
        root.style.setProperty("--hi", (upper.value - min) / span);
        lower.style.zIndex = lo > 0.5 ? 2 : 1;
        upper.style.zIndex = lo > 0.5 ? 1 : 2;
        if (out) out.value = `${prefix}${lower.value}${unit} \u2013 ${prefix}${upper.value}${unit}`;
      };
      lower.addEventListener("input", () => sync(lower));
      upper.addEventListener("input", () => sync(upper));
      sync(lower);
      root.addEventListener("pointerdown", (e) => {
        if (e.target !== root) return;
        const bounds = metrics(lower);
        const box = root.getBoundingClientRect();
        const cap = 30;
        const frac = Math.min(1, Math.max(0, (e.clientX - box.left - cap / 2) / (box.width - cap)));
        const raw = bounds.min + frac * bounds.span;
        const [lo, hi] = [+lower.value, +upper.value];
        const target = lo === hi ? raw > lo ? upper : lower : Math.abs(raw - lo) <= Math.abs(raw - hi) ? lower : upper;
        const held = target === lower ? Math.min(raw, hi) : Math.max(raw, lo);
        setValue(target, snap(bounds, held));
        target.focus({ preventScroll: true });
        target.dispatchEvent(new Event("change", { bubbles: true }));
      });
    }
  };
  var enhanceRangeKnobs = (claim) => {
    for (const root of claim("[data-range-knob]")) {
      const [lower, upper] = root.querySelectorAll('input[type="range"]');
      const label = root.querySelector(".rknob__label");
      const bounds = metrics(lower);
      const { min, span } = bounds;
      const { prefix = "", unit = "" } = root.dataset;
      const fmt = (value) => `${prefix}${value}${unit}`;
      root.classList.add("is-enhanced");
      const arc = "M43.43 156.57A80 80 0 1 1 156.57 156.57";
      const dial = el("div", "rknob__dial");
      dial.setAttribute("aria-hidden", "true");
      dial.innerHTML = `<svg class="rknob__arc" viewBox="0 0 200 200">
      <path class="rknob__lip" d="${arc}"/><path class="rknob__groove" d="${arc}"/>
      <path class="rknob__floor" d="${arc}"/><path class="rknob__lit" pathLength="270" d="${arc}"/>
    </svg>`;
      const lit = dial.querySelector(".rknob__lit");
      const out = el("output", "lcd", dial);
      [fmt(min), fmt(bounds.max)].forEach((text, i) => {
        const bound = el("span", "rknob__bound", dial);
        bound.style.left = i ? "78.3%" : "21.7%";
        bound.textContent = text;
      });
      const handles = [lower, upper].map((input, i) => {
        const handle = el("div", `rknob__handle rknob__handle--${i ? "hi" : "lo"}`, dial);
        el("div", "rknob__cap", handle);
        return handle;
      });
      label.before(dial);
      dial.addEventListener("pointerdown", (e) => {
        if (e.target.closest(".rknob__handle")) return;
        const angle = pointerAngle(dial, e);
        if (Math.abs(angle) > ARC / 2) return;
        const raw = min + (angle - START) / ARC * span;
        const [lo, hi] = [+lower.value, +upper.value];
        const target = lo === hi ? raw > lo ? upper : lower : Math.abs(raw - lo) <= Math.abs(raw - hi) ? lower : upper;
        const held = target === lower ? Math.min(raw, hi) : Math.max(raw, lo);
        setValue(target, snap(bounds, held));
        target.focus({ preventScroll: true });
        target.dispatchEvent(new Event("change", { bubbles: true }));
      });
      const render = () => {
        const lo = (lower.value - min) / span;
        const hi = (upper.value - min) / span;
        [lo, hi].forEach((frac, i) => handles[i].style.setProperty("--a", `${START + ARC * frac}deg`));
        lit.style.strokeDasharray = `${ARC * (hi - lo)} 1000`;
        lit.style.strokeDashoffset = -ARC * lo;
        handles[0].style.zIndex = lo > 0.5 ? 2 : 1;
        handles[1].style.zIndex = lo > 0.5 ? 1 : 2;
        out.value = `${fmt(lower.value)}\u2013${fmt(upper.value)}`;
        lower.setAttribute("aria-valuetext", fmt(lower.value));
        upper.setAttribute("aria-valuetext", fmt(upper.value));
      };
      const moveTo = (input, raw) => {
        const held = input === lower ? Math.min(raw, +upper.value) : Math.max(raw, +lower.value);
        setValue(input, snap(bounds, held));
      };
      [lower, upper].forEach((input, i) => {
        const handle = handles[i];
        let angle = null;
        input.addEventListener("input", () => {
          if (+lower.value > +upper.value) (input === lower ? upper : lower).value = input.value;
          render();
        });
        handle.addEventListener("pointerdown", (e) => {
          handle.setPointerCapture(e.pointerId);
          handle.classList.add("is-active");
          input.focus({ preventScroll: true });
          angle = START + ARC * ((input.value - min) / span);
        });
        handle.addEventListener("pointermove", (e) => {
          if (angle === null) return;
          const pointer = pointerAngle(dial, e);
          angle = Math.abs(pointer) <= ARC / 2 ? pointer : Math.sign(angle) * (ARC / 2);
          moveTo(input, min + (angle - START) / ARC * span);
        });
        const end = () => {
          if (angle === null) return;
          angle = null;
          handle.classList.remove("is-active");
          input.dispatchEvent(new Event("change", { bubbles: true }));
        };
        handle.addEventListener("pointerup", end);
        handle.addEventListener("pointercancel", end);
      });
      render();
    }
  };
  var enhanceKnobs = (claim) => {
    for (const root of claim("[data-knob]")) {
      const input = root.querySelector('input[type="range"]');
      const label = root.querySelector("label");
      const bounds = metrics(input);
      const { min, step, span } = bounds;
      const labels = input.dataset.labels?.split(",");
      const count = labels ? labels.length : num(input.dataset.ticks, 11);
      const stepped = Boolean(labels);
      root.classList.add("is-enhanced");
      root.classList.toggle("is-stepped", stepped);
      const dial = el("div", "knob__dial");
      dial.setAttribute("aria-hidden", "true");
      const ticks = [];
      const tickLabels = [];
      for (let i = 0; i < count; i++) {
        const angle = START + ARC * i / (count - 1);
        const tick = el("span", "knob__tick", dial);
        tick.style.setProperty("--t", `${angle}deg`);
        ticks.push(tick);
        if (labels) {
          const text = el("span", "knob__tick-label", dial);
          text.style.setProperty("--t", `${angle}deg`);
          text.textContent = labels[i];
          tickLabels.push(text);
        }
      }
      const well = el("div", "knob__well", dial);
      const cap = el("div", "knob__cap", well);
      el("div", "knob__face", cap);
      el("div", "knob__dish", cap);
      const out = el("output", "lcd");
      out.setAttribute("aria-hidden", "true");
      label.before(dial, out);
      const render = () => {
        const frac = (input.value - min) / span;
        dial.style.setProperty("--a", `${START + ARC * frac}deg`);
        const text = readout(input, labels);
        out.value = text;
        if (labels || input.dataset.unit || input.dataset.prefix) input.setAttribute("aria-valuetext", text);
        ticks.forEach((tick, i) => {
          const at = i / (count - 1);
          tick.classList.toggle("is-lit", stepped ? Math.abs(at - frac) < 1e-6 : at <= frac + 1e-6);
        });
        tickLabels.forEach((tickLabel, i) => {
          tickLabel.classList.toggle("is-active", Math.abs(i / (count - 1) - frac) < 1e-6);
        });
      };
      const set = (raw) => setValue(input, snap(bounds, raw));
      const travel = stepped ? 50 * (count - 1) : 220;
      let drag = null;
      dial.addEventListener("pointerdown", (e) => {
        const picked = tickLabels.indexOf(e.target.closest(".knob__tick-label"));
        if (picked >= 0) {
          input.focus({ preventScroll: true });
          set(min + picked * step);
          input.dispatchEvent(new Event("change", { bubbles: true }));
          return;
        }
        if (!e.target.closest(".knob__well")) {
          const angle = pointerAngle(dial, e);
          if (Math.abs(angle) <= ARC / 2) {
            input.focus({ preventScroll: true });
            set(min + (angle - START) / ARC * span);
            input.dispatchEvent(new Event("change", { bubbles: true }));
          }
          return;
        }
        dial.setPointerCapture(e.pointerId);
        input.focus({ preventScroll: true });
        drag = { x: e.clientX, y: e.clientY, from: +input.value };
      });
      dial.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const pixels = e.clientX - drag.x - (e.clientY - drag.y);
        set(drag.from + pixels / (travel * (e.shiftKey ? 4 : 1)) * span);
      });
      const end = () => {
        if (!drag) return;
        drag = null;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      dial.addEventListener("pointerup", end);
      dial.addEventListener("pointercancel", end);
      dial.addEventListener("dblclick", () => set(num(input.defaultValue, min)));
      dial.addEventListener("wheel", (e) => {
        if (document.activeElement !== input) return;
        e.preventDefault();
        set(+input.value + (e.deltaY < 0 ? step : -step));
      }, { passive: false });
      input.addEventListener("input", render);
      render();
    }
  };
  var enhanceDialogs = (claim) => {
    if (!("command" in HTMLButtonElement.prototype)) {
      for (const trigger of claim("[data-dialog-open]")) {
        trigger.addEventListener("click", () => document.getElementById(trigger.dataset.dialogOpen).showModal());
      }
    }
    for (const dialog of claim("dialog")) {
      const out = dialog.id && document.querySelector(`output[for="${dialog.id}"]`);
      dialog.addEventListener("click", (e) => {
        if (e.target === dialog) dialog.close("dismissed");
      });
      dialog.addEventListener("cancel", () => {
        dialog.returnValue = "dismissed";
      });
      dialog.addEventListener("close", () => {
        if (!out) return;
        const how = dialog.returnValue || "dismissed";
        const form = dialog.querySelector("form");
        const values = form && !["", "cancel", "dismissed"].includes(how) ? [...new FormData(form).values()] : [];
        out.value = values.length ? `${how}: ${values.join(", ")}` : how;
      });
    }
  };
  var enhanceEmbeds = (claim) => {
    for (const embed of claim(".embed")) {
      const frame = embed.querySelector(":scope > iframe, :scope > embed, :scope > object");
      if (!frame) continue;
      const sync = () => embed.classList.toggle("is-focused", document.activeElement === frame);
      addEventListener("blur", () => setTimeout(sync));
      addEventListener("focus", sync);
      document.addEventListener("focusin", sync);
      frame.addEventListener("focus", sync);
      frame.addEventListener("blur", sync);
    }
  };
  var enhanceSpeedDials = (claim) => {
    for (const dial of claim(".speed-dial")) {
      const toggle = dial.querySelector(":scope > summary");
      if (!toggle) continue;
      const close = (refocus) => {
        if (!dial.open) return;
        dial.open = false;
        if (refocus) toggle.focus();
      };
      dial.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || !dial.open) return;
        e.preventDefault();
        e.stopPropagation();
        close(true);
      });
      dial.addEventListener("click", (e) => {
        if (e.target.closest(".speed-dial__list a, .speed-dial__list button")) close(false);
      });
      dial.addEventListener("focusout", (e) => {
        if (e.relatedTarget && !dial.contains(e.relatedTarget)) close(false);
      });
      document.addEventListener("pointerdown", (e) => {
        if (!dial.contains(e.target)) close(false);
      });
    }
  };
  var swipeLists = 0;
  var enhanceSwipeLists = (claim) => {
    for (const list of claim("[data-swipe-list]")) {
      const index = swipeLists++;
      const items = [...list.querySelectorAll(":scope > .swipe-list__item")];
      list.classList.add("is-enhanced");
      const set = (item, open) => {
        const main = item.querySelector(".swipe-list__main");
        const sign = getComputedStyle(item).direction === "rtl" ? 1 : -1;
        item.classList.toggle("is-open", open);
        item.querySelector(".swipe-list__toggle").setAttribute("aria-expanded", String(open));
        main.style.setProperty("--swipe-x", open ? `${sign * item.querySelector(".swipe-list__actions").offsetWidth}px` : "0px");
      };
      const closeAll = (except) => {
        for (const other of items) if (other !== except && other.classList.contains("is-open")) set(other, false);
      };
      items.forEach((item, n) => {
        const main = item.querySelector(".swipe-list__main");
        const actions = item.querySelector(".swipe-list__actions");
        if (!main || !actions) return;
        actions.id ||= `swipe-list-${index}-${n}`;
        const name = item.querySelector(".swipe-list__text")?.textContent.trim() ?? "";
        const label = el("div", "swipe-list__label");
        label.append(...main.childNodes);
        main.append(label);
        const toggle = el("button", "swipe-list__toggle", main);
        toggle.type = "button";
        toggle.setAttribute("aria-label", `Actions for ${name}`);
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-controls", actions.id);
        toggle.innerHTML = icon2("ellipsis");
        toggle.addEventListener("click", () => {
          const open = !item.classList.contains("is-open");
          closeAll(item);
          set(item, open);
        });
        let start = null;
        let swallow = false;
        const settle = (x) => {
          main.classList.remove("is-dragging");
          item.classList.remove("is-dragging");
          const width = actions.offsetWidth;
          set(item, Math.abs(x) >= width / 2);
        };
        main.addEventListener("pointerdown", (e) => {
          if (e.pointerType === "mouse" || !e.isPrimary) return;
          closeAll(item);
          const sign = getComputedStyle(item).direction === "rtl" ? 1 : -1;
          start = { id: e.pointerId, x: e.clientX, y: e.clientY, base: item.classList.contains("is-open") ? sign * actions.offsetWidth : 0, sign, moved: false, now: 0 };
        });
        main.addEventListener("pointermove", (e) => {
          if (!start || e.pointerId !== start.id) return;
          const dx = e.clientX - start.x;
          if (!start.moved) {
            if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(e.clientY - start.y)) return;
            start.moved = true;
            main.classList.add("is-dragging");
            item.classList.add("is-dragging");
            main.setPointerCapture?.(e.pointerId);
          }
          const width = actions.offsetWidth;
          start.now = start.sign < 0 ? Math.min(0, Math.max(-width, start.base + dx)) : Math.max(0, Math.min(width, start.base + dx));
          main.style.setProperty("--swipe-x", `${start.now}px`);
        });
        const finish = () => {
          if (!start) return;
          const done = start;
          start = null;
          if (!done.moved) return;
          swallow = true;
          setTimeout(() => {
            swallow = false;
          });
          settle(done.now);
        };
        main.addEventListener("pointerup", finish);
        main.addEventListener("pointercancel", finish);
        main.addEventListener("click", (e) => {
          if (swallow) {
            e.preventDefault();
            e.stopPropagation();
          }
        }, true);
      });
      list.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        const item = e.target.closest(".swipe-list__item.is-open");
        if (!item) return;
        e.preventDefault();
        e.stopPropagation();
        set(item, false);
        item.querySelector(".swipe-list__toggle").focus();
      });
      list.addEventListener("click", (e) => {
        const item = e.target.closest(".swipe-list__item");
        if (item && e.target.closest(".swipe-list__actions a, .swipe-list__actions button")) set(item, false);
      });
      list.addEventListener("focusout", (e) => {
        const item = e.target.closest(".swipe-list__item.is-open");
        if (item && e.relatedTarget && !item.contains(e.relatedTarget)) set(item, false);
      });
      document.addEventListener("pointerdown", (e) => {
        if (!list.contains(e.target)) closeAll();
      });
      addEventListener("resize", () => {
        for (const item of items) if (item.classList.contains("is-open")) set(item, true);
      });
    }
  };
  var wizards = 0;
  var enhanceWizards = (claim) => {
    for (const form of claim("[data-wizard]")) {
      const steps = [...form.querySelectorAll(":scope > .wizard__step")];
      if (steps.length < 2) continue;
      wizards++;
      let current = 0;
      form.classList.add("is-enhanced");
      const list = el("ol", "steps");
      list.setAttribute("aria-label", form.dataset.label || "Steps");
      steps[0].before(list);
      const names = steps.map((step) => step.querySelector(":scope > legend")?.textContent.trim() ?? "");
      const items = names.map((name) => {
        const item = el("li", "steps__item", list);
        item.innerHTML = '<span class="steps__mark" aria-hidden="true"></span><span class="steps__label"></span>';
        item.querySelector(".steps__label").textContent = name;
        return item;
      });
      const nav = el("div", "wizard__nav", form);
      nav.innerHTML = '<span class="well" data-back-well><button type="button" class="key" data-back>Back</button></span><p class="wizard__status"></p><span class="well" data-next-well><button type="button" class="key key--accent" data-next>Next</button></span>';
      const status = nav.querySelector(".wizard__status");
      const hint = (text) => {
        const span = el("span", "visually-hidden");
        span.textContent = text;
        return span;
      };
      const show = (n, focus) => {
        current = n;
        steps.forEach((step, i) => {
          step.hidden = i !== n;
        });
        items.forEach((item, i) => {
          const mark = item.querySelector(".steps__mark");
          const label = item.querySelector(".steps__label");
          label.querySelector(".visually-hidden")?.remove();
          item.classList.toggle("is-done", i < n);
          item.classList.toggle("is-current", i === n);
          if (i === n) item.setAttribute("aria-current", "step");
          else item.removeAttribute("aria-current");
          mark.innerHTML = i < n ? icon2("check") : String(i + 1);
          if (i < n) label.append(hint(", completed"));
          if (i === n) label.append(hint(", current step"));
        });
        status.textContent = `Step ${n + 1} of ${steps.length}`;
        nav.querySelector("[data-back-well]").hidden = n === 0;
        nav.querySelector("[data-next-well]").hidden = n === steps.length - 1;
        if (focus) {
          const legend = steps[n].querySelector(":scope > legend");
          if (legend) {
            legend.tabIndex = -1;
            legend.focus();
          }
        }
        form.dispatchEvent(new CustomEvent("wizard:step", { bubbles: true, detail: { step: n, name: names[n] } }));
      };
      const next = () => {
        for (const field of steps[current].querySelectorAll("input, select, textarea")) {
          if (!field.checkValidity()) {
            field.reportValidity();
            return;
          }
        }
        if (current < steps.length - 1) show(current + 1, true);
      };
      nav.querySelector("[data-next]").addEventListener("click", next);
      nav.querySelector("[data-back]").addEventListener("click", () => {
        if (current > 0) show(current - 1, true);
      });
      form.addEventListener("submit", (e) => {
        if (current >= steps.length - 1) return;
        e.preventDefault();
        e.stopImmediatePropagation();
        next();
      }, true);
      show(0, false);
    }
  };
  var enhanceRefresh = (claim) => {
    for (const root of claim("[data-refresh]")) {
      const key = root.querySelector("[data-refresh-key]");
      const body = root.querySelector(".refresh__body");
      const status = root.querySelector(".refresh__status");
      if (!key || !body || !status) continue;
      root.classList.add("is-enhanced");
      let busy = false;
      const finish = (message) => {
        busy = false;
        body.removeAttribute("aria-busy");
        status.textContent = message || `Updated at ${(/* @__PURE__ */ new Date()).toLocaleTimeString(document.documentElement.lang || void 0, { hour: "numeric", minute: "2-digit" })}`;
      };
      const start = () => {
        if (busy) return;
        busy = true;
        body.setAttribute("aria-busy", "true");
        status.textContent = "Refreshing...";
        let waiting = false;
        root.dispatchEvent(new CustomEvent("refresh", { bubbles: true, detail: { wait: () => {
          waiting = true;
        }, done: finish } }));
        if (!waiting) finish();
      };
      key.addEventListener("click", start);
      let from = null;
      let pull = 0;
      const settle = () => {
        body.classList.remove("is-pulling");
        body.style.setProperty("--pull", "0px");
      };
      body.addEventListener("touchstart", (e) => {
        from = body.scrollTop === 0 && e.touches.length === 1 ? e.touches[0].clientY : null;
        pull = 0;
      }, { passive: true });
      body.addEventListener("touchmove", (e) => {
        if (from === null) return;
        const dy = e.touches[0].clientY - from;
        if (dy <= 0 || body.scrollTop > 0) {
          from = null;
          settle();
          return;
        }
        pull = Math.min(dy * 0.5, 72);
        body.classList.add("is-pulling");
        body.style.setProperty("--pull", `${pull}px`);
      }, { passive: true });
      const release = () => {
        const pulled = pull;
        from = null;
        pull = 0;
        settle();
        if (pulled >= 56) start();
      };
      body.addEventListener("touchend", release);
      body.addEventListener("touchcancel", release);
    }
  };
  var enhanceSideMenus = (claim) => {
    for (const menu of claim("[data-side-menu]")) {
      const toggle = menu.querySelector(".side-menu__toggle");
      const panel = menu.querySelector(".side-menu__panel");
      if (!toggle || !panel) continue;
      const docked = menu.classList.contains("side-menu--docked") ? matchMedia("(min-width: 75rem)") : null;
      const isDocked = () => Boolean(docked?.matches);
      const set = (open) => {
        panel.hidden = !open && !isDocked();
        toggle.setAttribute("aria-expanded", String(!panel.hidden && !isDocked()));
      };
      menu.classList.add("is-enhanced");
      set(false);
      docked?.addEventListener("change", () => set(false));
      toggle.addEventListener("click", () => set(panel.hidden));
      menu.addEventListener("side-menu:open", () => set(true));
      menu.addEventListener("side-menu:close", () => set(false));
      menu.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || panel.hidden || isDocked()) return;
        set(false);
        toggle.focus();
      });
      if (menu.hasAttribute("data-close-on-select")) {
        panel.addEventListener("click", (e) => {
          if (e.target.closest("a") && !isDocked()) set(false);
        });
      }
      let pressing = false;
      menu.addEventListener("pointerdown", () => {
        pressing = true;
      });
      addEventListener("pointerup", () => setTimeout(() => {
        pressing = false;
      }));
      menu.addEventListener("focusout", (e) => {
        if (pressing || isDocked() || panel.hidden || menu.contains(e.relatedTarget)) return;
        set(false);
      });
    }
  };
  var pad = (n) => String(n).padStart(2, "0");
  var iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  var parseISO = (text) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return null;
    const [y, m, d] = text.split("-").map(Number);
    return new Date(y, m - 1, d);
  };
  var addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  var monthStart = (d, offset = 0) => new Date(d.getFullYear(), d.getMonth() + offset, 1);
  var daysBetween = (a, b) => Math.round((b - a) / 864e5);
  var icon2 = (name) => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
  var dateRanges = 0;
  var enhanceDateRanges = (claim) => {
    for (const root of claim("[data-daterange]")) {
      const index = dateRanges++;
      const [startInput, endInput] = root.querySelectorAll('input[type="date"]');
      const months = num(root.dataset.months, 1);
      const firstDay = num(root.dataset.firstDay, 0);
      const maxSpan = num(root.dataset.maxSpan, Infinity);
      const minDate = parseISO(startInput.min);
      const maxDate = parseISO(endInput.max) ?? parseISO(startInput.max);
      const now = /* @__PURE__ */ new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const lang = document.documentElement.lang || void 0;
      const monthName = new Intl.DateTimeFormat(lang, { month: "long", year: "numeric" });
      const shortDate = new Intl.DateTimeFormat(lang, { month: "short", day: "numeric" });
      const weekday = new Intl.DateTimeFormat(lang, { weekday: "short" });
      const fullDate = new Intl.DateTimeFormat(lang, { dateStyle: "full" });
      let start = parseISO(startInput.value);
      let end = parseISO(endInput.value);
      let pending = Boolean(start && !end);
      let view = monthStart(start ?? (minDate && minDate > today ? minDate : today));
      root.classList.add("is-enhanced");
      const tools = el("div", "daterange__tools", root);
      const toggleWell = el("span", "well", tools);
      const toggle = el("button", "key key--sq", toggleWell);
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Choose dates");
      toggle.setAttribute("aria-expanded", "false");
      toggle.dataset.tooltip = "Choose dates";
      toggle.innerHTML = icon2("calendar");
      const summary = el("output", "lcd", tools);
      const pop = el("div", "daterange__pop cal", root);
      pop.id = `daterange-${index}`;
      pop.setAttribute("popover", "");
      pop.setAttribute("role", "dialog");
      pop.setAttribute("aria-label", "Choose dates");
      toggle.setAttribute("popovertarget", pop.id);
      const body = el("div", "cal__months", pop);
      const foot = el("div", "cal__foot", pop);
      foot.innerHTML = `<span class="well"><button type="button" class="key" data-clear>Clear</button></span>
      <span class="well"><button type="button" class="key key--accent" data-done>Done</button></span>`;
      const inBounds = (d) => (!minDate || d >= minDate) && (!maxDate || d <= maxDate);
      const allowed = (d) => inBounds(d) && (!pending || d < start || daysBetween(start, d) < maxSpan);
      const describe = () => {
        if (!start) return "no dates";
        if (!end) return `${shortDate.format(start)} \u2013 \u2026`;
        const days = daysBetween(start, end) + 1;
        return `${shortDate.format(start)} \u2013 ${shortDate.format(end)} \xB7 ${days} ${days === 1 ? "day" : "days"}`;
      };
      const writeInputs = () => {
        startInput.value = start ? iso(start) : "";
        endInput.value = end ? iso(end) : "";
        endInput.min = start ? iso(start) : startInput.min;
        summary.value = describe();
        for (const input of [startInput, endInput]) input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      const dayButton = (d) => {
        const isStart = start && +d === +start;
        const isEnd = end && +d === +end;
        const inRange = start && end && d > start && d < end;
        const multiDay = start && end && +start !== +end;
        const classes = [
          "day",
          isStart && "is-start",
          isEnd && "is-end",
          inRange && "is-range",
          isStart && multiDay && "is-range-start",
          isEnd && multiDay && "is-range-end",
          +d === +today && "is-today"
        ].filter(Boolean).join(" ");
        return `<button type="button" class="${classes}" data-date="${iso(d)}" tabindex="-1"
        aria-pressed="${Boolean(isStart || isEnd)}" aria-label="${fullDate.format(d)}"${allowed(d) ? "" : " disabled"}>${d.getDate()}</button>`;
      };
      const nav = (dir) => `<span class="well"><button type="button" class="key key--sq" data-nav="${dir}"
      aria-label="${dir < 0 ? "Previous" : "Next"} month">${icon2(dir < 0 ? "chevron-left" : "chevron-right")}</button></span>`;
      const cell = (key) => body.querySelector(`[data-date="${key}"]:not(:disabled)`);
      let navTips = [];
      const render = (focusKey) => {
        const parts = [];
        for (let m = 0; m < months; m++) {
          const first = monthStart(view, m);
          const length = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
          let cells = "";
          for (let i = 0; i < 7; i++) {
            cells += `<span class="cal__dow" aria-hidden="true">${weekday.format(new Date(2023, 0, 1 + (firstDay + i) % 7))}</span>`;
          }
          cells += "<span></span>".repeat((first.getDay() - firstDay + 7) % 7);
          for (let n = 1; n <= length; n++) cells += dayButton(new Date(first.getFullYear(), first.getMonth(), n));
          const title = monthName.format(first);
          parts.push(`<div class="cal__month"><div class="cal__head">${m === 0 ? nav(-1) : "<span></span>"}
          <span class="cal__title">${title}</span>${m === months - 1 ? nav(1) : "<span></span>"}</div>
          <div class="cal__grid" role="group" aria-label="${title}">${cells}</div></div>`);
        }
        body.innerHTML = parts.join("");
        for (const old of navTips) {
          if (showing === old) showing = null;
          old.remove();
        }
        navTips = enhanceTooltips(body);
        const target = cell(focusKey) ?? cell(start && iso(start)) ?? cell(iso(today)) ?? body.querySelector(".day:not(:disabled)");
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
        if (end && endInput.value !== iso(end)) endInput.value = iso(end);
        endInput.min = start ? iso(start) : startInput.min;
        if (start) view = monthStart(start);
        summary.value = describe();
        render();
      };
      startInput.addEventListener("input", readInputs);
      endInput.addEventListener("input", readInputs);
      pop.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;
        if (button.dataset.nav) {
          view = monthStart(view, +button.dataset.nav);
          render();
          pop.querySelector(`[data-nav="${button.dataset.nav}"]`)?.focus();
        } else if (button.classList.contains("day")) {
          choose(parseISO(button.dataset.date));
        } else if ("clear" in button.dataset) {
          start = end = null;
          pending = false;
          writeInputs();
          render();
        } else if ("done" in button.dataset) {
          pop.hidePopover();
        }
      });
      const clearPreview = () => body.querySelectorAll(".is-preview").forEach((node) => node.classList.remove("is-preview"));
      body.addEventListener("pointerover", (e) => {
        clearPreview();
        const button = e.target.closest(".day");
        if (!pending || !button) return;
        const hover = parseISO(button.dataset.date);
        for (const day of body.querySelectorAll(".day")) {
          const d = parseISO(day.dataset.date);
          if (d > start && d <= hover) day.classList.add("is-preview");
        }
      });
      body.addEventListener("pointerleave", clearPreview);
      body.addEventListener("keydown", (e) => {
        const button = e.target.closest(".day");
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
          End: addDays(d, 6 - offset)
        };
        const next = moves[e.key];
        if (!next) return;
        e.preventDefault();
        if (!allowed(next)) return;
        if (next < view) view = monthStart(next);
        else if (next >= monthStart(view, months)) view = monthStart(next, 1 - months);
        render(iso(next));
      });
      const place = () => {
        if (!pop.matches(":popover-open")) return;
        const anchor = root.getBoundingClientRect();
        const size = pop.getBoundingClientRect();
        pop.style.top = `${Math.max(8, Math.min(anchor.bottom + 8, innerHeight - size.height - 8))}px`;
        pop.style.left = `${Math.max(8, Math.min(anchor.left, innerWidth - size.width - 8))}px`;
      };
      pop.addEventListener("toggle", (e) => {
        toggle.setAttribute("aria-expanded", String(e.newState === "open"));
        if (e.newState !== "open") return;
        view = monthStart(start ?? (minDate && minDate > today ? minDate : today));
        render(start ? iso(start) : iso(today));
        place();
      });
      addEventListener("scroll", place, { passive: true });
      addEventListener("resize", place);
      summary.value = describe();
      render();
    }
  };
  var timePickers = 0;
  var enhanceTimePickers = (claim) => {
    for (const root of claim("[data-timepicker]")) {
      const input = root.querySelector('input[type="time"]');
      if (!input) continue;
      const index = timePickers++;
      const lang = document.documentElement.lang || void 0;
      const hour12 = root.dataset.hour12 ? root.dataset.hour12 === "true" : new Intl.DateTimeFormat(lang, { hour: "numeric" }).resolvedOptions().hour12 === true;
      const stepAttr = num(input.step, 0) / 60;
      const step = Math.max(1, Math.round(num(root.dataset.minuteStep, Number.isInteger(stepAttr) && stepAttr >= 1 ? stepAttr : 5)));
      root.classList.add("is-enhanced");
      const toggle = el("button", "timepicker__button", root);
      toggle.type = "button";
      toggle.setAttribute("aria-label", "Choose time");
      toggle.setAttribute("aria-expanded", "false");
      toggle.dataset.tooltip = "Choose time";
      toggle.innerHTML = icon2("clock");
      const pop = el("div", "timepicker__pop", root);
      pop.id = `timepicker-${index}`;
      pop.setAttribute("popover", "");
      pop.setAttribute("role", "dialog");
      pop.setAttribute("aria-label", "Choose time");
      toggle.setAttribute("popovertarget", pop.id);
      const group = (name, legend, choices, two = false) => `<fieldset class="timepicker__group"><legend>${legend}</legend>
      <div class="timepicker__grid${two ? " timepicker__grid--two" : ""}">${choices.map(([value, text]) => `<label class="well"><input type="radio" form="timepicker-none" name="timepicker-${index}-${name}" value="${value}"><span class="key">${text}</span></label>`).join("")}</div></fieldset>`;
      const hours = hour12 ? Array.from({ length: 12 }, (_, i) => [i + 1, i + 1]) : Array.from({ length: 24 }, (_, i) => [i, pad(i)]);
      const minutesFor = (m) => {
        const list = new Set(Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step));
        if (m !== null) list.add(m);
        return [...list].sort((a, b) => a - b).map((n) => [n, pad(n)]);
      };
      const parts = () => {
        const [h, m] = input.value.split(":").map(Number);
        return input.value && !Number.isNaN(h) ? { h, m } : { h: null, m: null };
      };
      let shown = null;
      const build = () => {
        const { m } = parts();
        shown = m;
        pop.innerHTML = group("hour", "Hour", hours) + group("minute", "Minute", minutesFor(m)) + (hour12 ? group("period", "AM or PM", [["am", "AM"], ["pm", "PM"]], true) : "") + '<div class="timepicker__foot"><span class="well"><button type="button" class="key" data-clear>Clear</button></span><span class="well"><button type="button" class="key key--accent" data-done>Done</button></span></div>';
      };
      const radios = (name) => [...pop.querySelectorAll(`input[name="timepicker-${index}-${name}"]`)];
      const sync = () => {
        const { h, m } = parts();
        if (m !== shown && m !== null && !radios("minute").some((r) => +r.value === m)) build();
        const hourValue = h === null ? null : hour12 ? h % 12 || 12 : h;
        for (const r of radios("hour")) r.checked = hourValue !== null && +r.value === hourValue;
        for (const r of radios("minute")) r.checked = m !== null && +r.value === m;
        for (const r of radios("period")) r.checked = h !== null && r.value === (h >= 12 ? "pm" : "am");
      };
      const write = (value) => {
        if (input.value === value) return;
        input.value = value;
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      const choose = () => {
        const hour = radios("hour").find((r) => r.checked);
        const minute = radios("minute").find((r) => r.checked);
        const period = radios("period").find((r) => r.checked);
        const old = parts();
        let h = hour ? +hour.value : old.h === null ? null : hour12 ? old.h % 12 || 12 : old.h;
        const m = minute ? +minute.value : old.m ?? 0;
        if (h === null) h = hour12 ? 12 : 0;
        if (hour12) {
          const pm = period ? period.value === "pm" : old.h !== null && old.h >= 12;
          h = h % 12 + (pm ? 12 : 0);
        }
        write(`${pad(h)}:${pad(m)}`);
        sync();
      };
      pop.addEventListener("change", (e) => {
        if (e.target.matches('input[type="radio"]')) choose();
      });
      pop.addEventListener("click", (e) => {
        const button = e.target.closest("button");
        if (!button) return;
        if ("clear" in button.dataset) {
          write("");
          sync();
        } else if ("done" in button.dataset) pop.hidePopover();
      });
      input.addEventListener("input", sync);
      const place = () => {
        if (!pop.matches(":popover-open")) return;
        const anchor = root.getBoundingClientRect();
        const size = pop.getBoundingClientRect();
        pop.style.top = `${Math.max(8, Math.min(anchor.bottom + 8, innerHeight - size.height - 8))}px`;
        pop.style.left = `${Math.max(8, Math.min(anchor.left, innerWidth - size.width - 8))}px`;
      };
      pop.addEventListener("toggle", (e) => {
        toggle.setAttribute("aria-expanded", String(e.newState === "open"));
        if (e.newState !== "open") return;
        sync();
        place();
        (pop.querySelector("input:checked") ?? pop.querySelector("input"))?.focus({ preventScroll: true });
      });
      addEventListener("scroll", place, { passive: true });
      addEventListener("resize", place);
      build();
      sync();
    }
  };
  var copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
    }
    const area = el("textarea", "", document.body);
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:0;left:0;opacity:0";
    area.select();
    try {
      return document.execCommand("copy");
    } finally {
      area.remove();
    }
  };
  var enhanceCode = (claim) => {
    for (const block of claim(".code")) {
      const body = block.querySelector(".code__body");
      const pre = block.querySelector("pre");
      if (!body || !pre) continue;
      const code = pre.querySelector("code");
      if (code && !block.hasAttribute("data-nolines") && !code.querySelector(".code__line")) {
        const lines = code.textContent.split("\n");
        if (lines.length > 1) {
          code.replaceChildren(...lines.flatMap((text, i) => {
            const line = el("span", "code__line");
            line.textContent = text;
            return i < lines.length - 1 ? [line, document.createTextNode("\n")] : [line];
          }));
          pre.style.setProperty("--code-gutter", `${String(lines.length).length}ch`);
        }
      }
      if (block.hasAttribute("data-nocopy")) continue;
      const button = el("button", "code__copy", body);
      button.type = "button";
      button.setAttribute("aria-label", "Copy code");
      button.dataset.tooltip = "Copy code";
      const status = el("span", "code__status", body);
      status.setAttribute("role", "status");
      const show = (name) => {
        button.innerHTML = icon2(name);
      };
      show("copy");
      button.addEventListener("click", async () => {
        const ok = await copyText(pre.textContent);
        status.textContent = ok ? "Copied" : "Press Command or Control C to copy";
        if (!ok) return;
        show("check");
        setTimeout(() => {
          show("copy");
          status.textContent = "";
        }, 1500);
      });
    }
  };
  var keyedSteppers = /* @__PURE__ */ new WeakSet();
  var stepFromKeyboard = (input) => {
    if (keyedSteppers.has(input)) return;
    keyedSteppers.add(input);
    const by = { ArrowUp: 1, ArrowDown: -1, PageUp: 10, PageDown: -10 };
    input.addEventListener("keydown", (e) => {
      if (!(e.key in by) || e.isComposing || e.altKey || e.ctrlKey || e.metaKey || input.readOnly || input.disabled) return;
      e.preventDefault();
      const n = by[e.key];
      const before = input.value;
      try {
        if (n > 0) input.stepUp(n);
        else input.stepDown(-n);
      } catch {
      }
      if (input.value !== before) {
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });
  };
  var enhanceSteppers = (claim) => {
    for (const key of claim("[data-step]")) {
      const input = document.getElementById(key.getAttribute("aria-controls"));
      if (!input) continue;
      stepFromKeyboard(input);
      const stepper = key.closest(".stepper");
      stepper.classList.add("is-enhanced");
      let status = stepper.querySelector(".stepper__status");
      if (!status) {
        status = el("span", "stepper__status", stepper);
        status.setAttribute("role", "status");
        status.style.cssText = "position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)";
      }
      key.addEventListener("click", () => {
        const by = +key.dataset.step;
        try {
          if (by > 0) input.stepUp(by);
          else input.stepDown(-by);
        } catch {
        }
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
        status.textContent = `${input.labels?.[0]?.textContent.trim() ?? "Value"}: ${input.value}`;
      });
    }
  };
  var enhanceReveal = (claim) => {
    for (const button of claim("[data-reveal]")) {
      const input = document.getElementById(button.getAttribute("aria-controls"));
      if (!input) continue;
      button.closest(".input-reveal")?.classList.add("is-enhanced");
      button.addEventListener("click", () => {
        const show = input.type === "password";
        input.type = show ? "text" : "password";
        button.setAttribute("aria-pressed", String(show));
        button.setAttribute("aria-label", show ? "Hide password" : "Show password");
        button.innerHTML = icon2(show ? "eye-off" : "eye");
      });
    }
  };
  var tabsMade = 0;
  var enhanceTabs = (claim) => {
    for (const root of claim("[data-tabs]")) {
      const panels = [...root.querySelectorAll(":scope > .tabs__panel")];
      if (!panels.length) continue;
      const id = `simar-tabs-${++tabsMade}`;
      const list = el("div", "tabs__list");
      list.setAttribute("role", "tablist");
      if (root.dataset.label) list.setAttribute("aria-label", root.dataset.label);
      const tabs = panels.map((panel, i) => {
        const title = panel.querySelector(".tabs__title");
        const tab = el("button", "key", list);
        tab.type = "button";
        tab.id = `${id}-tab-${i}`;
        tab.setAttribute("role", "tab");
        tab.setAttribute("aria-controls", `${id}-panel-${i}`);
        tab.textContent = title?.textContent ?? `Tab ${i + 1}`;
        panel.id = `${id}-panel-${i}`;
        panel.setAttribute("role", "tabpanel");
        panel.setAttribute("aria-labelledby", tab.id);
        panel.tabIndex = 0;
        return tab;
      });
      const select = (index, focus = false) => {
        tabs.forEach((tab, i) => {
          tab.setAttribute("aria-selected", String(i === index));
          tab.tabIndex = i === index ? 0 : -1;
          panels[i].hidden = i !== index;
        });
        if (focus) tabs[index].focus();
      };
      tabs.forEach((tab, i) => {
        tab.addEventListener("click", () => select(i));
        tab.addEventListener("keydown", (e) => {
          const last = tabs.length - 1;
          const next = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last }[e.key];
          if (next === void 0) return;
          e.preventDefault();
          select(next, true);
        });
      });
      root.prepend(list);
      root.classList.add("is-enhanced");
      select(Math.max(0, panels.findIndex((p) => p.hasAttribute("data-selected"))));
    }
  };
  var enhanceMenus = (claim) => {
    for (const root of claim(".menu")) {
      const button = root.querySelector("[popovertarget]");
      const list = button && document.getElementById(button.getAttribute("popovertarget"));
      if (!list) continue;
      const items = () => [...list.querySelectorAll(".menu__item")];
      list.setAttribute("role", "menu");
      if (!list.getAttribute("aria-label") && !list.getAttribute("aria-labelledby")) list.setAttribute("aria-labelledby", button.id ||= `${list.id}-button`);
      for (const li of list.querySelectorAll("li")) li.setAttribute("role", li.querySelector(".menu__item") ? "none" : "separator");
      for (const item of items()) {
        item.setAttribute("role", "menuitem");
        item.tabIndex = -1;
        if (item.matches('[aria-disabled="true"]')) item.addEventListener("click", (e) => e.preventDefault());
      }
      button.setAttribute("aria-haspopup", "menu");
      button.setAttribute("aria-expanded", "false");
      const place = () => {
        const box = button.getBoundingClientRect();
        list.style.left = `${Math.max(8, Math.min(box.left, innerWidth - list.offsetWidth - 8))}px`;
        const below = innerHeight - box.bottom;
        list.style.top = `${below >= list.offsetHeight + 8 || box.top < list.offsetHeight ? box.bottom + 4 : box.top - list.offsetHeight - 4}px`;
      };
      let focusEnd = false;
      list.addEventListener("toggle", (e) => {
        const open = e.newState === "open";
        button.setAttribute("aria-expanded", String(open));
        if (open) button.setAttribute("aria-controls", list.id);
        else button.removeAttribute("aria-controls");
        if (!open) return;
        place();
        const all = items();
        (focusEnd ? all.at(-1) : all[0])?.focus();
        focusEnd = false;
      });
      button.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        e.preventDefault();
        focusEnd = e.key === "ArrowUp";
        list.showPopover();
      });
      list.addEventListener("click", (e) => {
        const item = e.target.closest(".menu__item");
        if (item && item.getAttribute("aria-disabled") !== "true") list.hidePopover();
      });
      list.addEventListener("keydown", (e) => {
        const all = items();
        const at = all.indexOf(document.activeElement);
        if (e.key === "Tab") {
          list.hidePopover();
          return;
        }
        const next = { ArrowDown: (at + 1) % all.length, ArrowUp: (at - 1 + all.length) % all.length, Home: 0, End: all.length - 1 }[e.key];
        if (next !== void 0) {
          e.preventDefault();
          all[next].focus();
          return;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const letter = e.key.toLowerCase();
          const found = [...all.slice(at + 1), ...all.slice(0, at + 1)].find((n) => n.textContent.trim().toLowerCase().startsWith(letter));
          if (found) {
            e.preventDefault();
            found.focus();
          }
        }
      });
    }
  };
  var suggestions = 0;
  var enhanceAutocomplete = (claim) => {
    for (const input of claim("input[data-autocomplete][list]")) {
      const datalist = document.getElementById(input.getAttribute("list"));
      if (!datalist) continue;
      const id = `simar-suggest-${++suggestions}`;
      const all = [...datalist.options].map((o) => ({ value: o.value, label: o.label && o.label !== o.value ? o.label : "", keywords: o.dataset.keywords ?? "" }));
      const label = input.id ? document.querySelector(`label[for="${input.id}"]`) : null;
      const list = el("ul", "picker__list suggest", input.closest('main, dialog, [role="dialog"], [popover]') ?? document.body);
      list.id = `${id}-list`;
      list.setAttribute("role", "listbox");
      list.setAttribute("popover", "manual");
      if (label) {
        label.id ||= `${id}-label`;
        list.setAttribute("aria-labelledby", label.id);
      } else if (input.getAttribute("aria-label")) list.setAttribute("aria-label", input.getAttribute("aria-label"));
      const status = el("span", "suggest__status", input.parentNode);
      status.setAttribute("role", "status");
      input.removeAttribute("list");
      input.setAttribute("role", "combobox");
      input.setAttribute("aria-autocomplete", "list");
      input.setAttribute("aria-expanded", "false");
      input.setAttribute("aria-controls", list.id);
      input.autocomplete = "off";
      let shown = [];
      let active = -1;
      const isOpen = () => list.matches(":popover-open");
      const close = () => {
        if (isOpen()) list.hidePopover();
        input.setAttribute("aria-expanded", "false");
        input.removeAttribute("aria-activedescendant");
        active = -1;
      };
      const highlight = (i) => {
        active = i;
        [...list.children].forEach((item, n) => item.classList.toggle("is-active", n === i));
        if (i < 0) {
          input.removeAttribute("aria-activedescendant");
          return;
        }
        input.setAttribute("aria-activedescendant", list.children[i].id);
        list.children[i].scrollIntoView({ block: "nearest" });
      };
      const choose = (i) => {
        input.value = shown[i].value;
        close();
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      };
      const render = () => {
        const query = input.value.trim().toLowerCase();
        shown = all.filter((o) => !query || `${o.value} ${o.label} ${o.keywords}`.toLowerCase().includes(query)).sort((a, b) => Number(b.value.toLowerCase().startsWith(query)) - Number(a.value.toLowerCase().startsWith(query))).slice(0, 8);
        list.replaceChildren();
        shown.forEach((o, i) => {
          const item = el("li", "picker__option", list);
          item.id = `${id}-option-${i}`;
          item.setAttribute("role", "option");
          item.setAttribute("aria-selected", "false");
          const text = el("span", "picker__text", item);
          const at = query ? o.value.toLowerCase().indexOf(query) : -1;
          if (at >= 0) {
            text.append(o.value.slice(0, at));
            el("mark", "", text).textContent = o.value.slice(at, at + query.length);
            text.append(o.value.slice(at + query.length));
          } else text.textContent = o.value;
          if (o.label) el("span", "suggest__hint", item).textContent = o.label;
          item.addEventListener("pointerdown", (e) => e.preventDefault());
          item.addEventListener("click", () => choose(i));
          item.addEventListener("pointermove", () => highlight(i));
        });
        if (shown.length && !(shown.length === 1 && shown[0].value.toLowerCase() === query)) {
          const box = input.getBoundingClientRect();
          list.style.minWidth = `${box.width}px`;
          list.style.left = `${box.left}px`;
          if (!isOpen()) list.showPopover();
          const below = innerHeight - box.bottom;
          list.style.top = `${below >= list.offsetHeight + 8 || box.top < list.offsetHeight ? box.bottom + 4 : box.top - list.offsetHeight - 4}px`;
          input.setAttribute("aria-expanded", "true");
          status.textContent = `${shown.length} suggestion${shown.length === 1 ? "" : "s"} available. Use the up and down arrows to review.`;
        } else {
          close();
          status.textContent = query && !shown.length ? "No suggestions." : "";
        }
        active = -1;
        input.removeAttribute("aria-activedescendant");
      };
      input.addEventListener("input", render);
      input.addEventListener("focus", () => {
        if (input.value) render();
      });
      input.addEventListener("blur", () => {
        close();
        status.textContent = "";
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          if (!isOpen()) render();
          if (!isOpen()) return;
          e.preventDefault();
          const n = shown.length;
          highlight(e.key === "ArrowDown" ? (active + 1) % n : (active - 1 + n) % n);
        } else if (e.key === "Enter" && isOpen() && (active >= 0 || input.dataset.autocomplete === "first")) {
          e.preventDefault();
          choose(Math.max(active, 0));
        } else if (e.key === "Escape" && isOpen()) {
          e.preventDefault();
          close();
        }
      });
      addEventListener("resize", close);
    }
  };
  var ALERT_ICONS = { info: "info", success: "circle-check", warning: "triangle-alert", danger: "circle-alert" };
  var closeButton = (label = "Dismiss") => {
    const button = el("button", "alert__close");
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.innerHTML = icon2("x");
    return button;
  };
  var enhanceAlerts = (claim) => {
    for (const alert of claim(".alert[data-dismissible]")) {
      const button = closeButton();
      alert.append(button);
      button.addEventListener("click", () => {
        const stack = alert.closest(".alert-stack") ?? alert.parentElement;
        alert.remove();
        stack.tabIndex = -1;
        stack.focus({ preventScroll: true });
      });
    }
  };
  var toastRegion = () => {
    let region = document.querySelector(".toasts");
    if (!region) {
      region = el("div", "toasts", document.body);
      region.setAttribute("role", "region");
      region.setAttribute("aria-label", "Notifications");
      region.setAttribute("aria-live", "polite");
      region.setAttribute("aria-relevant", "additions");
    }
    return region;
  };
  var toast = (message, { variant = "info", title = "", duration = 6e3 } = {}) => {
    const kind = ALERT_ICONS[variant] ? variant : "info";
    const node = el("div", `alert alert--${kind} toast`, toastRegion());
    if (kind === "danger") node.setAttribute("role", "alert");
    node.innerHTML = `${icon2(ALERT_ICONS[kind]).replace('class="icon"', 'class="icon alert__icon"')}<div class="alert__body"></div>`;
    const body = node.querySelector(".alert__body");
    const label = { info: "Information", success: "Success", warning: "Warning", danger: "Error" }[kind];
    el("p", "alert__title", body).textContent = title || label;
    if (message) el("p", "alert__text", body).textContent = message;
    const button = closeButton();
    node.append(button);
    let timer;
    let waiting = false;
    const remove = () => {
      clearTimeout(timer);
      node.remove();
    };
    const start = () => {
      clearTimeout(timer);
      if (duration > 0) timer = setTimeout(() => {
        if (!waiting) remove();
        else start();
      }, duration);
    };
    button.addEventListener("click", remove);
    node.addEventListener("keydown", (e) => {
      if (e.key === "Escape") remove();
    });
    for (const type of ["pointerenter", "focusin"]) node.addEventListener(type, () => {
      waiting = true;
    });
    for (const type of ["pointerleave", "focusout"]) node.addEventListener(type, () => {
      waiting = false;
      start();
    });
    start();
    return node;
  };
  var enhanceToastTriggers = (claim) => {
    for (const trigger of claim("[data-toast]")) {
      trigger.addEventListener("click", () => toast(trigger.dataset.toast, {
        variant: trigger.dataset.toastVariant,
        title: trigger.dataset.toastTitle,
        duration: trigger.dataset.duration === void 0 ? void 0 : +trigger.dataset.duration
      }));
    }
  };
  var enhanceTables = (claim) => {
    for (const table of claim("table[data-sortable]")) {
      const heads = [...table.querySelectorAll("thead th")];
      const body = table.tBodies[0];
      if (!body) continue;
      const value = (row, i) => {
        const cell = row.cells[i];
        const raw = (cell.dataset.value ?? cell.textContent).trim();
        const number = parseFloat(raw.replace(/[^0-9.\-]/g, ""));
        return raw !== "" && !Number.isNaN(number) && /^[-+$€£]?[0-9.,\s]+%?$/.test(raw) ? number : raw.toLowerCase();
      };
      heads.forEach((th, i) => {
        if (!th.hasAttribute("data-sort")) return;
        const button = el("button", "table__sort");
        button.type = "button";
        button.append(...th.childNodes);
        th.append(button);
        th.setAttribute("aria-sort", "none");
        button.addEventListener("click", () => {
          const next = th.getAttribute("aria-sort") === "ascending" ? "descending" : "ascending";
          for (const other of heads) if (other.hasAttribute("aria-sort")) other.setAttribute("aria-sort", "none");
          th.setAttribute("aria-sort", next);
          const sign = next === "ascending" ? 1 : -1;
          const rows = [...body.rows].sort((a, b) => {
            const x = value(a, i);
            const y = value(b, i);
            return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y), void 0, { numeric: true })) * sign;
          });
          body.append(...rows);
        });
      });
    }
  };
  var pickers = 0;
  var enhancePickers = (claim) => {
    for (const select of claim("select[data-picker]")) {
      const id = `simar-picker-${++pickers}`;
      const label = select.id ? document.querySelector(`label[for="${select.id}"]`) : null;
      const options = [...select.options];
      const art = (option) => {
        if (option.dataset.icon) {
          const holder = document.createElement("template");
          holder.innerHTML = icon2(option.dataset.icon);
          return holder.content;
        }
        const template = option.dataset.art && document.getElementById(option.dataset.art);
        return template ? template.content.cloneNode(true) : null;
      };
      const fill = (target, option) => {
        const holder = el("span", "picker__art", target);
        holder.setAttribute("aria-hidden", "true");
        holder.append(art(option) ?? "");
        el("span", "picker__text", target).textContent = option.textContent;
      };
      const wrap = el("div", "picker");
      const button = el("button", "input picker__button", wrap);
      button.type = "button";
      button.id = `${id}-button`;
      button.setAttribute("role", "combobox");
      button.setAttribute("aria-haspopup", "listbox");
      button.setAttribute("aria-expanded", "false");
      if (label) {
        label.setAttribute("for", button.id);
        label.id ||= `${id}-label`;
        button.setAttribute("aria-labelledby", `${label.id} ${button.id}`);
      } else if (select.getAttribute("aria-label")) {
        button.setAttribute("aria-label", select.getAttribute("aria-label"));
      }
      const shown = el("span", "picker__shown", button);
      button.insertAdjacentHTML("beforeend", icon2("chevron-down").replace('class="icon"', 'class="icon picker__icon"'));
      const list = el("ul", "picker__list", wrap);
      list.id = `${id}-list`;
      list.setAttribute("role", "listbox");
      list.setAttribute("popover", "auto");
      if (label) list.setAttribute("aria-labelledby", label.id);
      const items = options.map((option, i) => {
        const item = el("li", "picker__option", list);
        item.id = `${id}-option-${i}`;
        item.setAttribute("role", "option");
        fill(item, option);
        item.addEventListener("pointerdown", (e) => e.preventDefault());
        item.addEventListener("click", () => {
          choose(i);
          close();
        });
        item.addEventListener("pointermove", () => highlight(i));
        return item;
      });
      let active = select.selectedIndex;
      const isOpen = () => list.matches(":popover-open");
      const highlight = (i) => {
        active = Math.max(0, Math.min(items.length - 1, i));
        items.forEach((item, n) => item.classList.toggle("is-active", n === active));
        button.setAttribute("aria-activedescendant", items[active].id);
        items[active].scrollIntoView({ block: "nearest" });
      };
      const render = () => {
        shown.replaceChildren();
        fill(shown, select.options[select.selectedIndex]);
        items.forEach((item, n) => item.setAttribute("aria-selected", String(n === select.selectedIndex)));
      };
      const choose = (i) => {
        if (select.selectedIndex === i) return;
        select.selectedIndex = i;
        render();
        select.dispatchEvent(new Event("input", { bubbles: true }));
        select.dispatchEvent(new Event("change", { bubbles: true }));
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
      const close = () => {
        if (isOpen()) list.hidePopover();
      };
      list.addEventListener("toggle", () => {
        button.setAttribute("aria-expanded", String(isOpen()));
        if (isOpen()) button.setAttribute("aria-controls", list.id);
        else {
          button.removeAttribute("aria-controls");
          button.removeAttribute("aria-activedescendant");
        }
      });
      button.addEventListener("click", () => isOpen() ? close() : open());
      button.addEventListener("keydown", (e) => {
        const key = e.key;
        if (!isOpen()) {
          if (["ArrowDown", "ArrowUp", "Enter", " "].includes(key)) {
            e.preventDefault();
            open();
          } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const next = options.findIndex((o, n) => n > select.selectedIndex && o.textContent.toLowerCase().startsWith(key.toLowerCase()));
            if (next >= 0) {
              e.preventDefault();
              choose(next);
            }
          }
          return;
        }
        if (key === "ArrowDown") highlight(active + 1);
        else if (key === "ArrowUp") highlight(active - 1);
        else if (key === "Home") highlight(0);
        else if (key === "End") highlight(items.length - 1);
        else if (key === "Enter" || key === " ") {
          choose(active);
          close();
        } else if (key === "Tab") {
          choose(active);
          close();
          return;
        } else if (key === "Escape") {
          close();
        } else if (key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const next = options.findIndex((o, n) => n > active && o.textContent.toLowerCase().startsWith(key.toLowerCase()));
          if (next >= 0) highlight(next);
        } else return;
        e.preventDefault();
      });
      select.addEventListener("change", render);
      const host = select.closest(".select") ?? select;
      host.hidden = true;
      host.after(wrap);
      render();
    }
  };
  var enhanceColors = (claim) => {
    for (const input of claim('.color input[type="color"]')) {
      const out = input.closest(".color").querySelector("output");
      const sync = () => {
        if (out) out.value = input.value;
      };
      input.addEventListener("input", sync);
      sync();
    }
  };
  var CHECKABLE = 'input:not([type="hidden"]):not([type="submit"]):not([type="reset"]):not([type="button"]):not([type="image"]):not([type="radio"]), select, textarea';
  var errorCount = 0;
  var enhanceForms = (claim) => {
    for (const form of claim("form[data-validate]")) {
      form.noValidate = true;
      let summary = form.querySelector(".form__summary");
      if (!summary) {
        summary = el("div", "form__summary");
        summary.hidden = true;
        summary.setAttribute("role", "alert");
        summary.tabIndex = -1;
        form.prepend(summary);
      }
      const nameOf = (control) => control.labels?.[0]?.textContent.replace(/\s+/g, " ").trim() || control.getAttribute("aria-label") || control.name;
      const errorNode = (control) => {
        if (!control.id) control.id = `simar-field-${++errorCount}`;
        let node = document.getElementById(`${control.id}-error`);
        if (!node) {
          node = el("p", "field__error");
          node.id = `${control.id}-error`;
          node.hidden = true;
          node.innerHTML = `${icon2("circle-alert")}<span></span>`;
          const check2 = !control.closest(".field") && control.closest(".check");
          if (check2) check2.after(node);
          else (control.closest(".field") ?? control.parentElement).append(node);
        }
        return node;
      };
      const setError = (control, message) => {
        const node = errorNode(control);
        const ids = (control.getAttribute("aria-describedby") ?? "").split(/\s+/).filter((id) => id && id !== node.id);
        if (message) {
          node.querySelector("span").textContent = message;
          node.hidden = false;
          control.setAttribute("aria-invalid", "true");
          control.setAttribute("aria-describedby", [...ids, node.id].join(" "));
        } else {
          node.hidden = true;
          control.removeAttribute("aria-invalid");
          if (ids.length) control.setAttribute("aria-describedby", ids.join(" "));
          else control.removeAttribute("aria-describedby");
        }
      };
      const check = (control) => {
        setError(control, control.validity.valid ? "" : control.dataset.error || control.validationMessage);
        return control.validity.valid;
      };
      const controls = () => [...form.elements].filter((c) => c.matches(CHECKABLE) && c.willValidate);
      const refreshSummary = () => {
        const bad = controls().filter((c) => !c.validity.valid && c.getAttribute("aria-invalid") === "true");
        if (!bad.length) {
          summary.hidden = true;
          summary.textContent = "";
          return;
        }
        summary.textContent = `${bad.length} ${bad.length === 1 ? "field needs" : "fields need"} attention: ${bad.map(nameOf).join(", ")}.`;
        summary.hidden = false;
      };
      form.addEventListener("submit", (e) => {
        const bad = controls().filter((c) => !check(c));
        if (!bad.length) {
          summary.hidden = true;
          return;
        }
        e.preventDefault();
        refreshSummary();
        bad[0].focus();
      });
      form.addEventListener("change", (e) => {
        if (e.target.matches?.(CHECKABLE)) {
          check(e.target);
          refreshSummary();
        }
      });
      form.addEventListener("input", (e) => {
        if (e.target.matches?.(CHECKABLE) && e.target.getAttribute("aria-invalid") === "true") {
          check(e.target);
          refreshSummary();
        }
      });
      form.addEventListener("reset", () => {
        controls().forEach((c) => setError(c, ""));
        summary.hidden = true;
      });
    }
  };
  var enhanceChecks = (claim) => {
    for (const box of claim('input[type="checkbox"][data-indeterminate]')) box.indeterminate = true;
  };
  var enhanceChips = (claim) => {
    for (const list of claim("[data-chips]")) {
      const status = document.createElement("p");
      status.className = "chips__status";
      status.setAttribute("role", "status");
      list.after(status);
      const remove = (button) => {
        const chip = button.closest(".chip");
        if (!chip) return;
        const text = chip.querySelector(".chip__text")?.textContent.trim() ?? "";
        const next = chip.nextElementSibling ?? chip.previousElementSibling;
        chip.remove();
        list.dispatchEvent(new CustomEvent("chip:remove", { bubbles: true, detail: { text } }));
        const left = list.querySelectorAll(".chip").length;
        status.textContent = `${text} removed. ${left} left.`;
        if (next) next.querySelector(".chip__remove")?.focus();
        else {
          list.tabIndex = -1;
          list.focus();
        }
      };
      list.addEventListener("click", (e) => {
        const button = e.target.closest(".chip__remove");
        if (!button || button.type === "submit") return;
        e.preventDefault();
        remove(button);
      });
      list.addEventListener("keydown", (e) => {
        const button = e.target.closest?.(".chip__remove");
        if (button && button.type !== "submit" && (e.key === "Delete" || e.key === "Backspace")) {
          e.preventDefault();
          remove(button);
        }
      });
    }
  };
  var enhanceSearchbars = (claim) => {
    for (const bar of claim(".searchbar")) {
      const input = bar.querySelector('input[type="search"]');
      const clear = bar.querySelector("[data-clear]");
      if (!input || !clear) continue;
      const sync = () => {
        clear.hidden = input.value === "";
      };
      const empty = () => {
        input.value = "";
        input.dispatchEvent(new Event("input", { bubbles: true }));
        bar.dispatchEvent(new CustomEvent("search:clear", { bubbles: true }));
        input.focus();
      };
      bar.classList.add("is-enhanced");
      sync();
      input.addEventListener("input", sync);
      input.form?.addEventListener("reset", () => setTimeout(sync));
      clear.addEventListener("click", empty);
      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && input.value !== "" && !e.defaultPrevented) {
          e.preventDefault();
          e.stopPropagation();
          empty();
        }
      });
    }
  };
  var checklistCount = 0;
  var enhanceChecklists = (claim) => {
    for (const set of claim("[data-checklist]")) {
      const n = ++checklistCount;
      const items = () => [...set.querySelectorAll('input[type="checkbox"]')].filter((box) => box !== all && !box.disabled);
      const all = document.createElement("input");
      all.type = "checkbox";
      const row = document.createElement("label");
      row.className = "check checklist__all";
      row.innerHTML = '<span class="well"><span class="key key--box"><svg class="icon icon--check" aria-hidden="true"><use href="#i-check"/></svg><svg class="icon icon--minus" aria-hidden="true"><use href="#i-minus"/></svg></span></span><span class="check__text"></span>';
      row.querySelector(".check__text").textContent = set.dataset.all || "Select all";
      row.querySelector(".well").prepend(all);
      const status = document.createElement("p");
      status.className = "checklist__status";
      status.setAttribute("role", "status");
      const legend = set.querySelector(":scope > legend");
      legend ? legend.after(row) : set.prepend(row);
      set.append(status);
      items().forEach((box, i) => {
        box.id ||= `simar-checklist-${n}-${i + 1}`;
      });
      all.setAttribute("aria-controls", items().map((box) => box.id).join(" "));
      const refresh = () => {
        const list = items();
        const done = list.filter((box) => box.checked).length;
        all.checked = list.length > 0 && done === list.length;
        all.indeterminate = done > 0 && done < list.length;
        all.disabled = list.length === 0;
        status.textContent = `${done} of ${list.length} ${set.dataset.done || "done"}`;
      };
      all.addEventListener("change", () => {
        const on = all.checked;
        for (const box of items()) {
          if (box.checked === on) continue;
          box.checked = on;
          box.dispatchEvent(new Event("change", { bubbles: true }));
        }
        refresh();
      });
      set.addEventListener("change", (e) => {
        if (e.target !== all) refresh();
      });
      set.closest("form")?.addEventListener("reset", () => setTimeout(refresh));
      refresh();
    }
  };
  var appbarCount = 0;
  var enhanceAppBars = (claim) => {
    for (const bar of claim(".appbar[data-menu]")) {
      const nav = bar.querySelector(".appbar__nav");
      if (!nav) continue;
      nav.id ||= `simar-appbar-nav-${++appbarCount}`;
      const well = document.createElement("span");
      well.className = "well appbar__menu";
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "key";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", nav.id);
      toggle.innerHTML = '<svg class="icon icon--lead" aria-hidden="true"><use href="#i-list"/></svg>';
      toggle.append(bar.dataset.menuLabel || "Menu");
      well.append(toggle);
      const anchor = bar.querySelector(".appbar__actions") ?? bar.querySelector(".appbar__brand, .appbar__title");
      if (anchor) anchor.after(well);
      else bar.prepend(well);
      const set = (open) => {
        bar.toggleAttribute("data-open", open);
        toggle.setAttribute("aria-expanded", String(open));
      };
      bar.classList.add("is-enhanced");
      toggle.addEventListener("click", () => set(!bar.hasAttribute("data-open")));
      nav.addEventListener("click", (e) => {
        if (e.target.closest("a")) set(false);
      });
      bar.addEventListener("keydown", (e) => {
        if (e.key !== "Escape" || !bar.hasAttribute("data-open") || !toggle.offsetParent) return;
        set(false);
        toggle.focus();
      });
      addEventListener("resize", () => {
        if (bar.hasAttribute("data-open") && !toggle.offsetParent) set(false);
      });
    }
  };
  var enhanceCarousels = (claim) => {
    const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const key = (label, icon3) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "key key--sq";
      button.setAttribute("aria-label", label);
      button.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${icon3}"/></svg>`;
      return button;
    };
    for (const root of claim(".carousel")) {
      const track = root.querySelector(".carousel__track");
      const slides = [...root.querySelectorAll(".carousel__slide")];
      if (!track || slides.length < 2) continue;
      const links = [...root.querySelectorAll(".carousel__nav a")];
      let bar = root.querySelector(".carousel__bar");
      if (!bar) {
        bar = document.createElement("div");
        bar.className = "carousel__bar";
        root.append(bar);
      }
      const status = document.createElement("p");
      status.className = "visually-hidden";
      status.setAttribute("role", "status");
      bar.after(status);
      const left = (i) => slides[i].offsetLeft - slides[0].offsetLeft;
      const nearest = () => {
        const at = Math.abs(track.scrollLeft);
        return slides.reduce((best, _, i) => Math.abs(left(i) - at) < Math.abs(left(best) - at) ? i : best, 0);
      };
      let current = 0;
      let speak = false;
      let timer;
      const show = (i) => {
        current = i;
        slides.forEach((slide, k) => slide.toggleAttribute("data-active", k === i));
        links.forEach((link, k) => k === i ? link.setAttribute("aria-current", "true") : link.removeAttribute("aria-current"));
        clearTimeout(timer);
        timer = setTimeout(() => {
          if (speak) status.textContent = `Slide ${i + 1} of ${slides.length}`;
          speak = false;
        }, 250);
      };
      let target = 0;
      const go = (i, byPerson = true) => {
        target = (i + slides.length) % slides.length;
        speak = byPerson;
        track.scrollTo({ left: left(target), behavior: calm() ? "auto" : "smooth" });
      };
      let frame;
      let idle;
      track.addEventListener("scroll", () => {
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => {
          const i = nearest();
          if (i !== current) show(i);
        });
        clearTimeout(idle);
        idle = setTimeout(() => {
          target = nearest();
        }, 150);
      }, { passive: true });
      track.addEventListener("keydown", (e) => {
        speak = true;
        if (e.key === "Home" || e.key === "End") {
          e.preventDefault();
          go(e.key === "Home" ? 0 : slides.length - 1);
        }
      });
      links.forEach((link, i) => link.addEventListener("click", (e) => {
        e.preventDefault();
        go(i);
      }));
      const prev = key("Previous slide", "chevron-left");
      const next = key("Next slide", "chevron-right");
      bar.prepend(prev);
      bar.append(next);
      prev.addEventListener("click", () => go(target - 1));
      next.addEventListener("click", () => go(target + 1));
      const ms = Number(root.dataset.autoplay);
      if (ms >= 3e3) {
        const play = key("Pause slides", "pause");
        const button = play;
        bar.append(play);
        let running = false;
        let inside = false;
        let chosen = !calm();
        const tick = () => go(target + 1, false);
        const sync = () => {
          const should = chosen && !inside;
          if (should && !running) timer2 = setInterval(tick, ms);
          if (!should && running) clearInterval(timer2);
          running = should;
          const use = button.querySelector("use");
          button.setAttribute("aria-label", chosen ? "Pause slides" : "Play slides");
          use.setAttribute("href", chosen ? "#i-pause" : "#i-play");
        };
        let timer2;
        button.addEventListener("click", () => {
          chosen = !chosen;
          sync();
        });
        root.addEventListener("pointerenter", () => {
          inside = true;
          sync();
        });
        root.addEventListener("pointerleave", () => {
          inside = false;
          sync();
        });
        root.addEventListener("focusin", () => {
          inside = true;
          sync();
        });
        root.addEventListener("focusout", (e) => {
          if (!root.contains(e.relatedTarget)) {
            inside = false;
            sync();
          }
        });
        sync();
      }
      show(nearest());
      status.textContent = "";
    }
  };
  var tipped = /* @__PURE__ */ new WeakSet();
  var tipCount = 0;
  var showing = null;
  var enhanceTooltips = (scope) => {
    for (const control of scope.querySelectorAll('button.key, input[type="radio"]')) {
      if (control.hasAttribute("data-tooltip")) continue;
      const face = control.matches("input") ? control.nextElementSibling : control;
      const label = control.getAttribute("aria-label")?.trim();
      if (label && face && !face.textContent.trim()) control.dataset.tooltip = label;
    }
    const created = [];
    for (const trigger of scope.querySelectorAll("[data-tooltip]")) {
      const text = trigger.dataset.tooltip.trim();
      if (tipped.has(trigger) || !text) continue;
      tipped.add(trigger);
      const host = trigger.closest("dialog, [popover], main, nav, aside, header, footer, section[aria-label], section[aria-labelledby]") ?? document.body;
      const tip = el("span", "tooltip", host);
      created.push(tip);
      tip.id = `simar-tip-${++tipCount}`;
      tip.setAttribute("role", "tooltip");
      tip.setAttribute("popover", "manual");
      tip.textContent = text;
      const name = (trigger.getAttribute("aria-label") ?? trigger.textContent ?? "").trim();
      if (!name) {
        trigger.setAttribute("aria-label", text);
        report(trigger, "is named only by its tooltip, which needs JavaScript. Add an aria-label in the markup so it is named without it.");
      } else if (name.toLowerCase() !== text.toLowerCase()) {
        trigger.setAttribute("aria-describedby", [trigger.getAttribute("aria-describedby"), tip.id].filter(Boolean).join(" "));
      }
      const anchor = trigger.matches("input") ? trigger.nextElementSibling ?? trigger : trigger;
      const hoverArea = anchor.closest(".well") ?? anchor;
      let timer;
      const later = (fn, ms) => {
        clearTimeout(timer);
        timer = setTimeout(fn, ms);
      };
      const place = () => {
        if (!tip.matches(":popover-open")) return;
        const a = anchor.getBoundingClientRect();
        const t = tip.getBoundingClientRect();
        const gap = 10;
        const above = a.top - t.height - gap >= 8;
        const left = Math.max(8, Math.min(a.left + a.width / 2 - t.width / 2, innerWidth - t.width - 8));
        tip.style.top = `${above ? a.top - t.height - gap : a.bottom + gap}px`;
        tip.style.left = `${left}px`;
        tip.style.setProperty("--arrow", `${a.left + a.width / 2 - left}px`);
        tip.dataset.side = above ? "above" : "below";
      };
      const show = () => {
        clearTimeout(timer);
        if (showing && showing !== tip) showing.hidePopover();
        if (!tip.matches(":popover-open")) tip.showPopover();
        showing = tip;
        tip.place = place;
        place();
      };
      const hide = () => {
        clearTimeout(timer);
        if (tip.matches(":popover-open")) tip.hidePopover();
        if (showing === tip) showing = null;
      };
      hoverArea.addEventListener("pointerenter", (e) => {
        if (e.pointerType === "mouse") later(show, 450);
      });
      hoverArea.addEventListener("pointerleave", (e) => {
        if (e.pointerType === "mouse") later(hide, 150);
      });
      tip.addEventListener("pointerenter", () => clearTimeout(timer));
      tip.addEventListener("pointerleave", () => later(hide, 150));
      trigger.addEventListener("focus", () => {
        if (trigger.matches(":focus-visible")) later(show, 0);
      });
      trigger.addEventListener("blur", hide);
      trigger.addEventListener("pointerdown", hide);
    }
    return created;
  };
  var listenForTooltips = () => {
    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape" || !showing) return;
      showing.hidePopover();
      showing = null;
      e.preventDefault();
    }, true);
    const follow = () => showing?.place?.();
    addEventListener("scroll", follow, { passive: true });
    addEventListener("resize", follow);
  };
  var BUZZ = { tick: 8, click: 14, heavy: 28 };
  var lastBuzz = 0;
  var haptic = (target, kind) => {
    if (!("vibrate" in navigator)) return;
    const setting = target.closest("[data-haptic]")?.dataset.haptic || "on";
    if (setting === "off") return;
    const now = performance.now();
    if (now - lastBuzz < 25) return;
    lastBuzz = now;
    const custom = /^[\d,\s]+$/.test(setting) ? setting.split(",").map(Number) : null;
    navigator.vibrate(custom ?? BUZZ[setting] ?? BUZZ[kind]);
  };
  var listenForHaptics = () => {
    document.addEventListener("click", (e) => {
      if (e.target.closest("button, summary, a.key")) haptic(e.target, "click");
    });
    document.addEventListener("change", (e) => {
      if (e.target.matches('input[type="radio"], input[type="checkbox"]')) haptic(e.target, "click");
      else if (e.target.matches("select")) haptic(e.target, "tick");
    });
    document.addEventListener("input", (e) => {
      if (e.target.matches('input[type="range"]')) haptic(e.target, "tick");
    });
  };
  var injectIcons = () => {
    const holder = el("div");
    holder.innerHTML = icons_default;
    const svg = holder.querySelector("svg");
    const missing = [...svg.querySelectorAll("symbol")].filter((symbol) => !document.getElementById(symbol.id));
    if (!missing.length) return;
    svg.replaceChildren(...missing);
    document.body.prepend(svg);
  };
  var started = false;
  var init = (scope = document) => {
    document.documentElement.dataset.js = "on";
    if (!started) {
      started = true;
      injectIcons();
      listenForHaptics();
      listenForTooltips();
    }
    expandTags(scope);
    const claim = (selector) => [...scope.querySelectorAll(selector)].filter((node) => {
      if (node.hasAttribute("data-simar")) return false;
      node.setAttribute("data-simar", "");
      return true;
    });
    enhanceFaders(claim);
    enhanceRanges(claim);
    enhanceRangeKnobs(claim);
    enhanceKnobs(claim);
    enhanceDialogs(claim);
    enhanceDateRanges(claim);
    enhanceTimePickers(claim);
    enhanceCode(claim);
    enhanceChecks(claim);
    enhanceChecklists(claim);
    enhanceChips(claim);
    enhanceSearchbars(claim);
    enhanceAppBars(claim);
    enhanceCarousels(claim);
    enhanceTabs(claim);
    enhanceSpeedDials(claim);
    enhanceSwipeLists(claim);
    enhanceWizards(claim);
    enhanceRefresh(claim);
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
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => init());
  else init();
})();
