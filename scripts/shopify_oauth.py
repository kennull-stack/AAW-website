#!/usr/bin/env python3
"""Generate a Shopify Admin API offline token for a custom app OAuth install."""

from __future__ import annotations

import argparse
import hashlib
import hmac
import json
import os
import secrets
import sys
import urllib.error
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_ENV = ROOT / ".env.shopify.oauth"
TOKEN_ENV = ROOT / ".env.shopify"
DEFAULT_REDIRECT_URI = "http://127.0.0.1:8787/callback"
DEFAULT_SCOPES = ",".join(
    [
        "read_products",
        "write_products",
        "read_content",
        "write_content",
        "read_online_store_navigation",
        "write_online_store_navigation",
        "read_product_listings",
        "write_product_listings",
        "read_markets",
        "read_files",
        "write_files",
        "read_themes",
    ]
)


class OAuthError(RuntimeError):
    pass


def load_env(path: Path) -> None:
    if not path.exists():
        return
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


def required(name: str) -> str:
    value = os.environ.get(name, "").strip()
    if not value:
        raise OAuthError(f"Missing {name}. Create {DEFAULT_ENV.name} from .env.shopify.oauth.example.")
    return value


def shop_domain() -> str:
    return required("SHOPIFY_SHOP").replace("https://", "").replace("http://", "").rstrip("/")


def oauth_config() -> dict:
    return {
        "shop": shop_domain(),
        "client_id": required("SHOPIFY_CLIENT_ID"),
        "client_secret": required("SHOPIFY_CLIENT_SECRET"),
        "redirect_uri": os.environ.get("SHOPIFY_OAUTH_REDIRECT_URI", DEFAULT_REDIRECT_URI).strip(),
        "scopes": os.environ.get("SHOPIFY_OAUTH_SCOPES", DEFAULT_SCOPES).strip(),
        "api_version": os.environ.get("SHOPIFY_API_VERSION", "2026-04").strip(),
    }


def install_url(state: str) -> str:
    cfg = oauth_config()
    params = {
        "client_id": cfg["client_id"],
        "scope": cfg["scopes"],
        "redirect_uri": cfg["redirect_uri"],
        "state": state,
    }
    return f"https://{cfg['shop']}/admin/oauth/authorize?{urllib.parse.urlencode(params)}"


def verify_hmac(params: dict[str, list[str]], secret: str) -> bool:
    received = params.get("hmac", [""])[0]
    if not received:
        return False
    message_parts = []
    for key in sorted(params):
        if key in {"hmac", "signature"}:
            continue
        value = ",".join(params[key])
        message_parts.append(f"{key}={value}")
    message = "&".join(message_parts).encode("utf-8")
    digest = hmac.new(secret.encode("utf-8"), message, hashlib.sha256).hexdigest()
    return hmac.compare_digest(digest, received)


