# CardPointer

A free, offline-capable web app (PWA): pick the credit cards you own, and instantly
see which one earns the most cash back in each spending category.

No accounts, no backend, no API keys — all data lives in a single editable file
(`cards.js`) and your wallet is saved in the browser's `localStorage`.

## Run it

**Quickest:** double-click `index.html` to open it in your browser. Everything works
except the service worker (offline mode), which browsers only allow over http/https.

**Full PWA (offline + installable):** serve the folder over a local web server, e.g.

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

On a phone, open the served URL and use the browser's **"Add to Home Screen"** to
install it like a native app.

## Edit the card data

Open `cards.js`. Each card looks like:

```js
{
  id: "my-card",                 // unique slug
  name: "My Card",
  issuer: "Some Bank",
  annualFee: 0,
  rewards: {
    dining: { rate: 4, note: "optional caveat" },
    other:  { rate: 1 },         // required: the everything-else rate
  },
  rotating: { rate: 5, note: "..." }, // optional, for quarterly 5% cards
  note: "card-level note",
}
```

- `rate` is percent cash back (`3` = 3%).
- `rewards` keys must match a category `key` in the `CATEGORIES` list (top of `cards.js`),
  plus the required `other` base rate.
- Add a new category by adding to `CATEGORIES`.
- `issuer` must match a key in the `ISSUERS` map (top of `cards.js`), which sets the
  brand color + monogram shown as the card's logo badge. Add new issuers there.

### Rotating cards (Discover it, Freedom Flex)

These use a per-quarter calendar so the app applies the **current quarter's** 5%
categories automatically:

```js
rotating: {
  rate: 5,
  cap: "up to $1,500/qtr, then 1%; activation required",
  calendar: {
    "2026-Q2": { keys: ["dining"], label: "Restaurants & home improvement stores" },
    // keys = app categories that get boosted; label = full issuer wording
  },
}
```

Issuers announce categories ~quarterly, so add each new quarter (`YYYY-Qn`) when it's
published. If the current quarter isn't in the calendar, the app says so and prompts
you to update it.

### Merchant search

The "Where are you shopping?" box maps a store to a category and recommends the best
card you own. Add or fix stores in the `MERCHANTS` list (bottom of `cards.js`):

```js
{ name: "Trader Joe's", category: "groceries", aliases: ["trader joes"], note: "optional caveat" }
```

`category` must be a CATEGORIES key; `aliases` improve matching; `note` shows a caveat
(e.g. "superstore — not grocery-bonus eligible").

## Deploy for free

Push the folder to a GitHub repo and enable **GitHub Pages** (Settings → Pages →
deploy from branch). Netlify and Cloudflare Pages also host static folders for free.

## Notes & limitations

- Rates are **hand-curated** and may go stale — always confirm with the issuer.
- Rotating 5% categories are applied for the current quarter from each card's
  `calendar`, but the app does **not** track your spend, so it can't enforce caps
  ($1,500/qtr) or confirm you've activated them — it just reminds you.
- "Choose your category" cards (BofA Customized, Citi Custom Cash, Venmo) list their
  eligible bonus categories at the bonus rate with a note; you can only get the bonus
  on one at a time.
- **Targeted offers** (Amex Offers, Chase Offers) are *not* included — they're
  personalized per account with no public data source. They'd need a separate manual
  tracker (merchant + reward + expiry), not the category model.
- **Points** cards (Amex Gold, Sapphire Preferred, Citi Strata Premier, Venture, Bilt)
  store their `rewards` rates as point **multipliers** and carry a `points` currency.
  The **"Value points at"** toggle (1¢ / 1.5¢ / 2¢) converts them to an effective %, so
  the ranking reflects how *you* redeem. They're marked 💎. Cash-back cards are always 1¢.
