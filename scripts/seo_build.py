#!/usr/bin/env python3
"""
Scriptum AI - search and AI-assistant discoverability build step.

Run from the repo root after adding or editing a blog post:

    python3 scripts/seo_build.py

Stdlib only, idempotent (safe to run any number of times). It:
  1. writes sitemap.xml (every real page + every post in blog/posts.json)
  2. writes the "Latest posts" section of llms.txt
  3. refreshes the static post list inside blog/index.html (so crawlers that
     don't run JavaScript still see every post)
  4. adds/refreshes JSON-LD structured data (<script ... data-seo="scriptum">)
     and missing canonical / Open Graph tags on key pages and every post

Facts used below come from the live site (tryscriptum.ai). If pricing or
positioning changes on /pricing, update OFFERS / ORG_DESCRIPTION here.
"""
import html, json, os, re, subprocess, sys
from datetime import date

ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.getcwd()
SITE = "https://tryscriptum.ai"
ORG_ID = SITE + "/#organization"
WEBSITE_ID = SITE + "/#website"
APP_ID = SITE + "/#software"

# Add official profile URLs here once they exist (LinkedIn company page,
# Crunchbase, G2, Capterra, Legaltech Hub, Product Hunt, Microsoft AppSource,
# Wikidata). Only list profiles that belong to THIS Scriptum AI.
SAME_AS = []

ORG_DESCRIPTION = ("Scriptum AI is the operating system for transactional legal teams: "
    "AI-assisted drafting inside Microsoft Word from a firm's own precedents, a secure "
    "matter workspace for the client and the other side, negotiation support, and a "
    "clause library that belongs to the firm.")

# (path, file, changefreq, priority, kind)
PAGES = [
    ("/", "index.html", "weekly", "1.0", "home"),
    ("/pricing", "pricing.html", "monthly", "0.9", "pricing"),
    ("/product/draft", "product/draft.html", "monthly", "0.8", "product"),
    ("/product/collaborate", "product/collaborate.html", "monthly", "0.8", "product"),
    ("/product/negotiate", "product/negotiate.html", "monthly", "0.8", "product"),
    ("/product/clause-library", "product/clause-library.html", "monthly", "0.8", "product"),
    ("/blog/", "blog/index.html", "daily", "0.8", "blogindex"),
    ("/guides", "guides.html", "monthly", "0.4", "page"),
    ("/privacy", "privacy.html", "yearly", "0.3", "page"),
    ("/terms", "terms.html", "yearly", "0.3", "page"),
    ("/data-protection", "data-protection.html", "yearly", "0.3", "page"),
]

OFFERS = [
    ("Starter", "79", "Drafting agent, review agent with partner sign-off, Word add-in, matter workspace, instant redline, firm clause library."),
    ("Pro", "119", "Everything in Starter plus the negotiation agent, collaboration agent, firm playbook and counterparty history, and a running issues list."),
]

FEATURES = [
    "Microsoft Word add-in for AI-assisted drafting from the firm's own precedents and house style",
    "Drafting agent: first drafts from template, term sheet and email chain",
    "Review agent: reviews the other side's markup against the firm's playbook for partner sign-off",
    "Negotiation agent working inside limits set by the partner",
    "Collaboration agent for client and partner questions",
    "Secure matter workspace for the team, the client and opposing counsel, with approval flows",
    "Instant redlines and running issues lists across negotiation rounds",
    "Firm-owned clause library captured automatically as lawyers work",
    "No training on customer documents; firm-level data isolation; EU data hosting",
]

FAQ_PRICING = [  # visible, answered questions on /pricing only
    ("Do you train AI models on our documents?",
     "No. Your data is never used to train models, and each firm's data is kept separate from every other firm's."),
    ("Who owns the clause library?",
     "Your firm does, on every plan. It stays with the firm when people leave."),
    ("Where is our data stored?", "In the EU."),
]


def rd(p):
    with open(os.path.join(ROOT, p), encoding="utf-8") as f:
        return f.read()


def wr(p, s):
    full = os.path.join(ROOT, p)
    os.makedirs(os.path.dirname(full) or ".", exist_ok=True)
    old = open(full, encoding="utf-8").read() if os.path.exists(full) else None
    if old != s:
        with open(full, "w", encoding="utf-8") as f:
            f.write(s)
        print("updated", p)


