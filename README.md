# 🎯 triage-scorecard

**How good is your vulnerability triage, really?** Score any prioritization method against **real** public data, the CISA Known Exploited Vulnerabilities catalog (KEV) and FIRST's daily EPSS scores, replayed day by day with **no future data**.

[![test](https://github.com/milesgurule-png/triage-scorecard/actions/workflows/test.yml/badge.svg)](https://github.com/milesgurule-png/triage-scorecard/actions/workflows/test.yml) ![license](https://img.shields.io/badge/license-MIT-green) ![node](https://img.shields.io/badge/node-%3E%3D18-blue) ![deps](https://img.shields.io/badge/dependencies-0-brightgreen)

Most teams pick a rule like "only CRITICAL" or "EPSS above 0.1" and hope. This tool shows what that rule actually costs you: how many alerts a day, how many known-exploited vulnerabilities it misses, and whether it warns you *before* a CVE is exploited.

<!-- kev-watch:start -->
## 🔴 KEV Watch (updates daily)

**6 of 9** vulnerabilities CISA confirmed as exploited in the last 14 days had an EPSS score under 0.1 the day before, so an "EPSS ≥ 0.1" filter would not have flagged them.

| Added to KEV | CVE | Vendor / product | EPSS day before | Percentile | EPSS ≥ 0.1? |
|---|---|---|---:|---:|:---:|
| 2026-10-16 | [CVE-2025-61624](https://nvd.nist.gov/vuln/detail/CVE-2025-61624) | Fortinet Multiple Products | 0.005 | 43.8% | ❌ missed |
| 2026-10-16 | [CVE-2026-102764](https://nvd.nist.gov/vuln/detail/CVE-2026-102764) | BeyondTrust Remote Support | not scored | – | – |
| 2026-10-15 | [CVE-2026-21589](https://nvd.nist.gov/vuln/detail/CVE-2026-21589) | Atlassian Multiple Products | 0.028 | 86.1% | ❌ missed |
| 2026-10-14 | [CVE-2026-0322](https://nvd.nist.gov/vuln/detail/CVE-2026-0322) | Palo Alto Networks PAN-OS | not scored | – | – |
| 2026-10-14 | [CVE-2026-105133](https://nvd.nist.gov/vuln/detail/CVE-2026-105133) | Ahsay AhsayCBS | 0.004 | 30.5% | ❌ missed |
| 2026-10-14 | [CVE-2026-105134](https://nvd.nist.gov/vuln/detail/CVE-2026-105134) | Ahsay AhsayCBS | 0.018 | 78.5% | ❌ missed |
| 2026-10-14 | [CVE-2026-76519](https://nvd.nist.gov/vuln/detail/CVE-2026-76519) | Cisco Secure Email Gateway | not scored | – | – |
| 2026-10-13 | [CVE-2026-104935](https://nvd.nist.gov/vuln/detail/CVE-2026-104935) | Ivanti Connect Secure | not scored | – | – |

"Not scored" means EPSS had no score for that CVE yet, which is common for brand-new CVEs and is its own blind spot.

Updated 2026-10-19 from the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [FIRST EPSS](https://www.first.org/epss/). [Full list →](KEV-WATCH.md)
<!-- kev-watch:end -->

## Results: 60 real days (Aug 17 – Oct 15, 2026)

Every CVE with an EPSS score (~375,000 a day). Reproduce with `npx github:milesgurule-png/triage-scorecard --days 60 --end 2026-10-15`.

| Filter | Flagged/day | Noise cut | KEV recall | Precision (KEV) | Warned before KEV | Median lead |
|---|---:|---:|---:|---:|---:|---:|
| Show everything | 374,268 | 0.0% | 100.0% | 0.5% | 52 of 80 | 10 d |
| EPSS >= 0.1 | 17,310 | 95.4% | 75.1% | 7.4% | 10 of 80 | 23 d |
| EPSS >= 0.5 | 4,319 | 98.8% | 50.9% | 20.1% | 5 of 80 | 52 d |
| EPSS top 1% | 3,747 | 99.0% | 48.5% | 22.1% | 4 of 80 | 52 d |
| KEV only | 1,709 | 99.5% | 100.0% | 100.0% | 0 of 80 | – |
| KEV or EPSS >= 0.1 | 17,734 | 95.3% | 100.0% | 9.6% | 10 of 80 | 23 d |

**What it shows:**
- **Every EPSS cutoff misses known-exploited vulnerabilities.** Even EPSS >= 0.1 skips about 1 in 4.
- **KEV alone is perfectly precise but gives zero warning.** You only hear about a CVE after it's confirmed exploited.
- **The hard problem is the middle:** flagging the CVEs that *will* be exploited, early, without flooding the team. That's the trade-off this tool makes visible.

## Quick start

```bash
npx github:milesgurule-png/triage-scorecard                 # last 30 days, built-in filters
npx github:milesgurule-png/triage-scorecard --days 60 --json result.json
```

Node 18+, no dependencies. Data downloads once into `.cache/` (each EPSS day is about 2 MB).

## Score your own tool

**Your tool's decisions:** export what it flagged as `date,cve` (one row per flagged CVE per day), or a plain list of CVEs to flag every day:

```bash
npx github:milesgurule-png/triage-scorecard --flags my-tool.csv
```

**Your own rule:** write a filter in a few lines of JS:

```js
// my-rule.js  (row = { cve, epss, pct, day, kev })
export default { label: 'KEV, or EPSS >= 0.3', flag: (row) => row.kev || row.epss >= 0.3 };
```

```bash
npx github:milesgurule-png/triage-scorecard --filter my-rule.js
```

**Only your environment:** restrict scoring to the CVEs your scanner actually found:

```bash
npx github:milesgurule-png/triage-scorecard --cves my-findings.txt --flags my-tool.csv
```

## Metrics

| Metric | Meaning |
|---|---|
| **Flagged/day** | Average CVEs the filter marks for action each day |
| **Noise cut** | How much smaller that is than showing everything |
| **KEV recall** | Share of known-exploited CVEs (in KEV that day) the filter flagged. Anything under 100% is a known-exploited vulnerability you'd skip. |
| **Precision (KEV)** | Share of flagged CVEs already known-exploited that day. A strict bar, since most real risk is never confirmed exploited. Compare filters against each other, not against 100%. |
| **Warned before KEV** | CVEs added to KEV during the window that the filter flagged on an earlier day |
| **Median lead** | Typical days of warning for those early catches |

## Honesty rules
- **No time travel:** day D uses only that day's EPSS file and KEV entries with `dateAdded` on or before D.
- **Real data only:** no synthetic CVEs, assets or labels.
- **Known limits:** KEV is a narrow definition of "exploited" (confirmed, in-the-wild, mostly US-government-relevant). CVEs without an EPSS score on a given day aren't scored that day. Severity (CVSS) filters aren't built in yet; use `--filter` with your own CVSS data.

## Data sources
- [CISA Known Exploited Vulnerabilities catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog)
- [FIRST EPSS](https://www.first.org/epss/): daily scores, cited per FIRST's guidance (Jacobs et al., *Exploit Prediction Scoring System*).

## Contributing
Ideas and new filters are welcome; open an issue or PR. Run `npm test` before submitting.

Made by [Miles Gurule](https://github.com/milesgurule-png) · Forge Labs. MIT licensed.