def exchange_code(code: str) -> dict:
    cfg = oauth_config()
    url = f"https://{cfg['shop']}/admin/oauth/access_token"
    payload = json.dumps(
        {
            "client_id": cfg["client_id"],
            "client_secret": cfg["client_secret"],
            "code": code,
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise OAuthError(f"HTTP {exc.code}: {detail}") from exc


def exchange_client_credentials() -> dict:
    cfg = oauth_config()
    url = f"https://{cfg['shop']}/admin/oauth/access_token"
    payload = urllib.parse.urlencode(
        {
            "grant_type": "client_credentials",
            "client_id": cfg["client_id"],
            "client_secret": cfg["client_secret"],
        }
    ).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=payload,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise OAuthError(f"HTTP {exc.code}: {detail}") from exc


def save_token(token: str) -> None:
    cfg = oauth_config()
    content = "\n".join(
        [
            f"SHOPIFY_SHOP={cfg['shop']}",
            f"SHOPIFY_ADMIN_TOKEN={token}",
            f"SHOPIFY_API_VERSION={cfg['api_version']}",
            "",
        ]
    )
    TOKEN_ENV.write_text(content, encoding="utf-8")


def cmd_url(_: argparse.Namespace) -> None:
    state = secrets.token_urlsafe(24)
    print(json.dumps({"state": state, "install_url": install_url(state)}, indent=2))


def cmd_exchange(args: argparse.Namespace) -> None:
    data = exchange_code(args.code)
    token = data.get("access_token")
    if not token:
        raise OAuthError(f"No access_token in response: {json.dumps(data, indent=2)}")
    if args.save:
        save_token(token)
        print(f"Saved token to {TOKEN_ENV}")
    else:
        print(json.dumps({"access_token": token, "scope": data.get("scope")}, indent=2))


def cmd_client_credentials(args: argparse.Namespace) -> None:
    data = exchange_client_credentials()
    token = data.get("access_token")
    if not token:
        raise OAuthError(f"No access_token in response: {json.dumps(data, indent=2)}")
    if args.save:
        save_token(token)
        print(f"Saved token to {TOKEN_ENV}")
    else:
        print(json.dumps({"access_token": token, "scope": data.get("scope"), "expires_in": data.get("expires_in")}, indent=2))


def cmd_listen(_: argparse.Namespace) -> None:
    cfg = oauth_config()
    parsed = urllib.parse.urlparse(cfg["redirect_uri"])
    host = parsed.hostname or "127.0.0.1"
    port = parsed.port or 8787
    path = parsed.path or "/callback"
    state = secrets.token_urlsafe(24)

    class Handler(BaseHTTPRequestHandler):
        def log_message(self, format: str, *args: object) -> None:
            return

        def do_GET(self) -> None:
            req = urllib.parse.urlparse(self.path)
            if req.path != path:
                self.send_response(404)
                self.end_headers()
                return
            params = urllib.parse.parse_qs(req.query)
            try:
                if params.get("state", [""])[0] != state:
                    raise OAuthError("State mismatch")
                if params.get("shop", [""])[0] != cfg["shop"]:
                    raise OAuthError("Shop mismatch")
                if not verify_hmac(params, cfg["client_secret"]):
                    raise OAuthError("HMAC verification failed")
                code = params.get("code", [""])[0]
                if not code:
                    raise OAuthError("Missing code")
                data = exchange_code(code)
                token = data.get("access_token")
                if not token:
                    raise OAuthError(f"No access_token in response: {data}")
                save_token(token)
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                self.wfile.write(b"Shopify Admin token saved to .env.shopify. You can close this tab.")
                self.server.token_saved = True  # type: ignore[attr-defined]
            except Exception as exc:
                self.send_response(400)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.end_headers()
                self.wfile.write(f"OAuth failed: {exc}".encode("utf-8"))

    httpd = HTTPServer((host, port), Handler)
    httpd.token_saved = False  # type: ignore[attr-defined]
    print("Open this URL in a browser logged into Shopify:")
    print(install_url(state))
    print(f"Listening on {cfg['redirect_uri']}")
    while not httpd.token_saved:  # type: ignore[attr-defined]
        httpd.handle_request()
    print(f"Saved token to {TOKEN_ENV}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Shopify custom app OAuth helper")
    parser.add_argument("--env", default=str(DEFAULT_ENV))
    sub = parser.add_subparsers(dest="command", required=True)
    sub.add_parser("url", help="Print an install URL").set_defaults(func=cmd_url)
    listen = sub.add_parser("listen", help="Start local callback listener, print install URL, and save token")
    listen.set_defaults(func=cmd_listen)
    exchange = sub.add_parser("exchange", help="Exchange a returned OAuth code for a token")
    exchange.add_argument("code")
    exchange.add_argument("--save", action="store_true")
    exchange.set_defaults(func=cmd_exchange)
    client = sub.add_parser("client-credentials", help="Exchange Client ID/Secret for a Dev Dashboard Admin API token")
    client.add_argument("--save", action="store_true")
    client.set_defaults(func=cmd_client_credentials)
    return parser


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    load_env(Path(args.env))
    try:
        args.func(args)
    except OAuthError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