def git_date(p):
    try:
        out = subprocess.run(["git", "log", "-1", "--format=%cs", "--", p], cwd=ROOT,
                             capture_output=True, text=True).stdout.strip()
        return out or None
    except Exception:
        return None


def meta(doc, name, attr="name"):
    m = re.search(r'<meta\s+%s="%s"\s+content="([^"]*)"' % (attr, re.escape(name)), doc, re.I)
    return html.unescape(m.group(1)) if m else None


def title_of(doc):
    m = re.search(r"<title>(.*?)</title>", doc, re.S | re.I)
    t = html.unescape(m.group(1).strip()) if m else ""
    return re.sub(r"\s*\|\s*Scriptum AI\s*$", "", t)


def org_node(full=False):
    n = {"@type": "Organization", "@id": ORG_ID, "name": "Scriptum AI", "url": SITE + "/"}
    if full:
        n.update({
            "alternateName": "Scriptum",
            "description": ORG_DESCRIPTION,
            "disambiguatingDescription": "UK legal technology company behind tryscriptum.ai, building AI drafting and negotiation tools for transactional lawyers.",
            "address": {"@type": "PostalAddress", "addressRegion": "Northern Ireland", "addressCountry": "GB"},
            "areaServed": "GB",
            "funder": [{"@type": "Organization", "name": "TechStart"},
                       {"@type": "Organization", "name": "Invest Northern Ireland"}],
            "knowsAbout": ["Legal AI", "AI-assisted contract drafting", "Transactional law",
                           "Contract negotiation", "Legal knowledge management"],
        })
        if SAME_AS:
            n["sameAs"] = SAME_AS
    return n


def app_node():
    offers = []
    for name, price, desc in OFFERS:
        offers.append({
            "@type": "Offer", "name": name, "description": desc, "price": price,
            "priceCurrency": "GBP", "url": SITE + "/pricing",
            "priceSpecification": {"@type": "UnitPriceSpecification", "price": price,
                                   "priceCurrency": "GBP", "unitText": "per user per month",
                                   "billingDuration": "P1M", "valueAddedTaxIncluded": False},
        })
    return {
        "@type": "SoftwareApplication", "@id": APP_ID, "name": "Scriptum AI",
        "applicationCategory": "BusinessApplication",
        "applicationSubCategory": "Legal AI contract drafting and negotiation",
        "operatingSystem": "Microsoft Word (add-in), Web",
        "url": SITE + "/", "description": ORG_DESCRIPTION,
        "publisher": {"@id": ORG_ID}, "provider": {"@id": ORG_ID},
        "audience": {"@type": "BusinessAudience",
                     "audienceType": "Transactional lawyers in law firms of 20 to 100 fee earners and in-house legal teams"},
        "featureList": FEATURES, "offers": offers,
    }


def crumbs(items):
    return {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": i + 1, "name": n, "item": SITE + u}
        for i, (n, u) in enumerate(items)]}


def ld_block(graph):
    body = json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False, indent=2)
    body = body.replace("</", "<\\/")
    return '<script type="application/ld+json" data-seo="scriptum">\n' + body + "\n</script>\n"


def set_ld(doc, graph, drop_plain=False):
    doc = re.sub(r'<script type="application/ld\+json" data-seo="scriptum">.*?</script>\n?', "", doc, flags=re.S)
    if drop_plain:  # remove the old hand-written Article block in posts
        doc = re.sub(r'<script type="application/ld\+json">\s*\{[^<]*?"@type":\s*"(?:Article|BlogPosting)".*?</script>\n?', "", doc, flags=re.S)
    return doc.replace("</head>", ld_block(graph) + "</head>", 1)


def ensure_head_tags(doc, url, title, desc, og_type):
    add = []
    if 'rel="canonical"' not in doc:
        add.append('<link rel="canonical" href="%s">' % url)
    if 'property="og:type"' not in doc:
        add.append('<meta property="og:type" content="%s">' % og_type)
    if 'property="og:url"' not in doc:
        add.append('<meta property="og:url" content="%s">' % url)
    if 'property="og:title"' not in doc and title:
        add.append('<meta property="og:title" content="%s | Scriptum AI">' % html.escape(title))
    if 'property="og:description"' not in doc and desc:
        add.append('<meta property="og:description" content="%s">' % html.escape(desc))
    if 'property="og:site_name"' not in doc:
        add.append('<meta property="og:site_name" content="Scriptum AI">')
    if 'property="og:locale"' not in doc:
        add.append('<meta property="og:locale" content="en_GB">')
    if not add:
        return doc
    block = "\n".join(add) + "\n"
    m = re.search(r'<meta name="description"[^>]*>\n?', doc)
    if m:
        return doc[:m.end()] + block + doc[m.end():]
    return doc.replace("</head>", block + "</head>", 1)


