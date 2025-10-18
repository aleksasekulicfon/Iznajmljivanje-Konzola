// Pretraži SVE slike u src/assets (i u podfolderima, ako ih bude)
const allImgs = import.meta.glob("../assets/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  as: "url",
});

// neutralni SVG placeholder (uvek postoji)
const SVG_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900">
       <rect width="100%" height="100%" fill="#f3f4f6"/>
       <g fill="#9ca3af" font-family="Arial,Helvetica,sans-serif" font-size="32">
         <text x="50%" y="50%" text-anchor="middle" dy=".3em">Slika nije dostupna</text>
       </g>
     </svg>`
  );

function slug(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // skini dijakritike
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9\-]/g, "");
}

// aliasi da pogodimo i kad je fajl npr. ps5.jpg a naziv je "PlayStation 5"
const ALIASES = {
  "playstation-5": ["ps5", "playstation5", "sony-ps5"],
  "xbox-series-x": ["xbox", "xsx", "series-x", "microsoft-xbox"],
  "dualsense-kontroler": ["dualsense", "ps5-controller", "dual-sense", "dualsensecontroller"],
  "xbox-bezicni-kontroler": ["xboxcontroller", "xbox-controller", "xbox-bezicni", "xbox-kontroler"],
  "nintendo-switch": ["nintendo", "switch", "nintendo-switch-console"],
};

function findImagePath(name) {
  const s = slug(name);
  const keys = Object.keys(allImgs);

  // 1) direktan pogodak po slug-u
  let k = keys.find((p) => p.includes(s));
  if (k) return allImgs[k];

  // 2) pogledaj alias-e
  for (const [canonical, list] of Object.entries(ALIASES)) {
    if (s.includes(canonical) || list.some((a) => s.includes(a))) {
      const hit = keys.find((p) => p.includes(canonical) || list.some((a) => p.includes(a)));
      if (hit) return allImgs[hit];
    }
  }

  return null;
}

/**
 * Vrati validan <img src>.
 * - Ako je prosleđen URL (/ http / data:) → vrati ga
 * - Inače potraži fajl u src/assets po imenu/aliasu
 * - Ako nema, vrati SVG placeholder
 */
export function getConsoleImage(nameOrUrl) {
  const s = nameOrUrl || "";
  if (/^(https?:\/\/|\/|data:)/.test(s)) return s;

  const found = findImagePath(s);
  return found || SVG_PLACEHOLDER;
}
