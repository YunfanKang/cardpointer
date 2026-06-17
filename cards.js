/*
 * CardPointer reward data — hand-curated.
 *
 * HOW TO EDIT:
 *   - Add a card by copying a block in CARDS and changing the values.
 *   - `issuer` must match a key in ISSUERS (controls the colored logo badge).
 *     Add new issuers there.
 *   - `rewards` keys must be a category `key` from CATEGORIES, plus the required
 *     `other` (base / everything-else) rate. `rate` is percent cash back (3 = 3%).
 *   - For most cards `rate` is percent cash back (3 = 3%).
 *   - For cards with a `points` currency (e.g. "Chase Ultimate Rewards"), `rate` is
 *     points PER DOLLAR (a multiplier, 4 = 4x). The app converts it to an effective
 *     % using the per-point value chosen in the "Value points" toggle.
 *   - Optional `aka: [...]` on a card adds extra search synonyms.
 *
 * Rates are best-effort as of the date below. Programs change and exclusions
 * apply — always confirm with the issuer.
 */

const DATA_UPDATED = "January 2026";

// Issuer → brand color + short monogram for the logo badge.
const ISSUERS = {
  "American Express": { color: "#006FCF", short: "AX", aka: ["amex"] },
  "Chase":            { color: "#117ACA", short: "CH" },
  "Citi":             { color: "#003B70", short: "CI", aka: ["citibank"] },
  "Capital One":      { color: "#13294B", short: "C1", aka: ["capone", "cap one"] },
  "Discover":         { color: "#F26E00", short: "DI" },
  "Bank of America":  { color: "#E31837", short: "BA", aka: ["bofa", "boa"] },
  "Wells Fargo":      { color: "#D71E28", short: "WF" },
  "U.S. Bank":        { color: "#0C2074", short: "UB", aka: ["us bank", "usbank"] },
  "Apple":            { color: "#1D1D1F", short: "AP" },
  "SoFi":             { color: "#00A0B0", short: "SF" },
  "Fidelity":         { color: "#368727", short: "FI" },
  "PayPal":           { color: "#003087", short: "PP" },
  "Robinhood":        { color: "#00C805", short: "RH" },
  "Venmo":            { color: "#3D95CE", short: "VN" },
  "PenFed":           { color: "#00467F", short: "PF" },
  "Alliant":          { color: "#E37222", short: "AL" },
  "Bilt":             { color: "#1A1A1A", short: "BL", aka: ["rent"] },
  "Credit One":       { color: "#0E4D8B", short: "CO", aka: ["creditone"] },
  "Shop Your Way":    { color: "#1C6EC8", short: "SY", aka: ["syw", "5321", "sears"] },
};

// Default ¢-per-point per rewards currency (each user can override per card in the
// UI). Hotel points are worth well under 1¢; transferable currencies default to 1¢.
const POINTS_DEFAULTS = {
  "Amex Membership Rewards": 1,
  "Chase Ultimate Rewards": 1,
  "Citi ThankYou": 1,
  "Capital One Miles": 1,
  "Bilt": 1,
  "United MileagePlus": 1.25,
  "American AAdvantage": 1.25,
  "Delta SkyMiles": 1.25,
  "Southwest Rapid Rewards": 1.25,
  "World of Hyatt": 1.75,
  "Hilton Honors": 0.5,
  "Marriott Bonvoy": 0.75,
  "IHG One Rewards": 0.5,
};

// Card payment network, for vendors that accept only some networks (e.g. Costco).
// Amex/Discover/Apple and "...Visa"/"...Mastercard" names are detected automatically;
// this map covers the rest. Best-effort — some products ship on multiple networks,
// so edit to match your actual card.
const NETWORK_OVERRIDES = {
  "chase-freedom-flex": "Mastercard",
  "chase-freedom-unlimited": "Visa",
  "chase-freedom-rise": "Visa",
  "chase-sapphire-preferred": "Visa",
  "chase-sapphire-reserve": "Visa",
  "chase-ink-cash": "Mastercard",
  "chase-ink-unlimited": "Visa",
  "chase-ihg-premier": "Mastercard",
  "chase-united-gateway": "Visa",
  "chase-united-explorer": "Visa",
  "chase-united-quest": "Visa",
  "chase-united-club": "Visa",
  "chase-southwest-priority": "Visa",
  "chase-hyatt": "Visa",
  "chase-marriott-boundless": "Visa",
  "citi-double-cash": "Mastercard",
  "citi-custom-cash": "Mastercard",
  "citi-strata-premier": "Mastercard",
  "citi-strata": "Mastercard",
  "citi-rewards-plus": "Mastercard",
  "citi-aa-platinum": "Mastercard",
  "capone-venture": "Visa",
  "capone-venture-x": "Visa",
  "wf-active-cash": "Visa",
  "wf-autograph": "Visa",
  "wf-autograph-journey": "Visa",
  "usbank-cashplus": "Visa",
  "usbank-altitude-go": "Visa",
  "usbank-altitude-connect": "Visa",
  "boa-premium-rewards": "Visa",
  "boa-travel-rewards": "Visa",
  "sofi-credit": "Mastercard",
  "venmo-card": "Visa",
  "robinhood-gold": "Visa",
  "penfed-power-cash": "Visa",
  "alliant-cashback": "Visa",
  "creditone-amex": "Amex",
};

