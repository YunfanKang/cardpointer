// Finds rotating-category cards in cards.js that have no calendar entry for the
// upcoming quarter. Prints a Markdown issue body (empty if nothing is missing).
import { readFileSync, appendFileSync } from "node:fs";
import vm from "node:vm";

const src = readFileSync(new URL("../../cards.js", import.meta.url), "utf8");
const CARDS = vm.runInNewContext(`${src}\nCARDS`, {});

// Look 20 days ahead: mid-month of a quarter's last month → next quarter;
// the first days of a quarter → that quarter (catches anything still missing).
const target = new Date(Date.now() + 20 * 864e5);
const quarter = `${target.getUTCFullYear()}-Q${Math.floor(target.getUTCMonth() / 3) + 1}`;

const missing = CARDS.filter((c) => c.rotating?.calendar && !c.rotating.calendar[quarter]);

let body = "";
if (missing.length) {
  body = [
    `These rotating 5% cards have no \`"${quarter}"\` entry in \`cards.js\`:`,
    "",
    ...missing.map((c) => `- [ ] **${c.name.startsWith(c.issuer) ? c.name : `${c.issuer} ${c.name}`}** (\`${c.id}\`)`),
    "",
    "Add each one under `rotating.calendar` once the issuer announces it:",
    "",
    "```js",
    `"${quarter}": { keys: ["dining"], label: "Full issuer wording" },`,
    "```",
    "",
    "Also bump `DATA_UPDATED`. Close this issue when done.",
  ].join("\n");
}

console.log(body || `All rotating cards have ${quarter} categories.`);
if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `quarter=${quarter}\nmissing=${missing.length}\n`);
  if (body) appendFileSync("issue-body.md", body);
}
