#!/usr/bin/env python3
"""Mirror public pages and assets from platinumroofingaz.com into a static folder."""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import re
import shutil
import sys
import time
from collections import deque
from dataclasses import dataclass
from html import unescape
from pathlib import Path
from typing import Dict, Iterable, Set, Tuple
from urllib.parse import urljoin, urlparse, urlunparse
from urllib.request import Request, urlopen

DEFAULT_BASE_URL = "https://www.platinumroofingaz.com/"
DEFAULT_USER_AGENT = "GAIOS-Mirror/1.0 (+https://github.com/brentscheidt)"

ATTR_RE = re.compile(
    r"(?P<name>srcset|src|href|poster|data-src|data-href)\s*=\s*(?P<q>['\"])(?P<val>.*?)(?P=q)",
    re.IGNORECASE | re.DOTALL,
)
CSS_URL_RE = re.compile(r"url\((?P<q>['\"]?)(?P<val>[^)\"']+)(?P=q)\)", re.IGNORECASE)
SITEMAP_LOC_RE = re.compile(r"<loc>(.*?)</loc>", re.IGNORECASE)

BLOCK_PREFIXES = ("mailto:", "tel:", "javascript:", "data:", "#")


@dataclass
class PageRecord:
    url: str
    rel_path: str
    public_url: str
    html: str


@dataclass
class AssetRecord:
    url: str
    rel_path: str
    public_url: str
    content_type: str
    size: int


def now_iso() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def normalize_url(raw: str) -> str:
    parsed = urlparse(raw)
    scheme = parsed.scheme or "https"
    netloc = parsed.netloc.lower()
    path = parsed.path or "/"
    path = re.sub(r"//+", "/", path)
    return urlunparse((scheme, netloc, path, "", parsed.query, ""))


def drop_fragment(url: str) -> str:
    p = urlparse(url)
    return urlunparse((p.scheme, p.netloc, p.path, "", p.query, ""))


def is_same_site(url: str, site_hosts: Set[str]) -> bool:
    host = urlparse(url).netloc.lower()
    return host in site_hosts


def allowed_asset_host(host: str, site_hosts: Set[str]) -> bool:
    host = host.lower()
    if host in site_hosts:
        return True
    trusted_suffixes = (
        "squarespace.com",
        "squarespace-cdn.com",
        "googleapis.com",
        "gstatic.com",
        "cloudfront.net",
    )
    return any(host == suffix or host.endswith("." + suffix) for suffix in trusted_suffixes)


def is_probable_page(url: str, site_hosts: Set[str]) -> bool:
    p = urlparse(url)
    if p.netloc.lower() not in site_hosts:
        return False
    path = p.path or "/"
    ext = Path(path).suffix.lower()
    if ext in {"", ".html", ".htm"}:
        return True
    return False


def page_paths(url: str) -> Tuple[str, str]:
    p = urlparse(url)
    path = p.path or "/"
    ext = Path(path).suffix.lower()
    if path == "/":
        return "index.html", "/"
    clean = path.lstrip("/")
    if ext in {".html", ".htm"}:
        return clean, "/" + clean
    if ext:
        return clean, "/" + clean
    rel = clean.rstrip("/") + "/index.html"
    pub = "/" + clean.rstrip("/") + "/"
    return rel, pub


def asset_paths(url: str, content_type: str = "") -> Tuple[str, str]:
    p = urlparse(url)
    host = p.netloc.lower()
    path = p.path or "/"
    clean = path.lstrip("/")
    if not clean or clean.endswith("/"):
        clean = clean.rstrip("/") + "/index"
    suffix = Path(clean).suffix
    if not suffix and content_type:
        guessed = mimetypes.guess_extension(content_type.split(";")[0].strip())
        if guessed:
            clean += guessed
    if p.query:
        qhash = hashlib.sha1(p.query.encode("utf-8")).hexdigest()[:10]
        stem = str(Path(clean).with_suffix(""))
        ext = Path(clean).suffix
        clean = f"{stem}__q_{qhash}{ext}"
    rel = f"assets/{host}/{clean}"
    return rel, "/" + rel


def fetch_bytes(url: str, timeout: int, user_agent: str) -> Tuple[bytes, str]:
    req = Request(url, headers={"User-Agent": user_agent})
    with urlopen(req, timeout=timeout) as resp:
        content = resp.read()
        ctype = resp.headers.get("Content-Type", "")
    return content, ctype