const CATEGORIES = [
  { key: "dining",        label: "Dining / Restaurants", icon: "🍽️" },
  { key: "groceries",     label: "Groceries",            icon: "🛒" },
  { key: "gas",           label: "Gas",                  icon: "⛽" },
  { key: "transit",       label: "Transit / Commute",    icon: "🚇" },
  { key: "travel",        label: "Travel",               icon: "✈️" },
  { key: "streaming",     label: "Streaming",            icon: "📺" },
  { key: "online",        label: "Online / Amazon",      icon: "📦" },
  { key: "drugstores",    label: "Drugstores",           icon: "💊" },
  { key: "entertainment", label: "Entertainment",        icon: "🎟️" },
  { key: "wholesale",     label: "Warehouse Clubs",      icon: "🏬" },
  { key: "other",         label: "Everything else",      icon: "💳" },
];

const CARDS = [
  /* ---------------- American Express ---------------- */
  {
    id: "amex-bcp", name: "Blue Cash Preferred", issuer: "American Express", annualFee: 95,
    rewards: {
      groceries: { rate: 6, note: "U.S. supermarkets, up to $6,000/yr (then 1%)." },
      streaming: { rate: 6, note: "Select U.S. streaming services." },
      transit: { rate: 3 },
      gas: { rate: 3, note: "U.S. gas stations." },
      other: { rate: 1 },
    },
    note: "$95 annual fee. Best-in-class for groceries + streaming.",
  },
  {
    id: "amex-bce", name: "Blue Cash Everyday", issuer: "American Express", annualFee: 0,
    rewards: {
      groceries: { rate: 3, note: "U.S. supermarkets, up to $6,000/yr (then 1%)." },
      online: { rate: 3, note: "U.S. online retail, up to $6,000/yr (then 1%)." },
      gas: { rate: 3, note: "U.S. gas stations, up to $6,000/yr (then 1%)." },
      other: { rate: 1 },
    },
    note: "No annual fee.",
  },
  {
    id: "amex-gold", name: "Gold Card", issuer: "American Express", annualFee: 325,
    points: "Amex Membership Rewards",
    rewards: {
      dining: { rate: 4 },
      groceries: { rate: 4, note: "U.S. supermarkets, up to $25,000/yr (then 1x)." },
      travel: { rate: 3, note: "Flights booked direct or via Amex Travel." },
      other: { rate: 1 },
    },
    aka: ["gold", "membership rewards", "mr"],
    note: "Earns Membership Rewards points. $325 AF, offset by dining/Uber/Resy credits. Transfer to airline/hotel partners for higher value.",
  },

  /* ---------------- Chase ---------------- */
  {
    id: "chase-freedom-unlimited", name: "Freedom Unlimited", issuer: "Chase", annualFee: 0,
    rewards: { dining: { rate: 3 }, drugstores: { rate: 3 }, other: { rate: 1.5 } },
    note: "Also 5% on travel booked through Chase Travel.",
  },
  {
    id: "chase-freedom-flex", name: "Freedom Flex", issuer: "Chase", annualFee: 0,
    rewards: { dining: { rate: 3 }, drugstores: { rate: 3 }, other: { rate: 1 } },
    rotating: {
      rate: 5,
      cap: "up to $1,500/qtr, then 1%; activation required",
      // `keys` are app categories boosted in recommendations; `label` is the full
      // issuer wording (incl. merchant/charity items that don't map to a category).
      calendar: {
        "2026-Q1": { keys: ["dining"], label: "Dining, Norwegian Cruise Line, American Heart Association" },
        "2026-Q2": { keys: ["online"], label: "Amazon, Whole Foods Market, Chase Travel, Feeding America" },
        "2026-Q3": { keys: ["gas", "transit", "entertainment"], label: "Gas & EV charging, public transit, select live entertainment, United Way" },
        // Q4 2026: not announced yet — add it here when Chase publishes it.
      },
    },
    note: "Also 5% on travel booked through Chase Travel.",
  },
  {
    id: "chase-freedom-rise", name: "Freedom Rise", issuer: "Chase", annualFee: 0,
    rewards: { other: { rate: 1.5 } },
    note: "Starter card — flat 1.5%. Good for building credit.",
  },
  {
    id: "amazon-prime-visa", name: "Prime Visa (Amazon)", issuer: "Chase", annualFee: 0,
    rewards: {
      online: { rate: 5, note: "Amazon.com & Whole Foods, with an eligible Prime membership." },
      dining: { rate: 2 }, gas: { rate: 2 }, transit: { rate: 2 }, other: { rate: 1 },
    },
    note: "Requires an eligible Amazon Prime membership for the 5% rate.",
  },
  {
    id: "chase-sapphire-preferred", name: "Sapphire Preferred", issuer: "Chase", annualFee: 95,
    points: "Chase Ultimate Rewards",
    rewards: { dining: { rate: 3 }, streaming: { rate: 3 }, travel: { rate: 2 }, other: { rate: 1 } },
    aka: ["sapphire", "csp", "ultimate rewards"],
    note: "Earns Ultimate Rewards points. Also 5x travel via Chase Travel & 3x online groceries. $95 AF; points worth 25% more through Chase Travel, or transfer to airline/hotel partners.",
  },

  /* ---------------- Citi ---------------- */
  {
    id: "citi-double-cash", name: "Double Cash", issuer: "Citi", annualFee: 0,
    rewards: { other: { rate: 2 } },
    note: "Flat 2% on everything (1% when you buy + 1% as you pay).",
  },
  {
    id: "citi-custom-cash", name: "Custom Cash", issuer: "Citi", annualFee: 0,
    rewards: { other: { rate: 1 } },
    choose: {
      rate: 5,
      categories: ["dining", "gas", "groceries", "transit", "streaming", "drugstores", "entertainment"],
      note: "Your active 5% category (up to $500/cycle, then 1%).",
    },
    note: "Earns 5% on only ONE eligible category each billing cycle — your highest-spend one, up to $500 (then 1%). Set which below.",
  },
  {
    id: "costco-citi", name: "Costco Anywhere Visa", issuer: "Citi", annualFee: 0,
    rewards: {
      gas: { rate: 4, note: "Incl. EV charging, up to $7,000/yr (then 1%)." },
      dining: { rate: 3 }, travel: { rate: 3 },
      wholesale: { rate: 2, note: "Costco & Costco.com." }, other: { rate: 1 },
    },
    note: "Requires a Costco membership. Rewards paid once a year as a certificate.",
  },
  {
    id: "citi-strata-premier", name: "Strata Premier", issuer: "Citi", annualFee: 95,
    points: "Citi ThankYou",
    rewards: {
      dining: { rate: 3 }, groceries: { rate: 3 }, gas: { rate: 3 }, travel: { rate: 3 }, other: { rate: 1 },
    },
    aka: ["thankyou", "thank you", "strata", "premier"],
    note: "Earns ThankYou Points. 3x dining, supermarkets, gas, air travel & hotels; 10x hotels/cars/attractions via Citi Travel. $95 AF. Transfer to airline partners.",
  },
  {
    id: "citi-thankyou", name: "ThankYou Mastercard", issuer: "Citi", annualFee: 0,
    points: "Citi ThankYou",
    rewards: {
      gas: { rate: 5, note: "Up to $10,000/yr (then 1x)." },
      groceries: { rate: 3, note: "With dining, up to $10,000/yr combined (then 1x)." },
      dining: { rate: 3, note: "With groceries, up to $10,000/yr combined (then 1x)." },
      drugstores: { rate: 3, note: "Also department stores." },
      other: { rate: 1 },
    },
    aka: ["thankyou", "thank you"],
    note: "Earns ThankYou Points. 5x gas, 3x groceries & dining, 3x department & drug stores, 1x else. No annual fee. No longer open to new applicants (legacy/converted card).",
  },
  /* ---------------- Capital One ---------------- */
  {
    id: "capone-quicksilver", name: "Quicksilver", issuer: "Capital One", annualFee: 0,
    rewards: { other: { rate: 1.5 } },
    note: "Flat 1.5% on everything.",
  },
  {
    id: "capone-quicksilverone", name: "QuicksilverOne", issuer: "Capital One", annualFee: 39,
    rewards: { other: { rate: 1.5 } },
    note: "Flat 1.5% for fair/average credit. $39 annual fee.",
  },
  {
    id: "capone-savor", name: "Savor", issuer: "Capital One", annualFee: 0,
    rewards: {
      dining: { rate: 3 }, entertainment: { rate: 3 }, streaming: { rate: 3 },
      groceries: { rate: 3, note: "Excludes superstores like Walmart/Target & warehouse clubs." },
      other: { rate: 1 },
    },
    note: "Also 8% on Capital One Entertainment bookings. No annual fee.",
  },
  {
    id: "capone-venture", name: "Venture", issuer: "Capital One", annualFee: 95,
    points: "Capital One Miles",
    rewards: { other: { rate: 2 } },
    aka: ["venture", "miles"],
    note: "Earns 2x miles on everything; 5x hotels & rental cars via Capital One Travel. $95 AF. Miles transfer to airline/hotel partners.",
  },

  /* ---------------- Discover ---------------- */
  {
    id: "discover-it", name: "Discover it Cash Back", issuer: "Discover", annualFee: 0,
    rewards: { other: { rate: 1 } },
    rotating: {
      rate: 5,
      cap: "up to $1,500/qtr, then 1%; activation required",
      calendar: {
        "2026-Q1": { keys: ["groceries", "wholesale", "streaming"], label: "Grocery stores, wholesale clubs, select streaming" },
        "2026-Q2": { keys: ["dining"], label: "Restaurants & home improvement stores" },
        "2026-Q3": { keys: ["gas", "transit", "drugstores"], label: "Gas & EV charging, public transit, flights, drugstores" },
        // Q4 2026: not announced yet — add it here when Discover publishes it.
      },
    },
    note: "New cardholders: Discover matches all cash back earned in your first year.",
  },
  {
    id: "discover-it-chrome", name: "Discover it Chrome", issuer: "Discover", annualFee: 0,
    rewards: {
      dining: { rate: 2, note: "Combined with gas, up to $1,000/qtr (then 1%)." },
      gas: { rate: 2, note: "Combined with dining, up to $1,000/qtr (then 1%)." },
      other: { rate: 1 },
    },
    note: "First-year cash-back match for new cardholders.",
  },
  {
    id: "discover-it-miles", name: "Discover it Miles", issuer: "Discover", annualFee: 0,
    rewards: { other: { rate: 1.5 } },
    note: "1.5x miles ≈ 1.5% as a statement credit. First-year miles match.",
  },

  /* ---------------- Bank of America ---------------- */
  {
    id: "boa-customized-cash", name: "Customized Cash Rewards", issuer: "Bank of America", annualFee: 0,
    rewards: { groceries: { rate: 2 }, wholesale: { rate: 2 }, other: { rate: 1 } },
    choose: {
      rate: 3,
      categories: ["dining", "gas", "online", "travel", "drugstores"],
      note: "Your chosen 3% category.",
    },
    note: "Pick ONE 3% category (below); also 2% at groceries & warehouse clubs. Bonus rates apply to the first $2,500/qtr combined. Boosted up to 75% for Preferred Rewards members.",
  },
  {
    id: "boa-unlimited-cash", name: "Unlimited Cash Rewards", issuer: "Bank of America", annualFee: 0,
    rewards: { other: { rate: 1.5 } },
    note: "Flat 1.5%. Preferred Rewards members can boost this up to ~2.62%.",
  },

  /* ---------------- Wells Fargo ---------------- */
  {
    id: "wf-active-cash", name: "Active Cash", issuer: "Wells Fargo", annualFee: 0,
    rewards: { other: { rate: 2 } },
    note: "Flat 2% cash rewards on everything.",
  },
  {
    id: "wf-autograph", name: "Autograph", issuer: "Wells Fargo", annualFee: 0,
    rewards: {
      dining: { rate: 3 }, travel: { rate: 3 }, gas: { rate: 3 },
      transit: { rate: 3 }, streaming: { rate: 3 }, other: { rate: 1 },
    },
    note: "Earns points (~1¢ as cash). Also 3% on phone plans.",
  },

  /* ---------------- U.S. Bank ---------------- */
  {
    id: "usbank-cashplus", name: "Cash+", issuer: "U.S. Bank", annualFee: 0,
    rewards: {
      streaming: { rate: 5, note: "Eligible as a 5% pick (TV, internet & streaming category)." },
      other: { rate: 1 },
    },
    note: "Choose two 5% categories (up to $2,000/qtr combined) and one 2% everyday category from U.S. Bank's lists. Many 5% options are niche (cell phone, utilities, fast food, etc.).",
  },
  {
    id: "usbank-altitude-go", name: "Altitude Go", issuer: "U.S. Bank", annualFee: 0,
    rewards: {
      dining: { rate: 4, note: "Incl. takeout & delivery." },
      groceries: { rate: 2 }, gas: { rate: 2 }, streaming: { rate: 2 }, other: { rate: 1 },
    },
    note: "Earns points (~1¢ as cash).",
  },

  /* ---------------- Apple ---------------- */
  {
    id: "apple-card", name: "Apple Card", issuer: "Apple", annualFee: 0,
    rewards: { other: { rate: 1 } },
    note: "3% at Apple & select partners (Walgreens, Exxon/Mobil, Uber, T-Mobile, Nike, Panera). 2% on any Apple Pay purchase. 1% on the physical card.",
  },

  /* ---------------- Other issuers ---------------- */
  {
    id: "sofi-credit", name: "SoFi Credit Card", issuer: "SoFi", annualFee: 0,
    rewards: { other: { rate: 2 } },
    note: "2% when points are redeemed into an eligible SoFi account.",
  },
  {
    id: "fidelity-rewards", name: "Fidelity Rewards Visa", issuer: "Fidelity", annualFee: 0,
    rewards: { other: { rate: 2 } },
    note: "Flat 2% deposited into an eligible Fidelity account.",
  },
  {
    id: "paypal-cashback", name: "PayPal Cashback Mastercard", issuer: "PayPal", annualFee: 0,
    rewards: {
      online: { rate: 3, note: "When you check out with PayPal." },
      other: { rate: 1.5 },
    },
    note: "Issued by Synchrony. 3% on PayPal purchases, 1.5% everywhere else.",
  },
  {
    id: "robinhood-gold", name: "Robinhood Gold Card", issuer: "Robinhood", annualFee: 0,
    rewards: { other: { rate: 3 } },
    note: "Flat 3% on everything — requires a Robinhood Gold subscription ($5/mo or $50/yr).",
  },
  {
    id: "venmo-card", name: "Venmo Credit Card", issuer: "Venmo", annualFee: 0,
    rewards: { other: { rate: 1 } },
    choose: {
      rate: 3,
      categories: ["dining", "groceries", "gas", "travel", "transit", "entertainment"],
      note: "Your top spend category (auto).",
    },
    note: "Issued by Synchrony. 3% auto-applies to your top spend category each month, 2% to the second, 1% else. Set your top category below.",
  },
  {
    id: "penfed-power-cash", name: "Power Cash Rewards", issuer: "PenFed", annualFee: 0,
    rewards: { other: { rate: 2 } },
    note: "2% with PenFed Honors (a checking account or military), otherwise 1.5%. Credit-union membership required.",
  },
  {
    id: "alliant-cashback", name: "Cashback Visa", issuer: "Alliant", annualFee: 0,
    rewards: { other: { rate: 2.5 } },
    note: "Up to 2.5% on the first $10,000/mo with an eligible checking account & balance requirements, otherwise 1.5%.",
  },

  /* ---------------- Bilt (Bilt 2.0, issued by Column N.A.) ---------------- */
  {
    id: "bilt-blue", name: "Bilt Blue", issuer: "Bilt", annualFee: 0,
    points: "Bilt",
    rewards: { other: { rate: 1 } },
    aka: ["bilt", "rent", "blue"],
    note: "Bilt 2.0 (issued by Column N.A.). 1x everyday, up to 1.25x on rent/mortgage — or 4% Bilt Cash on everyday spend. No annual fee. New program; verify details.",
  },
  {
    id: "bilt-obsidian", name: "Bilt Obsidian", issuer: "Bilt", annualFee: 95,
    points: "Bilt",
    rewards: {
      dining: { rate: 3 },
      groceries: { rate: 3, note: "Up to $25,000/yr (then 1x)." },
      travel: { rate: 2 },
      other: { rate: 1 },
    },
    aka: ["bilt", "rent", "obsidian"],
    note: "Bilt 2.0 (Column N.A.). 3x dining & groceries, 2x travel, up to 1.25x housing. $95 AF, $100 hotel credit. New program; verify details.",
  },
  {
    id: "bilt-palladium", name: "Bilt Palladium", issuer: "Bilt", annualFee: 495,
    points: "Bilt",
    rewards: { other: { rate: 2 } },
    aka: ["bilt", "rent", "palladium"],
    note: "Bilt 2.0 (Column N.A.). Flat 2x everyday, up to 1.25x housing. $495 AF; $400 hotel credit, $200 Bilt Cash, Priority Pass. New program; verify details.",
  },

  /* ---------------- Credit One ---------------- */
  {
    id: "creditone-x5", name: "Platinum X5 Visa", issuer: "Credit One", annualFee: 95,
    rewards: {
      gas: { rate: 5, note: "First $5,000/yr combined with the other 5% categories (then 1%)." },
      groceries: { rate: 5, note: "First $5,000/yr combined (then 1%)." },
      other: { rate: 1 },
    },
    aka: ["creditone", "x5"],
    note: "5% on the first $5,000/yr combined across gas, groceries, internet, cable/satellite TV & mobile phone, then 1%. $95 annual fee. A credit-building card.",
  },
  {
    id: "creditone-amex", name: "Amex Card", issuer: "Credit One", annualFee: 0,
    rewards: { other: { rate: 2 } },
    aka: ["creditone", "amex", "american express"],
    note: "Credit One Bank American Express Card — flat 2% cash back on all purchases (runs on the Amex network).",
  },

  /* ---------------- Shop Your Way ---------------- */
  {
    id: "syw-5321", name: "Shop Your Way 5321 Visa", issuer: "Shop Your Way", annualFee: 0,
    rewards: {
      gas: { rate: 5, note: "Plus EV charging." },
      transit: { rate: 5, note: "Transportation: transit, rideshare, taxis, parking, tolls, car washes." },
      dining: { rate: 3 }, groceries: { rate: 3 }, travel: { rate: 3 }, other: { rate: 1 },
    },
    aka: ["syw", "5321", "sears", "shop your way"],
    note: "Relaunched Nov 2025 as a Visa issued by First Bank & Trust (no longer Citi). 5% gas & transportation, 3% dining/groceries/travel, 2% Shop Your Way network, 1% else — paid in Shop Your Way points (≈1¢, ecosystem redemption).",
  },

  /* ===== Additional popular cards (grouped by issuer at render time) ===== */

  /* American Express */
  {
    id: "amex-platinum", name: "Platinum Card", issuer: "American Express", annualFee: 695,
    points: "Amex Membership Rewards",
    rewards: { travel: { rate: 5, note: "Flights booked direct/Amex Travel & prepaid hotels via Amex Travel." }, other: { rate: 1 } },
    aka: ["platinum", "plat"],
    note: "Earns Membership Rewards. $695 AF offset by extensive credits + airport lounges.",
  },
  {
    id: "amex-green", name: "Green Card", issuer: "American Express", annualFee: 150,
    points: "Amex Membership Rewards",
    rewards: { dining: { rate: 3 }, travel: { rate: 3 }, transit: { rate: 3 }, other: { rate: 1 } },
    aka: ["green"],
    note: "Earns Membership Rewards. 3x travel, transit & restaurants. $150 AF.",
  },
  {
    id: "amex-hilton", name: "Hilton Honors", issuer: "American Express", annualFee: 0,
    points: "Hilton Honors",
    rewards: { travel: { rate: 7, note: "Hilton properties." }, dining: { rate: 5 }, groceries: { rate: 5 }, gas: { rate: 5 }, other: { rate: 3 } },
    aka: ["hilton"],
    note: "No-AF Hilton cobrand. 7x Hilton, 5x U.S. dining/supermarkets/gas, 3x else. Hilton points (~0.5¢).",
  },
  {
    id: "amex-delta-gold", name: "Delta SkyMiles Gold", issuer: "American Express", annualFee: 150,
    points: "Delta SkyMiles",
    rewards: { travel: { rate: 2, note: "Delta purchases." }, dining: { rate: 2 }, groceries: { rate: 2, note: "U.S. supermarkets." }, other: { rate: 1 } },
    aka: ["delta", "skymiles"],
    note: "$150 AF (waived first year). Delta miles. Free checked bag on Delta.",
  },
  {
    id: "amex-blue-business-plus", name: "Blue Business Plus", issuer: "American Express", annualFee: 0,
    points: "Amex Membership Rewards",
    rewards: { other: { rate: 2, note: "2x on the first $50,000/yr, then 1x." } },
    aka: ["business", "bbp"],
    note: "Business card. Flat 2x Membership Rewards (to $50k/yr). No AF.",
  },

  /* Chase */
  {
    id: "chase-sapphire-reserve", name: "Sapphire Reserve", issuer: "Chase", annualFee: 550,
    points: "Chase Ultimate Rewards",
    rewards: { dining: { rate: 3 }, travel: { rate: 3 }, other: { rate: 1 } },
    aka: ["sapphire", "csr", "reserve"],
    note: "Earns Ultimate Rewards. 8x via Chase Travel, 3x dining & travel, 1x else. High AF, recently refreshed — verify current AF/credits.",
  },
  {
    id: "chase-ink-cash", name: "Ink Business Cash", issuer: "Chase", annualFee: 0,
    points: "Chase Ultimate Rewards",
    rewards: { gas: { rate: 2 }, dining: { rate: 2 }, other: { rate: 1 } },
    aka: ["ink", "business"],
    note: "Business card. 5x office supplies & internet/cable/phone (to $25k/yr), 2x gas & dining (to $25k/yr), 1x else.",
  },
  {
    id: "chase-ink-unlimited", name: "Ink Business Unlimited", issuer: "Chase", annualFee: 0,
    points: "Chase Ultimate Rewards",
    rewards: { other: { rate: 1.5 } },
    aka: ["ink", "business"],
    note: "Business card. Flat 1.5x Ultimate Rewards. No AF.",
  },
  {
    id: "chase-united-gateway", name: "United Gateway", issuer: "Chase", annualFee: 0,
    points: "United MileagePlus",
    rewards: { gas: { rate: 2 }, transit: { rate: 2, note: "Local transit & commuting (incl. rideshare, parking, tolls)." }, other: { rate: 1 } },
    aka: ["united", "gateway", "mileageplus"],
    note: "No-AF United cobrand. 2x United, 2x gas, 2x transit/commuting, 1x else. Earns MileagePlus miles.",
  },
  {
    id: "chase-united-explorer", name: "United Explorer", issuer: "Chase", annualFee: 95,
    points: "United MileagePlus",
    rewards: { travel: { rate: 2, note: "United & hotels booked direct." }, dining: { rate: 2 }, other: { rate: 1 } },
    aka: ["united", "explorer", "mileageplus"],
    note: "$95 AF (waived first year). 2x United, dining & hotels. Free checked bag + 2 lounge passes/yr. MileagePlus miles.",
  },
  {
    id: "chase-united-quest", name: "United Quest", issuer: "Chase", annualFee: 350,
    points: "United MileagePlus",
    rewards: { travel: { rate: 2, note: "3x on United; 2x other travel." }, dining: { rate: 2 }, streaming: { rate: 2 }, other: { rate: 1 } },
    aka: ["united", "quest", "mileageplus"],
    note: "$350 AF. 3x United, 2x other travel/dining/streaming, 1x else. Annual United & rideshare credits + anniversary miles. MileagePlus miles.",
  },
  {
    id: "chase-united-club", name: "United Club Infinite", issuer: "Chase", annualFee: 525,
    points: "United MileagePlus",
    rewards: { travel: { rate: 2, note: "4x on United; 2x other travel." }, dining: { rate: 2 }, other: { rate: 1 } },
    aka: ["united", "club", "infinite", "mileageplus"],
    note: "$525 AF. 4x United, 2x other travel & dining, 1x else. Includes United Club lounge membership. MileagePlus miles.",
  },
  {
    id: "chase-hyatt", name: "World of Hyatt", issuer: "Chase", annualFee: 95,
    points: "World of Hyatt",
    rewards: { travel: { rate: 4, note: "Hyatt properties." }, dining: { rate: 2 }, transit: { rate: 2 }, other: { rate: 1 } },
    aka: ["hyatt"],
    note: "$95 AF. Hyatt points (high value); 2x dining/airline/transit/gym. Annual free night.",
  },
  {
    id: "chase-marriott-boundless", name: "Marriott Bonvoy Boundless", issuer: "Chase", annualFee: 95,
    points: "Marriott Bonvoy",
    rewards: { travel: { rate: 6, note: "Marriott properties." }, dining: { rate: 3 }, groceries: { rate: 3 }, gas: { rate: 3 }, other: { rate: 2 } },
    aka: ["marriott", "bonvoy"],
    note: "$95 AF. 6x Marriott; 3x grocery/gas/dining (to $6k/qtr, then 2x); 2x else. Annual free night.",
  },
  {
    id: "chase-ihg-premier", name: "IHG One Rewards Premier", issuer: "Chase", annualFee: 99,
    points: "IHG One Rewards",
    rewards: { travel: { rate: 5 }, dining: { rate: 5 }, gas: { rate: 5 }, other: { rate: 3 } },
    aka: ["ihg"],
    note: "$99 AF. 10x at IHG hotels; 5x travel/gas/dining; 3x else. Anniversary free night.",
  },
  {
    id: "chase-southwest-priority", name: "Southwest Rapid Rewards Priority", issuer: "Chase", annualFee: 149,
    points: "Southwest Rapid Rewards",
    rewards: { travel: { rate: 3, note: "Southwest purchases." }, transit: { rate: 2 }, streaming: { rate: 2 }, other: { rate: 1 } },
    aka: ["southwest"],
    note: "$149 AF. 3x Southwest; 2x transit, internet/cable/phone & streaming. Annual travel credit.",
  },

  /* Citi */
  {
    id: "citi-strata", name: "Strata", issuer: "Citi", annualFee: 0,
    points: "Citi ThankYou",
    rewards: { groceries: { rate: 3 }, transit: { rate: 3 }, gas: { rate: 3, note: "Incl. EV charging." }, streaming: { rate: 3, note: "Only if chosen as your self-select 3x category." }, entertainment: { rate: 3, note: "Live entertainment — only if chosen as your self-select 3x category." }, other: { rate: 1 } },
    aka: ["strata", "thankyou", "thank you"],
    note: "No-AF ThankYou card. 3x supermarkets, transit, gas & EV; plus 3x on ONE self-select category.",
  },
  {
    id: "citi-rewards-plus", name: "Rewards+", issuer: "Citi", annualFee: 0,
    points: "Citi ThankYou",
    rewards: { groceries: { rate: 2 }, gas: { rate: 2 }, other: { rate: 1 } },
    aka: ["rewards+", "rewards plus", "thankyou"],
    note: "No AF. 2x supermarkets & gas (to $6k/yr combined). Rounds each purchase up to the nearest 10 points; 10% points back on the first 100k redeemed/yr.",
  },
  {
    id: "citi-aa-platinum", name: "AAdvantage Platinum Select", issuer: "Citi", annualFee: 99,
    points: "American AAdvantage",
    rewards: { travel: { rate: 2, note: "American Airlines purchases." }, dining: { rate: 2 }, gas: { rate: 2 }, other: { rate: 1 } },
    aka: ["american airlines", "aadvantage", "aa"],
    note: "$99 AF (waived first year). AAdvantage miles. Free checked bag on American.",
  },

  /* Capital One */
  {
    id: "capone-venture-x", name: "Venture X", issuer: "Capital One", annualFee: 395,
    points: "Capital One Miles",
    rewards: { other: { rate: 2 } },
    aka: ["venture", "venturex"],
    note: "2x miles on everything; 10x hotels/cars & 5x flights via Capital One Travel. $395 AF offset by $300 travel credit, 10k anniversary miles & lounge access.",
  },

  /* Bank of America (points redeem at ~1¢; shown as cash %) */
  {
    id: "boa-premium-rewards", name: "Premium Rewards", issuer: "Bank of America", annualFee: 95,
    rewards: { dining: { rate: 2 }, travel: { rate: 2 }, other: { rate: 1.5 } },
    aka: ["premium rewards"],
    note: "Points redeem at 1¢. 2x travel & dining, 1.5x else. $95 AF offset by travel/airline credits. Preferred Rewards can boost 25–75%.",
  },
  {
    id: "boa-travel-rewards", name: "Travel Rewards", issuer: "Bank of America", annualFee: 0,
    rewards: { other: { rate: 1.5 } },
    aka: ["travel rewards"],
    note: "Flat 1.5x points (1¢ toward travel). No AF. Preferred Rewards boost up to ~2.62%.",
  },

  /* U.S. Bank */
  {
    id: "usbank-altitude-connect", name: "Altitude Connect", issuer: "U.S. Bank", annualFee: 0,
    rewards: { travel: { rate: 4 }, gas: { rate: 4, note: "Incl. EV charging." }, dining: { rate: 2 }, groceries: { rate: 2 }, streaming: { rate: 2 }, other: { rate: 1 } },
    aka: ["altitude", "connect"],
    note: "Points ~1¢. 4x travel & gas/EV; 5x prepaid hotels/cars via portal; 2x dining/grocery/streaming. AF $0 first year, then $95.",
  },
  {
    id: "usbank-smartly", name: "Smartly Visa", issuer: "U.S. Bank", annualFee: 0,
    rewards: { other: { rate: 2 } },
    aka: ["smartly"],
    note: "2% base; up to 4% on everything with a U.S. Bank Smartly Savings account & balance tiers. No AF.",
  },

  /* Wells Fargo */
  {
    id: "wf-autograph-journey", name: "Autograph Journey", issuer: "Wells Fargo", annualFee: 95,
    rewards: { travel: { rate: 4, note: "5x hotels, 4x airlines, 3x other travel." }, dining: { rate: 3 }, other: { rate: 1 } },
    aka: ["autograph", "journey"],
    note: "Points ~1¢ (transferable to partners). 5x hotels, 4x airlines, 3x other travel & dining, 1x else. $95 AF.",
  },
];

