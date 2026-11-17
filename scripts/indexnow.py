#!/usr/bin/env python3
"""
Submit Scriptum AI URLs to IndexNow (Bing, Yandex, Seznam, Naver, Yep).
Google does not use IndexNow; use Search Console for Google.

Usage (from the repo root):
  python3 scripts/indexnow.py --all                  # every URL in sitemap.xml
  python3 scripts/indexnow.py --changed BASE HEAD    # URLs for files changed between two commits
  python3 scripts/indexnow.py URL [URL ...]          # specific URLs
Add --dry-run to print the payload without sending it.
Add --wait to poll the live site until each URL returns 200 before submitting.

Stdlib only. The key file /<KEY>.txt must be live at the site root first.
"""
import json, os, re, subprocess, sys, time, urllib.request, urllib.error

SITE = "https://tryscriptum.ai"
HOST = "tryscriptum.ai"
KEY = "681f6334dcc9af76f40cf15c58ce26d2"
KEY_LOCATION = "%s/%s.txt" % (SITE, KEY)
ENDPOINT = "https://api.indexnow.org/indexnow"
ROOT = os.getcwd()

# Files that are served but must never be submitted
SKIP = re.compile(r"(^|/)(_template\.html|README\.md|posts\.json|google[0-9a-f]+\.html)$")


def sitemap_urls():
    with open(os.path.join(ROOT, "sitemap.xml"), encoding="utf-8") as f:
        return re.findall(r"<loc>(.*?)</loc>", f.read())


def file_to_url(path):
    """Map a repo file to its public clean URL, or None if it is not a page."""
    if SKIP.search(path) or not path.endswith(".html"):
        return None
    if path == "index.html":
        return SITE + "/"
    if path == "blog/index.html":
        return SITE + "/blog/"
    if path == "404.html":
        return None
    return SITE + "/" + path[:-len(".html")]


def changed_urls(base, head):
    out = subprocess.run(["git", "diff", "--name-only", "--diff-filter=AMR", base, head],
                         cwd=ROOT, capture_output=True, text=True, check=True).stdout.split()
    known = set(sitemap_urls())
    urls = []
    for p in out:
        u = file_to_url(p)
        if u and u in known and u not in urls:
            urls.append(u)
    # a new or edited post also changes the blog index and sitemap; tell engines
    if any(p.startswith("blog/") and p.endswith(".html") for p in out) and SITE + "/blog/" not in urls:
        urls.append(SITE + "/blog/")
    return urls


def live(url):
    try:
        req = urllib.request.Request(url, method="HEAD", headers={"User-Agent": "scriptum-indexnow/1.0"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status == 200
    except Exception:
        return False


def wait_until_live(urls, timeout=900):
    deadline = time.time() + timeout
    pending = [KEY_LOCATION] + list(urls)
    while pending and time.time() < deadline:
        pending = [u for u in pending if not live(u)]
        if pending:
            time.sleep(20)
    if pending:
        print("WARNING: still not live after %ds: %s" % (timeout, pending))
    return [u for u in urls if u not in pending]


def submit(urls, dry=False):
    urls = [u for u in urls if u.startswith(SITE + "/")]
    if not urls:
        print("Nothing to submit.")
        return 0
    for i in range(0, len(urls), 10000):
        batch = urls[i:i + 10000]
        body = {"host": HOST, "key": KEY, "keyLocation": KEY_LOCATION, "urlList": batch}
        if dry:
            print(json.dumps(body, indent=2))
            continue
        req = urllib.request.Request(ENDPOINT, data=json.dumps(body).encode("utf-8"), method="POST",
                                     headers={"Content-Type": "application/json; charset=utf-8"})
        try:
            with urllib.request.urlopen(req, timeout=30) as r:
                print("IndexNow: HTTP %d for %d URLs" % (r.status, len(batch)))
        except urllib.error.HTTPError as e:
            # 200/202 = accepted; 400 bad request; 403 key not valid; 422 URLs not on host; 429 too many
            print("IndexNow: HTTP %d %s" % (e.code, e.read()[:300]))
            return 1
    return 0


if __name__ == "__main__":
    args = sys.argv[1:]
    dry = "--dry-run" in args
    wait = "--wait" in args
    args = [a for a in args if a not in ("--dry-run", "--wait")]
    if args[:1] == ["--all"]:
        urls = sitemap_urls()
    elif args[:1] == ["--changed"] and len(args) == 3:
        urls = changed_urls(args[1], args[2])
    elif args:
        urls = args
    else:
        print(__doc__)
        sys.exit(2)
    if wait and not dry:
        urls = wait_until_live(urls)
    print("URLs:", len(urls))
    for u in urls:
        print("  ", u)
    sys.exit(submit(urls, dry))
