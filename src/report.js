const pct = (x) => (x == null ? 'n/a' : `${(100 * x).toFixed(1)}%`);
const num = (x) => Math.round(x).toLocaleString('en-US');

export function markdown(r, { cohort }) {
  const lines = [
    `## Triage scorecard: ${r.start} to ${r.end} (${r.days} days)`,
    '',
    `Cohort: ${cohort}. ${r.newlyExploited} CVEs were added to CISA KEV during the window.`,
    '',
    '| Filter | Flagged/day | Noise cut | KEV recall | Precision (KEV) | Warned before KEV | Median lead |',
    '|---|---:|---:|---:|---:|---:|---:|',
  ];
  for (const x of r.rows) {
    lines.push(`| ${x.label} | ${num(x.perDay)} | ${pct(x.noiseCut)} | ${pct(x.kevRecall)} | ${pct(x.precision)} | ${x.earlyWarned} of ${r.newlyExploited} | ${x.medianLeadDays == null ? '–' : x.medianLeadDays + ' d'} |`);
  }
  lines.push('',
    '- **KEV recall:** share of known-exploited CVEs (in KEV on that day) that the filter flagged.',
    '- **Precision (KEV):** share of flagged CVEs that were already known-exploited that day. A strict bar: most real risk is never confirmed exploited.',
    '- **Warned before KEV:** CVEs added to KEV during the window that the filter flagged on an earlier day. Lead = days of warning.',
    '- No future data: day D uses only EPSS scores for D and KEV entries added on or before D.', '');
  return lines.join('\n');
}