def load_posts():
    posts = json.loads(rd("blog/posts.json"))
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts


def post_ld_info(doc):
    m = re.search(r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S)
    info = {}
    if m:
        try:
            j = json.loads(m.group(1))
            j = j.get("@graph", [j])[0] if isinstance(j, dict) else {}
            info = {k: j.get(k) for k in ("datePublished", "dateModified", "author")}
        except Exception:
            pass
    return info


def do_posts(posts):
    out = []
    for p in posts:
        path = "blog/%s.html" % p["slug"]
        if not os.path.exists(os.path.join(ROOT, path)):
            print("WARNING: posts.json lists missing file", path)
            continue
        doc = rd(path)
        url = "%s/blog/%s" % (SITE, p["slug"])
        info = post_ld_info(doc)
        published = info.get("datePublished") or p["date"]
        modified = info.get("dateModified") or published
        if modified < p["date"]:
            modified = p["date"]
        desc = meta(doc, "description") or p.get("excerpt", "")
        author_name = (p.get("author") or "").strip()
        if not author_name and isinstance(info.get("author"), dict):
            author_name = (info["author"].get("name") or "").strip()
        if author_name and "[[" not in author_name:
            author = {"@type": "Person", "name": author_name}
        else:
            author = {"@id": ORG_ID}
        graph = [
            {"@type": "BlogPosting", "@id": url + "#article", "headline": p["title"],
             "description": desc, "url": url, "mainEntityOfPage": url,
             "datePublished": published, "dateModified": modified,
             "author": author, "publisher": {"@id": ORG_ID}, "inLanguage": "en-GB",
             "articleSection": p.get("tag", ""), "isPartOf": {"@id": SITE + "/blog/#blog"},
             "about": {"@id": APP_ID} if "scriptum" in (p["title"] + p["slug"]).lower() else None},
            crumbs([("Home", "/"), ("Blog", "/blog/"), (p["title"], "/blog/" + p["slug"])]),
            org_node(),
        ]
        graph[0] = {k: v for k, v in graph[0].items() if v not in (None, "")}
        doc = ensure_head_tags(doc, url, p["title"], desc, "article")
        doc = set_ld(doc, graph, drop_plain=True)
        wr(path, doc)
        out.append((p, modified))
    return out