def decode_text(content: bytes, content_type: str) -> str:
    charset = "utf-8"
    m = re.search(r"charset=([a-zA-Z0-9._-]+)", content_type or "")
    if m:
        charset = m.group(1).strip()
    try:
        return content.decode(charset, errors="replace")
    except LookupError:
        return content.decode("utf-8", errors="replace")


def is_urlish(candidate: str) -> bool:
    """Heuristic filter to skip plain metadata text that is not a URL/path."""
    if candidate.startswith(("http://", "https://", "//", "/", "./", "../")):
        return True
    return any(ch in candidate for ch in ("/", ".", "?", "="))


def extract_urls_from_html(base_url: str, html: str) -> Set[str]:
    found: Set[str] = set()

    def to_abs(candidate: str) -> str:
        candidate = unescape(candidate.strip())
        if not candidate or candidate.startswith(BLOCK_PREFIXES):
            return ""
        if any(ch in candidate for ch in ("\n", "\r", "\t")) or " " in candidate:
            return ""
        if not is_urlish(candidate):
            return ""
        if candidate.startswith("//"):
            candidate = "https:" + candidate
        return normalize_url(drop_fragment(urljoin(base_url, candidate)))

    for match in ATTR_RE.finditer(html):
        name = match.group("name").lower()
        val = match.group("val")
        if name == "srcset":
            for part in val.split(","):
                first = part.strip().split(" ")[0]
                abs_url = to_abs(first)
                if abs_url:
                    found.add(abs_url)
        else:
            abs_url = to_abs(val)
            if abs_url:
                found.add(abs_url)

    for match in CSS_URL_RE.finditer(html):
        abs_url = to_abs(match.group("val"))
        if abs_url:
            found.add(abs_url)

    return found


def rewrite_html(
    html: str,
    base_url: str,
    page_map: Dict[str, PageRecord],
    asset_map: Dict[str, AssetRecord],
    site_hosts: Set[str],
) -> str:
    def rewrite_one(candidate: str) -> str:
        raw = unescape(candidate.strip())
        if not raw or raw.startswith(BLOCK_PREFIXES):
            return candidate
        if any(ch in raw for ch in ("\n", "\r", "\t")) or " " in raw:
            return candidate
        if not is_urlish(raw):
            return candidate
        if raw.startswith("//"):
            raw = "https:" + raw
        abs_url = normalize_url(drop_fragment(urljoin(base_url, raw)))

        if abs_url in page_map:
            return page_map[abs_url].public_url
        if abs_url in asset_map:
            return asset_map[abs_url].public_url

        host = urlparse(abs_url).netloc.lower()
        if host in site_hosts:
            p = urlparse(abs_url)
            if not p.path:
                return "/"
            return p.path + (("?" + p.query) if p.query else "")

        return candidate

    def attr_sub(match: re.Match[str]) -> str:
        name = match.group("name")
        quote = match.group("q")
        val = match.group("val")
        if name.lower() == "srcset":
            parts = []
            for chunk in val.split(","):
                piece = chunk.strip()
                if not piece:
                    continue
                tokens = piece.split()
                rewritten = rewrite_one(tokens[0])
                if len(tokens) > 1:
                    rewritten += " " + " ".join(tokens[1:])
                parts.append(rewritten)
            new_val = ", ".join(parts)
        else:
            new_val = rewrite_one(val)
        return f"{name}={quote}{new_val}{quote}"

    def css_sub(match: re.Match[str]) -> str:
        q = match.group("q")
        val = match.group("val")
        rewritten = rewrite_one(val)
        return f"url({q}{rewritten}{q})"

    html = ATTR_RE.sub(attr_sub, html)
    html = CSS_URL_RE.sub(css_sub, html)

    html = html.replace("https://www.platinumroofingaz.com", "")
    html = html.replace("https://platinumroofingaz.com", "")
    html = html.replace("http://www.platinumroofingaz.com", "")
    html = html.replace("http://platinumroofingaz.com", "")
    return html