// Merchant → spending category, for the "Where are you shopping?" search.
// `category` must be a CATEGORIES key. `aliases` help matching; `note` adds a caveat.
const MERCHANTS = [
  // Groceries
  { name: "Kroger", category: "groceries" },
  { name: "Safeway", category: "groceries" },
  { name: "Albertsons", category: "groceries" },
  { name: "Publix", category: "groceries" },
  { name: "Trader Joe's", category: "groceries", aliases: ["trader joes"] },
  { name: "Aldi", category: "groceries" },
  { name: "Whole Foods", category: "groceries", aliases: ["whole foods market"] },
  { name: "Wegmans", category: "groceries" },
  { name: "H-E-B", category: "groceries", aliases: ["heb"] },
  { name: "Meijer", category: "groceries" },
  { name: "Sprouts", category: "groceries" },
  { name: "Ralphs", category: "groceries" },
  { name: "Vons", category: "groceries" },
  { name: "Food Lion", category: "groceries" },
  { name: "ShopRite", category: "groceries" },
  { name: "Stop & Shop", category: "groceries", aliases: ["stop and shop"] },
  { name: "Harris Teeter", category: "groceries" },
  // Warehouse clubs
  { name: "Costco", category: "wholesale", networks: ["Visa"], note: "In-store accepts Visa only (Costco.com takes more). The Costco Anywhere Visa earns 2% there." },
  { name: "Sam's Club", category: "wholesale", aliases: ["sams club"] },
  { name: "BJ's Wholesale", category: "wholesale", aliases: ["bjs", "bj's"] },
  // Superstores (usually NOT grocery bonus eligible)
  { name: "Walmart", category: "other", note: "Superstore — usually NOT counted as a grocery store by card issuers." },
  { name: "Target", category: "other", note: "Superstore — usually NOT counted as a grocery store by card issuers." },
  // Dining & fast food
  { name: "Starbucks", category: "dining" },
  { name: "McDonald's", category: "dining", aliases: ["mcdonalds"] },
  { name: "Chipotle", category: "dining" },
  { name: "Chick-fil-A", category: "dining", aliases: ["chick fil a", "chickfila"] },
  { name: "Taco Bell", category: "dining" },
  { name: "Subway", category: "dining" },
  { name: "Domino's", category: "dining", aliases: ["dominos"] },
  { name: "Panera", category: "dining" },
  { name: "Wendy's", category: "dining", aliases: ["wendys"] },
  { name: "Burger King", category: "dining" },
  { name: "Five Guys", category: "dining" },
  { name: "Shake Shack", category: "dining" },
  { name: "Olive Garden", category: "dining" },
  // Food delivery
  { name: "DoorDash", category: "dining" },
  { name: "Uber Eats", category: "dining" },
  { name: "Grubhub", category: "dining" },
  // Gas
  { name: "Shell", category: "gas" },
  { name: "Exxon", category: "gas", aliases: ["exxonmobil", "exxon mobil"] },
  { name: "Mobil", category: "gas" },
  { name: "Chevron", category: "gas" },
  { name: "BP", category: "gas" },
  { name: "Texaco", category: "gas" },
  { name: "Marathon", category: "gas" },
  { name: "Speedway", category: "gas" },
  { name: "Sunoco", category: "gas" },
  { name: "Valero", category: "gas" },
  { name: "Circle K", category: "gas" },
  { name: "Wawa", category: "gas" },
  { name: "Sheetz", category: "gas" },
  { name: "QuikTrip", category: "gas", aliases: ["qt"] },
  // Transit / rideshare
  { name: "Uber", category: "transit", note: "Uber rides count as transit; Uber Eats counts as dining." },
  { name: "Lyft", category: "transit" },
  { name: "Amtrak", category: "travel" },
  // Streaming
  { name: "Netflix", category: "streaming" },
  { name: "Spotify", category: "streaming" },
  { name: "Hulu", category: "streaming" },
  { name: "Disney+", category: "streaming", aliases: ["disney plus"] },
  { name: "Max", category: "streaming", aliases: ["hbo max", "hbo"] },
  { name: "YouTube Premium", category: "streaming", aliases: ["youtube"] },
  { name: "Apple Music", category: "streaming" },
  { name: "Peacock", category: "streaming" },
  { name: "Paramount+", category: "streaming", aliases: ["paramount plus"] },
  // Online shopping
  { name: "Amazon", category: "online", aliases: ["amazon.com", "amzn"] },
  { name: "eBay", category: "online" },
  { name: "Etsy", category: "online" },
  { name: "Shein", category: "online" },
  { name: "Temu", category: "online" },
  { name: "Wayfair", category: "online" },
  { name: "Chewy", category: "online" },
  { name: "PayPal", category: "online", note: "The PayPal Cashback Mastercard earns 3% when you check out with PayPal." },
  // Drugstores
  { name: "CVS", category: "drugstores" },
  { name: "Walgreens", category: "drugstores" },
  { name: "Rite Aid", category: "drugstores" },
  { name: "Duane Reade", category: "drugstores" },
  // Entertainment
  { name: "AMC Theatres", category: "entertainment", aliases: ["amc"] },
  { name: "Regal", category: "entertainment" },
  { name: "Cinemark", category: "entertainment" },
  { name: "Ticketmaster", category: "entertainment" },
  { name: "StubHub", category: "entertainment" },
  { name: "Topgolf", category: "entertainment" },
  // Travel
  { name: "Delta", category: "travel" },
  { name: "United Airlines", category: "travel", aliases: ["united"] },
  { name: "American Airlines", category: "travel" },
  { name: "Southwest", category: "travel" },
  { name: "JetBlue", category: "travel" },
  { name: "Marriott", category: "travel" },
  { name: "Hilton", category: "travel" },
  { name: "Hyatt", category: "travel" },
  { name: "Airbnb", category: "travel" },
  { name: "Vrbo", category: "travel" },
  { name: "Expedia", category: "travel" },
  { name: "Booking.com", category: "travel", aliases: ["booking"] },
  { name: "Hotels.com", category: "travel" },
  { name: "Hertz", category: "travel" },
  { name: "Enterprise", category: "travel" },
  // Other retail (base rate; perks noted)
  { name: "Apple", category: "other", aliases: ["apple store", "apple.com"], note: "Apple Card earns 3% at Apple." },
  { name: "Best Buy", category: "other" },
  { name: "Home Depot", category: "other", note: "Home improvement — sometimes a rotating 5% category, so check the calendar above." },
  { name: "Lowe's", category: "other", aliases: ["lowes"], note: "Home improvement — sometimes a rotating 5% category, so check the calendar above." },
  { name: "Nike", category: "other", note: "Apple Card earns 3% at Nike." },
  { name: "IKEA", category: "other" },
];
