# KEV Watch

Every day, this repo checks what EPSS said about each newly confirmed exploited vulnerability **the day before** CISA added it to KEV.

**12 of 14** vulnerabilities CISA confirmed as exploited in the last 14 days had an EPSS score under 0.1 the day before, so an "EPSS ≥ 0.1" filter would not have flagged them.

| Added to KEV | CVE | Vendor / product | EPSS day before | Percentile | EPSS ≥ 0.1? |
|---|---|---|---:|---:|:---:|
| 2026-11-10 | [CVE-2026-111560](https://nvd.nist.gov/vuln/detail/CVE-2026-111560) | Barracuda Networks Multiple Products | 0.011 | 64.8% | ❌ missed |
| 2026-11-10 | [CVE-2026-111793](https://nvd.nist.gov/vuln/detail/CVE-2026-111793) | Openwave Messaging Limited Webtop Media Transcoder | 0.003 | 19.9% | ❌ missed |
| 2026-11-10 | [CVE-2026-116606](https://nvd.nist.gov/vuln/detail/CVE-2026-116606) | Barracuda Networks Barracuda Email Security Gateway (ESG) | 0.016 | 76.0% | ❌ missed |
| 2026-11-10 | [CVE-2026-124194](https://nvd.nist.gov/vuln/detail/CVE-2026-124194) | Microsoft Office | not scored | – | – |
| 2026-11-10 | [CVE-2026-125350](https://nvd.nist.gov/vuln/detail/CVE-2026-125350) | Google Chromium | not scored | – | – |
| 2026-11-10 | [CVE-2026-20320](https://nvd.nist.gov/vuln/detail/CVE-2026-20320) | Cisco BroadWorks | 0.004 | 32.9% | ❌ missed |
| 2026-11-09 | [CVE-2026-102895](https://nvd.nist.gov/vuln/detail/CVE-2026-102895) | GPUStack GPUStack | 0.003 | 26.4% | ❌ missed |
| 2026-11-09 | [CVE-2026-116779](https://nvd.nist.gov/vuln/detail/CVE-2026-116779) | SignalWire FreeSwitch | 0.013 | 70.6% | ❌ missed |
| 2026-11-09 | [CVE-2026-123158](https://nvd.nist.gov/vuln/detail/CVE-2026-123158) | OpenBSD OpenSSH | 0.010 | 63.5% | ❌ missed |
| 2026-11-09 | [CVE-2026-123218](https://nvd.nist.gov/vuln/detail/CVE-2026-123218) | IBM Aspera Faspex | 0.004 | 34.1% | ❌ missed |
| 2026-11-06 | [CVE-2026-19868](https://nvd.nist.gov/vuln/detail/CVE-2026-19868) | SonicWall SonicOS SSLVPN | not scored | – | – |
| 2026-11-04 | [CVE-2024-27834](https://nvd.nist.gov/vuln/detail/CVE-2024-27834) | Apple Multiple Products | 0.006 | 48.7% | ❌ missed |
| 2026-11-03 | [CVE-2026-119977](https://nvd.nist.gov/vuln/detail/CVE-2026-119977) | WordPress WordPress Core | 0.006 | 48.7% | ❌ missed |
| 2026-10-30 | [CVE-2026-111357](https://nvd.nist.gov/vuln/detail/CVE-2026-111357) | Ivanti Connect Secure | 0.002 | 16.0% | ❌ missed |
| 2026-10-30 | [CVE-2026-118527](https://nvd.nist.gov/vuln/detail/CVE-2026-118527) | Ivanti Connect Secure | not scored | – | – |
| 2026-10-29 | [CVE-2026-76418](https://nvd.nist.gov/vuln/detail/CVE-2026-76418) | Cisco Secure Firewall ASA Software and Cisco Secure FTD Software | not scored | – | – |
| 2026-10-29 | [CVE-2026-97229](https://nvd.nist.gov/vuln/detail/CVE-2026-97229) | GitLab Community Edition and Enterprise Edition | 0.184 | 97.2% | ✅ flagged |
| 2026-10-28 | [CVE-2026-41709](https://nvd.nist.gov/vuln/detail/CVE-2026-41709) | Broadcom VMware ESX | 0.003 | 22.2% | ❌ missed |
| 2026-10-28 | [CVE-2026-46300](https://nvd.nist.gov/vuln/detail/CVE-2026-46300) | Linux Kernel | 0.102 | 95.6% | ✅ flagged |

"Not scored" means EPSS had no score for that CVE yet, which is common for brand-new CVEs and is its own blind spot.

Updated 2026-11-10 from the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [FIRST EPSS](https://www.first.org/epss/).
