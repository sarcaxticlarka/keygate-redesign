export type Block =
  | { t: "h"; id: string; text: string }
  | { t: "p"; text: string; lead?: boolean }
  | { t: "code"; title: string; code: string }
  | { t: "tabs"; items: { label: string; title: string; code: string }[] }
  | { t: "callout"; title: string; text: string }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "list"; items: string[] }
  | { t: "steps"; items: { title: string; text: string }[] }
  | { t: "cards"; items: { title: string; text: string; href: string }[] }
  | { t: "endpoints"; tags: string[] }
  | { t: "events" };

export type Doc = { slug: string; title: string; group: string; lead: string; minutes: number; blocks: Block[] };
