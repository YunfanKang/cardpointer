/* CardPointer — app logic. Depends on CARDS, CATEGORIES, DATA_UPDATED from cards.js */

const LS_KEY = "cardpointer.wallet.v1";

/* ---------- wallet state (persisted) ---------- */
function getWalletIds() {
  try {
    const v = JSON.parse(localStorage.getItem(LS_KEY));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}
function setWalletIds(ids) {
  localStorage.setItem(LS_KEY, JSON.stringify([...new Set(ids)]));
}
function ownedCards() {
  const ids = new Set(getWalletIds());
  return CARDS.filter((c) => ids.has(c.id));
}

/* ---------- points valuation (cents per point, stored per currency) ---------- */
const PV_KEY = "cardpointer.pointsValues.v2"; // keyed by card id (was per-currency)
const PV_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
function getPointsValues() {
  try {
    const o = JSON.parse(localStorage.getItem(PV_KEY));
    return o && typeof o === "object" ? o : {};
  } catch {
    return {};
  }
}
// Per-card cents-per-point: the value the user set for this specific card, else the
// default for the card's points currency, else 1¢.
function getPointsValue(card) {
  const stored = getPointsValues()[card.id];
  if (PV_OPTIONS.includes(stored)) return stored;
  const def = typeof POINTS_DEFAULTS !== "undefined" ? POINTS_DEFAULTS[card.points] : undefined;
  return PV_OPTIONS.includes(def) ? def : 1;
}
function setPointsValue(cardId, cents) {
  const o = getPointsValues();
  o[cardId] = cents;
  localStorage.setItem(PV_KEY, JSON.stringify(o));
}
function round2(n) {
  return Math.round(n * 100) / 100;
}

// Card payment network, for vendors that accept only some networks (e.g. Costco
// in-store = Visa). Uses NETWORK_OVERRIDES, then issuer/name; null = unknown.
function cardNetwork(card) {
  if (typeof NETWORK_OVERRIDES !== "undefined" && NETWORK_OVERRIDES[card.id]) {
    return NETWORK_OVERRIDES[card.id];
  }
  if (card.issuer === "American Express") return "Amex";
  if (card.issuer === "Discover") return "Discover";
  if (card.issuer === "Apple") return "Mastercard";
  const n = card.name.toLowerCase();
  if (n.includes("visa")) return "Visa";
  if (n.includes("mastercard")) return "Mastercard";
  return null;
}

/* ---------- reward lookup ---------- */
// Current calendar quarter, e.g. "2026-Q2".
function currentQuarter(d = new Date()) {
  return `${d.getFullYear()}-Q${Math.floor(d.getMonth() / 3) + 1}`;
}
// The rotating calendar entry active for `card` this quarter, or null.
function activeRotating(card) {
  if (!card.rotating || !card.rotating.calendar) return null;
  return card.rotating.calendar[currentQuarter()] || null;
}

// Rate a card earns in a category: the better of its fixed bonus, an active
// rotating 5% (this quarter only), or its base ("other") rate. For points cards
// the stored rate is a multiplier (points/$), converted to an effective % using
// the user's chosen per-point value.
function rateInfoFor(card, catKey) {
  let best = null;
  const fixed = card.rewards[catKey];
  if (fixed) best = { rate: fixed.rate, note: fixed.note || "", rotating: false, fallback: false };

  const rot = activeRotating(card);
  if (rot && rot.keys.includes(catKey)) {
    const r = card.rotating.rate ?? 5;
    if (!best || r > best.rate) {
      const cap = card.rotating.cap ? ` (${card.rotating.cap})` : "";
      best = { rate: r, note: `Rotating 5% this quarter — activate it${cap}.`, rotating: true, fallback: false };
    }
  }
  if (!best) {
    const base = card.rewards.other || { rate: 0 };
    best = { rate: base.rate, note: "", rotating: false, fallback: true };
  }
  if (card.points) {
    const cents = getPointsValue(card);
    return { ...best, mult: best.rate, rate: round2(best.rate * cents), points: card.points, cents };
  }
  return best;
}
function rankForCategory(catKey, cards) {
  return cards
    .map((card) => ({ card, ...rateInfoFor(card, catKey) }))
    .sort((a, b) => b.rate - a.rate || a.card.name.localeCompare(b.card.name));
}

/* ---------- formatting helpers ---------- */
function fmtRate(r) {
  return `${Number.isInteger(r) ? r : r.toFixed(1)}%`;
}
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}
// Colored monogram badge for an issuer. Real bank logos are trademarked, so we
// generate a recognizable brand-colored badge instead of bundling logo images.
function issuerBadge(issuer) {
  const meta = (typeof ISSUERS !== "undefined" && ISSUERS[issuer]) || {
    color: "#5b6b86",
    short: (issuer || "?").slice(0, 2).toUpperCase(),
  };
  return `<span class="logo" style="--logo:${meta.color}">${escapeHtml(meta.short)}</span>`;
}

