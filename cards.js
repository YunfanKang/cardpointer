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

const DATA_UPDATED = "November 2026";

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
  "paypal-debit": "Mastercard",
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
  { key: "home",          label: "Home Improvement",     icon: "🛠️" },
  { key: "fitness",       label: "Fitness / Gym",        icon: "🏋️" },
  // Fine-grained categories. `parent` = the broader category they also count as;
  // they're listed only when one of your cards earns more there than in the parent.
  // `noBase`: cards without an explicit rate earn nothing usable there (rent by card
  // usually costs a ~3% fee), so the base rate isn't offered.
  { key: "fastfood",      label: "Fast Food",               icon: "🍔", parent: "dining" },
  { key: "evcharging",    label: "EV Charging",             icon: "🔌", parent: "gas" },
  { key: "rideshare",     label: "Rideshare / Taxi",        icon: "🚕", parent: "transit" },
  { key: "airlines",      label: "Airfare",                 icon: "🛫", parent: "travel" },
  { key: "hotels",        label: "Hotels",                  icon: "🏨", parent: "travel" },
  { key: "carrental",     label: "Car Rental",              icon: "🚙", parent: "travel" },
  { key: "movies",        label: "Movie Theaters",          icon: "🎬", parent: "entertainment" },
  { key: "phone",         label: "Cell Phone Plan",         icon: "📱", parent: "other" },
  { key: "internet",      label: "Internet, Cable & TV",    icon: "🌐", parent: "other" },
  { key: "utilities",     label: "Utilities",               icon: "💡", parent: "other" },
  { key: "rent",          label: "Rent / Mortgage",         icon: "🏠", parent: "other", noBase: true },
  { key: "department",    label: "Department Stores",       icon: "🛍️", parent: "other" },
  { key: "electronics",   label: "Electronics Stores",      icon: "💻", parent: "other" },
  { key: "furniture",     label: "Furniture Stores",        icon: "🛋️", parent: "other" },
  { key: "clothing",      label: "Clothing Stores",         icon: "👕", parent: "other" },
  { key: "sporting",      label: "Sporting Goods",          icon: "⚽", parent: "other" },
  { key: "beauty",        label: "Health, Beauty & Salons", icon: "💄", parent: "other" },
  { key: "pets",          label: "Pet Supplies",            icon: "🐾", parent: "other" },
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
    note: "No annual fee. 3% caps are $6,000/yr per category. Superstores (Walmart, Target) and warehouse clubs don't count as supermarkets.",
  },
  {
    id: "amex-gold", name: "Gold Card", issuer: "American Express", annualFee: 325,
    points: "Amex Membership Rewards",
    rewards: {
      dining: { rate: 4, note: "Restaurants worldwide, up to $50,000/yr (then 1x)." },
      groceries: { rate: 4, note: "U.S. supermarkets, up to $25,000/yr (then 1x)." },
      airlines: { rate: 3, note: "Flights booked directly with airlines or via Amex Travel." },
      other: { rate: 1 },
    },
    aka: ["gold", "membership rewards", "mr"],
    note: "Earns Membership Rewards points. $325 AF, offset by dining/Uber/Resy credits. Transfer to airline/hotel partners for higher value.",
  },

  /* ---------------- Chase ---------------- */
  {
    id: "chase-freedom-unlimited", name: "Freedom Unlimited", issuer: "Chase", annualFee: 0,
    rewards: {
      dining: { rate: 3, note: "Incl. takeout & eligible delivery (DoorDash, Uber Eats, Grubhub)." },
      drugstores: { rate: 3 },
      other: { rate: 1.5 },
    },
    merchants: { "Lyft": { rate: 2, note: "2% on Lyft rides (Chase × Lyft partnership)." } },
    note: "Also 5% on travel booked through Chase Travel. No grocery bonus.",
  },
  {
    id: "chase-freedom-flex", name: "Freedom Flex", issuer: "Chase", annualFee: 0,
    rewards: { dining: { rate: 3 }, drugstores: { rate: 3 }, other: { rate: 1 } },
    merchants: { "Lyft": { rate: 2, note: "2% on Lyft rides (Chase × Lyft partnership)." } },
    rotating: {
      rate: 5,
      stacks: true, // the +4% quarterly bonus stacks on the 3% dining/drugstore rate (= 7%)
      cap: "first $1,500/qtr combined; activation required",
      // `keys` are app categories boosted in recommendations; `label` is the full
      // issuer wording (incl. merchant/charity items that don't map to a category).
      calendar: {
        "2026-Q1": { keys: ["dining"], label: "Dining, Norwegian Cruise Line, American Heart Association" },
        "2026-Q2": { keys: [], merchants: ["Amazon", "Whole Foods"], label: "Amazon, Whole Foods Market, Chase Travel, Feeding America" },
        "2026-Q3": { keys: ["gas", "transit", "entertainment"], label: "Gas & EV charging, public transit, select live entertainment, United Way" },
        "2026-Q4": { keys: ["groceries", "dining"], label: "Grocery stores (excl. Walmart & Target), dining, American Red Cross" },
        "2027-Q1": { keys: ["groceries", "streaming"], label: "Grocery stores (excl. Walmart & Target), top streaming services" },
      },
    },
    note: "Mastercard. Also 5% on travel booked through Chase Travel. 3% dining incl. takeout & delivery.",
  },
  {
    id: "chase-freedom-rise", name: "Freedom Rise", issuer: "Chase", annualFee: 0,
    rewards: { other: { rate: 1.5 } },
    note: "Starter card — flat 1.5%. Good for building credit.",
  },
  {
    id: "amazon-prime-visa", name: "Prime Visa (Amazon)", issuer: "Chase", annualFee: 0,
    rewards: {
      dining: { rate: 2 }, gas: { rate: 2 }, transit: { rate: 2 }, other: { rate: 1 },
    },
    merchants: {
      "Amazon": { rate: 5, note: "Amazon.com, with an eligible Prime membership." },
      "Whole Foods": { rate: 5, note: "With an eligible Prime membership." },
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
      categories: ["dining", "gas", "groceries", "transit", "travel", "streaming", "drugstores", "entertainment", "home", "fitness"],
      labels: {
        dining: "Restaurants (incl. fast food)", gas: "Gas stations & EV charging", travel: "Select travel (airlines, hotels, cruises, agencies)",
        transit: "Select transit (rideshare, parking, tolls, trains)", entertainment: "Live entertainment",
      },
      note: "Your active 5% category (up to $500/cycle, then 1%).",
    },
    note: "Earns 5% on only ONE eligible category each cycle — your highest-spend one, up to $500 (then 1%). Eligible: restaurants, gas, groceries, select travel & transit, streaming, drugstores, home improvement, fitness clubs, live entertainment. Closed to new applicants (May 2026); existing cardmembers unaffected. Set which below.",
  },
  {
    id: "costco-citi", name: "Costco Anywhere Visa", issuer: "Citi", annualFee: 0,
    rewards: {
      gas: { rate: 4, note: "Incl. EV charging, up to $7,000/yr (then 1%)." },
      dining: { rate: 3 }, travel: { rate: 3 },
      other: { rate: 1 },
    },
    merchants: { "Costco": { rate: 2, note: "Costco & Costco.com (4% at Costco gas)." } },
    note: "Requires a Costco membership. Rewards paid once a year as a certificate.",
  },
  {
    id: "citi-strata-premier", name: "Strata Premier", issuer: "Citi", annualFee: 95,
    points: "Citi ThankYou",
    rewards: {
      dining: { rate: 3 }, groceries: { rate: 3 }, gas: { rate: 3, note: "Gas stations & EV charging." },
      airlines: { rate: 3 }, hotels: { rate: 3 }, other: { rate: 1 },
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
      drugstores: { rate: 3 },
      department: { rate: 3, note: "Department stores." },
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
        "2026-Q2": { keys: ["dining", "home"], label: "Restaurants & home improvement stores" },
        "2026-Q3": { keys: ["gas", "transit", "airlines", "drugstores"], label: "Gas & EV charging, public transit, flights, drugstores" },
        "2026-Q4": { keys: ["entertainment", "dining", "utilities"], label: "Restaurants, entertainment (movies, concerts, live sports), utilities" },
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
      categories: ["dining", "gas", "online", "travel", "drugstores", "home"],
      labels: {
        gas: "Gas & EV charging", online: "Online shopping (incl. phone, internet, cable & streaming)",
        home: "Home improvement & furnishings",
      },
      covers: { online: ["streaming", "phone", "internet"], home: ["furniture"] },
      note: "Your chosen 3% category (2%/3% share a $2,500/qtr cap).",
    },
    note: "Pick ONE 3% category (change monthly); also 2% at groceries & warehouse clubs. 3% + 2% apply to the first $2,500/qtr combined, then 1%. Preferred Rewards boosts 25–75% (up to 5.25% in the 3% category).",
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
      dining: { rate: 3 }, travel: { rate: 3 }, gas: { rate: 3, note: "Gas stations & EV charging." },
      transit: { rate: 3, note: "Incl. rideshare, parking, tolls." }, streaming: { rate: 3, note: "Popular streaming services." },
      phone: { rate: 3, note: "Cell phone & landline plans." },
      other: { rate: 1 },
    },
    note: "Earns points (~1¢ as cash), no caps. 3x restaurants, travel, gas, transit, streaming & phone plans. No AF, no foreign transaction fee.",
  },

  /* ---------------- U.S. Bank ---------------- */
  {
    id: "usbank-cashplus", name: "Cash+", issuer: "U.S. Bank", annualFee: 0,
    rewards: { other: { rate: 1 } },
    choose: [
      {
        rate: 5, count: 2,
        categories: ["phone", "utilities", "internet", "fastfood", "department", "electronics", "furniture", "clothing", "sporting", "movies", "fitness", "rideshare"],
        labels: {
          phone: "Cell phone providers", utilities: "Home utilities", internet: "TV, internet & streaming",
          clothing: "Select clothing stores", fitness: "Gyms / fitness centers", rideshare: "Ground transportation",
        },
        covers: { internet: ["streaming"], rideshare: ["transit"] },
        note: "One of your two 5% picks (up to $2,000/qtr combined, then 1%; re-enroll each quarter).",
      },
      {
        rate: 2,
        categories: ["gas", "groceries", "dining"],
        labels: { gas: "Gas & EV charging", groceries: "Grocery stores", dining: "Restaurants" },
        note: "Your 2% everyday category (no cap).",
      },
    ],
    note: "Pick TWO 5% categories each quarter (first $2,000 combined, then 1%) and ONE 2% everyday category. You must choose every quarter or earn 1%. Also 5% on prepaid travel via the U.S. Bank Travel Center.",
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
    merchants: Object.fromEntries(
      ["Apple", "Walgreens", "Duane Reade", "Exxon", "Mobil", "Uber", "Uber Eats", "Nike", "Ace Hardware", "ChargePoint", "Booking.com", "Hertz"]
        .map((m) => [m, { rate: 3, note: "3% Daily Cash with Apple Pay." }])
    ),
    note: "3% with Apple Pay at Apple, Walgreens/Duane Reade, Exxon/Mobil, Uber & Uber Eats, Nike, Ace Hardware, ChargePoint, Booking.com & Hertz. 2% on any other Apple Pay purchase (not reflected in category rates — they show the 1% physical-card rate).",
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
    merchants: { "PayPal": { rate: 3, note: "3% when you check out with PayPal." } },
    note: "Issued by Synchrony. 3% when you check out with PayPal, 1.5% everywhere else. No annual fee.",
  },
  {
    id: "paypal-debit", name: "PayPal Debit Card", issuer: "PayPal", annualFee: 0, debit: true,
    rewards: { other: { rate: 0 } },
    choose: {
      rate: 5,
      categories: ["groceries", "dining", "gas", "clothing", "transit", "beauty"],
      labels: {
        groceries: "Groceries", dining: "Restaurants", gas: "Fuel (incl. EV charging)", clothing: "Apparel",
        transit: "Rideshare & public transit", beauty: "Health & beauty",
      },
      covers: { gas: ["evcharging"] },
      note: "Your monthly 5% category (up to $1,000/mo, paid as PayPal points).",
    },
    aka: ["paypal", "debit"],
    note: "Debit card (Mastercard) — no credit check. Pick ONE 5% category each month in the PayPal app (up to $1,000/mo = $50). No rewards on other purchases. Offered categories change — check the app.",
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
    rewards: {
      rent: { rate: 1.25, note: "Up to 1.25x on rent/mortgage, unlocked with Bilt Cash or everyday spend; no fee." },
      other: { rate: 1 },
    },
    merchants: { "Bilt Rent": { rate: 1.25, note: "Up to 1.25x on rent/mortgage, no transaction fee." } },
    aka: ["bilt", "rent", "blue"],
    note: "Bilt 2.0 (issued by Column N.A.). 1x everyday + up to 1.25x on rent/mortgage. Flexible option: 4% Bilt Cash on non-housing spend, used to unlock housing points ($30 Bilt Cash per 1,000 pts). No annual fee.",
  },
  {
    id: "bilt-obsidian", name: "Bilt Obsidian", issuer: "Bilt", annualFee: 95,
    points: "Bilt",
    rewards: {
      dining: { rate: 3 },
      groceries: { rate: 3, note: "Up to $25,000/yr (then 1x)." },
      travel: { rate: 2 },
      rent: { rate: 1.25, note: "Up to 1.25x on rent/mortgage." },
      other: { rate: 1 },
    },
    aka: ["bilt", "rent", "obsidian"],
    note: "Bilt 2.0 (Column N.A.). 3x dining & groceries, 2x travel, up to 1.25x housing. $95 AF, $100 hotel credit. New program; verify details.",
  },
  {
    id: "bilt-palladium", name: "Bilt Palladium", issuer: "Bilt", annualFee: 495,
    points: "Bilt",
    rewards: { rent: { rate: 1.25, note: "Up to 1.25x on rent/mortgage." }, other: { rate: 2 } },
    aka: ["bilt", "rent", "palladium"],
    note: "Bilt 2.0 (Column N.A.). Flat 2x everyday, up to 1.25x housing. $495 AF; $400 hotel credit, $200 Bilt Cash, Priority Pass. New program; verify details.",
  },

  /* ---------------- Credit One ---------------- */
  {
    id: "creditone-x5", name: "Platinum X5 Visa", issuer: "Credit One", annualFee: 95,
    rewards: {
      gas: { rate: 5, note: "First $5,000/yr combined with the other 5% categories (then 1%)." },
      groceries: { rate: 5, note: "First $5,000/yr combined (then 1%)." },
      phone: { rate: 5, note: "Mobile phone service; first $5,000/yr combined (then 1%)." },
      internet: { rate: 5, note: "Internet, cable & satellite TV; first $5,000/yr combined (then 1%)." },
      other: { rate: 1 },
    },
    aka: ["creditone", "x5"],
    note: "5% on the first $5,000/yr combined across gas, groceries, internet, cable/satellite TV & mobile phone, then 1%. $95 annual fee. A credit-building card.",
  },
  {
    id: "creditone-amex", name: "Amex Card", issuer: "Credit One", annualFee: 39,
    rewards: { other: { rate: 1 } },
    aka: ["creditone", "amex", "american express"],
    note: "Credit One Bank American Express Card — flat 1% cash back on all purchases (runs on the Amex network). $39 annual fee (some Premier versions $0). If your card's terms say otherwise, edit the rate here.",
  },

  /* ---------------- Shop Your Way ---------------- */
  {
    id: "syw-5321", name: "Shop Your Way 5321 Visa", issuer: "Shop Your Way", annualFee: 0,
    rewards: {
      gas: { rate: 5, note: "Plus EV charging." },
      transit: { rate: 5, note: "Transportation: transit, rideshare, taxis, parking, tolls, car washes." },
      evcharging: { rate: 5, note: "EV charging counts with gas." },
      dining: { rate: 3 }, groceries: { rate: 3 }, travel: { rate: 3 }, other: { rate: 1 },
    },
    aka: ["syw", "5321", "sears", "shop your way"],
    merchants: Object.fromEntries(
      ["Kmart", "Sears", "Shop Your Way"].map((m) => [m, { rate: 2, note: "2% in the Shop Your Way merchant network." }])
    ),
    note: "Relaunched Nov 2025 as a Visa issued by First Bank & Trust (no longer Citi). 5% gas & transportation, 3% dining/groceries/travel, 2% Shop Your Way network, 1% else — paid in Shop Your Way points (≈1¢, ecosystem redemption).",
  },

  /* ===== Additional popular cards (grouped by issuer at render time) ===== */

  /* American Express */
  {
    id: "amex-platinum", name: "Platinum Card", issuer: "American Express", annualFee: 695,
    points: "Amex Membership Rewards",
    rewards: { airlines: { rate: 5, note: "Flights booked directly with airlines or via Amex Travel (up to $500k/yr)." }, other: { rate: 1 } },
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
    rewards: { dining: { rate: 5 }, groceries: { rate: 5, note: "U.S. supermarkets." }, gas: { rate: 5, note: "U.S. gas stations." }, other: { rate: 3 } },
    merchants: { "Hilton": { rate: 7, note: "Hilton hotels & resorts." } },
    aka: ["hilton"],
    note: "No-AF Hilton cobrand. 7x Hilton, 5x U.S. dining/supermarkets/gas, 3x else. Hilton points (~0.5¢).",
  },
  {
    id: "amex-delta-gold", name: "Delta SkyMiles Gold", issuer: "American Express", annualFee: 150,
    points: "Delta SkyMiles",
    rewards: { dining: { rate: 2 }, groceries: { rate: 2, note: "U.S. supermarkets." }, other: { rate: 1 } },
    merchants: { "Delta": { rate: 2, note: "Delta purchases." } },
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
    rewards: {
      phone: { rate: 5, note: "With internet/cable/phone & office supplies, up to $25,000/yr combined." },
      internet: { rate: 5, note: "With phone & office supplies, up to $25,000/yr combined." },
      gas: { rate: 2 }, dining: { rate: 2 }, other: { rate: 1 },
    },
    merchants: Object.fromEntries(
      ["Staples", "Office Depot"].map((m) => [m, { rate: 5, note: "Office supply stores (up to $25,000/yr combined)." }])
    ),
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
    merchants: { "United Airlines": { rate: 2, note: "United purchases." } },
    aka: ["united", "gateway", "mileageplus"],
    note: "No-AF United cobrand. 2x United, 2x gas, 2x transit/commuting, 1x else. Earns MileagePlus miles.",
  },
  {
    id: "chase-united-explorer", name: "United Explorer", issuer: "Chase", annualFee: 150,
    points: "United MileagePlus",
    rewards: {
      dining: { rate: 2, note: "Incl. eligible delivery & takeout." },
      hotels: { rate: 2, note: "Booked directly with the hotel or via United Hotels (not third-party sites)." },
      other: { rate: 1 },
    },
    merchants: { "United Airlines": { rate: 2, note: "2x on United purchases (more when booking United flights as a MileagePlus member)." } },
    aka: ["united", "explorer", "mileageplus"],
    note: "$150 AF ($0 first year). 2x United, dining & hotels booked direct; 1x else. Free first checked bag, 2 United Club passes/yr, priority boarding. MileagePlus miles.",
  },
  {
    id: "chase-united-quest", name: "United Quest", issuer: "Chase", annualFee: 350,
    points: "United MileagePlus",
    rewards: { travel: { rate: 2 }, dining: { rate: 2 }, streaming: { rate: 2 }, other: { rate: 1 } },
    merchants: { "United Airlines": { rate: 3, note: "United purchases." } },
    aka: ["united", "quest", "mileageplus"],
    note: "$350 AF. 3x United, 2x other travel/dining/streaming, 1x else. Annual United & rideshare credits + anniversary miles. MileagePlus miles.",
  },
  {
    id: "chase-united-club", name: "United Club Infinite", issuer: "Chase", annualFee: 525,
    points: "United MileagePlus",
    rewards: { travel: { rate: 2 }, dining: { rate: 2 }, other: { rate: 1 } },
    merchants: { "United Airlines": { rate: 4, note: "United purchases." } },
    aka: ["united", "club", "infinite", "mileageplus"],
    note: "$525 AF. 4x United, 2x other travel & dining, 1x else. Includes United Club lounge membership. MileagePlus miles.",
  },
  {
    id: "chase-hyatt", name: "World of Hyatt", issuer: "Chase", annualFee: 95,
    points: "World of Hyatt",
    rewards: { dining: { rate: 2 }, airlines: { rate: 2, note: "Booked directly with the airline." }, transit: { rate: 2 }, fitness: { rate: 2 }, other: { rate: 1 } },
    merchants: { "Hyatt": { rate: 4, note: "Hyatt hotels." } },
    aka: ["hyatt"],
    note: "$95 AF. Hyatt points (high value); 2x dining/airline/transit/gym. Annual free night.",
  },
  {
    id: "chase-marriott-boundless", name: "Marriott Bonvoy Boundless", issuer: "Chase", annualFee: 95,
    points: "Marriott Bonvoy",
    rewards: { dining: { rate: 3 }, groceries: { rate: 3 }, gas: { rate: 3 }, other: { rate: 2 } },
    merchants: { "Marriott": { rate: 6, note: "Marriott Bonvoy hotels." } },
    aka: ["marriott", "bonvoy"],
    note: "$95 AF. 6x Marriott; 3x grocery/gas/dining (to $6k/qtr, then 2x); 2x else. Annual free night.",
  },
  {
    id: "chase-ihg-premier", name: "IHG One Rewards Premier", issuer: "Chase", annualFee: 99,
    points: "IHG One Rewards",
    rewards: { travel: { rate: 5 }, dining: { rate: 5 }, gas: { rate: 5 }, other: { rate: 3 } },
    merchants: { "IHG": { rate: 10, note: "IHG hotels." } },
    aka: ["ihg"],
    note: "$99 AF. 10x at IHG hotels; 5x travel/gas/dining; 3x else. Anniversary free night.",
  },
  {
    id: "chase-southwest-priority", name: "Southwest Rapid Rewards Priority", issuer: "Chase", annualFee: 149,
    points: "Southwest Rapid Rewards",
    rewards: { transit: { rate: 2 }, streaming: { rate: 2 }, phone: { rate: 2 }, internet: { rate: 2 }, other: { rate: 1 } },
    merchants: { "Southwest": { rate: 3, note: "Southwest purchases." } },
    aka: ["southwest"],
    note: "$149 AF. 3x Southwest; 2x transit, internet/cable/phone & streaming. Annual travel credit.",
  },

  /* Citi */
  {
    id: "citi-strata", name: "Strata", issuer: "Citi", annualFee: 0,
    points: "Citi ThankYou",
    rewards: { groceries: { rate: 3 }, transit: { rate: 3 }, gas: { rate: 3, note: "Incl. EV charging." }, streaming: { rate: 3, note: "Only if chosen as your self-select 3x category." }, entertainment: { rate: 3, note: "Live entertainment — only if chosen as your self-select 3x category." }, fitness: { rate: 3, note: "Fitness clubs — only if chosen as your self-select 3x category." }, other: { rate: 1 } },
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
    rewards: { dining: { rate: 2 }, gas: { rate: 2 }, other: { rate: 1 } },
    merchants: { "American Airlines": { rate: 2, note: "American Airlines purchases." } },
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
    rewards: {
      travel: { rate: 4 }, gas: { rate: 4, note: "Gas stations & EV charging." },
      dining: { rate: 2, note: "Incl. takeout & delivery." }, groceries: { rate: 2, note: "Incl. grocery delivery." }, streaming: { rate: 2 },
      other: { rate: 1 },
    },
    aka: ["altitude", "connect"],
    note: "Points ~1¢. 4x travel & gas/EV; 5x prepaid hotels/cars via U.S. Bank Travel Center; 2x dining, groceries & streaming. No annual fee; up to $120 TSA PreCheck/Global Entry credit.",
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
    rewards: { hotels: { rate: 5 }, airlines: { rate: 4 }, travel: { rate: 3 }, dining: { rate: 3 }, other: { rate: 1 } },
    aka: ["autograph", "journey"],
    note: "Points ~1¢ (transferable to partners). 5x hotels, 4x airlines, 3x other travel & dining, 1x else. $95 AF.",
  },
];

