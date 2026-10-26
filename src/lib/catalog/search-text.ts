import { CLARITY_VALUES, COLOR_VALUES, LAB_VALUES, SHAPE_VALUES, type ProductQuery, type Shape } from "@/lib/types/product";

/**
 * Turns what a shopper types into shop filters, so "1.5 ct oval lab F VS1 under 3 lakh"
 * finds the right stones even though the backend's `q` only searches names.
 * Anything not understood is sent as `q` (name search).
 */

const SHAPE_WORDS: Record<string, Shape> = {
  brilliant: "ROUND",
  round: "ROUND",
  oval: "OVAL",
  cushion: "CUSHION",
  emerald: "EMERALD",
  pear: "PEAR",
  teardrop: "PEAR",
  princess: "PRINCESS",
  square: "PRINCESS",
  radiant: "RADIANT",
  asscher: "ASSCHER",
  marquise: "MARQUISE",
  heart: "HEART",
};

const FILLER = new Set(["diamond", "diamonds", "loose", "stone", "stones", "certified", "a", "the", "with", "and", "in", "of", "for", "colour", "color", "clarity", "cut", "shape", "carat", "ct", "cts", "carats"]);

export function searchToQuery(text: string): ProductQuery {
  let rest = ` ${text.toLowerCase().replace(/[,]/g, " ")} `;
  const query: ProductQuery = {};

  // Price: "under 3 lakh", "below 50000", "upto 2l"
  const price = /\b(?:under|below|upto|up to|max|less than)\s*₹?\s*([\d.]+)\s*(lakh|lakhs|lac|l|k|thousand)?\b/.exec(rest);
  if (price) {
    let rupees = Number(price[1]);
    const unit = price[2] ?? "";
    if (unit.startsWith("l")) rupees *= 100000;
    if (unit === "k" || unit === "thousand") rupees *= 1000;
    if (rupees > 0) query.maxPrice = Math.round(rupees) * 100;
    rest = rest.replace(price[0], " ");
  }

  // Carat: "1.5 ct", "2 carat", "1ct"
  const carat = /\b(\d+(?:\.\d+)?)\s*(?:ct|cts|carat|carats)\b/.exec(rest);
  if (carat) {
    const c = Number(carat[1]);
    if (c > 0 && c <= 50) {
      query.minCarat = c;
      query.maxCarat = Math.round(c * 1.2 * 100) / 100;
    }
    rest = rest.replace(carat[0], " ");
  }

  // Origin
  if (/\blab[\s-]?grown\b|\blab\b|\bcvd\b|\bhpht\b|\blab[\s-]?created\b/.test(rest)) {
    query.origin = "LAB_GROWN";
    rest = rest.replace(/\blab[\s-]?grown\b|\blab[\s-]?created\b|\blab\b|\bcvd\b|\bhpht\b/g, " ");
  } else if (/\bnatural\b|\bmined\b|\bearth[\s-]?mined\b/.test(rest)) {
    query.origin = "NATURAL";
    rest = rest.replace(/\bnatural\b|\bearth[\s-]?mined\b|\bmined\b/g, " ");
  }

  // Shapes
  const shapes: Shape[] = [];
  for (const [word, shape] of Object.entries(SHAPE_WORDS)) {
    const re = new RegExp(`\\b${word}s?\\b`, "g");
    if (re.test(rest)) {
      if (!shapes.includes(shape)) shapes.push(shape);
      rest = rest.replace(re, " ");
    }
  }
  if (shapes.length) query.shape = shapes.filter((s) => SHAPE_VALUES.includes(s));

  // Lab
  const labs = LAB_VALUES.filter((lab) => new RegExp(`\\b${lab.toLowerCase()}\\b`).test(rest));
  if (labs.length) {
    query.lab = [...labs];
    for (const lab of labs) rest = rest.replace(new RegExp(`\\b${lab.toLowerCase()}\\b`, "g"), " ");
  }

  // Clarity (before colour, so "if" isn't mistaken)
  const clarities = CLARITY_VALUES.filter((c) => c !== "IF" && new RegExp(`\\b${c.toLowerCase()}\\b`).test(rest));
  if (/\bif\b/.test(rest) && /\b(vvs|vs|si|fl|clarity)\b|\bif\s+clarity\b/.test(rest)) clarities.push("IF");
  if (clarities.length) {
    query.clarity = [...clarities];
    for (const c of clarities) rest = rest.replace(new RegExp(`\\b${c.toLowerCase()}\\b`, "g"), " ");
  }

  // Colour: single letters D–M, or "d colour"
  // "i" is only a colour when the word colour is next to it ("i colour"), not in "i want…"
  const colourI = /\bi\s+colou?r\b|\bcolou?r\s+i\b/.test(rest);
  const colours = COLOR_VALUES.filter((c) => (c !== "I" || colourI) && new RegExp(`(^|\\s)${c.toLowerCase()}(\\s|$)`).test(rest));
  if (colours.length && colours.length <= 4) {
    query.color = [...colours];
    for (const c of colours) rest = rest.replace(new RegExp(`(^|\\s)${c.toLowerCase()}(?=\\s|$)`, "g"), " ");
  }

  const leftover = rest
    .split(/\s+/)
    .filter((w) => w && !FILLER.has(w))
    .join(" ")
    .trim();
  if (leftover) query.q = leftover;

  return query;
}