/* ---------- rendering ---------- */
function renderPicker(filter = "") {
  const picker = document.getElementById("picker");
  const owned = new Set(getWalletIds());
  const q = filter.trim().toLowerCase();
  const terms = q.split(/\s+/).filter(Boolean);
  // Match when every typed word appears across the card name, issuer, or nicknames.
  const match = (c) => {
    if (!terms.length) return true;
    const issuerAka = ((ISSUERS[c.issuer] && ISSUERS[c.issuer].aka) || []).join(" ");
    const cardAka = (c.aka || []).join(" ");
    const hay = `${c.name} ${c.issuer} ${issuerAka} ${cardAka}`.toLowerCase();
    return terms.every((t) => hay.includes(t));
  };

  // Group matching cards by issuer, ordered by the ISSUERS list (extras last).
  const byIssuer = {};
  for (const c of CARDS) {
    if (!match(c)) continue;
    (byIssuer[c.issuer] = byIssuer[c.issuer] || []).push(c);
  }
  const order = [...new Set([...Object.keys(ISSUERS), ...Object.keys(byIssuer)])];
  const issuers = order.filter((i) => byIssuer[i]);

  if (!issuers.length) {
    picker.innerHTML = `<p class="muted">No cards match “${escapeHtml(filter)}”.</p>`;
    return;
  }

  picker.innerHTML = issuers
    .map((issuer) => {
      const cards = byIssuer[issuer];
      const ownedCount = cards.filter((c) => owned.has(c.id)).length;
      const chips = cards
        .map((c) => {
          const on = owned.has(c.id);
          const fee = c.annualFee ? `<span class="fee">$${c.annualFee}/yr</span>` : "";
          const chip = `<button class="chip ${on ? "on" : ""}" data-id="${c.id}" aria-pressed="${on}">
            ${issuerBadge(c.issuer)}<span class="chip-name">${escapeHtml(c.name)}</span>${fee}${
            c.points ? ' <span class="gem">💎</span>' : ""
          }
          </button>`;
          if (!c.points) return chip;
          // Points card: attach an inline per-card value selector.
          const v = getPointsValue(c);
          const opts = PV_OPTIONS.map(
            (x) => `<option value="${x}" ${x === v ? "selected" : ""}>${x}¢</option>`
          ).join("");
          return `<span class="chip-pv">${chip}
            <label class="pv" title="What a ${escapeHtml(c.points)} point is worth to you on this card">💎 <select class="pv-select" data-card="${c.id}">${opts}</select></label>
          </span>`;
        })
        .join("");
      // Folded by default; auto-open while searching so matches are visible.
      return `<details class="issuer-group" ${q ? "open" : ""}>
        <summary class="issuer-head">
          <span class="ih-left">${issuerBadge(issuer)} ${escapeHtml(issuer)}
            <span class="muted">(${cards.length})</span></span>
          <span class="owned-pill ${ownedCount ? "" : "hidden"}">${ownedCount}</span>
          <span class="chev" aria-hidden="true">▸</span>
        </summary>
        <div class="chips">${chips}</div>
      </details>`;
    })
    .join("");
}

// Keep an issuer's "N in wallet" pill in sync after a chip toggle (no re-render).
function updateOwnedPill(btn) {
  const group = btn.closest(".issuer-group");
  if (!group) return;
  const owned = new Set(getWalletIds());
  const n = [...group.querySelectorAll(".chip")].filter((c) => owned.has(c.dataset.id)).length;
  const pill = group.querySelector(".owned-pill");
  if (pill) {
    pill.textContent = String(n);
    pill.classList.toggle("hidden", n === 0);
  }
}

