import type { Doc } from "./docs-types";

const tokenNote = "The token is `base64url(payload).base64url(signature)`. Verify the signature over the payload string itself (the base64url text, not the decoded JSON) with the 32-byte public key from `GET /license/pubkey`.";

const nodeSample = `import crypto from "node:crypto";
import os from "node:os";

const API = "https://licenses.example.com/api/v1";
// Wrap a raw 32-byte Ed25519 key (hex) in the SPKI header Node expects.
const SPKI = Buffer.from("302a300506032b6570032100", "hex");

export function verifyToken(token, publicKeyHex) {
  const [payload, sig] = token.split(".");
  const key = crypto.createPublicKey({
    key: Buffer.concat([SPKI, Buffer.from(publicKeyHex, "hex")]),
    format: "der",
    type: "spki",
  });
  const ok = crypto.verify(null, Buffer.from(payload), key, Buffer.from(sig, "base64url"));
  return ok ? JSON.parse(Buffer.from(payload, "base64url").toString()) : null;
}

export async function activate(licenseKey, deviceId) {
  const res = await fetch(API + "/license/activate", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Idempotency-Key": crypto.randomUUID() },
    body: JSON.stringify({ license_key: licenseKey, identifier: deviceId, label: os.hostname() }),
  });
  const body = await res.json();
  if (!body.success) throw new Error(body.error.code);
  return body.data.token;
}`;

const pySample = `import base64, json, requests
from nacl.signing import VerifyKey  # pip install pynacl

API = "https://licenses.example.com/api/v1"

def b64u(s: str) -> bytes:
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))

def verify_token(token: str, public_key_hex: str) -> dict:
    payload, sig = token.split(".")
    VerifyKey(bytes.fromhex(public_key_hex)).verify(payload.encode(), b64u(sig))  # raises BadSignatureError
    return json.loads(b64u(payload))

def activate(license_key: str, device_id: str) -> str:
    r = requests.post(f"{API}/license/activate",
                      json={"license_key": license_key, "identifier": device_id},
                      timeout=10)
    body = r.json()
    if not body["success"]:
        raise RuntimeError(body["error"]["code"])
    return body["data"]["token"]`;

const swiftSample = `import CryptoKit
import Foundation

struct Claims: Decodable { let lid: String; let sts: String; let did: String; let exp: Int64 }

func base64URL(_ s: String) -> Data? {
    var b = s.replacingOccurrences(of: "-", with: "+").replacingOccurrences(of: "_", with: "/")
    while b.count % 4 != 0 { b += "=" }
    return Data(base64Encoded: b)
}

func verify(token: String, publicKeyHex: String) throws -> Claims? {
    let parts = token.split(separator: ".").map(String.init)
    guard parts.count == 2, let sig = base64URL(parts[1]), let payload = base64URL(parts[0]) else { return nil }
    let raw = Data(stride(from: 0, to: publicKeyHex.count, by: 2).map {
        let i = publicKeyHex.index(publicKeyHex.startIndex, offsetBy: $0)
        return UInt8(publicKeyHex[i...publicKeyHex.index(after: i)], radix: 16)!
    })
    let key = try Curve25519.Signing.PublicKey(rawRepresentation: raw)
    guard key.isValidSignature(sig, for: Data(parts[0].utf8)) else { return nil }
    return try JSONDecoder().decode(Claims.self, from: payload)
}`;

const dotnetSample = `using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using NSec.Cryptography; // dotnet add package NSec.Cryptography

static class Keygate
{
    static readonly HttpClient Http = new() { BaseAddress = new Uri("https://licenses.example.com/api/v1/") };

    static byte[] FromB64Url(string s) =>
        Convert.FromBase64String(s.Replace('-', '+').Replace('_', '/').PadRight((s.Length + 3) / 4 * 4, '='));

    public static JsonDocument? VerifyToken(string token, string publicKeyHex)
    {
        var parts = token.Split('.');
        var algo = SignatureAlgorithm.Ed25519;
        var key = PublicKey.Import(algo, Convert.FromHexString(publicKeyHex), KeyBlobFormat.RawPublicKey);
        // The signed bytes are the base64url payload text.
        if (!algo.Verify(key, Encoding.ASCII.GetBytes(parts[0]), FromB64Url(parts[1]))) return null;
        return JsonDocument.Parse(FromB64Url(parts[0]));
    }

    public static async Task<string> ActivateAsync(string licenseKey, string deviceId)
    {
        var res = await Http.PostAsJsonAsync("license/activate", new { license_key = licenseKey, identifier = deviceId });
        var body = await res.Content.ReadFromJsonAsync<JsonElement>();
        if (!body.GetProperty("success").GetBoolean()) throw new Exception(body.GetProperty("error").GetProperty("code").GetString());
        return body.GetProperty("data").GetProperty("token").GetString()!;
    }
}`;

