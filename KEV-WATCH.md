# KEV Watch

Every day, this repo checks what EPSS said about each newly confirmed exploited vulnerability **the day before** CISA added it to KEV.

**11 of 11** vulnerabilities CISA confirmed as exploited in the last 14 days had an EPSS score under 0.1 the day before, so an "EPSS ≥ 0.1" filter would not have flagged them.

| Added to KEV | CVE | Vendor / product | EPSS day before | Percentile | EPSS ≥ 0.1? |
|---|---|---|---:|---:|:---:|
| 2026-10-23 | [CVE-2026-110447](https://nvd.nist.gov/vuln/detail/CVE-2026-110447) | Collabora Collabora Online – Built-in CODE Server | 0.012 | 68.6% | ❌ missed |
| 2026-10-23 | [CVE-2026-114625](https://nvd.nist.gov/vuln/detail/CVE-2026-114625) | Arista VeloCloud Orchestrator | not scored | – | – |
| 2026-10-20 | [CVE-2026-106931](https://nvd.nist.gov/vuln/detail/CVE-2026-106931) | EG Secure Solutions SiteGuard Server Edition | 0.007 | 50.7% | ❌ missed |
| 2026-10-20 | [CVE-2026-110936](https://nvd.nist.gov/vuln/detail/CVE-2026-110936) | Siemens Software Center | 0.001 | 2.7% | ❌ missed |
| 2026-10-20 | [CVE-2026-96652](https://nvd.nist.gov/vuln/detail/CVE-2026-96652) | Plex Media Server | 0.002 | 12.0% | ❌ missed |
| 2026-10-20 | [CVE-2026-96654](https://nvd.nist.gov/vuln/detail/CVE-2026-96654) | Plex Media Server | 0.002 | 12.6% | ❌ missed |
| 2026-10-20 | [CVE-2026-96655](https://nvd.nist.gov/vuln/detail/CVE-2026-96655) | Plex Media Server | 0.002 | 12.0% | ❌ missed |
| 2026-10-20 | [CVE-2026-96656](https://nvd.nist.gov/vuln/detail/CVE-2026-96656) | Plex Media Server | 0.004 | 32.3% | ❌ missed |
| 2026-10-16 | [CVE-2025-61624](https://nvd.nist.gov/vuln/detail/CVE-2025-61624) | Fortinet Multiple Products | 0.005 | 43.8% | ❌ missed |
| 2026-10-16 | [CVE-2026-102764](https://nvd.nist.gov/vuln/detail/CVE-2026-102764) | BeyondTrust Remote Support | not scored | – | – |
| 2026-10-15 | [CVE-2026-21589](https://nvd.nist.gov/vuln/detail/CVE-2026-21589) | Atlassian Multiple Products | 0.028 | 86.1% | ❌ missed |
| 2026-10-14 | [CVE-2026-0322](https://nvd.nist.gov/vuln/detail/CVE-2026-0322) | Palo Alto Networks PAN-OS | not scored | – | – |
| 2026-10-14 | [CVE-2026-105133](https://nvd.nist.gov/vuln/detail/CVE-2026-105133) | Ahsay AhsayCBS | 0.004 | 30.5% | ❌ missed |
| 2026-10-14 | [CVE-2026-105134](https://nvd.nist.gov/vuln/detail/CVE-2026-105134) | Ahsay AhsayCBS | 0.018 | 78.5% | ❌ missed |
| 2026-10-14 | [CVE-2026-76519](https://nvd.nist.gov/vuln/detail/CVE-2026-76519) | Cisco Secure Email Gateway | not scored | – | – |
| 2026-10-13 | [CVE-2026-104935](https://nvd.nist.gov/vuln/detail/CVE-2026-104935) | Ivanti Connect Secure | not scored | – | – |
| 2026-10-13 | [CVE-2026-96951](https://nvd.nist.gov/vuln/detail/CVE-2026-96951) | Microsoft Windows | not scored | – | – |

"Not scored" means EPSS had no score for that CVE yet, which is common for brand-new CVEs and is its own blind spot.

Updated 2026-10-26 from the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [FIRST EPSS](https://www.first.org/epss/).