function renderResults() {
  const owned = ownedCards();
  const empty = document.getElementById("empty");
  const cheat = document.getElementById("cheatsheet");
  const toggle = document.getElementById("toggle-matrix");
  const matrixWrap = document.getElementById("matrix-wrap");
  const tip = document.getElementById("rotating-tip");

  if (owned.length === 0) {
    empty.classList.remove("hidden");
    cheat.innerHTML = "";
    toggle.classList.add("hidden");
    matrixWrap.classList.add("hidden");
    matrixWrap.innerHTML = "";
    tip.classList.add("hidden");
    return;
  }
  empty.classList.add("hidden");
  toggle.classList.remove("hidden");

  // This quarter's rotating 5% categories (activation required).
  const rotators = owned.filter((c) => c.rotating);
  if (rotators.length) {
    tip.classList.remove("hidden");
    const q = currentQuarter();
    const items = rotators
      .map((c) => {
        const entry = activeRotating(c);
        const detail = entry
          ? escapeHtml(entry.label)
          : `${q} categories aren't in the data yet — check the issuer and update cards.js`;
        return `<li><strong>${escapeHtml(c.name)}</strong> — ${detail}</li>`;
      })
      .join("");
    tip.innerHTML = `🔄 <strong>Rotating 5% this quarter (${q})</strong> — activate each card's categories with the issuer:<ul class="tip-list">${items}</ul>`;
  } else {
    tip.classList.add("hidden");
  }

  // "Best card per category" list.
  cheat.innerHTML = CATEGORIES.map((cat) => {
    const rank = rankForCategory(cat.key, owned);
    const top = rank[0];
    const tie = rank[1] && rank[1].rate === top.rate;

    const rows = rank
      .map((e) => {
        const tags = [];
        if (e.points) tags.push(`${e.mult}× ${escapeHtml(e.points)} @ ${e.cents}¢`);
        if (e.fallback) tags.push(`<span class="muted">base rate</span>`);
        if (e.note) tags.push(escapeHtml(e.note));
        const meta = tags.length ? `<span class="row-note">${tags.join(" · ")}</span>` : "";
        return `<li><span class="row-card">${issuerBadge(e.card.issuer)} ${escapeHtml(e.card.name)}</span>
          <span class="row-rate">${fmtRate(e.rate)}${e.rotating ? " 🔄" : ""}${e.points ? " 💎" : ""}</span>${meta}</li>`;
      })
      .join("");

    return `<details class="cat">
      <summary>
        <span class="cat-label">${cat.icon} ${escapeHtml(cat.label)}</span>
        <span class="cat-winner">${issuerBadge(top.card.issuer)} ${escapeHtml(top.card.name)}${tie ? " (tie)" : ""}</span>
        <span class="badge">${fmtRate(top.rate)}${top.rotating ? " 🔄" : ""}${top.points ? " 💎" : ""}</span>
      </summary>
      <ul class="rank">${rows}</ul>
    </details>`;
  }).join("");

  renderMatrix(owned);
}

function renderMatrix(owned) {
  const wrap = document.getElementById("matrix-wrap");
  const head = `<tr><th class="corner">Category</th>${owned
    .map((c) => `<th>${issuerBadge(c.issuer)}<br>${escapeHtml(c.name)}</th>`)
    .join("")}</tr>`;

  const body = CATEGORIES.map((cat) => {
    const cells = owned.map((c) => rateInfoFor(c, cat.key));
    const max = Math.max(...cells.map((x) => x.rate));
    const tds = cells
      .map(
        (x) =>
          `<td class="${x.rate === max ? "best" : ""} ${x.fallback ? "is-base" : ""}">${fmtRate(
            x.rate
          )}</td>`
      )
      .join("");
    return `<tr><th>${cat.icon} ${escapeHtml(cat.label)}</th>${tds}</tr>`;
  }).join("");

  wrap.innerHTML = `<table class="matrix"><thead>${head}</thead><tbody>${body}</tbody></table>
    <p class="muted small">Highlighted = best card you own for that row. Faded cells use the card's base rate.</p>`;
}

