import { docsA } from "./docs-a";
import { docsB } from "./docs-b";
import { docsC } from "./docs-c";
import { docsGroups, slugify } from "./data";
import type { Doc } from "./docs-types";

export const allDocs: Doc[] = [...docsA, ...docsB, ...docsC];
const bySlug = new Map(allDocs.map((d) => [d.slug, d]));
export const getDoc = (slug: string) => bySlug.get(slug);

// sidebar order, so previous/next follow the menu
export const ordered: Doc[] = docsGroups.flatMap((g) => g.items.map((t) => bySlug.get(slugify(t))).filter(Boolean) as Doc[]);
