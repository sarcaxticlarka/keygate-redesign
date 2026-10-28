import type { Doc } from "./docs-types";

const mintLicense = `curl -X POST https://licenses.example.com/api/v1/admin/licenses \\
  -H 'Authorization: Bearer kg_live_…' \\
  -H 'Content-Type: application/json' \\
  -d '{
    "product_id": "<product uuid>",
    "plan_id": "<plan uuid>",
    "email": "customer@example.com",
    "external_customer_id": "order_8431"
  }'`;

export const docsB: Doc[] = [
  {
    slug: "selling-with-stripe", title: "Selling with Stripe", group: "Guides", minutes: 6,
    lead: "A customer pays and the license appears. Renewals, failures, upgrades and refunds follow on their own. You set one key and wire nothing.",
    blocks: [
      { t: "h", id: "setup", text: "Set it up" },
      { t: "steps", items: [
        { title: "Add your key", text: "Set `STRIPE_SECRET_KEY`. That is the only Stripe variable. The webhook endpoint is created for you on startup." },
        { title: "Attach a price to a plan", text: "In the dashboard, pick a plan and choose its Stripe price. Prices are checked so one price cannot serve two plans." },
        { title: "Share the pay link", text: "Each plan has a `/pay/:checkout_id` link that redirects to Stripe Checkout." },
      ] },
      { t: "h", id: "lifecycle", text: "What happens on each event" },
      { t: "table", head: ["Stripe event", "Keygate does"], rows: [
        ["`checkout.session.completed`", "Creates the license and subscription, emails the key."],
        ["`invoice.paid`", "Extends the license. Recovers one that was past due (`license.payment_recovered`)."],
        ["`invoice.payment_failed`", "Marks it past due and starts the dunning emails. The customer keeps working through the grace period."],
        ["`invoice.upcoming` `invoice.payment_action_required`", "Sends the reminder or action email."],
        ["`customer.subscription.deleted`", "Marks the license canceled."],
        ["`charge.refunded`", "Revokes the license on a full refund."],
      ] },
      { t: "callout", title: "Three layers, so nothing is missed", text: "A payment is picked up by the webhook, by verification on the success page (`/checkout/verify`), and by a periodic sync. If one path fails, another catches it." },
      { t: "h", id: "changes", text: "Plan changes" },
      { t: "p", text: "Upgrades are prorated. Downgrades apply at once and are billed from the next invoice. Customers preview and change plans from the portal (`/portal/subscription/preview`, `/portal/subscription/change`), cancel, open the Stripe billing portal and download invoices." },
      { t: "p", text: "A free plan shows **Upgrade** in the portal. The customer pays for a paid plan of the same product and the same license moves to it: same key, same activations, no reinstall. A full refund or the end of the subscription puts it back on the free plan." },
      { t: "h", id: "perpetual", text: "Perpetual licenses with updates" },
      { t: "p", text: "Customers renew a perpetual license's update period with a one-time payment from the portal (`/portal/updates/renew`). Until then it keeps running; it just cannot install releases published after `updates_until`." },
      { t: "h", id: "signup", text: "Self sign-up for free plans" },
      { t: "p", text: "The plan's `/pay` link becomes a form: confirm an email with a login code, get a key. One per address per product, with an optional daily cap and a marketing-consent checkbox reported in the `license.created` webhook. No card, no Stripe customer." },
    ],
  },
  {
    slug: "selling-with-lemon-squeezy", title: "Selling with Lemon Squeezy", group: "Guides", minutes: 4,
    lead: "Keygate's built-in checkout is Stripe. For Lemon Squeezy, receive its order webhook on your own server and mint the license through the admin API.",
    blocks: [
      { t: "callout", title: "A pattern, not a built-in", text: "The repository's payment code is Stripe only. This guide uses the admin API, which can do anything the dashboard can. Check the API reference for exact fields." },
      { t: "h", id: "flow", text: "The flow" },
      { t: "steps", items: [
        { title: "Create a scoped key", text: "In **API Keys**, mint a `licenses:write` key bound to your product. A bound key can only touch that product." },
        { title: "Receive the order", text: "Your server verifies Lemon Squeezy's signature on the `order_created` webhook." },
        { title: "Mint the license", text: "Call `POST /admin/licenses`. Keygate emails the customer the key." },
        { title: "Handle refunds", text: "On a refund, call `POST /admin/licenses/{id}/revoke` or `/refund`." },
      ] },
      { t: "code", title: "mint a license", code: mintLicense },
      { t: "p", text: "`external_customer_id` is echoed by `/license/verify` and filterable on the list, so you can map a Lemon Squeezy order back to a license." },
      { t: "endpoints", tags: ["Admin Licenses"] },
    ],
  },
  {
    slug: "selling-with-gumroad", title: "Selling with Gumroad", group: "Guides", minutes: 3,
    lead: "Same idea as any outside storefront: Gumroad's sale ping reaches your server, and your server asks Keygate to issue the key.",
    blocks: [
      { t: "callout", title: "A pattern, not a built-in", text: "Keygate does not ship a Gumroad integration. The admin API is the supported way to create and manage licenses from outside." },
      { t: "h", id: "flow", text: "Wire it up" },
      { t: "steps", items: [
        { title: "Point Gumroad's ping at your server", text: "Not at Keygate. Your endpoint validates the sale." },
        { title: "Create the license", text: "`POST /admin/licenses` with the buyer's email and the plan that matches the product they bought." },
        { title: "Deliver the key", text: "Keygate sends the key email. Or read it back with `GET /admin/licenses/{id}/key` and put it in your own receipt." },
        { title: "Retry safely", text: "Writes accept an `Idempotency-Key`, so a repeated ping never creates two licenses." },
      ] },
      { t: "code", title: "mint a license", code: mintLicense },
    ],
  },
  {
    slug: "shipping-updates", title: "Shipping updates", group: "Guides", minutes: 7,
    lead: "Publish a release once and every updater reads it. Sparkle, Velopack and Tauri consume the same feed, with per-product Ed25519 signatures on every artifact.",
    blocks: [
      { t: "h", id: "feeds", text: "One release, three feeds" },
      { t: "table", head: ["Updater", "Platform", "Feed"], rows: [
        ["Sparkle", "macOS", "`GET /releases/{product_slug}/feed.xml`"],
        ["Velopack", "Windows", "`GET /releases/{product_slug}/feed.json`, and `velopack/{platform}/{file}`"],
        ["Tauri", "Cross-platform", "`GET /releases/{product_slug}/upgrade.json` (204 when there is no update)"],
      ] },
      { t: "h", id: "storage", text: "Storage" },
      { t: "p", text: "Artifacts live in S3-compatible storage. Uploads go straight from the browser with presigned URLs, so files never pass through Keygate. Downloads are license-gated with short-lived URLs. Set the `STORAGE_*` variables and `RELEASE_KEY_ENCRYPTION_KEY`." },
      { t: "h", id: "publish", text: "Publish safely" },
      { t: "list", items: [
        "**Atomic publish gate.** A release stays a draft until every artifact is finalised, so a half-uploaded release can never leak.",
        "**Server-side SHA-256.** Integrity is computed by the server. The client's hash is never trusted.",
        "**Yank.** `POST /admin/releases/{id}/actions/yank` pulls a bad release instantly; `unyank` restores it.",
        "**Per-platform binaries** are grouped under a single release.",
      ] },
      { t: "h", id: "signing", text: "Signing keys" },
      { t: "p", text: "Each product has its own Ed25519 signing key. Private keys are encrypted at rest with AES-256-GCM and HKDF-derived subkeys. Download the public key as PEM, or in Tauri format at `/admin/products/{id}/signing-key/tauri-pubkey`. Keys can be rotated and deactivated." },
      { t: "h", id: "gating", text: "Gating updates by license" },
      { t: "p", text: "Feeds are public by default, so a customer's auto-updater never breaks when a license rotates. For products sold with a maintenance period, turn on `feed_license_required`. The updater then sends the license, and sees only releases published inside the customer's update period. Without a license the feed answers `401 LICENSE_KEY_REQUIRED`." },
      { t: "p", text: "`minimum_supported_version` on a product sets a floor for forced upgrades." },
      { t: "endpoints", tags: ["Releases", "Admin Releases"] },
    ],
  },
  {
    slug: "features-and-usage-limits", title: "Features and usage limits", group: "Guides", minutes: 5,
    lead: "Entitlements turn a plan into behaviour in your app: flags, numbers and metered quotas. Quotas are enforced inside the database, so concurrency cannot overspend them.",
    blocks: [
      { t: "h", id: "types", text: "Entitlement types" },
      { t: "table", head: ["Type", "In verify and the token", "Example"], rows: [
        ["`bool` / `flag`", "JSON boolean (a flag is off only at `false`)", "`premium_support: true`"],
        ["numeric limit", "String value", "`storage_gb: \"100\"`"],
        ["`quota`", "Metered with a counter and a period", "`api_calls: \"50000\"`"],
      ] },
      { t: "p", text: "Fetch them with `POST /license/entitlements`, or read the `features` object returned by verify." },
      { t: "h", id: "record", text: "Record usage" },
      { t: "code", title: "POST /api/v1/license/usage", code: "curl -X POST http://localhost:9000/api/v1/license/usage \\\n  -H 'Content-Type: application/json' \\\n  -H 'Idempotency-Key: 9b1e…' \\\n  -d '{\"license_key\":\"KG-…\",\"feature\":\"api_calls\",\"quantity\":1}'" },
      { t: "code", title: "response · 200 OK", code: `{\n  "success": true,\n  "data": {\n    "accepted": true,\n    "used": 9847,\n    "limit": 10000,\n    "remaining": 153,\n    "period": "monthly",\n    "period_key": "2026-09"\n  }\n}` },
      { t: "h", id: "atomic", text: "Atomic by design" },
      { t: "p", text: "The increment is a single guarded update, so two concurrent requests cannot both pass a limit check. A refused increment counts nothing and answers `429 QUOTA_EXCEEDED` with the used, limit and period. A limit of `0` means unlimited and reports `remaining: -1`." },
      { t: "table", head: ["Event", "When"], rows: [
        ["`quota.warning`", "Once, when usage crosses `QUOTA_WARNING_THRESHOLD` (default 0.8)."],
        ["`quota.exceeded`", "On every refused call."],
      ] },
      { t: "p", text: "Periods are hourly, daily, monthly or yearly and reset automatically. Check where a customer stands without spending anything with `POST /license/usage/status`." },
      { t: "endpoints", tags: ["Usage", "Entitlements"] },
    ],
  },
  {
    slug: "webhooks", title: "Webhooks", group: "Guides", minutes: 6,
    lead: "Keygate tells your systems when something happens to a license. Deliveries are signed, retried with backoff, and inspectable and resendable from the dashboard.",
    blocks: [
      { t: "h", id: "events", text: "Events" },
      { t: "p", text: "Subscribe an endpoint to any of these. `webhook.test` is sent by the dashboard test button and is not subscribable." },
      { t: "events" },
      { t: "h", id: "headers", text: "What you receive" },
      { t: "table", head: ["Header", "Value"], rows: [
        ["`X-Keygate-Event`", "The event name"],
        ["`X-Keygate-Delivery`", "The delivery id"],
        ["`X-Keygate-Signature`", "`sha256=<hex>`, HMAC-SHA256 of the raw body keyed with the endpoint secret"],
      ] },
      { t: "h", id: "verify", text: "Verify the signature" },
      { t: "p", text: "The signature covers the body only. Compare in constant time, and check `timestamp` yourself if you want to refuse old deliveries." },
      { t: "tabs", items: [
        { label: "Node", title: "verify.js", code: `import crypto from "node:crypto";\n\nexport function verify(rawBody, header, secret) {\n  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");\n  const a = Buffer.from(expected), b = Buffer.from(header || "");\n  return a.length === b.length && crypto.timingSafeEqual(a, b);\n}` },
        { label: "Python", title: "verify.py", code: `import hmac, hashlib\n\ndef verify(raw_body: bytes, header: str, secret: str) -> bool:\n    expected = "sha256=" + hmac.new(secret.encode(), raw_body, hashlib.sha256).hexdigest()\n    return hmac.compare_digest(expected, header or "")` },
        { label: "Go", title: "verify.go", code: `func verify(body []byte, header, secret string) bool {\n\tm := hmac.New(sha256.New, []byte(secret))\n\tm.Write(body)\n\texpected := "sha256=" + hex.EncodeToString(m.Sum(nil))\n\treturn hmac.Equal([]byte(expected), []byte(header))\n}` },
      ] },
      { t: "h", id: "retries", text: "Delivery and retries" },
      { t: "p", text: "Any 2xx within `WEBHOOK_HTTP_TIMEOUT` (10s) counts as delivered. Otherwise it is retried 1, 2, 4 and 8 minutes after each failed attempt, checked every `WEBHOOK_RETRY_INTERVAL` (30s), until `WEBHOOK_MAX_ATTEMPTS` (5) have been made. Then it is marked `failed`. Redirects are followed up to 10 hops." },
      { t: "callout", title: "Private targets are blocked", text: "Loopback, private and link-local addresses are refused by default. Set `WEBHOOK_ALLOW_PRIVATE=true` for a receiver on the same Docker network." },
      { t: "endpoints", tags: ["Admin Webhooks"] },
    ],
  },
  {
    slug: "emails", title: "Emails", group: "Guides", minutes: 3,
    lead: "Keygate sends the mail a licensing system needs: login codes, license keys, expiry reminders and payment notices, through your own SMTP server.",
    blocks: [
      { t: "h", id: "smtp", text: "Connect SMTP" },
      { t: "code", title: ".env", code: `SMTP_HOST=smtp.example.com\nSMTP_PORT=587\nSMTP_USERNAME=…\nSMTP_PASSWORD=…\nSMTP_FROM=Acme Licensing <noreply@example.com>` },
      { t: "p", text: "The name in `SMTP_FROM` is what recipients see; the envelope sender is stripped to the bare address. Without SMTP, OTP codes are printed to the server log so first-run setup still works." },
      { t: "h", id: "what", text: "What it sends" },
      { t: "list", items: [
        "Login codes (email OTP).",
        "The license key after checkout, and when an admin resends it.",
        "Expiry reminders, with a configurable number of days.",
        "Dunning: failed payments, action required, recovered.",
        "Trial ended, naming the plan the customer carries on with.",
        "Team invitations.",
      ] },
      { t: "p", text: "Emails go through a queue, so a slow mail server never blocks a request. Templates are editable in the dashboard under **Email Templates**, with your branding. Every email footer carries the Powered by Keygate attribution required by the licence." },
      { t: "callout", title: "Keep the login endpoint tight", text: "`RATE_LIMIT_OTP_SEND` (30 per IP per hour) is low on purpose. The endpoint mails an address the caller supplies, so a loose limit lets someone use your server to spam third parties." },
    ],
  },
  {
    slug: "customer-portal-and-teams", title: "Customer portal and teams", group: "Guides", minutes: 4,
    lead: "Customers manage their own licenses and billing, and invite their team. Every member gets a key of their own.",
    blocks: [
      { t: "h", id: "portal", text: "What customers can do" },
      { t: "list", items: [
        "See licenses, plans, validity and entitlements.",
        "Free up a device themselves, without a support ticket (`/portal/licenses/{key}/activations`).",
        "Change plan with a prorated preview, cancel, open the Stripe billing portal and read invoices.",
        "Add or remove seats on a plan sold per seat.",
        "Renew a perpetual license's update period.",
        "Upgrade from a free plan.",
      ] },
      { t: "h", id: "teams", text: "Seats and members" },
      { t: "p", text: "A license holds a number of seats, set per plan or sold per seat. The buyer owns the license and holds one seat, and invites members to the rest. Each accepted member gets a license key of their own, shown in the portal. It opens the same license but keeps to that member's own devices and floating sessions." },
      { t: "callout", title: "Removing a member", text: "Removing a member stops their key and frees their devices. The license's own key stays fixed once issued; an admin can rotate it." },
      { t: "p", text: "If a license ends up with more people than seats, say a plan's seat limit is lowered, the members who joined last are paused (`SEAT_PAUSED`) until a seat frees up." },
      { t: "endpoints", tags: ["Portal", "Seats"] },
    ],
  },
  {
    slug: "migrating-to-keygate", title: "Migrating to Keygate", group: "Guides", minutes: 4,
    lead: "Moving from another licensing system means keeping your customers' existing keys working while their records move across.",
    blocks: [
      { t: "h", id: "map", text: "Map your concepts" },
      { t: "table", head: ["Usually called", "In Keygate"], rows: [
        ["Product / app", "Product (`desktop`, `saas` or `hybrid`)"],
        ["Policy / tier / SKU", "Plan"],
        ["License / entitlement", "License"],
        ["Machine / seat / device", "Activation (or a floating session)"],
        ["Custom fields", "`external_customer_id`, `external_workspace_id`, `notes`"],
      ] },
      { t: "h", id: "steps", text: "Steps" },
      { t: "steps", items: [
        { title: "Recreate products and plans", text: "In the dashboard or with the admin API. Match limits and entitlements first." },
        { title: "Create licenses", text: "`POST /admin/licenses` per customer, with `valid_until` to keep their dates and `external_customer_id` to keep your join key." },
        { title: "Run both for a while", text: "Point new builds of your app at Keygate and keep the old check for old builds." },
        { title: "Move billing last", text: "A license can be detached from its Stripe subscription with `POST /admin/licenses/{id}/stripe/unlink`." },
      ] },
      { t: "callout", title: "Imported keys", text: "A key imported from another system has no Keygate prefix. The license list leaves its prefix out and shows only the last four characters." },
      { t: "code", title: "re-runnable import", code: `# Idempotency-Key makes a re-run safe\ncurl -X POST $BASE/api/v1/admin/licenses \\\n  -H "Authorization: Bearer $KG_KEY" \\\n  -H "Idempotency-Key: import-$ROW_ID" \\\n  -H 'Content-Type: application/json' \\\n  -d @row.json` },
    ],
  },
];