/* ---------- merchant search ---------- */
// 💗 A little private easter egg for the "Where are you shopping?" box: type one of
// these names to reveal a message + floating hearts. (Heads up: client-side code is
// public in the repo, so it's a sweet surprise, not a true secret.)
const EASTER_EGGS = {
  yunfan: { message: "Free for Xiaolin 💗", hearts: true },
  xiaolin: { message: "Ask Yunfan for a discount 😉", hearts: true },
};
const EGG_SIGNATURE = "made by Yunfan with 💗";
let lastEggShown = null;
function floatHearts(n = 26) {
  const layer = document.createElement("div");
  layer.className = "heart-layer";
  const set = ["💗", "💕", "❤️", "💖", "💞"];
  for (let i = 0; i < n; i++) {
    const h = document.createElement("span");
    h.className = "heart";
    h.textContent = set[i % set.length];
    h.style.left = Math.random() * 100 + "vw";
    h.style.fontSize = 18 + Math.random() * 30 + "px";
    h.style.animationDelay = Math.random() * 0.9 + "s";
    h.style.animationDuration = 2.6 + Math.random() * 2 + "s";
    layer.appendChild(h);
  }
  document.body.appendChild(layer);
  setTimeout(() => layer.remove(), 6500);
}

// Best matching merchant for a free-text query, or null.
function findMerchant(query) {
  const q = (query || "").trim().toLowerCase();
  if (!q) return null;
  let best = null,
    bestScore = -1;
  for (const m of MERCHANTS) {
    for (const n of [m.name, ...(m.aliases || [])]) {
      const name = n.toLowerCase();
      let score = -1;
      if (name === q) score = 100;
      else if (name.startsWith(q)) score = 80 + q.length / name.length;
      else if (q.startsWith(name)) score = 70 + name.length;
      else if (name.includes(q)) score = 50 + q.length / name.length;
      else if (q.includes(name)) score = 40 + name.length;
      if (score > bestScore) {
        bestScore = score;
        best = m;
      }
    }
  }
  return bestScore >= 0 ? best : null;
}

function renderMerchantResult(query) {
  const box = document.getElementById("merchant-result");
  const q = (query || "").trim();
  if (!q) {
    box.innerHTML = "";
    lastEggShown = null;
    return;
  }
  // 💗 easter egg
  const egg = EASTER_EGGS[q.toLowerCase()];
  if (egg) {
    box.innerHTML = `<div class="merchant-card egg" title="tap for more 💗">
      <div class="egg-msg">${escapeHtml(egg.message)}</div>
      <div class="egg-sub">${escapeHtml(EGG_SIGNATURE)}</div>
    </div>`;
    if (egg.hearts && lastEggShown !== q.toLowerCase()) floatHearts();
    lastEggShown = q.toLowerCase();
    return;
  }
  lastEggShown = null;
  const m = findMerchant(q);
  if (!m) {
    box.innerHTML = `<div class="merchant-card unknown">“${escapeHtml(
      q
    )}” isn't in the merchant list yet — use the category guide below, or add it to <code>MERCHANTS</code> in cards.js.</div>`;
    return;
  }
  const cat = CATEGORIES.find((c) => c.key === m.category);
  const head = `<div class="merchant-top"><span class="merchant-name">🛍️ ${escapeHtml(
    m.name
  )}</span><span class="muted">${cat.icon} ${escapeHtml(cat.label)}</span></div>`;
  const wallet = ownedCards();
  if (!wallet.length) {
    box.innerHTML = `<div class="merchant-card">${head}<div class="muted">Add cards to your wallet above to see which one to use.</div></div>`;
    return;
  }

  // Some vendors accept only certain card networks (e.g. Costco in-store = Visa).
  // Unknown-network cards are kept (with a "confirm" note); known-mismatch ones drop.
  const accepts = Array.isArray(m.networks) && m.networks.length ? m.networks : null;
  let usable = wallet;
  let excluded = [];
  if (accepts) {
    usable = wallet.filter((c) => {
      const net = cardNetwork(c);
      return net === null || accepts.includes(net);
    });
    excluded = wallet.filter((c) => {
      const net = cardNetwork(c);
      return net !== null && !accepts.includes(net);
    });
  }
  const warn = accepts
    ? `<div class="merchant-warn">⚠️ Accepts ${accepts.join("/")} only${
        excluded.length
          ? ` — won't take your ${excluded
              .slice(0, 3)
              .map((c) => escapeHtml(c.name))
              .join(", ")}${excluded.length > 3 ? ` +${excluded.length - 3} more` : ""}`
          : ""
      }.</div>`
    : "";

  if (accepts && !usable.length) {
    box.innerHTML = `<div class="merchant-card">${head}${warn}<div class="muted">None of your cards work here.</div>${
      m.note ? `<div class="merchant-note">ℹ️ ${escapeHtml(m.note)}</div>` : ""
    }</div>`;
    return;
  }

  const rank = rankForCategory(m.category, usable);
  const top = rank[0];
  const tie = rank[1] && rank[1].rate === top.rate;
  const topUnknownNet = accepts && cardNetwork(top.card) === null;
  const others = rank
    .slice(1, 3)
    .map((e) => `${issuerBadge(e.card.issuer)} ${escapeHtml(e.card.name)} ${fmtRate(e.rate)}`)
    .join(" · ");

  box.innerHTML = `<div class="merchant-card">
    ${head}
    ${warn}
    <div class="merchant-best">
      <span>Use ${issuerBadge(top.card.issuer)} <strong>${escapeHtml(top.card.name)}</strong>${
    tie ? " (tie)" : ""
  }</span>
      <span class="badge">${fmtRate(top.rate)}${top.rotating ? " 🔄" : ""}${top.points ? " 💎" : ""}</span>
    </div>
    ${topUnknownNet ? `<div class="merchant-note">Confirm this card is a ${accepts.join("/")}.</div>` : ""}
    ${top.points ? `<div class="merchant-note">${top.mult}× ${escapeHtml(top.points)} @ ${top.cents}¢</div>` : ""}
    ${top.note ? `<div class="merchant-note">${escapeHtml(top.note)}</div>` : ""}
    ${m.note ? `<div class="merchant-note">ℹ️ ${escapeHtml(m.note)}</div>` : ""}
    ${others ? `<div class="merchant-others">Also: ${others}</div>` : ""}
  </div>`;
}

