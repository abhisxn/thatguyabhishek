/* ─── SVG coordinate system ─── */
export const VW = 560, VH = 320;
export const ML = 28, MR = 20, MT = 52, MB = 62;
export const IW = VW - ML - MR, IH = VH - MT - MB;

const K = 2.5;
function expV(t) {
  const raw = ((Math.exp(K * t) - 1) / (Math.exp(K) - 1)) * 100;
  return 10 + raw * 0.9;
}

export const TIMELINE = [
  { period: 'Currently', role: 'Senior Product Designer',       org: 'Microsoft',          year: 2026 },
  { period: '2022–2023', role: 'Design Manager',                org: 'GoodWorker',         year: 2023 },
  { period: '2020–2023', role: 'Chief Hustler',                 org: 'ThinkPlanty.com',    year: 2023 },
  { period: '2019–2020', role: 'Principal Experience Designer', org: 'Airtel',             year: 2020 },
  { period: '2018–2019', role: 'UX Manager',                    org: 'Cheil, Samsung',     year: 2019 },
  { period: '2016–2018', role: 'Founder',                       org: 'Watchlyst App',      year: 2018 },
  { period: '2015–2018', role: 'UX Manager',                    org: 'Avizva, USA',        year: 2018 },
  { period: '2015–2016', role: 'Design Director',               org: 'Toaster / Google',   year: 2016 },
  { period: '2011–2015', role: 'UX Manager',                    org: 'Dentsu, Webchutney', year: 2015 },
];

export const X_TICKS = [2011, 2013, 2015, 2017, 2019, 2021, 2023, 2025];
export const H_GRID  = [25, 50, 75, 100];

export function xOf(year) { return ML + ((year - 2011) / (2026 - 2011)) * IW; }
export function yOf(year) {
  const t = (year - 2011) / (2026 - 2011);
  return MT + IH - (expV(t) / 100) * IH;
}
export function xPct(year) { return ((xOf(year) / VW) * 100).toFixed(3) + '%'; }

export function buildLinePath(activeYear) {
  const tEnd = Math.min(1, Math.max(0.001, (activeYear - 2011) / (2026 - 2011)));
  return Array.from({ length: 101 }, (_, i) => {
    const t = (i / 100) * tEnd;
    const x = ML + t * IW;
    const y = MT + IH - (expV(t) / 100) * IH;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join(' ');
}

export function buildAreaPath(activeYear) {
  const tEnd = Math.min(1, Math.max(0.001, (activeYear - 2011) / (2026 - 2011)));
  const baseY = (MT + IH).toFixed(2);
  const pts = Array.from({ length: 101 }, (_, i) => {
    const t = (i / 100) * tEnd;
    const x = ML + t * IW;
    const y = MT + IH - (expV(t) / 100) * IH;
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
  });
  const endX = (ML + tEnd * IW).toFixed(2);
  return [...pts, `L ${endX} ${baseY}`, `L ${ML.toFixed(2)} ${baseY}`, 'Z'].join(' ');
}

export function nearestIdx(year) {
  let best = 0, bestDist = Infinity;
  TIMELINE.forEach((item, i) => {
    const d = Math.abs(item.year - year);
    if (d < bestDist) { bestDist = d; best = i; }
  });
  return best;
}