def do_pages(posts):
    for path_url, f, _, _, kind in PAGES:
        if not os.path.exists(os.path.join(ROOT, f)):
            continue
        doc = rd(f)
        url = SITE + path_url
        title = title_of(doc)
        desc = meta(doc, "description")
        page = {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": title or "Scriptum AI",
                "description": desc, "isPartOf": {"@id": WEBSITE_ID}, "publisher": {"@id": ORG_ID},
                "inLanguage": "en-GB"}
        if kind == "home":
            graph = [org_node(full=True),
                     {"@type": "WebSite", "@id": WEBSITE_ID, "url": SITE + "/", "name": "Scriptum AI",
                      "publisher": {"@id": ORG_ID}, "inLanguage": "en-GB"},
                     app_node(), dict(page, about={"@id": APP_ID})]
        elif kind == "pricing":
            graph = [org_node(), app_node(), dict(page, about={"@id": APP_ID}),
                     {"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [
                         {"@type": "Question", "name": q,
                          "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ_PRICING]},
                     crumbs([("Home", "/"), ("Pricing", "/pricing")])]
        elif kind == "product":
            graph = [org_node(), dict(page, about={"@id": APP_ID}),
                     crumbs([("Home", "/"), (title, path_url)])]
        elif kind == "blogindex":
            graph = [org_node(),
                     {"@type": "Blog", "@id": SITE + "/blog/#blog", "url": url, "name": "Scriptum AI blog",
                      "description": desc, "publisher": {"@id": ORG_ID}, "inLanguage": "en-GB",
                      "blogPost": [{"@type": "BlogPosting", "headline": p["title"],
                                    "url": "%s/blog/%s" % (SITE, p["slug"]), "datePublished": p["date"]}
                                   for p in posts]},
                     crumbs([("Home", "/"), ("Blog", "/blog/")])]
        else:
            graph = [org_node(), page]
        graph = [{k: v for k, v in n.items() if v is not None} for n in graph]
        doc = ensure_head_tags(doc, url, title, desc, "website")
        doc = set_ld(doc, graph)
        if kind == "blogindex":
            doc = static_blog_list(doc, posts)
        wr(f, doc)


def static_blog_list(doc, posts):
    def fmt(d):
        y, m, dd = d.split("-")
        months = ["January", "February", "March", "April", "May", "June", "July", "August",
                  "September", "October", "November", "December"]
        return "%d %s %s" % (int(dd), months[int(m) - 1], y)
    cards = []
    for p in posts:
        meta_bits = [fmt(p["date"]), p.get("readingTime", "")]
        if p.get("author"):
            meta_bits.append(p["author"])
        cards.append('    <a class="post-card" href="/blog/%s"><span class="post-tag">%s</span><h3>%s</h3><p>%s</p>'
                     '<div class="post-meta">%s</div></a>' % (
                         p["slug"], html.escape(p.get("tag", "")), html.escape(p["title"]),
                         html.escape(p.get("excerpt", "")), " &middot; ".join(html.escape(b) for b in meta_bits if b)))
    block = "<!-- POSTS:START (generated by scripts/seo_build.py, do not edit by hand) -->\n" + "\n".join(cards) + "\n    <!-- POSTS:END -->"
    if "<!-- POSTS:START" in doc:
        doc = re.sub(r"<!-- POSTS:START.*?<!-- POSTS:END -->", lambda _: block, doc, flags=re.S)
    else:
        doc = doc.replace('<p style="color:var(--text-dim)">Loading posts...</p>', block, 1)
    # if the fetch fails, keep the static list instead of replacing it with an error
    doc = doc.replace(
        "    .catch(function(){\n      document.getElementById('blogGrid').innerHTML =\n"
        "        '<p style=\"color:var(--text-dim)\">No posts found yet. Add your first entry to posts.json to see it here.</p>';\n    });",
        "    .catch(function(){ /* keep the static list rendered by scripts/seo_build.py */ });")
    return doc


def do_sitemap(post_dates):
    rows = []
    newest = max((m for _, m in post_dates), default=None)
    for path_url, f, freq, prio, kind in PAGES:
        if not os.path.exists(os.path.join(ROOT, f)):
            continue
        lm = git_date(f) or date.today().isoformat()
        if kind == "blogindex" and newest and newest > lm:
            lm = newest
        rows.append((SITE + path_url, lm, freq, prio))
    for p, mod in post_dates:
        rows.append(("%s/blog/%s" % (SITE, p["slug"]), mod, "monthly", "0.7"))
    xml = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, lm, freq, prio in rows:
        xml.append("  <url><loc>%s</loc><lastmod>%s</lastmod><changefreq>%s</changefreq><priority>%s</priority></url>"
                   % (loc, lm, freq, prio))
    xml.append("</urlset>\n")
    wr("sitemap.xml", "\n".join(xml))
    return len(rows)


def do_llms(posts):
    if not os.path.exists(os.path.join(ROOT, "llms.txt")):
        return
    doc = rd("llms.txt")
    lines = ["<!-- LATEST:START (generated by scripts/seo_build.py) -->"]
    for p in posts[:15]:
        lines.append("- [%s](%s/blog/%s): %s" % (p["title"], SITE, p["slug"], p.get("excerpt", "")))
    lines.append("<!-- LATEST:END -->")
    doc = re.sub(r"<!-- LATEST:START.*?<!-- LATEST:END -->", lambda _: "\n".join(lines), doc, flags=re.S)
    wr("llms.txt", doc)


if __name__ == "__main__":
    posts = load_posts()
    pd = do_posts(posts)
    do_pages(posts)
    n = do_sitemap(pd)
    do_llms(posts)
    print("sitemap.xml: %d URLs" % n)