def main() -> int:
    parser = argparse.ArgumentParser(description="Mirror platinumroofingaz.com static site")
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    parser.add_argument("--out", default="docs")
    parser.add_argument("--timeout", type=int, default=30)
    parser.add_argument("--max-pages", type=int, default=300)
    parser.add_argument("--max-assets", type=int, default=4000)
    parser.add_argument("--user-agent", default=DEFAULT_USER_AGENT)
    parser.add_argument("--keep-existing", action="store_true")
    args = parser.parse_args()

    base_url = normalize_url(args.base_url)
    parsed_base = urlparse(base_url)
    site_hosts = {parsed_base.netloc.lower()}
    if parsed_base.netloc.lower().startswith("www."):
        site_hosts.add(parsed_base.netloc.lower()[4:])
    else:
        site_hosts.add("www." + parsed_base.netloc.lower())

    out_dir = Path(args.out).resolve()
    if out_dir.exists() and not args.keep_existing:
        shutil.rmtree(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    # Seed pages from sitemap + homepage.
    page_queue: deque[str] = deque([base_url])
    seen_pages: Set[str] = set()

    sitemap_url = normalize_url(urljoin(base_url, "/sitemap.xml"))
    try:
        sitemap_bytes, sitemap_ct = fetch_bytes(sitemap_url, args.timeout, args.user_agent)
        sitemap_text = decode_text(sitemap_bytes, sitemap_ct)
        for loc in SITEMAP_LOC_RE.findall(sitemap_text):
            loc_url = normalize_url(drop_fragment(loc.strip()))
            if is_same_site(loc_url, site_hosts):
                page_queue.append(loc_url)
    except Exception as exc:  # noqa: BLE001
        print(f"[warn] sitemap fetch failed: {exc}", file=sys.stderr)

    page_map: Dict[str, PageRecord] = {}
    discovered_assets: Set[str] = set()

    while page_queue and len(page_map) < args.max_pages:
        page_url = page_queue.popleft()
        if page_url in seen_pages:
            continue
        seen_pages.add(page_url)
        if not is_probable_page(page_url, site_hosts):
            continue

        try:
            raw, ctype = fetch_bytes(page_url, args.timeout, args.user_agent)
        except Exception as exc:  # noqa: BLE001
            print(f"[warn] page fetch failed: {page_url} ({exc})", file=sys.stderr)
            continue

        html = decode_text(raw, ctype)
        rel_path, pub_url = page_paths(page_url)
        rec = PageRecord(url=page_url, rel_path=rel_path, public_url=pub_url, html=html)
        page_map[page_url] = rec

        for found in extract_urls_from_html(page_url, html):
            host = urlparse(found).netloc.lower()
            if is_probable_page(found, site_hosts):
                if found not in seen_pages:
                    page_queue.append(found)
            elif allowed_asset_host(host, site_hosts):
                if len(discovered_assets) < args.max_assets:
                    discovered_assets.add(found)

    asset_map: Dict[str, AssetRecord] = {}
    for asset_url in sorted(discovered_assets):
        try:
            content, ctype = fetch_bytes(asset_url, args.timeout, args.user_agent)
        except Exception as exc:  # noqa: BLE001
            print(f"[warn] asset fetch failed: {asset_url} ({exc})", file=sys.stderr)
            continue

        rel_path, pub_url = asset_paths(asset_url, ctype)
        abs_path = out_dir / rel_path
        abs_path.parent.mkdir(parents=True, exist_ok=True)
        abs_path.write_bytes(content)
        asset_map[asset_url] = AssetRecord(
            url=asset_url,
            rel_path=rel_path,
            public_url=pub_url,
            content_type=ctype,
            size=len(content),
        )

    for page_url, rec in page_map.items():
        rewritten = rewrite_html(rec.html, page_url, page_map, asset_map, site_hosts)
        abs_path = out_dir / rec.rel_path
        abs_path.parent.mkdir(parents=True, exist_ok=True)
        abs_path.write_text(rewritten, encoding="utf-8")

    report = {
        "generated_at": now_iso(),
        "base_url": base_url,
        "output_dir": str(out_dir),
        "pages_total": len(page_map),
        "assets_total": len(asset_map),
        "pages": sorted(page_map.keys()),
        "assets": sorted(asset_map.keys()),
    }
    (out_dir / "crawl-report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(f"Mirror complete: {len(page_map)} pages, {len(asset_map)} assets -> {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
