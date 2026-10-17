// Example custom filter: run with  npx github:milesgurule-png/triage-scorecard --filter examples/epss-03.js
// row = { cve, epss, pct, day, kev }  (kev = already in CISA KEV on that day)
export default {
  label: 'KEV, or EPSS >= 0.3',
  flag: (row) => row.kev || row.epss >= 0.3,
};
