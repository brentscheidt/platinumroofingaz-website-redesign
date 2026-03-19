# Platinum Roofing Group — Testsite Outline, SEO Strategy, and Competitive Analysis

**Date:** 03_18_26
**Prepared for:** Presentation — 03_19_26 9am
**Site:** https://testsite.platinum.gaios.ai (26 pages, noindex, preview only)
**Old site:** platinumroofingaz.com (Squarespace, 5 pages, decommissioned)

---

## Executive Summary

The Platinum Roofing testsite represents a structural leap from the old site: 26 fully built pages versus 5, dedicated service pages, 8 city pages, a blog, and a clean modern architecture — all on Cloudflare edge with no framework weight. The old site could not rank for a single high-intent local keyword. This build can.

What it still needs before launch: schema markup, GA4, noindex removal, a sitemap, real project photos, and a review strategy. Those are solved in weeks, not months.

Against three major competitors — ProWest (Brent's former employer), Chucktown Roofing (Brian Surguy), and Mission Restoration — Platinum wins on design quality, page architecture, and content depth. Competitors win on volume of location pages, review counts, and trust badges. Both are closable gaps post-launch.

---

## 1. Site Architecture

### 1.1 Complete Page Inventory (All 26 Pages)

| # | URL | Page Title | Type | Word Count (est.) |
|---|-----|------------|------|-------------------|
| 1 | `/` | Platinum Roofing Group \| Phoenix Roofing Contractor | Home | ~2,100 |
| 2 | `/services/` | Roofing Services in Phoenix, AZ | Service Hub | ~1,400 |
| 3 | `/services/roof-repair/` | Roof Repair in Phoenix, AZ | Service Detail | ~1,200 |
| 4 | `/services/roof-replacement/` | Roof Replacement in Phoenix, AZ | Service Detail | ~1,200 |
| 5 | `/services/commercial-roofing/` | Commercial Roofing in Phoenix, AZ | Service Detail | ~1,200 |
| 6 | `/services/metal-roofing/` | Metal Roofing in Phoenix, AZ | Service Detail | ~1,400 |
| 7 | `/services/tile-roofing/` | Tile Roofing in Phoenix, AZ | Service Detail | ~1,150 |
| 8 | `/services/flat-foam-roofing/` | Flat & Foam Roofing in Phoenix, AZ | Service Detail | ~1,150 |
| 9 | `/services/storm-damage-insurance/` | Storm Damage and Insurance Roof Support | Service Detail | ~1,200 |
| 10 | `/services/roof-inspection/` | Roof Inspection in Phoenix, AZ | Service Detail | ~1,400 |
| 11 | `/service-areas/` | Phoenix Metro Service Areas | City Hub | ~1,050 |
| 12 | `/service-areas/phoenix/` | Phoenix Roof Repair and Replacement | City Page | ~1,000 |
| 13 | `/service-areas/scottsdale/` | Scottsdale Roofing | City Page | ~1,000 |
| 14 | `/service-areas/mesa/` | Mesa Roof Repair and Inspection | City Page | ~1,050 |
| 15 | `/service-areas/tempe/` | Tempe Commercial Roofing and Inspection | City Page | ~1,000 |
| 16 | `/service-areas/chandler/` | Chandler Roof Repair and Replacement | City Page | ~1,000 |
| 17 | `/service-areas/gilbert/` | Gilbert Roof Inspection and Replacement | City Page | ~1,000 |
| 18 | `/service-areas/glendale/` | Glendale Roof Repair and Commercial Roofing | City Page | ~1,000 |
| 19 | `/service-areas/peoria/` | Peoria Roof Repair and Storm Damage | City Page | ~1,050 |
| 20 | `/about/` | About Platinum Roofing Group \| Arizona Roofing Since 2010 | Brand | ~1,400 |
| 21 | `/projects/` | Projects \| Platinum Roofing Group | Proof | ~950 |
| 22 | `/contact/` | Contact Platinum Roofing Group \| Free Roof Inspection | Conversion | ~850 |
| 23 | `/blog/` | Roofing Blog \| Arizona Homeowner Tips | Blog Index | ~850 |
| 24 | `/blog/when-to-replace-vs-repair/` | When to Replace vs. Repair Your Roof | Blog Article | ~1,450 |
| 25 | `/blog/arizona-monsoon-roof-prep/` | Arizona Monsoon Season Roof Prep | Blog Article | ~1,500 |
| 26 | `/blog/insurance-claim-roof-damage/` | Filing a Roof Damage Insurance Claim in Arizona | Blog Article | ~1,600 |

**Total:** 1 home + 9 service pages (1 hub + 8 detail) + 9 city pages (1 hub + 8 detail) + 4 brand/proof pages + 4 blog pages (1 index + 3 articles)

### 1.2 Page Types and Purpose

| Type | Count | Purpose |
|------|-------|---------|
| Home | 1 | Brand entry, trust stack, navigation entry point to all service and city lanes |
| Service hub | 1 | Services overview, links into all 8 service detail pages; targets "roofing services Phoenix AZ" |
| Service detail | 8 | One page per service; targets high-intent queries like "roof repair Phoenix AZ"; contains H1, signs/symptoms, process, FAQs, CTA |
| City hub | 1 | Phoenix metro overview; links into all 8 city pages; targets "roofing company Phoenix metro" |
| City detail | 8 | One page per city; unique copy, local climate context, service links; targets "[city] roofing contractor" |
| About | 1 | Trust and brand story; inspection-first philosophy, Arizona since 2010 |
| Projects | 1 | Proof section: residential repairs, commercial work, storm restoration |
| Contact | 1 | Canonical conversion page: phone (480) 974-1595, form, response expectation |
| Blog index | 1 | Content hub for all articles |
| Blog article | 3 | Informational SEO; targets mid-funnel queries from homeowners researching |

### 1.3 Navigation Structure

**Primary nav (current):**
- About | Services | Insurance Claims (shortcut to storm page) | Projects | Contact | Call now (tel:+14809741595)

**Observed internal linking pattern from homepage:**
```
Home → /services/metal-roofing/
Home → /services/roof-replacement/
Home → /services/roof-repair/
Home → /services/commercial-roofing/
Home → /services/storm-damage-insurance/
Home → /service-areas/phoenix/
Home → /service-areas/scottsdale/
Home → /service-areas/mesa/
Home → /service-areas/chandler/
Home → /service-areas/tempe/
Home → /service-areas/gilbert/
Home → /service-areas/glendale/
Home → /service-areas/peoria/
Home → /blog/when-to-replace-vs-repair/
Home → /blog/arizona-monsoon-roof-prep/
Home → /blog/insurance-claim-roof-damage/
Home → /projects/
Home → /about/
Home → /contact/
```

**Home page has 42 unique internal links** — thorough crawl distribution from the entry point.

### 1.4 Internal Linking Strategy

Every service detail page links to:
- All 8 city service-area pages
- `/services/roof-replacement/` or the adjacent service when relevant
- `/projects/`
- `/about/`
- `/services/storm-damage-insurance/`
- `/contact/`

Every city page links to:
- `/services/` (hub)
- `/services/roof-repair/` and `/services/roof-replacement/`
- `/contact/`

**Gap identified:** City pages do not currently link to the specific service most associated with that city (e.g., Tempe → `/services/commercial-roofing/`, Peoria → `/services/storm-damage-insurance/`). Add those cross-links post-launch to strengthen topical relevance signals.

---

## 2. Content Strategy

### 2.1 Content Pattern (Consistent Across Service Pages)

Every service detail page follows this structure:

```
1. H1 — Service + city in plain language ("Roof repair in Phoenix — find the leak, fix it right.")
2. Opening paragraph — Arizona-specific context, differentiator
3. H2 — What this service covers (scope)
4. H2 — Signs you need this service (triggers for the homeowner)
5. H2 — What Platinum's process looks like (Inspect → Diagnose → Repair → Verify)
6. H2 — Schedule CTA section
```

This mirrors what the SEO research recommended: each page addresses intent (what is it?), urgency (do I need it?), and process (what will happen?), then closes to CTA. FAQs are referenced in the services hub page but not yet present on individual service detail pages — that is a post-launch addition.

### 2.2 City Page Content Pattern

```
1. H1 — City + service statement ("Roofing in Phoenix, AZ — repair, replacement, and storm support.")
2. Opening — Local context (Phoenix since 2010)
3. Climate/housing section — Specific to that city
   Phoenix: 110°F summers, monsoon, housing stock 1960s–2000s
   Mesa: older housing stock, eastern valley hail exposure
   Tempe: high commercial density, flat roof prevalence
   Peoria: storm damage focus, northwest valley growth corridor
4. Common local conditions/issues
5. CTA — Phone + inspection offer
```

Each city page is unique copy, not boilerplate cloned across cities. This is a deliberate SEO-quality decision — thin city pages are a Google trust liability.

### 2.3 Blog Strategy

**Three live articles:**

| Article | URL | Target Query | Intent |
|---------|-----|--------------|--------|
| When to Replace vs. Repair Your Roof | `/blog/when-to-replace-vs-repair/` | "when to replace roof vs repair Phoenix" | Decision-stage homeowner |
| Arizona Monsoon Season Roof Prep | `/blog/arizona-monsoon-roof-prep/` | "monsoon roof prep Arizona" / "roof check before monsoon" | Seasonal, awareness |
| Filing a Roof Damage Insurance Claim in AZ | `/blog/insurance-claim-roof-damage/` | "how to file roof insurance claim Arizona" | Post-storm, high intent |

**Why these three:** They map directly to Platinum's three core revenue drivers — storm work (insurance), repair decisions, and seasonal maintenance that converts to inspections.

**Content calendar framework for next 6 months:**

| Month | Topic | Target Query | Revenue Driver |
|-------|-------|--------------|----------------|
| April | Arizona tile roof: what to inspect before summer | "tile roof inspection Phoenix" | Tile/inspection upsell |
| May | How metal roofing holds up in Phoenix heat | "metal roofing Phoenix heat" | Metal roofing sales |
| June | Flat roof blistering: causes and solutions | "flat roof bubbling Phoenix" | Commercial + flat repairs |
| July | Emergency roof repairs during monsoon season | "emergency roof repair Phoenix monsoon" | Storm work |
| August | What a hail damage roof inspection actually checks | "hail damage roof inspection" | Insurance lane |
| September | Foam roof recoat: when and why | "foam roof recoat Phoenix" | Flat/foam maintenance |

### 2.4 Content Gaps (Post-Launch Priorities)

1. **FAQ sections on each service page** — currently on the services hub, not individual pages. Google's FAQ schema can generate rich snippets for service queries.
2. **Project case studies** — Projects page is structured but awaiting real photo content.
3. **Before/after gallery** — Mentioned in brief, not built.
4. **Review blocks** — No testimonials on any page currently. This is a visible trust gap.
5. **Trust badge section** — ROC license number, BBB, certifications, insurance details.
6. **Team/crew section** on About — Currently inspection-first philosophy, but no faces or names.

---

## 3. SEO Strategy

### 3.1 Target Keywords by Page Type

**Home:**
- `roofing company Phoenix AZ` (est. 1,000–5,000 searches/mo)
- `Phoenix roofing contractor`
- `Platinum Roofing Group` (branded)

**Service detail pages:**

| Page | Primary Keyword | Secondary Keywords |
|------|----------------|-------------------|
| Roof Repair | `roof repair Phoenix AZ` (5,000–10,000/mo) | `roof leak repair Phoenix`, `emergency roof repair Phoenix` |
| Roof Replacement | `roof replacement Phoenix AZ` (1,000–5,000/mo) | `roof replacement cost Phoenix`, `new roof Phoenix` |
| Commercial Roofing | `commercial roofing Phoenix AZ` (500–1,000/mo) | `commercial roof repair Phoenix`, `TPO roof Phoenix` |
| Metal Roofing | `metal roofing Phoenix` (1,000–5,000/mo) | `standing seam metal roof Phoenix`, `metal roof cost AZ` |
| Tile Roofing | `tile roof repair Phoenix` (1,000–5,000/mo) | `tile roof replacement Phoenix`, `broken tile roof repair AZ` |
| Flat & Foam | `flat roof repair Phoenix` (500–1,000/mo) | `foam roofing Phoenix`, `TPO roof repair Phoenix` |
| Storm Damage | `storm damage roof repair Phoenix` (500–1,000/mo) | `hail damage roof inspection`, `monsoon roof leak repair Phoenix` |
| Roof Inspection | `roof inspection Phoenix` (1,000–5,000/mo) | `free roof inspection Phoenix AZ` |

**City pages:**

| Page | Primary Keyword | Secondary |
|------|----------------|-----------|
| Phoenix | `roofing company Phoenix AZ` | `Phoenix roofing contractor` |
| Scottsdale | `roofing contractor Scottsdale AZ` | `Scottsdale roof repair` |
| Mesa | `roofing company Mesa AZ` | `Mesa roof repair` |
| Tempe | `Tempe roofing contractor` | `commercial roofing Tempe` |
| Chandler | `Chandler roofing contractor` | `roof repair Chandler AZ` |
| Gilbert | `roofing company Gilbert AZ` | `Gilbert roof replacement` |
| Glendale | `Glendale AZ roofing` | `commercial roofing Glendale` |
| Peoria | `Peoria AZ roofing contractor` | `storm damage roof repair Peoria` |

### 3.2 Title Tag Patterns

**Current title pattern (testsite, preview mode):**
```
[Service] in Phoenix, AZ | Platinum Roofing Group Testsite Preview
[City] Roof Repair and [Service] | Platinum Roofing Group Testsite Preview
```

**Launch-ready title pattern (remove "Testsite Preview" suffix):**
```
[Service] in [City], AZ | Free Inspection | Platinum Roofing Group
[City] Roofing Contractor | Repair, Replacement & Inspections | Platinum Roofing
```

**Live title examples:**
- `Roof Repair in Phoenix, AZ | Free Inspection | Platinum Roofing Group`
- `Metal Roofing in Phoenix, AZ | Licensed Contractor | Platinum Roofing Group`
- `Scottsdale Roofing Contractor | Repair & Replacement | Platinum Roofing Group`
- `Storm Damage and Insurance Roof Support | Platinum Roofing Group`

### 3.3 Meta Description Patterns

**Service pages:**
```
Need [service] in [city]? Licensed & insured Arizona roofing team. Free inspection, clear estimate, and work that holds up to Phoenix heat and monsoon season. Call (480) 974-1595.
```

**City pages:**
```
Platinum Roofing serves [city], AZ for roof repair, replacement, and commercial roofing. Inspection-first process, Arizona experience since 2010. Free inspection — call (480) 974-1595.
```

**Current meta on testsite homepage:**
> "Preview the rebuilt Platinum Roofing Group site with deeper service pages, Phoenix-metro service areas, inspection-first roofing guidance, and commercial roofing support."

This is a preview-only meta. Replace at launch with the live pattern above.

### 3.4 URL Structure

**Current structure is clean and correct:**
```
/services/[service-slug]/     — service detail
/service-areas/[city-slug]/   — city pages
/blog/[article-slug]/         — blog articles
```

Do not change this structure. It follows SEO best practice: flat, readable, no parameters, logical hierarchy.

### 3.5 Internal Linking Map (Priority Paths)

```
Home ──► /services/roof-repair/      ──► /service-areas/phoenix/  ──► /contact/
     ──► /services/roof-replacement/ ──► /service-areas/mesa/     ──► /contact/
     ──► /services/commercial-roofing/─► /service-areas/tempe/    ──► /contact/
     ──► /services/storm-damage/     ──► /service-areas/peoria/   ──► /contact/
     ──► /projects/                  ──► /contact/
     ──► /blog/[article]             ──► /services/[relevant]/    ──► /contact/
```

**Post-launch linking to add:**
- Blog articles → specific service pages (e.g., "monsoon prep" article → `/services/storm-damage-insurance/`)
- City pages → the most relevant service page for that city's profile
- Projects page → related service pages for each project type shown

### 3.6 Schema Markup Plan

**None exists on testsite currently (0 schema blocks on all 26 pages).** This is the highest-priority pre-launch technical SEO task.

| Schema Type | Pages | Priority |
|------------|-------|----------|
| `Organization` | All pages (in `<head>`) | P0 — launch blocker |
| `LocalBusiness` > `RoofingContractor` | Home, contact, all city pages | P0 — launch blocker |
| `BreadcrumbList` | All service and city pages | P1 — add at launch |
| `FAQPage` | Services hub, individual service pages (once FAQs added) | P1 |
| `Article` | All 3 blog posts | P1 |
| `WebSite` with `SearchAction` | Home | P2 |

**Minimum viable Organization schema (add to `<head>` sitewide):**
```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "RoofingContractor"],
  "name": "Platinum Roofing Group",
  "url": "https://www.platinumroofingaz.com",
  "telephone": "(480) 974-1595",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Phoenix",
    "addressRegion": "AZ",
    "addressCountry": "US"
  },
  "areaServed": ["Phoenix", "Scottsdale", "Mesa", "Tempe", "Chandler", "Gilbert", "Glendale", "Peoria"],
  "foundingDate": "2010",
  "sameAs": ["[Instagram URL]", "[Facebook URL]", "[Google Business Profile URL]"]
}
```

### 3.7 Technical SEO

**Current state:**
- All 26 pages return HTTP 200
- Canonical tags: present and correct on all pages (`https://testsite.platinum.gaios.ai/[path]/`)
- Robots meta: `noindex, nofollow, noarchive, nosnippet, noimageindex` — CORRECT for preview; must be removed at launch
- Schema: 0 blocks across all pages — must be added at launch
- Sitemap: not verified (not linked from homepage head)
- Platform: Cloudflare Workers/Pages, vanilla HTML/CSS/JS, no framework weight

**Pre-launch technical checklist:**
- [ ] Remove noindex/nofollow from all 26 pages
- [ ] Add canonical tags pointing to production domain (update from testsite domain)
- [ ] Add Organization + RoofingContractor schema to all pages
- [ ] Add BreadcrumbList schema to service and city pages
- [ ] Generate and submit XML sitemap
- [ ] Configure GA4 property
- [ ] Run PageSpeed Insights on home, one service page, one city page
- [ ] Verify robots.txt allows Googlebot
- [ ] Confirm NAP consistency: (480) 974-1595 appears on every page that shows a phone number

**Expected performance advantage:** No JavaScript framework, no WordPress overhead, no Squarespace CDN latency. Cloudflare edge delivery should score 95+ on PageSpeed for mobile. This is a meaningful differentiator — most competitor sites run WordPress with multiple plugins and score 60–80.

---

## 4. Design Philosophy

### 4.1 Why Editorial/Clean Over Card-Heavy

The old site was a generic roofing contractor template — blue-and-white, heavy on stock photos, cards everywhere. The testsite deliberately breaks from that pattern:

- **Editorial typography-led layout** — Space Grotesk headlines that read as premium without fake luxury
- **High contrast, minimal chrome** — Content surface is dominant; decoration is secondary
- **Sections breathe** — No 3-column card grids crammed with bullet lists; each section has one job
- **Content leads design** — Copy is written first, layout serves it, not the reverse

The rationale: most Phoenix roofing sites look identical because they all buy the same WordPress theme. A distinct visual identity is itself a trust signal — it implies the company invested in its presentation.

### 4.2 Typography

**Space Grotesk** — A geometric sans-serif with personality. Features:
- Strong at large display sizes (hero H1s)
- Readable at body weight (service page paragraphs)
- Contemporary without being trendy
- Not found on competing roofing sites in the market

### 4.3 Color Palette

Observed from live testsite:
- Near-black background on hero sections — creates premium contrast
- High-contrast text (white/light on dark, dark on light)
- No standard roofing-blue or contractor-orange
- Deliberate restraint on accent colors — makes CTAs land harder when they appear

### 4.4 Mobile-First Approach

Cloudflare Workers delivery means: the HTML is the page. No client-side hydration, no React bundle, no render-blocking scripts. The mobile experience is:
- Instant first paint
- No layout shift from lazy-loaded frameworks
- No font swap flash (fonts embedded or preloaded)
- Navigation is direct — "Call now" is in the primary nav, visible above fold on all mobile views

More than 60% of roofing search traffic comes from mobile. Competitors running WordPress + Elementor or Squarespace consistently underperform on mobile PageSpeed due to plugin weight.

### 4.5 Performance Considerations

| Stack element | Platinum Testsite | Typical competitor (WP) |
|--------------|-------------------|------------------------|
| Framework | None (vanilla HTML/CSS/JS) | React/Elementor or Squarespace |
| Hosting | Cloudflare edge (global CDN) | Shared hosting or WP host |
| JS bundle | Minimal | 200–800KB |
| CLS | Near-zero (no lazy-load hydration) | Often 0.1–0.3 |
| LCP target | <1.5s | Often 3–6s |
| TTFB | ~50ms (edge) | 300–800ms (origin server) |

---

## 5. Competitive Analysis

### 5.1 Competitor Profiles

#### ChucktownRoofing.com (Brian Surguy — Brent knows him personally)

**Platform:** Next.js (modern, fast)
**Site structure:** 6 pages — Home, Our Services, Insurance Claims, FAQ, Contact, About
**Service pages:** Single combined services page with Storm Damage, Residential, and FAQ sections — NOT dedicated per-service pages
**City/area pages:** None
**Blog:** None
**Trust signals:** BBB Recognized, Licensed + Bonded + Insured, CertainTeed Shingle Master Select Certified, IKO Craftsman Premier certified, Google reviews (present, count not visible on static render), ROC displayed
**CTAs:** "Get In Touch" (nav), contact form (contact page)
**Schema:** 3 blocks on service page, 2 on about page
**SEO title example:** Domain name only ("chucktownroofing.com") — no keyword-optimized title tag observed
**Design:** Clean, white, modern. Insurance-claims focused in navigation. South Carolina base but expanding.
**Strengths:** Manufacturer certifications (CertainTeed + IKO), clean design, insurance claims as primary conversion lane
**Weaknesses:** No blog, no city pages, no dedicated service pages, weak title tags, no organic content strategy

#### ProWest.com (Brent's former employer)

**Platform:** WordPress + custom theme
**Site structure:** 20+ pages — Home, Services, Residential Roofing, Roof Repair, Roof Installation, Roof Replacement, Commercial Roofing, Commercial Roof Repair, Insurance Inspection, Get Quote, Master Elite, Projects, FAQ, Blog, 10 location pages
**Service pages:** Yes — dedicated pages for Residential Roofing (hub), Roof Replacement, Roof Installation, Roof Repair, Commercial Roofing, Commercial Roof Repair (6 dedicated service pages)
**City/area pages:** 10 dedicated location pages: Tucson, Phoenix, Gilbert, Apache Junction, Mesa, Tempe, Chandler, Flagstaff, Scottsdale, Glendale
**Blog:** 5+ visible posts — city+service topic targeting ("Tile Roof Repairs in Phoenix", "Emergency Roof Repair in Phoenix", "How Much Does Roof Repair Cost in Phoenix in 2025?", "Phoenix Monsoon Roof Damage Guide", "Phoenix Hail Storms 2025")
**Trust signals:** 350+ Google reviews (5-star claim), Master Elite GAF certification (dedicated page), financing available, multiple social platforms (FB, Instagram, Twitter, YouTube, LinkedIn, Yelp)
**CTAs:** "Receive a Free Estimate" (hero), "Get a Project Estimate" (nav), "Get an Insurance Inspection" (nav — dedicated conversion page)
**Schema:** BreadcrumbList on all pages, Yoast SEO implementation
**SEO title example:** "Mesa Roofing Contractors | Roof Repair & Replacement Services" — correctly optimized per-page
**H1 pattern:** "Arizona's Top-Rated Roofing Company" (home) — leads with brand claim
**Design:** Standard WordPress roofing template, functional, not premium
**Strengths:** Deep service pages, 10 city pages, active blog with local keyword targeting, 350+ reviews, Master Elite GAF certification, financing
**Weaknesses:** Generic design, no editorial identity, title tag brand-heavy, lacks premium positioning

#### MissionRestoration.com

**Platform:** Squarespace
**Site structure:** 20+ pages — Home, Residential, Commercial, Insurance Claims, Water Mitigation, Shingles, Tile, Low Slope, Metal Roofing, Solar Roof, About, Locations, Next Steps, Subcontractors, Blog, Careers, Contact, Products, Upgrades
**Service pages:** Yes — 7 dedicated product/service pages (Shingles, Tile, Low Slope, Metal Roofing, Solar Roof, Residential, Commercial) plus Insurance Claims and Water Mitigation (beyond roofing)
**City/area pages:** Dedicated `/locations` hub with AZ (Phoenix/Mesa, Prescott Valley, Tucson, Flagstaff) and multi-state (CO, CA) presence
**Blog:** 14 articles — strong AZ-specific and insurance-focused content
**Trust signals:** 300+ completed projects (claimed on residential page), 11 years in business, 651 (stat unclear), multiple social profiles; Squarespace site — fewer certification badges visible
**CTAs:** "CALL US" (top nav), "Schedule" (/schedule), "Get your roof claim approved" (blog CTA)
**Schema:** 4 blocks per page (Squarespace auto-generated)
**SEO title example:** "Mission Restoration | Get Your Roof Inspected Today" (home — not keyword-optimized), "Get Residential Restoration Services — Mission Restoration" (residential)
**H1 example:** "Peace of Mind" (home — emotional, not keyword-bearing)
**Design:** Squarespace — polished but template-bound; heavy on whitespace; soft brand
**Strengths:** 14 blog articles (strongest content library in this comparison), multi-state brand authority, water mitigation as adjacent service (creates storm damage funnel), insurance claims as primary conversion lane, multi-location pages
**Weaknesses:** Squarespace constraints (slower, less flexible SEO control), H1s don't carry keywords, title tags are brand-forward not query-forward, multi-state positioning dilutes local trust for Phoenix-only buyers, "Peace of Mind" headline doesn't convert on intent

### 5.2 Side-by-Side Comparison Table

| Feature | Platinum Testsite | ChucktownRoofing | ProWest | MissionRestoration |
|---------|------------------|-----------------|---------|-------------------|
| **Total pages** | 26 | 6 | 20+ | 20+ |
| **Dedicated service pages** | 8 | 0 (1 combined) | 6 | 7 |
| **City/location pages** | 8 | 0 | 10 | 4 AZ + multi-state |
| **Blog articles** | 3 | 0 | 5+ | 14 |
| **Schema markup** | None (pre-launch) | Present | BreadcrumbList | 4 blocks/page |
| **Review count (visible)** | None | Present (count unknown) | 350+ | Not prominently shown |
| **Manufacturer certs** | None shown | CertainTeed + IKO | Master Elite GAF | Not visible |
| **Financing** | No | Yes (mentioned) | Yes (dedicated section) | No |
| **Insurance claims page** | Yes | Yes | Yes (+ dedicated inspection CTA) | Yes (primary lane) |
| **Projects page** | Yes (placeholder content) | No | Yes (commercial projects) | "300+" claimed |
| **Platform** | Cloudflare edge, vanilla | Next.js | WordPress | Squarespace |
| **Est. PageSpeed mobile** | 95+ (expected) | 85–90 | 60–75 | 55–70 |
| **Title tag quality** | Strong (with "Testsite Preview" suffix to remove) | Weak (domain only) | Strong | Moderate |
| **H1 keyword targeting** | Strong | Moderate | Moderate | Weak |
| **Design quality** | Strong — editorial, distinct | Clean, modern | Generic contractor template | Polished but templated |
| **noindex status** | Currently noindex (preview) | Indexed | Indexed | Indexed |
| **Social links** | Not yet shown | Instagram | FB, IG, Twitter, YouTube, LinkedIn, Yelp | FB, IG, LinkedIn |
| **NAP consistency** | (480) 974-1595 (single, consistent) | Appears consistent | (602) 738-7663 | (800) 339-6762 |

### 5.3 Where Platinum Wins

1. **Architecture depth at launch:** 26 pages with a logical hub-and-spoke structure. Most competitors launched with fewer pages and built up over years. Platinum starts with a full structure.
2. **Technical performance:** Cloudflare edge, no framework overhead. Expected 95+ PageSpeed vs competitor range of 55–75. Core Web Vitals as a ranking factor favors this.
3. **Page-level SEO quality:** Title tags are keyword-optimized and descriptive. H1s carry the search query. Service pages have unique, specific content — not boilerplate.
4. **Content tone:** Arizona-specific, inspection-first, direct. No AI-filler phrases, no generic contractor copy. Noticeably different voice from every competitor sampled.
5. **City page quality:** 8 city pages with unique copy vs competitors who either have 0 (Chucktown) or boilerplate clones. Google rewards this.
6. **Insurance/storm page:** All three competitors have this lane; Platinum has it too, and it's integrated into the nav as "Insurance claims" — prominent placement.

### 5.4 Where Competitors Are Stronger

1. **Review volume:** ProWest has 350+ Google reviews. Chucktown has visible star ratings. Platinum has none shown. This is the biggest current trust gap and the most visible gap to any visitor.
2. **Manufacturer certifications:** Chucktown has CertainTeed Shingle Master Select + IKO Craftsman Premier on their homepage trust stack. ProWest has Master Elite GAF. These certifications are conversion signals for homeowners doing research.
3. **Blog depth:** Mission Restoration has 14 articles. ProWest has 5+ with strong local keyword targeting. Platinum has 3. Content compounds over time; competitors have a head start.
4. **Location page volume:** ProWest has 10 city pages. Platinum has 8. Marginal gap, but ProWest has Tucson, Flagstaff, and Apache Junction — wider AZ coverage.
5. **Financing:** ProWest prominently offers financing. Platinum does not. For $8,000–$25,000 roof replacements, financing is a conversion lever.

### 5.5 Opportunities

1. **Review acquisition system** — Launch a post-job SMS/email review flow. 50 reviews within 90 days is achievable and would make Platinum competitive with Chucktown on Google Maps visibility.
2. **Manufacturer certification** — Pursuing GAF Certified or CertainTeed ShingleMaster status adds a homepage trust badge and access to manufacturer-backed warranties. This is a competitive differentiator that ProWest and Chucktown both display.
3. **FAQ schema** — None of the three competitors have FAQPage schema on service pages. Adding this creates rich-result eligibility (expanded FAQ boxes in SERPs) that competitors don't have.
4. **Blog velocity** — 2 articles/month would put Platinum above ProWest by Q3 and rival Mission by Q4. The 3 articles already live are well-targeted.
5. **Real project photography** — The projects page is structured and ready; it currently has placeholder content. One good photoshoot of 3–5 jobs (before/after) creates content that competes directly with ProWest's projects section.
6. **Financing** — A simple "financing available through [partner]" line and a landing page removes a common objection at the replacement quote stage.

---

## 6. What's Live vs. What's Planned

### 6.1 Current State (Live on Testsite)

- 26 pages, all returning HTTP 200
- All pages have: unique titles, unique H1s, unique meta descriptions, canonical tags, correct URL structure
- All pages currently set to noindex (preview protection — correct behavior)
- Phone number: (480) 974-1595 consistent across all pages
- Internal linking: thorough from home page; cross-linking from service and city pages
- Blog: 3 articles live
- Projects: page built, awaiting real photo content
- Contact: form and phone present, no map embed yet
- Schema: 0 blocks (pre-launch gap)
- GA4: not yet configured
- Sitemap: not yet confirmed

### 6.2 Pre-Launch Checklist (Must-Have Before Going Live)

| Task | Owner | Priority | Effort |
|------|-------|----------|--------|
| Remove noindex from all 26 pages | Dev | P0 | 30 min |
| Update canonicals to production domain | Dev | P0 | 30 min |
| Add Organization + RoofingContractor schema to all pages | Dev | P0 | 2–4 hrs |
| Configure GA4 property + add tracking tag | Dev | P0 | 1 hr |
| Generate and submit XML sitemap | Dev | P0 | 1 hr |
| Run PageSpeed Insights on 3 pages; fix any LCP/CLS issues | Dev | P1 | 2–4 hrs |
| Remove "Testsite Preview" from all title tags | Dev | P0 | 30 min |
| Update meta descriptions to remove preview language | Dev | P1 | 1 hr |
| Add ROC license number to footer/about | Content | P1 | 15 min |
| Validate robots.txt | Dev | P0 | 15 min |

**Estimated total pre-launch effort: 8–12 hours.**

### 6.3 Post-Launch Roadmap

**Month 1 (March–April 2026) — Trust Layer**
- [ ] Set up post-job review flow (SMS or email after job close) — target: 20 reviews in 60 days
- [ ] Add FAQ sections to each of the 8 service pages (5 FAQs each)
- [ ] Add FAQPage schema to service pages
- [ ] Add BreadcrumbList schema to service and city pages
- [ ] Publish 2 blog articles

**Month 2–3 (April–May 2026) — Proof Layer**
- [ ] Photoshoot: 3–5 real jobs (before/during/after)
- [ ] Update projects page with real photos and job descriptions
- [ ] Add review/testimonial block to home page
- [ ] Add review block to at least 3 service pages
- [ ] Publish 2 more blog articles

**Month 3–6 (May–August 2026) — SEO Growth**
- [ ] Pursue manufacturer certification (GAF or CertainTeed) for homepage badge
- [ ] Add financing information (partner TBD)
- [ ] Continue blog cadence: 2 articles/month, local keyword targeted
- [ ] Add social links to footer and build social proof connection
- [ ] Search Console review: identify which pages are getting impressions, optimize
- [ ] Expand city pages: consider adding Peoria, Queen Creek, Surprise, Avondale

**Keyword ranking timeline expectation:**
- Branded queries ("Platinum Roofing Phoenix"): index within weeks of launch
- Local non-branded queries ("roof repair Phoenix"): 3–6 months with consistent content + review acquisition
- Featured snippet/FAQ rich results: 2–4 months after FAQ schema addition

### 6.4 Future Features (Tabled)

The following were discussed and intentionally deferred to avoid launch complexity:

| Feature | Status | Reasoning |
|---------|--------|-----------|
| AI chatbot / lead capture widget | Tabled | Requires CRM integration; adds complexity without clear ROI at this stage |
| Hail lookup tool (interactive map) | Tabled | SPC storm data integration is available in GAIOS but needs design spec; post-launch feature |
| Calendar scheduling integration | Tabled | Calendly or equivalent adds an external dependency; contact form + phone is sufficient for launch |
| Real-time review feed | Tabled | Requires Google Reviews API or third-party widget; add after review count is meaningful |

---

## Appendix: Source Data

**Research files used:**
- `platinum_seo_competitive_analysis_02_25_26_v1.md` — Deep Research SEO analysis (276 lines)
- `Platinum Testsite Content and Design Brief_03_16_26_v1.md` — Design and content brief
- `platinum_roofing_competitor_matrix_enriched.csv` — 15-competitor structured data
- Live scrape of `testsite.platinum.gaios.ai` — all 26 pages audited 03_18_26
- Live scrape of `chucktownroofing.com` — homepage, services, about, insurance, FAQ — 03_18_26
- Live scrape of `prowest.com` — homepage, services, blog, residential, city page, commercial, master-elite, projects — 03_18_26
- Live scrape of `missionrestoration.com` — homepage, residential, locations, blog, insurance — 03_18_26

**Competitor data confidence:** High for structural analysis (page count, URLs, content patterns); Medium for review counts (taken from visible on-page signals, not API data); Low for exact traffic/keyword rankings (no Semrush access used in this session).
