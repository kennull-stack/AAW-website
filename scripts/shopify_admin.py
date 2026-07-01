#!/usr/bin/env python3
"""Small Shopify Admin API helper for AAW site cleanup tasks."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENV = ROOT / ".env.shopify"
DEFAULT_API_VERSION = "2026-04"

LEGACY_REDIRECTS = [
    ("/products/z07", "/products/z07-in-ear-monitor"),
    ("/products/z07-hybrid-in-ear-monitor", "/products/z07-in-ear-monitor"),
    ("/products/canary", "/products/canary-isobaric-electrostatic-universal-in-ear-monitor"),
    ("/products/canary-pro", "/products/canary-isobaric-electrostatic-universal-in-ear-monitor"),
]

PRODUCT_HANDLES = [
    "z07-in-ear-monitor",
    "z05-auag-launch-edition",
    "z06-universal-in-ear-monitor",
    "canary-isobaric-electrostatic-universal-in-ear-monitor",
    "advanced-acousticwerkes-a3h-universal-in-ear-monitor",
    "aaw-custom-builder-dealer",
    "reshell-service",
    "capri-balanced-lightning",
]

COLLECTION_HANDLES = [
    "all",
    "z-series",
    "custom-iem",
    "universal-in-ear",
    "for-musician",
    "services",
]


class ShopifyError(RuntimeError):
    pass


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def config() -> tuple[str, str, str]:
    shop = os.environ.get("SHOPIFY_SHOP", "").strip().replace("https://", "").replace("http://", "").rstrip("/")
    token = os.environ.get("SHOPIFY_ADMIN_TOKEN", "").strip()
    version = os.environ.get("SHOPIFY_API_VERSION", DEFAULT_API_VERSION).strip()
    if not shop or not token:
        raise ShopifyError(
            f"Missing SHOPIFY_SHOP or SHOPIFY_ADMIN_TOKEN. Create {DEFAULT_ENV} from .env.shopify.example."
        )
    return shop, token, version


def graphql(query: str, variables: dict | None = None) -> dict:
    shop, token, version = config()
    url = f"https://{shop}/admin/api/{version}/graphql.json"
    body = json.dumps({"query": query, "variables": variables or {}}).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=body,
        headers={
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": token,
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            payload = json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise ShopifyError(f"HTTP {exc.code}: {detail}") from exc
    if payload.get("errors"):
        raise ShopifyError(json.dumps(payload["errors"], indent=2))
    return payload.get("data", {})


def cmd_check_access(_: argparse.Namespace) -> None:
    data = graphql(
        """
        query AdminAccessCheck {
          shop {
            name
            myshopifyDomain
            primaryDomain { url host }
            currencyCode
            enabledPresentmentCurrencies
          }
          currentAppInstallation {
            accessScopes { handle }
          }
        }
        """
    )
    shop = data["shop"]
    scopes = sorted(scope["handle"] for scope in data["currentAppInstallation"]["accessScopes"])
    print(json.dumps({"shop": shop, "scopes": scopes}, indent=2))


def cmd_discover(_: argparse.Namespace) -> None:
    product_query = " OR ".join(f"handle:{handle}" for handle in PRODUCT_HANDLES)
    collection_query = " OR ".join(f"handle:{handle}" for handle in COLLECTION_HANDLES)
    data = graphql(
        """
        query Discover($productQuery: String!, $collectionQuery: String!) {
          products(first: 50, query: $productQuery) {
            nodes {
              id
              handle
              title
              status
              onlineStoreUrl
              totalInventory
              productType
              vendor
            }
          }
          collections(first: 50, query: $collectionQuery) {
            nodes {
              id
              handle
              title
              sortOrder
              updatedAt
            }
          }
        }
        """,
        {"productQuery": product_query, "collectionQuery": collection_query},
    )
    print(json.dumps(data, indent=2))


def cmd_create_redirects(args: argparse.Namespace) -> None:
    if args.dry_run:
        print(json.dumps([{"path": path, "target": target} for path, target in LEGACY_REDIRECTS], indent=2))
        return
    mutation = """
    mutation CreateRedirect($urlRedirect: UrlRedirectInput!) {
      urlRedirectCreate(urlRedirect: $urlRedirect) {
        urlRedirect { id path target }
        userErrors { field message }
      }
    }
    """
    results = []
    for path, target in LEGACY_REDIRECTS:
        data = graphql(mutation, {"urlRedirect": {"path": path, "target": target}})
        result = data["urlRedirectCreate"]
        results.append({"path": path, "target": target, **result})
    print(json.dumps(results, indent=2))


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="AAW Shopify Admin helper")
    parser.add_argument("--env", default=str(DEFAULT_ENV), help="Path to env file with SHOPIFY_SHOP and token")
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("check-access", help="Verify token, shop, and granted scopes").set_defaults(func=cmd_check_access)
    sub.add_parser("discover", help="Fetch key products and collections for planning").set_defaults(func=cmd_discover)
    redirects = sub.add_parser("create-redirects", help="Create legacy product URL redirects")
    redirects.add_argument("--dry-run", action="store_true", help="Print redirects without writing")
    redirects.set_defaults(func=cmd_create_redirects)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    load_env(Path(args.env))
    try:
        args.func(args)
    except ShopifyError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
