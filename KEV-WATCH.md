# KEV Watch

Every day, this repo checks what EPSS said about each newly confirmed exploited vulnerability **the day before** CISA added it to KEV.

**21 of 22** vulnerabilities CISA confirmed as exploited in the last 14 days had an EPSS score under 0.1 the day before, so an "EPSS ≥ 0.1" filter would not have flagged them.

| Added to KEV | CVE | Vendor / product | EPSS day before | Percentile | EPSS ≥ 0.1? |
|---|---|---|---:|---:|:---:|
| 2026-11-25 | [CVE-2023-25914](https://nvd.nist.gov/vuln/detail/CVE-2023-25914) | Danfoss AK-SM 800A Series | 0.008 | 57.8% | ❌ missed |
| 2026-11-25 | [CVE-2023-25915](https://nvd.nist.gov/vuln/detail/CVE-2023-25915) | Danfoss AK-SM 800A Series | 0.010 | 64.7% | ❌ missed |
| 2026-11-25 | [CVE-2025-41450](https://nvd.nist.gov/vuln/detail/CVE-2025-41450) | Danfoss AK-SM 800A Series | 0.010 | 62.4% | ❌ missed |
| 2026-11-25 | [CVE-2026-103406](https://nvd.nist.gov/vuln/detail/CVE-2026-103406) | Hewlett Packard Enterprise (HPE) Juniper Session Smart Conductor and Session Smart Router | 0.005 | 44.5% | ❌ missed |
| 2026-11-25 | [CVE-2026-133275](https://nvd.nist.gov/vuln/detail/CVE-2026-133275) | Mitel MiCollab | 0.002 | 15.7% | ❌ missed |
| 2026-11-25 | [CVE-2026-133303](https://nvd.nist.gov/vuln/detail/CVE-2026-133303) | Mitel MiCollab | 0.005 | 46.6% | ❌ missed |
| 2026-11-25 | [CVE-2026-133311](https://nvd.nist.gov/vuln/detail/CVE-2026-133311) | Mitel MiCollab | 0.003 | 17.3% | ❌ missed |
| 2026-11-25 | [CVE-2026-133323](https://nvd.nist.gov/vuln/detail/CVE-2026-133323) | Mitel MiCollab | 0.017 | 77.2% | ❌ missed |
| 2026-11-25 | [CVE-2026-133324](https://nvd.nist.gov/vuln/detail/CVE-2026-133324) | Mitel MiCollab | 0.003 | 23.7% | ❌ missed |
| 2026-11-25 | [CVE-2026-133469](https://nvd.nist.gov/vuln/detail/CVE-2026-133469) | Vates Xen Orchestra | 0.008 | 56.7% | ❌ missed |
| 2026-11-24 | [CVE-2026-131914](https://nvd.nist.gov/vuln/detail/CVE-2026-131914) | Idunno AntiCsrf | 0.006 | 50.4% | ❌ missed |
| 2026-11-24 | [CVE-2026-132165](https://nvd.nist.gov/vuln/detail/CVE-2026-132165) | Drupal Core | not scored | – | – |
| 2026-11-24 | [CVE-2026-132224](https://nvd.nist.gov/vuln/detail/CVE-2026-132224) | Optimizely Web Experimentation | 0.004 | 37.6% | ❌ missed |
| 2026-11-23 | [CVE-2026-133968](https://nvd.nist.gov/vuln/detail/CVE-2026-133968) | Project MONAI MONAI Label | 0.038 | 90.2% | ❌ missed |
| 2026-11-23 | [CVE-2026-134624](https://nvd.nist.gov/vuln/detail/CVE-2026-134624) | N-able MailAssure | not scored | – | – |
| 2026-11-20 | [CVE-2025-42884](https://nvd.nist.gov/vuln/detail/CVE-2025-42884) | SAP NetWeaver | 0.003 | 20.4% | ❌ missed |
| 2026-11-20 | [CVE-2026-123890](https://nvd.nist.gov/vuln/detail/CVE-2026-123890) | Broadcom VMware vCenter | not scored | – | – |
| 2026-11-20 | [CVE-2026-129448](https://nvd.nist.gov/vuln/detail/CVE-2026-129448) | Apache Roller | 0.012 | 68.6% | ❌ missed |
| 2026-11-20 | [CVE-2026-76466](https://nvd.nist.gov/vuln/detail/CVE-2026-76466) | Cisco Expressway Series | 0.004 | 36.7% | ❌ missed |
| 2026-11-18 | [CVE-2024-10441](https://nvd.nist.gov/vuln/detail/CVE-2024-10441) | Synology DiskStation Manager (DSM) | 0.013 | 69.9% | ❌ missed |
| 2026-11-18 | [CVE-2026-40217](https://nvd.nist.gov/vuln/detail/CVE-2026-40217) | BerriAI LiteLLM | 0.170 | 97.1% | ✅ flagged |
| 2026-11-18 | [CVE-2026-90436](https://nvd.nist.gov/vuln/detail/CVE-2026-90436) | Apache Axis | 0.011 | 66.9% | ❌ missed |
| 2026-11-18 | [CVE-2026-90817](https://nvd.nist.gov/vuln/detail/CVE-2026-90817) | Vanderbilt University Research Electronic Data Capture (REDCap) | 0.037 | 90.1% | ❌ missed |
| 2026-11-17 | [CVE-2026-115731](https://nvd.nist.gov/vuln/detail/CVE-2026-115731) | Perforce Puppet Enterprise | 0.004 | 30.9% | ❌ missed |
| 2026-11-13 | [CVE-2026-114713](https://nvd.nist.gov/vuln/detail/CVE-2026-114713) | UnrealIRCd UnrealIRCd | 0.003 | 23.3% | ❌ missed |
| 2026-11-13 | [CVE-2026-123039](https://nvd.nist.gov/vuln/detail/CVE-2026-123039) | Check Point Multiple Products | not scored | – | – |

"Not scored" means EPSS had no score for that CVE yet, which is common for brand-new CVEs and is its own blind spot.

Updated 2026-11-26 from the [CISA KEV catalog](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [FIRST EPSS](https://www.first.org/epss/).
