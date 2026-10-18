const colors = ['#2563eb', '#dc2626', '#15803d', '#9333ea', '#b45309', '#0891b2', '#be185d', '#475569'];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c]);

// Plot the daily counts already computed by scorecard; do not re-score or smooth them.
export function chart(r) {
  const width = 1000, left = 85, right = 30, top = 65, bottom = 350;
  const height = 440 + r.rows.length * 25;
  const out = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description">`,
    '<title id="title">Flagged CVEs per day</title>',
    `<desc id="description">Daily alerts for each triage filter, ${esc(r.start)} to ${esc(r.end)}. Each point is the count for that day.</desc>`,
    '<rect width="100%" height="100%" fill="white"/>',
    '<g font-family="sans-serif" font-size="13" fill="#1f2937">',
    '<text x="85" y="27" font-size="20" font-weight="bold">Flagged CVEs per day</text>',
    `<text x="85" y="48">${esc(r.start)} to ${esc(r.end)}</text>`,
  ];
  if (!r.daily.length || !r.rows.length) {
    out.push('<text x="85" y="100">No daily data to plot.</text>', '</g></svg>');
    return out.join('\n') + '\n';
  }

  let max = 0;
  for (const day of r.daily) for (const row of r.rows) {
    const count = day[row.id];
    if (!Number.isFinite(count) || count < 0) throw new Error(`invalid daily count for ${row.id} on ${day.day}`);
    max = Math.max(max, count);
  }
  const magnitude = 10 ** Math.floor(Math.log10(Math.max(1, max / 5)));
  const step = Math.ceil(Math.max(1, max / 5) / magnitude) * magnitude;
  const ceiling = Math.max(step, Math.ceil(max / step) * step);
  const x = (i) => left + (width - left - right) * (r.daily.length === 1 ? 0.5 : i / (r.daily.length - 1));
  const y = (count) => bottom - (bottom - top) * count / ceiling;
  const num = (n) => Number(n.toFixed(2));
  for (let tick = 0; tick <= ceiling; tick += step) {
    out.push(`<line x1="${left}" y1="${num(y(tick))}" x2="${width - right}" y2="${num(y(tick))}" stroke="#e5e7eb"/>`,
      `<text x="75" y="${num(y(tick) + 4)}" text-anchor="end">${tick.toLocaleString('en-US')}</text>`);
  }
  out.push(`<path d="M${left},${top} V${bottom} H${width - right}" fill="none" stroke="#6b7280"/>`,
    '<text x="22" y="210" text-anchor="middle" transform="rotate(-90 22 210)">Flagged CVEs</text>',
    '<text x="527" y="400" text-anchor="middle">Date (UTC)</text>');
  const ticks = Math.min(5, r.daily.length);
  for (let t = 0; t < ticks; t++) {
    const i = ticks === 1 ? 0 : Math.round(t * (r.daily.length - 1) / (ticks - 1));
    out.push(`<text x="${num(x(i))}" y="373" text-anchor="middle">${esc(r.daily[i].day)}</text>`);
  }
  for (const [i, row] of r.rows.entries()) {
    const color = colors[i % colors.length];
    const points = r.daily.map((day, j) => `${num(x(j))},${num(y(day[row.id]))}`).join(' ');
    out.push(`<polyline data-filter="${esc(row.id)}" points="${points}" fill="none" stroke="${color}" stroke-width="2"><title>${esc(row.label)}</title></polyline>`);
    if (r.daily.length === 1) out.push(`<circle cx="${num(x(0))}" cy="${num(y(r.daily[0][row.id]))}" r="4" fill="${color}"/>`);
    const legendY = 430 + i * 25;
    out.push(`<line x1="85" y1="${legendY - 4}" x2="110" y2="${legendY - 4}" stroke="${color}" stroke-width="3"/>`,
      `<text x="120" y="${legendY}">${esc(row.label)}</text>`);
  }
  out.push('</g></svg>');
  return out.join('\n') + '\n';
}
