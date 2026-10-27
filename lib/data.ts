export const nav = [
  { href: "/#features", label: "Features" },
  { href: "/compare", label: "Compare" },
  { href: "/docs", label: "Docs" },
  { href: "/sponsorships", label: "Sponsor" },
];

export const GITHUB = "https://github.com/tabloy/keygate";

export const vendors = {
  keygen: {
    name: "Keygen",
    blurb: "Keygen is a mature licensing API with a hosted cloud and a self-hosted edition. Its source is available but not under an open source license.",
    rows: [
      ["Source code", "yes", "partial"],
      ["Self hosting", "yes", "yes"],
      ["Free self hosted edition", "yes", "yes"],
      ["Floating licenses", "yes", "yes"],
      ["Offline verification", "yes", "yes"],
      ["Usage metering", "yes", "yes"],
      ["Built in payments", "yes", "no"],
      ["Customer portal", "yes", "no"],
      ["Update distribution", "yes", "yes"],
      ["Official client SDKs", "no", "partial"],
    ],
    pick: "Pick Keygen if you want a battle tested hosted API and official SDKs. Pick Keygate if you want payments, a customer portal and the source in one self hosted box.",
  },
  cryptlex: {
    name: "Cryptlex",
    blurb: "Cryptlex is a commercial licensing platform with polished SDKs for many languages and a hosted dashboard.",
    rows: [
      ["Source code", "yes", "no"],
      ["Self hosting", "yes", "yes"],
      ["Free self hosted edition", "yes", "no"],
      ["Floating licenses", "yes", "yes"],
      ["Offline verification", "yes", "yes"],
      ["Usage metering", "yes", "yes"],
      ["Built in payments", "yes", "partial"],
      ["Customer portal", "yes", "yes"],
      ["Update distribution", "yes", "yes"],
      ["Official client SDKs", "no", "yes"],
    ],
    pick: "Pick Cryptlex if native SDKs for many runtimes matter most. Pick Keygate if you want to own the stack and pay nothing for it.",
  },
  licensespring: {
    name: "LicenseSpring",
    blurb: "LicenseSpring is a hosted licensing service aimed at desktop software vendors, with SDKs and a payment integration.",
    rows: [
      ["Source code", "yes", "no"],
      ["Self hosting", "yes", "yes"],
      ["Free self hosted edition", "yes", "no"],
      ["Floating licenses", "yes", "yes"],
      ["Offline verification", "yes", "yes"],
      ["Usage metering", "yes", "yes"],
      ["Built in payments", "yes", "yes"],
      ["Customer portal", "yes", "yes"],
      ["Update distribution", "yes", "partial"],
      ["Official client SDKs", "no", "yes"],
    ],
    pick: "Pick LicenseSpring for a managed service with SDKs. Pick Keygate when you want every feature free and on your own infrastructure.",
  },
} as const;

export type VendorKey = keyof typeof vendors;

export const matrix: { feature: string; v: ("yes" | "no" | "partial")[] }[] = [
  { feature: "Source code", v: ["yes", "partial", "no", "no"] },
  { feature: "Self hosting", v: ["yes", "yes", "yes", "yes"] },
  { feature: "Free self hosted edition", v: ["yes", "yes", "no", "no"] },
  { feature: "Floating licenses", v: ["yes", "yes", "yes", "yes"] },
  { feature: "Offline verification", v: ["yes", "yes", "yes", "yes"] },
  { feature: "Usage metering", v: ["yes", "yes", "yes", "yes"] },
  { feature: "Built in payments", v: ["yes", "no", "partial", "yes"] },
  { feature: "Customer portal", v: ["yes", "no", "yes", "yes"] },
  { feature: "Update distribution", v: ["yes", "yes", "yes", "partial"] },
  { feature: "Official client SDKs", v: ["no", "partial", "yes", "yes"] },
  { feature: "Webhooks", v: ["yes", "yes", "yes", "yes"] },
  { feature: "Audit logs", v: ["yes", "yes", "yes", "yes"] },
];

export const docsGroups = [
  { title: "Get started", items: ["Quick start", "Installation", "Configuration"] },
  { title: "Guides", items: ["Licensing models", "Activating licenses in your app", "Floating licenses", "Selling with Stripe", "Selling with Lemon Squeezy", "Selling with Gumroad", "Shipping updates", "Features and usage limits", "Webhooks", "Emails", "Customer portal and teams", "Migrating to Keygate"] },
  { title: "Frameworks", items: ["Electron", "Tauri", ".NET", "Python", "Swift (macOS)"] },
  { title: "Learn", items: ["How license keys work", "Node locked vs floating", "Build your own license server?"] },
  { title: "Reference", items: ["API reference", "Security", "Troubleshooting"] },
];

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