function refreshMerchant() {
  const el = document.getElementById("merchant-input");
  if (el) renderMerchantResult(el.value);
}

/* ---------- events ---------- */
function init() {
  document.getElementById("updated").textContent = DATA_UPDATED;

  // Toggle a card in/out of the wallet.
  document.getElementById("picker").addEventListener("click", (e) => {
    const btn = e.target.closest(".chip");
    if (!btn) return;
    const id = btn.dataset.id;
    const ids = new Set(getWalletIds());
    const nowOn = !ids.has(id);
    nowOn ? ids.add(id) : ids.delete(id);
    setWalletIds([...ids]);
    btn.classList.toggle("on", nowOn);
    btn.setAttribute("aria-pressed", String(nowOn));
    updateOwnedPill(btn);
    renderResults();
    updateCount();
    refreshMerchant();
  });

  // Per-card points-value selectors (change bubbles to #picker).
  document.getElementById("picker").addEventListener("change", (e) => {
    const sel = e.target.closest(".pv-select");
    if (!sel) return;
    setPointsValue(sel.dataset.card, parseFloat(sel.value));
    renderResults();
    refreshMerchant();
  });

  document.getElementById("search").addEventListener("input", (e) => {
    renderPicker(e.target.value);
  });

  document.getElementById("clear-wallet").addEventListener("click", () => {
    if (getWalletIds().length && confirm("Remove all cards from your wallet?")) {
      setWalletIds([]);
      renderPicker(document.getElementById("search").value);
      renderResults();
      updateCount();
      refreshMerchant();
    }
  });

  const toggle = document.getElementById("toggle-matrix");
  toggle.addEventListener("click", () => {
    const wrap = document.getElementById("matrix-wrap");
    const hidden = wrap.classList.toggle("hidden");
    toggle.textContent = hidden ? "Show full comparison table" : "Hide comparison table";
  });

  // Merchant search: native autocomplete from the merchant list.
  const mInput = document.getElementById("merchant-input");
  document.getElementById("merchant-list").innerHTML = MERCHANTS.map(
    (m) => `<option value="${escapeHtml(m.name)}"></option>`
  ).join("");
  mInput.addEventListener("input", () => renderMerchantResult(mInput.value));
  // 💗 tap the easter-egg card for another burst of hearts
  document.getElementById("merchant-result").addEventListener("click", (e) => {
    if (e.target.closest(".merchant-card.egg")) floatHearts();
  });

  renderPicker();
  renderResults();
  updateCount();

  // Fold the wallet by default; open it on first run when no cards are chosen yet.
  document.getElementById("wallet-panel").open = getWalletIds().length === 0;
}

function updateCount() {
  const n = getWalletIds().length;
  document.getElementById("wallet-count").textContent = n ? `(${n})` : "";
}

document.addEventListener("DOMContentLoaded", init);

// Offline support (only when served over http/https, not file://).
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