// Merchant → spending category, for the "Where are you shopping?" search.
// `category` must be a CATEGORIES key. `aliases` help matching; `note` adds a caveat.
const MERCHANTS = [
  // Groceries
  { name: "Kroger", category: "groceries", aliases: ["fred meyer", "king soopers", "fry's food", "smith's", "dillons", "harris teeter kroger"] },
  { name: "Safeway", category: "groceries" },
  { name: "Albertsons", category: "groceries", aliases: ["jewel-osco", "jewel osco", "acme markets", "shaw's"] },
  { name: "Publix", category: "groceries" },
  { name: "Trader Joe's", category: "groceries", aliases: ["trader joes"] },
  { name: "Aldi", category: "groceries" },
  { name: "Whole Foods", category: "groceries", aliases: ["whole foods market"], note: "Amazon Prime Visa earns 5% here." },
  { name: "Wegmans", category: "groceries" },
  { name: "H-E-B", category: "groceries", aliases: ["heb"] },
  { name: "Meijer", category: "groceries", note: "Some issuers code Meijer as a superstore, not a grocery store." },
  { name: "Sprouts", category: "groceries", aliases: ["sprouts farmers market"] },
  { name: "Ralphs", category: "groceries" },
  { name: "Vons", category: "groceries" },
  { name: "Food Lion", category: "groceries" },
  { name: "ShopRite", category: "groceries" },
  { name: "Stop & Shop", category: "groceries", aliases: ["stop and shop"] },
  { name: "Harris Teeter", category: "groceries" },
  { name: "Giant", category: "groceries", aliases: ["giant food", "giant eagle"] },
  { name: "Hy-Vee", category: "groceries", aliases: ["hyvee"] },
  { name: "WinCo", category: "groceries", aliases: ["winco foods"] },
  { name: "Lidl", category: "groceries" },
  { name: "Fresh Market", category: "groceries", aliases: ["the fresh market"] },
  { name: "H Mart", category: "groceries", aliases: ["hmart"] },
  { name: "99 Ranch", category: "groceries", aliases: ["99 ranch market"] },
  { name: "Instacart", category: "groceries", note: "Usually codes as grocery; some issuers treat it as online/delivery." },
  { name: "Amazon Fresh", category: "groceries", aliases: ["fresh"], note: "Physical Amazon Fresh stores code as grocery." },
  // Warehouse clubs
  { name: "Costco", category: "wholesale", networks: ["Visa"], note: "In-store accepts Visa only (Costco.com takes more). The Costco Anywhere Visa earns 2% there." },
  { name: "Sam's Club", category: "wholesale", aliases: ["sams club"] },
  { name: "BJ's Wholesale", category: "wholesale", aliases: ["bjs", "bj's"] },
  // Superstores (usually NOT grocery bonus eligible)
  { name: "Walmart", category: "other", aliases: ["walmart supercenter"], note: "Superstore — usually NOT counted as a grocery store by card issuers. Walmart.com counts as online." },
  { name: "Walmart.com", category: "online", aliases: ["walmart online", "walmart+"] },
  { name: "Target", category: "other", note: "Superstore — usually NOT counted as a grocery store by card issuers. Target.com counts as online." },
  { name: "Target.com", category: "online", aliases: ["target online"] },
  // Dining (sit-down & coffee)
  { name: "Starbucks", category: "dining" },
  { name: "Dunkin'", category: "dining", aliases: ["dunkin", "dunkin donuts"] },
  { name: "Panera", category: "dining", aliases: ["panera bread"] },
  { name: "Olive Garden", category: "dining" },
  { name: "Applebee's", category: "dining", aliases: ["applebees"] },
  { name: "Chili's", category: "dining", aliases: ["chilis"] },
  { name: "Cheesecake Factory", category: "dining", aliases: ["the cheesecake factory"] },
  { name: "Texas Roadhouse", category: "dining" },
  { name: "Buffalo Wild Wings", category: "dining", aliases: ["bdubs"] },
  { name: "IHOP", category: "dining" },
  { name: "Denny's", category: "dining", aliases: ["dennys"] },
  { name: "Red Lobster", category: "dining" },
  { name: "Outback Steakhouse", category: "dining", aliases: ["outback"] },
  { name: "P.F. Chang's", category: "dining", aliases: ["pf changs"] },
  { name: "Cracker Barrel", category: "dining" },
  // Fast food
  { name: "McDonald's", category: "fastfood", aliases: ["mcdonalds"] },
  { name: "Chipotle", category: "fastfood" },
  { name: "Chick-fil-A", category: "fastfood", aliases: ["chick fil a", "chickfila"] },
  { name: "Taco Bell", category: "fastfood" },
  { name: "Subway", category: "fastfood" },
  { name: "Domino's", category: "fastfood", aliases: ["dominos"] },
  { name: "Pizza Hut", category: "fastfood" },
  { name: "Papa John's", category: "fastfood", aliases: ["papa johns"] },
  { name: "Wendy's", category: "fastfood", aliases: ["wendys"] },
  { name: "Burger King", category: "fastfood" },
  { name: "Five Guys", category: "fastfood" },
  { name: "Shake Shack", category: "fastfood" },
  { name: "In-N-Out", category: "fastfood", aliases: ["in n out"] },
  { name: "Popeyes", category: "fastfood" },
  { name: "KFC", category: "fastfood" },
  { name: "Sonic", category: "fastfood", aliases: ["sonic drive-in"] },
  { name: "Arby's", category: "fastfood", aliases: ["arbys"] },
  { name: "Jack in the Box", category: "fastfood" },
  { name: "Panda Express", category: "fastfood" },
  { name: "Wingstop", category: "fastfood" },
  { name: "Raising Cane's", category: "fastfood", aliases: ["raising canes", "canes"] },
  { name: "Jersey Mike's", category: "fastfood", aliases: ["jersey mikes"] },
  { name: "Jimmy John's", category: "fastfood", aliases: ["jimmy johns"] },
  { name: "Dairy Queen", category: "fastfood", aliases: ["dq"] },
  { name: "Culver's", category: "fastfood", aliases: ["culvers"] },
  { name: "Whataburger", category: "fastfood" },
  { name: "Sweetgreen", category: "fastfood" },
  // Food delivery
  { name: "DoorDash", category: "dining" },
  { name: "Uber Eats", category: "dining", aliases: ["ubereats"] },
  { name: "Grubhub", category: "dining", aliases: ["seamless"] },
  { name: "Postmates", category: "dining" },
  // Gas
  { name: "Shell", category: "gas" },
  { name: "Exxon", category: "gas", aliases: ["exxonmobil", "exxon mobil"] },
  { name: "Mobil", category: "gas" },
  { name: "Chevron", category: "gas" },
  { name: "BP", category: "gas", aliases: ["amoco"] },
  { name: "Texaco", category: "gas" },
  { name: "Marathon", category: "gas" },
  { name: "Speedway", category: "gas" },
  { name: "Sunoco", category: "gas" },
  { name: "Valero", category: "gas" },
  { name: "Citgo", category: "gas" },
  { name: "Phillips 66", category: "gas", aliases: ["76", "conoco"] },
  { name: "Circle K", category: "gas" },
  { name: "Wawa", category: "gas" },
  { name: "Sheetz", category: "gas" },
  { name: "QuikTrip", category: "gas", aliases: ["qt"] },
  { name: "Casey's", category: "gas", aliases: ["caseys"] },
  { name: "Buc-ee's", category: "gas", aliases: ["bucees", "buc ees"] },
  { name: "Kwik Trip", category: "gas", aliases: ["kwik star"] },
  { name: "Murphy USA", category: "gas" },
  { name: "Costco Gas", category: "gas", networks: ["Visa"], note: "Visa only. Costco Anywhere Visa earns 4%." },
  // EV charging
  { name: "Tesla Supercharger", category: "evcharging", aliases: ["supercharger", "tesla charging"] },
  { name: "ChargePoint", category: "evcharging" },
  { name: "Electrify America", category: "evcharging" },
  { name: "EVgo", category: "evcharging" },
  { name: "Blink Charging", category: "evcharging", aliases: ["blink"] },
  // Transit / rideshare / parking
  { name: "Uber", category: "rideshare", note: "Uber rides count as transit; Uber Eats counts as dining." },
  { name: "Lyft", category: "rideshare", note: "Chase Freedom cards earn 2% on Lyft rides." },
  { name: "Taxi", category: "rideshare", aliases: ["cab", "yellow cab"] },
  { name: "Waymo", category: "rideshare" },
  { name: "MTA / Subway fare", category: "transit", aliases: ["mta", "omny", "metrocard"] },
  { name: "BART / Clipper", category: "transit", aliases: ["bart", "clipper"] },
  { name: "Ventra (CTA)", category: "transit", aliases: ["cta", "ventra"] },
  { name: "SEPTA", category: "transit" },
  { name: "WMATA / SmarTrip", category: "transit", aliases: ["wmata", "smartrip", "dc metro"] },
  { name: "Greyhound", category: "transit" },
  { name: "SpotHero", category: "transit", aliases: ["parking"] },
  { name: "ParkMobile", category: "transit" },
  { name: "E-ZPass", category: "transit", aliases: ["ezpass", "tolls", "fastrak", "sunpass"] },
  // Car rental
  { name: "Hertz", category: "carrental" },
  { name: "Enterprise", category: "carrental", aliases: ["enterprise rent-a-car"] },
  { name: "National", category: "carrental", aliases: ["national car rental"] },
  { name: "Avis", category: "carrental" },
  { name: "Budget", category: "carrental", aliases: ["budget rent a car"] },
  { name: "Alamo", category: "carrental" },
  { name: "Sixt", category: "carrental" },
  { name: "Dollar", category: "carrental", aliases: ["dollar rent a car"] },
  { name: "Thrifty", category: "carrental" },
  { name: "Fox Rent A Car", category: "carrental", aliases: ["fox"] },
  { name: "Turo", category: "carrental", note: "Peer-to-peer; some issuers don't code Turo as car rental." },
  { name: "Zipcar", category: "carrental" },
  // Airlines
  { name: "Delta", category: "airlines", aliases: ["delta air lines"] },
  { name: "United Airlines", category: "airlines", aliases: ["united"] },
  { name: "American Airlines", category: "airlines", aliases: ["aa"] },
  { name: "Southwest", category: "airlines", aliases: ["southwest airlines"] },
  { name: "JetBlue", category: "airlines" },
  { name: "Alaska Airlines", category: "airlines", aliases: ["alaska"] },
  { name: "Spirit", category: "airlines", aliases: ["spirit airlines"] },
  { name: "Frontier", category: "airlines", aliases: ["frontier airlines"] },
  { name: "Hawaiian Airlines", category: "airlines", aliases: ["hawaiian"] },
  { name: "Allegiant", category: "airlines" },
  // Hotels & lodging
  { name: "Marriott", category: "hotels", aliases: ["bonvoy", "sheraton", "westin", "ritz-carlton", "courtyard", "w hotels"] },
  { name: "Hilton", category: "hotels", aliases: ["hampton inn", "doubletree", "embassy suites", "conrad", "waldorf"] },
  { name: "Hyatt", category: "hotels", aliases: ["park hyatt", "andaz", "grand hyatt"] },
  { name: "IHG", category: "hotels", aliases: ["holiday inn", "intercontinental", "crowne plaza", "kimpton"] },
  { name: "Wyndham", category: "hotels", aliases: ["days inn", "super 8", "la quinta"] },
  { name: "Choice Hotels", category: "hotels", aliases: ["comfort inn", "quality inn"] },
  { name: "Best Western", category: "hotels" },
  { name: "Airbnb", category: "travel", note: "Most issuers code Airbnb as travel/lodging; not always as a hotel." },
  { name: "Vrbo", category: "travel" },
  // Online travel agencies & other travel
  { name: "Expedia", category: "travel" },
  { name: "Booking.com", category: "travel", aliases: ["booking"] },
  { name: "Hotels.com", category: "travel" },
  { name: "Priceline", category: "travel" },
  { name: "Kayak", category: "travel" },
  { name: "Amtrak", category: "travel" },
  { name: "Carnival", category: "travel", aliases: ["carnival cruise"] },
  { name: "Royal Caribbean", category: "travel" },
  { name: "Norwegian Cruise Line", category: "travel", aliases: ["ncl"] },
  // Streaming
  { name: "Netflix", category: "streaming" },
  { name: "Spotify", category: "streaming" },
  { name: "Hulu", category: "streaming" },
  { name: "Disney+", category: "streaming", aliases: ["disney plus"] },
  { name: "Max", category: "streaming", aliases: ["hbo max", "hbo"] },
  { name: "YouTube Premium", category: "streaming", aliases: ["youtube", "youtube tv"] },
  { name: "Apple Music", category: "streaming", aliases: ["apple tv+", "apple tv"] },
  { name: "Peacock", category: "streaming" },
  { name: "Paramount+", category: "streaming", aliases: ["paramount plus"] },
  { name: "Amazon Prime Video", category: "streaming", aliases: ["prime video"] },
  { name: "Sling TV", category: "streaming", aliases: ["sling"] },
  { name: "SiriusXM", category: "streaming", aliases: ["sirius"] },
  // Online shopping platforms
  { name: "Amazon", category: "online", aliases: ["amazon.com", "amzn"], note: "Amazon Prime Visa earns 5%." },
  { name: "eBay", category: "online" },
  { name: "Etsy", category: "online" },
  { name: "Shein", category: "online" },
  { name: "Temu", category: "online" },
  { name: "AliExpress", category: "online" },
  { name: "Wayfair", category: "online" },
  { name: "Chewy", category: "online" },
  { name: "Shopify stores", category: "online", aliases: ["shop pay", "shop app"] },
  { name: "Newegg", category: "online" },
  { name: "Zappos", category: "online" },
  { name: "Overstock", category: "online" },
  { name: "Wish", category: "online" },
  { name: "PayPal", category: "online", note: "The PayPal Cashback Mastercard earns 3% when you check out with PayPal." },
  { name: "Shop Your Way", category: "online", aliases: ["shopyourway"], note: "SYW 5321 Visa earns 2% in the Shop Your Way network." },
  // Department stores
  { name: "Macy's", category: "department", aliases: ["macys"] },
  { name: "Nordstrom", category: "department", aliases: ["nordstrom rack"] },
  { name: "Kohl's", category: "department", aliases: ["kohls"] },
  { name: "JCPenney", category: "department", aliases: ["jcp", "jc penney"] },
  { name: "Dillard's", category: "department", aliases: ["dillards"] },
  { name: "Bloomingdale's", category: "department", aliases: ["bloomingdales"] },
  { name: "Neiman Marcus", category: "department" },
  { name: "Saks Fifth Avenue", category: "department", aliases: ["saks", "saks off 5th"] },
  { name: "Belk", category: "department" },
  { name: "Sears", category: "department", note: "SYW 5321 Visa earns 2% here." },
  { name: "Kmart", category: "department", note: "SYW 5321 Visa earns 2% here." },
  { name: "TJ Maxx", category: "department", aliases: ["tj maxx", "tjmaxx", "marshalls", "homegoods"], note: "Off-price stores often code as department stores, but not always." },
  { name: "Ross", category: "department", aliases: ["ross dress for less"] },
  { name: "Burlington", category: "department" },
  // Clothing
  { name: "Gap", category: "clothing", aliases: ["old navy", "banana republic", "athleta"] },
  { name: "H&M", category: "clothing", aliases: ["h and m"] },
  { name: "Zara", category: "clothing" },
  { name: "Uniqlo", category: "clothing" },
  { name: "Express", category: "clothing" },
  { name: "American Eagle", category: "clothing", aliases: ["aerie"] },
  { name: "Abercrombie & Fitch", category: "clothing", aliases: ["abercrombie", "hollister"] },
  { name: "Lululemon", category: "clothing" },
  { name: "J.Crew", category: "clothing", aliases: ["j crew"] },
  { name: "Levi's", category: "clothing", aliases: ["levis"] },
  { name: "Nike", category: "clothing" },
  { name: "Adidas", category: "clothing" },
  { name: "Foot Locker", category: "clothing" },
  // Sporting goods
  { name: "Dick's Sporting Goods", category: "sporting", aliases: ["dicks", "dick's"] },
  { name: "Academy Sports", category: "sporting", aliases: ["academy"] },
  { name: "REI", category: "sporting" },
  { name: "Bass Pro Shops", category: "sporting", aliases: ["cabela's", "cabelas", "bass pro"] },
  { name: "Big 5 Sporting Goods", category: "sporting", aliases: ["big 5"] },
  // Electronics
  { name: "Best Buy", category: "electronics" },
  { name: "Apple", category: "electronics", aliases: ["apple store", "apple.com"] },
  { name: "Micro Center", category: "electronics" },
  { name: "B&H Photo", category: "electronics", aliases: ["b&h", "bh photo"] },
  { name: "GameStop", category: "electronics" },
  { name: "Samsung", category: "electronics", aliases: ["samsung.com"] },
  // Office supplies
  { name: "Staples", category: "other", note: "Chase Ink Business Cash earns 5x at office supply stores." },
  { name: "Office Depot", category: "other", aliases: ["officemax"], note: "Chase Ink Business Cash earns 5x at office supply stores." },
  // Furniture & home goods
  { name: "IKEA", category: "furniture" },
  { name: "Ashley Furniture", category: "furniture", aliases: ["ashley"] },
  { name: "Pottery Barn", category: "furniture", aliases: ["west elm", "williams sonoma"] },
  { name: "Crate & Barrel", category: "furniture", aliases: ["crate and barrel", "cb2"] },
  { name: "Rooms To Go", category: "furniture" },
  { name: "RH", category: "furniture", aliases: ["restoration hardware"] },
  { name: "La-Z-Boy", category: "furniture", aliases: ["lazboy"] },
  { name: "Mattress Firm", category: "furniture" },
  // Home improvement
  { name: "Home Depot", category: "home", aliases: ["the home depot"] },
  { name: "Lowe's", category: "home", aliases: ["lowes"] },
  { name: "Menards", category: "home" },
  { name: "Ace Hardware", category: "home", aliases: ["ace"] },
  { name: "True Value", category: "home" },
  { name: "Harbor Freight", category: "home" },
  { name: "Sherwin-Williams", category: "home", aliases: ["sherwin williams"] },
  { name: "Floor & Decor", category: "home" },
  // Drugstores
  { name: "CVS", category: "drugstores", aliases: ["cvs pharmacy"] },
  { name: "Walgreens", category: "drugstores" },
  { name: "Rite Aid", category: "drugstores" },
  { name: "Duane Reade", category: "drugstores" },
  // Health, beauty & salons
  { name: "Sephora", category: "beauty" },
  { name: "Ulta Beauty", category: "beauty", aliases: ["ulta"] },
  { name: "Sally Beauty", category: "beauty" },
  { name: "Great Clips", category: "beauty", aliases: ["supercuts", "barber", "hair salon"] },
  { name: "Bath & Body Works", category: "beauty", aliases: ["bath and body works"] },
  // Pets
  { name: "Petco", category: "pets" },
  { name: "PetSmart", category: "pets" },
  { name: "Pet Supplies Plus", category: "pets" },
  // Entertainment
  { name: "AMC Theatres", category: "movies", aliases: ["amc"] },
  { name: "Regal", category: "movies", aliases: ["regal cinemas"] },
  { name: "Cinemark", category: "movies" },
  { name: "Fandango", category: "movies", note: "Online ticket sellers don't always code as movie theaters." },
  { name: "Ticketmaster", category: "entertainment", aliases: ["live nation"] },
  { name: "StubHub", category: "entertainment" },
  { name: "SeatGeek", category: "entertainment" },
  { name: "Vivid Seats", category: "entertainment" },
  { name: "Topgolf", category: "entertainment" },
  { name: "Dave & Buster's", category: "entertainment", aliases: ["dave and busters"] },
  { name: "Disneyland / Disney World", category: "entertainment", aliases: ["disneyland", "disney world"] },
  { name: "Six Flags", category: "entertainment", aliases: ["cedar fair"] },
  // Fitness / gyms
  { name: "Planet Fitness", category: "fitness" },
  { name: "LA Fitness", category: "fitness" },
  { name: "Equinox", category: "fitness" },
  { name: "Crunch Fitness", category: "fitness", aliases: ["crunch"] },
  { name: "24 Hour Fitness", category: "fitness" },
  { name: "Anytime Fitness", category: "fitness" },
  { name: "Orangetheory", category: "fitness", aliases: ["orange theory"] },
  { name: "Life Time", category: "fitness", aliases: ["lifetime fitness"] },
  { name: "Peloton", category: "fitness", note: "Peloton memberships may code as streaming or fitness." },
  { name: "ClassPass", category: "fitness" },
  // Cell phone plans
  { name: "Verizon", category: "phone", aliases: ["verizon wireless"] },
  { name: "AT&T", category: "phone", aliases: ["att"] },
  { name: "T-Mobile", category: "phone", aliases: ["tmobile", "metro by t-mobile"] },
  { name: "Mint Mobile", category: "phone", aliases: ["mint"] },
  { name: "Visible", category: "phone" },
  { name: "Cricket Wireless", category: "phone", aliases: ["cricket"] },
  { name: "Google Fi", category: "phone" },
  { name: "US Mobile", category: "phone" },
  // Internet, cable & TV
  { name: "Xfinity", category: "internet", aliases: ["comcast"] },
  { name: "Spectrum", category: "internet", aliases: ["charter"] },
  { name: "Verizon Fios", category: "internet", aliases: ["fios"] },
  { name: "AT&T Fiber", category: "internet", aliases: ["att fiber", "at&t internet"] },
  { name: "Cox", category: "internet", aliases: ["cox communications"] },
  { name: "Optimum", category: "internet" },
  { name: "Google Fiber", category: "internet" },
  { name: "Starlink", category: "internet" },
  { name: "DirecTV", category: "internet", aliases: ["directv"] },
  { name: "Dish", category: "internet", aliases: ["dish network"] },
  // Utilities
  { name: "Electric bill", category: "utilities", aliases: ["electricity", "pg&e", "con edison", "coned", "duke energy", "comed", "georgia power", "fpl"] },
  { name: "Gas / water bill", category: "utilities", aliases: ["water bill", "natural gas", "sewer", "trash"] },
  // Rent / mortgage
  { name: "Bilt Rent", category: "rent", aliases: ["rent", "mortgage", "bilt"], note: "Most cards charge a fee or don't earn on rent; Bilt cards earn points with no fee." },
];