const tauriSample = `// Cargo: reqwest (json), serde_json, ed25519-dalek = "2", base64 = "0.22", hex = "0.4"
use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use ed25519_dalek::{Signature, Verifier, VerifyingKey};

const API: &str = "https://licenses.example.com/api/v1";

fn verify_token(token: &str, public_key_hex: &str) -> Result<serde_json::Value, String> {
    let (payload, sig) = token.split_once('.').ok_or("bad token")?;
    let pk: [u8; 32] = hex::decode(public_key_hex).map_err(|e| e.to_string())?.try_into().map_err(|_| "bad key")?;
    let sig: [u8; 64] = URL_SAFE_NO_PAD.decode(sig).map_err(|e| e.to_string())?.try_into().map_err(|_| "bad sig")?;
    VerifyingKey::from_bytes(&pk).map_err(|e| e.to_string())?
        .verify(payload.as_bytes(), &Signature::from_bytes(&sig)).map_err(|e| e.to_string())?;
    serde_json::from_slice(&URL_SAFE_NO_PAD.decode(payload).map_err(|e| e.to_string())?).map_err(|e| e.to_string())
}

#[tauri::command]
async fn activate(license_key: String, device_id: String) -> Result<String, String> {
    let body: serde_json::Value = reqwest::Client::new()
        .post(format!("{API}/license/activate"))
        .json(&serde_json::json!({ "license_key": license_key, "identifier": device_id }))
        .send().await.map_err(|e| e.to_string())?
        .json().await.map_err(|e| e.to_string())?;
    if body["success"] != true { return Err(body["error"]["code"].to_string()); }
    Ok(body["data"]["token"].as_str().unwrap_or_default().to_string())
}`;

const framework = (slug: string, title: string, lead: string, label: string, file: string, code: string, extra: Doc["blocks"]): Doc => ({
  slug, title, group: "Frameworks", minutes: 5, lead,
  blocks: [
    { t: "h", id: "overview", text: "What you build" },
    { t: "steps", items: [
      { title: "Fetch the public key once", text: "`GET /api/v1/license/pubkey` returns the Ed25519 key as 64 hex characters. Hard-code it after first run if you prefer." },
      { title: "Activate on first launch", text: "Send the customer's key and a stable device identifier. Store the returned token." },
      { title: "Verify the token locally", text: tokenNote },
      { title: "Re-verify online now and then", text: "`POST /license/verify` refreshes the status and the token. Fall back to the stored token when offline, until its `exp`." },
    ] },
    { t: "h", id: "code", text: `${label} example` },
    { t: "code", title: file, code },
    ...extra,
    { t: "callout", title: "Pick a stable device identifier", text: "Re-activating the same identifier never consumes another slot. Use something that survives updates, such as a hashed machine id, and send a friendly `label` so customers can recognise devices in the portal." },
  ],
});

