# KEV Watch

Every day, this repo checks what EPSS said about each newly confirmed exploited vulnerability **the day before** CISA added it to KEV.

**10 of 15** vulnerabilities CISA confirmed as exploited in the last 14 days had an EPSS score under 0.1 the day before, so an "EPSS ≥ 0.1" filter would not have flagged them.

| Added to KEV | CVE | Vendor / product | EPSS day before | Percentile | EPSS ≥ 0.1? |
|---|---|---|---:|---:|:---:|
| 2026-10-30 | [CVE-2026-111357](https://nvd.nist.gov/vuln/detail/CVE-2026-111357) | Ivanti Connect Secure | 0.002 | 16.0% | ❌ missed |
| 2026-10-30 | [CVE-2026-118527](https://nvd.nist.gov/vuln/detail/CVE-2026-118527) | Ivanti Connect Secure | not scored | – | – |
| 2026-10-29 | [CVE-2026-76418](https://nvd.nist.gov/vuln/detail/CVE-2026-76418) | Cisco Secure Firewall ASA Software and Cisco Secure FTD Software | not scored | – | – |
| 2026-10-29 | [CVE-2026-97229](https://nvd.nist.gov/vuln/detail/CVE-2026-97229) | GitLab Community Edition and Enterprise Edition | 0.184 | 97.2% | ✅ flagged |
| 2026-10-28 | [CVE-2026-41709](https://nvd.nist.gov/vuln/detail/CVE-2026-41709) | Broadcom VMware ESX | 0.003 | 22.2% | ❌ missed |
| 2026-10-28 | [CVE-2026-46300](https://nvd.nist.gov/vuln/detail/CVE-2026-46300) | Linux Kernel | 0.102 | 95.6% | ✅ flagged |
| 2026-10-27 | [CVE-2026-111497](https://nvd.nist.gov/vuln/detail/CVE-2026-111497) | Google Brotli | 0.360 | 98.5% | ✅ flagged |
| 2026-10-27 | [CVE-2026-48356](https://nvd.nist.gov/vuln/detail/CVE-2026-48356) | Adobe Commerce and Magento | 0.010 | 62.6% | ❌ missed |
| 2026-10-26 | [CVE-2026-109618](https://nvd.nist.gov/vuln/detail/CVE-2026-109618) | PHP Group PHP | 1.000 | 100.0% | ✅ flagged |
| 2026-10-26 | [CVE-2026-109619](https://nvd.nist.gov/vuln/detail/CVE-2026-109619) | PHP Group PHP | 1.000 | 100.0% | ✅ flagged |
| 2026-10-23 | [CVE-2026-110447](https://nvd.nist.gov/vuln/detail/CVE-2026-110447) | Collabora Collabora Online – Built-in CODE Server | 0.012 | 68.6% | ❌ missed |
| 2026-10-23 | [CVE-2026-114625](https://nvd.nist.gov/vuln/detail/CVE-2026-114625) | Arista VeloCloud Orchestrator | not scored | – | – |
| 2026-10-20 | [CVE-2026-106931](https://nvd.nist.gov/vuln/detail/CVE-2026-106931) | EG Secure Solutions SiteGuard Server Edition | 0.007 | 50.7% | ❌ missed |
| 2026-10-20 | [CVE-2026-110936](https://nvd.nist.gov/vuln/detail/CVE-2026-110936) | Siemens Software Center | 0.001 | 2.7% | ❌ missed |
| 2026-10-20 | [CVE-2026-96652](https://nvd.nist.gov/vuln/detail/CVE-2026-96652) | Plex Media Server | 0.002 | 12.0% | ❌ missed |
| 2026-10-20 | [CVE-2026-96654](https://nvd.nist.gov/vuln/detail/CVE-2026-96654) | Plex Media Server | 0.002 | 12.6% | ❌ missed |
| 2026-10-20 | [CVE-2026-96655](https://nvd.nist.gov/vuln/detail/CVE-2026-96655) | Plex Media Server | 0.002 | 12.0% | ❌ missed |
| 2026-10-20 | [CVE-2026-96656](https://nvd.nist.gov/vuln/detail/CVE-2026-96656) | Plex Media Server | 0.004 | 32.3% | ❌ missed |

"Not scored" means EPSS had no score for that CVE yet, which is common for brand-new CVEs and is its own blind spot.

Updated 2026-10-31 from the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [FIRST EPSS](https://www.first.org/epss/).