export const docsC: Doc[] = [
  framework("electron", "Electron", "Check licenses from Electron's main process, verify the signed token with Node's built-in crypto, and keep working offline.", "Node (main process)", "license.js", nodeSample, [
    { t: "p", text: "Keep licensing in the **main** process and expose a small IPC method to the renderer. Nothing secret is embedded: the license key is the credential, and the public key is public." },
    { t: "p", text: "For auto-updates, point Velopack (or your own updater) at `GET /releases/{product_slug}/feed.json` (see Shipping updates)." },
  ]),
  framework("tauri", "Tauri", "Activate from a Tauri command in Rust, verify the token with ed25519-dalek, and use Keygate's `upgrade.json` for the built-in updater.", "Rust", "src-tauri/src/license.rs", tauriSample, [
    { t: "h", id: "updater", text: "Updater endpoint" },
    { t: "p", text: "Keygate serves a bare Tauri manifest at `GET /releases/{product_slug}/upgrade.json` (and `204` when there is no update). Put that URL in `tauri.conf.json` under the updater endpoints, and paste the product's key from `GET /admin/products/{id}/signing-key/tauri-pubkey` as the updater public key." },
  ]),
  framework("net", ".NET", "Call the license API with `HttpClient` and verify the Ed25519 token with NSec. .NET has no built-in Ed25519, so a small library does the check.", "C#", "Keygate.cs", dotnetSample, [
    { t: "p", text: "For Windows desktop apps shipped with Velopack, the same release feed (`feed.json`) works as the update source." },
  ]),
  framework("python", "Python", "Activate with `requests` and verify the token with PyNaCl. Suits CLIs, scripts and server-side checks.", "Python", "keygate_client.py", pySample, [
    { t: "p", text: "In a long-running service, cache the verified claims until the token's `exp`, and call `/license/verify` on a timer rather than per request." },
  ]),
  framework("swift-macos", "Swift (macOS)", "Use CryptoKit's Curve25519 to verify the token, and Sparkle with Keygate's `feed.xml` for updates.", "Swift", "Keygate.swift", swiftSample, [
    { t: "h", id: "sparkle", text: "Sparkle feed" },
    { t: "p", text: "Set `SUFeedURL` to `https://licenses.example.com/api/v1/releases/{product_slug}/feed.xml`. Artifacts carry a per-product Ed25519 `sparkle:edSignature`, so put the product's public key in `SUPublicEDKey`. Releases published after a customer's `updates_until` are hidden from the feed when `feed_license_required` is on." },
  ]),

  {
    slug: "how-license-keys-work", title: "How license keys work", group: "Learn", minutes: 4,
    lead: "A license key is a lookup handle, not a secret you can trust the client with. Here is what Keygate does with it and why the design holds up.",
    blocks: [
      { t: "h", id: "format", text: "The key" },
      { t: "code", title: "example", code: "KG-ABCD2345-EFGH6789-JKLM2345-NPQR6789" },
      { t: "p", text: "A prefix you can choose per product, then four groups of eight characters. Keys are stored hashed with SHA-256 and encrypted at rest, so a database leak does not hand out working keys. The dashboard shows only the last four characters unless an admin reveals one." },
      { t: "h", id: "credential", text: "The key is the credential" },
      { t: "p", text: "The license API takes no API key. Anything you embed in a shipped app can be extracted, a secret key included, so adding one would only look like security. The key identifies the license; the server decides what it may do." },
      { t: "h", id: "token", text: "The signed token" },
      { t: "p", text: "Activate and verify return an Ed25519-signed token. Your app verifies it offline with the server's public key. A copy of your binary cannot mint its own, because it never holds the private key." },
      { t: "h", id: "hardening", text: "Why a bad key tells attackers nothing" },
      { t: "list", items: [
        "Every failure a stranger could cause collapses into one `404 LICENSE_NOT_FOUND`, so you cannot tell an unknown key from a revoked one.",
        "Unknown keys count toward a lockout (`429 LOCKED_OUT`).",
        "Activations and usage are enforced atomically in the database, so retries and races cannot hand out extra slots.",
      ] },
    ],
  },
  {
    slug: "node-locked-vs-floating", title: "Node locked vs floating", group: "Learn", minutes: 3,
    lead: "Two ways to count use. Pick the one that matches how your customers actually work.",
    blocks: [
      { t: "table", head: ["", "Node locked (`standard`)", "Floating"], rows: [
        ["Counts", "Activated devices or users", "Concurrent sessions"],
        ["Limit", "`max_activations`", "`max_activations` at the same time"],
        ["Best for", "Personal apps, per-device licenses", "Shared seats, render farms, engineering teams"],
        ["Starts with", "`POST /license/activate`", "`POST /license/floating/checkout`"],
        ["Stays alive", "Until deactivated", "Heartbeat within `floating_timeout` (default 30 min)"],
        ["Frees up", "Deactivate, or the owner removes it in the portal", "Check in, or the session times out"],
        ["Offline", "Signed token, until `exp`", "Needs reachability to renew the session"],
      ] },
      { t: "callout", title: "They do not mix on one plan", text: "A floating plan refuses `/license/activate` with `409 FLOATING_LICENSE`. A standard plan has no sessions to check out." },
      { t: "p", text: "Per-seat plans scale either model: the cap is `max_activations` times the seats bought." },
    ],
  },
  {
    slug: "build-your-own-license-server", title: "Build your own license server?", group: "Learn", minutes: 5,
    lead: "Generating keys is the easy afternoon. Everything that comes after is why most homegrown systems end up rewritten.",
    blocks: [
      { t: "p", text: "Here is what Keygate had to get right. If you build your own, you will meet each of these." },
      { t: "table", head: ["The problem", "How it bites", "What Keygate does"], rows: [
        ["Two devices activate at once", "Both pass the limit check, a customer gets 4 slots on a 3 slot plan", "Atomic enforcement in the database"],
        ["A client retries a request", "Double activation, double usage, duplicate licenses", "`Idempotency-Key` on writes, replays answered from cache"],
        ["A webhook arrives twice, late or never", "Paid customers without licenses", "Three layers: webhook, success page, periodic sync"],
        ["Payments fail", "Revenue leaks, or angry customers locked out too soon", "Dunning emails and a grace period"],
        ["A copy of your binary mints a license", "Free unlimited use", "Ed25519 tokens, private key never leaves the server"],
        ["Someone probes for valid keys", "Key enumeration", "One 404 for every failure, lockouts, rate limits"],
        ["Quota check then increment", "Race lets usage pass the limit", "Single guarded update"],
        ["Shipping updates", "Unsigned binaries, half-uploaded releases", "Signed artifacts, atomic publish gate, yank"],
        ["Refunds, plan changes, seats", "Hand-written edge cases forever", "Proration, per-seat pricing, member keys"],
      ] },
      { t: "p", text: "Keygate is about 38,000 lines of Go with more than 700 tests, and it exists because each row above took real time." },
      { t: "callout", title: "When building your own is fine", text: "A single desktop app, one price, no refunds to speak of, and an offline-only check can live happily on a signed file. Once you add subscriptions, teams or metering, a license server pays for itself." },
    ],
  },

  {
    slug: "api-reference", title: "API reference", group: "Reference", minutes: 10,
    lead: "118 operations across the license, portal and admin APIs. The rules below hold across all of them; the full OpenAPI 3.1 spec ships in the repository as `docs/openapi.yaml`.",
    blocks: [
      { t: "h", id: "envelope", text: "The envelope" },
      { t: "p", text: "Every response under `/api/` has one shape, success or failure. `data` and `error` are mutually exclusive." },
      { t: "code", title: "responses", code: `{ "success": true,  "data": { ... } }\n{ "success": false, "error": { "code": "LICENSE_NOT_FOUND", "message": "...", "details": {} } }` },
      { t: "p", text: "`error.code` is `SCREAMING_SNAKE_CASE`, and a given code always arrives with the same HTTP status, so a client can branch on the code and decide retries from the status. `204 No Content` is the only success with no body." },
      { t: "h", id: "auth", text: "Authentication" },
      { t: "table", head: ["Surface", "Credential"], rows: [
        ["`/license/*` and public feeds", "None. The `license_key` in the body is the credential."],
        ["`/admin/*`", "`Authorization: Bearer kg_live_…` or an admin session cookie."],
        ["`/portal/*`", "A customer session."],
      ] },
      { t: "table", head: ["Scope", "Reaches"], rows: [
        ["`admin`", "Every `/admin/*` route. Cannot be bound to a product."],
        ["`licenses:write`", "The Admin Licenses routes. May be bound to one product."],
        ["`releases:write`", "The Admin Releases routes. May be bound to one product."],
      ] },
      { t: "p", text: "A key with no scopes reaches nothing. A route outside a key's scopes answers `403 INSUFFICIENT_SCOPE`, and a bound key reaching for another product answers `403 PRODUCT_SCOPE_MISMATCH`." },
      { t: "h", id: "conventions", text: "Conventions" },
      { t: "list", items: [
        "`snake_case` throughout. A field ending in `_at` is an RFC 3339 timestamp with its UTC offset.",
        "Chart buckets (`date`, `period`) are plain `YYYY-MM-DD` dates, not timestamps.",
        "An empty collection is `[]`, never `null`.",
        "Raw-body routes (`feed.xml`, `feed.json`, `upgrade.json`, the PEM key, the CSV export, `/webhook/stripe`, `/pay/:id`) use their consumer's format. Errors on the read routes still use the envelope.",
      ] },
      { t: "h", id: "pagination", text: "Pagination" },
      { t: "code", title: "GET /api/v1/admin/licenses?limit=50&offset=0", code: `{ "success": true, "data": {\n    "licenses": [ ... ],   // named after the resource\n    "total": 1234,         // rows matching the filter\n    "limit": 50,           // the limit actually applied\n    "offset": 0\n} }` },
      { t: "callout", title: "The default is 50, the cap is 200", text: "A client that reads a collection and assumes it received everything will silently see only the first page. Asking for more than 200 is clamped, not refused; compute page counts from the response. Only `GET /admin/licenses` reads `?sort=` and `?order=`." },
      { t: "h", id: "errors", text: "Common error codes" },
      { t: "table", head: ["Code", "Status", "Meaning"], rows: [
        ["`LICENSE_NOT_FOUND`", "404", "Unknown key, or not usable now. Deliberately one answer."],
        ["`LICENSE_EXPIRED` `LICENSE_CANCELED` `LICENSE_SUSPENDED` `LICENSE_REVOKED`", "403", "On activate: the license cannot take new activations."],
        ["`ACTIVATION_LIMIT`", "409", "Slots used up. `details` carries `current` and `max`."],
        ["`FLOATING_LIMIT`", "409", "All sessions in use. `details` carries `active` and `max`."],
        ["`FLOATING_LICENSE`", "409", "The plan is floating: use checkout."],
        ["`DEVICE_HELD` `SESSION_HELD`", "409", "Held by another key on the same license."],
        ["`QUOTA_EXCEEDED`", "429", "Would pass the limit; nothing counted."],
        ["`RATE_LIMITED` `LOCKED_OUT`", "429", "Back off."],
        ["`INVALID_IDEMPOTENCY_KEY`", "400", "Malformed `Idempotency-Key`."],
        ["`IDEMPOTENCY_KEY_CONFLICT`", "422", "Same key, different body."],
        ["`IDEMPOTENCY_IN_FLIGHT`", "409", "A concurrent retry. Wait `Retry-After: 1`."],
        ["`LICENSE_KEY_REQUIRED`", "401", "A gated feed was fetched without a license."],
        ["`INSUFFICIENT_SCOPE`", "403", "The API key lacks the route's scope."],
        ["`INTERNAL_ERROR`", "500", "Opaque on purpose; detail is in the server log."],
      ] },
      { t: "h", id: "endpoints", text: "All endpoints" },
      { t: "endpoints", tags: ["Site", "License", "Entitlements", "Usage", "Floating", "Releases", "Seats", "Checkout", "Signup", "Auth", "Portal", "Admin Licenses", "Admin Releases", "Admin Webhooks"] },
    ],
  },
  {
    slug: "security", title: "Security", group: "Reference", minutes: 4,
    lead: "What Keygate protects, how, and what you are responsible for when you run it.",
    blocks: [
      { t: "h", id: "model", text: "Design choices" },
      { t: "table", head: ["Area", "Measure"], rows: [
        ["License keys", "Hashed with SHA-256 and encrypted at rest. Reveal is an explicit admin action."],
        ["Offline tokens", "Ed25519 signed. The private key never leaves the server."],
        ["Release signing keys", "Per product, encrypted at rest with AES-256-GCM and HKDF-derived subkeys."],
        ["Login", "Email OTP with constant-time hash verification. Role is checked per request from the database."],
        ["Abuse", "Brute force protection, rate limits per client IP, and a tight OTP send budget."],
        ["Webhooks", "HMAC-SHA256 signed. Private and loopback targets refused by default."],
        ["Sessions", "SameSite cookies, HSTS."],
        ["Startup", "Weak secrets are rejected before the server listens."],
        ["Enumeration", "Every license-knowable failure collapses to one 404."],
        ["Writes", "`Idempotency-Key` middleware prevents double execution on retries."],
        ["API keys", "Scope based and fail closed: a key with no scopes can do nothing. Per-product keys are supported."],
      ] },
      { t: "h", id: "yours", text: "What is yours to do" },
      { t: "list", items: [
        "Terminate TLS in front of Keygate and set `BASE_URL` to the https address.",
        "Set `TRUSTED_PROXIES` correctly, or rate limits and lockouts count the proxy instead of the client.",
        "Back up Postgres and keep `RELEASE_KEY_ENCRYPTION_KEY` safe and stable.",
        "Keep `JWT_SECRET` and `LICENSE_SIGNING_KEY` out of version control.",
        "Treat `kg_live_…` keys like passwords. Prefer product-bound, single-scope keys.",
      ] },
      { t: "callout", title: "Attribution is a licence term", text: "Keygate is AGPL v3 with an additional term: the Powered by Keygate attribution must remain visible in the UI, emails and API responses. A commercial licence lifts it. See `NOTICE` and `LICENSE`." },
      { t: "p", text: "Found a vulnerability? Please report it privately by email to hello@keygate.app instead of opening a public issue." },
    ],
  },
  {
    slug: "troubleshooting", title: "Troubleshooting", group: "Reference", minutes: 5,
    lead: "The problems people hit most, with the cause that is nearly always behind each one.",
    blocks: [
      { t: "h", id: "start", text: "The server will not start" },
      { t: "table", head: ["Symptom", "Likely cause", "Fix"], rows: [
        ["Exits immediately naming a secret", "`JWT_SECRET` or `LICENSE_SIGNING_KEY` unset or weak", "Set both to `openssl rand -hex 32`."],
        ["Cannot connect to the database", "Postgres not up yet, or `DATABASE_URL` points at `localhost` inside a container", "Use the compose service name `postgres`. The bundled compose waits on its health check."],
        ["Storage fails to initialise", "`STORAGE_BUCKET`, `STORAGE_ACCESS_KEY`, `STORAGE_SECRET_KEY` not set together", "Set all three, or leave the bucket empty to disable releases."],
      ] },
      { t: "h", id: "login", text: "I cannot sign in" },
      { t: "list", items: [
        "No SMTP? OTP codes are printed in the server log. Look there.",
        "`SETUP_EMAIL_NOT_ALLOWED`: `ADMIN_EMAILS` is set and your email is not in it.",
        "`429` on login: `RATE_LIMIT_AUTH` and `RATE_LIMIT_OTP_SEND` count per IP. Behind a proxy, check `TRUSTED_PROXIES`.",
      ] },
      { t: "h", id: "api", text: "API answers I did not expect" },
      { t: "table", head: ["You see", "It means"], rows: [
        ["`404 LICENSE_NOT_FOUND` on verify", "Unknown key, suspended, revoked, expired, past its paid period, or no activation for this identifier. One answer on purpose."],
        ["`409 ACTIVATION_LIMIT`", "Slots are used up. Free one in the portal, or raise the plan's limit."],
        ["`409 FLOATING_LICENSE`", "The plan is floating. Use `/license/floating/checkout`."],
        ["`429 QUOTA_EXCEEDED`", "A metered limit is spent. It resets with its period; waiting is not enough."],
        ["`429 LOCKED_OUT`", "Too many unknown keys from one address. Wait, then retry with a new idempotency key."],
        ["Only 50 results", "Lists are paginated. Read `total` and page with `limit` and `offset`."],
        ["`503` ending in `_NOT_CONFIGURED` or `_DISABLED`", "The feature is off for this install: Stripe, SMTP or storage. It will not fix itself."],
      ] },
      { t: "h", id: "hooks", text: "Webhooks are not arriving" },
      { t: "list", items: [
        "Open the endpoint's deliveries in the dashboard: each attempt shows the status and body, and can be resent.",
        "A target on a private address is refused. Set `WEBHOOK_ALLOW_PRIVATE=true` for a receiver on the same network.",
        "Return 2xx within 10 seconds. Slower counts as a failure and is retried.",
        "Verify against the **raw** body. A re-serialised JSON body will not match the signature.",
      ] },
      { t: "h", id: "signing", text: "Release signing stopped working" },
      { t: "p", text: "If `RELEASE_KEY_ENCRYPTION_KEY` was lost or changed, existing signing keys cannot be decrypted and signing fails. Restore the original value. If it is gone for good, deactivate and rotate the product's signing key and republish." },
      { t: "h", id: "ask", text: "Still stuck?" },
      { t: "p", text: "Search the GitHub issues, then ask in Discussions. Include the version from `/health`, the error `code`, and the relevant server log lines with secrets removed." },
    ],
  },
];
