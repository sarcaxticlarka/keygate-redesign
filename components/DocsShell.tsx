import type { ReactNode } from "react";
import DocsSide from "./DocsSide";
import DocsToc from "./DocsToc";
import { PageHero, CTABand } from "./Page";

export default function DocsShell({ group, title, lead, toc = [], minutes, children }: { group: string; title: string; lead: ReactNode; toc?: { id: string; label: string }[]; minutes?: number; children: ReactNode }) {
  return (
    <>
      <PageHero crumbs={[{ label: "Docs", href: "/docs" }, ...(group !== "Docs" ? [{ label: group }] : []), { label: title }]} title={title} lead={lead}>
        {minutes ? <div className="reading"><span className="badge"><b>■</b> {minutes} min read</span><span className="badge">{group}</span><span className="badge">v1.3 API</span></div> : null}
      </PageHero>
      <section className="sec">
        <div className="frame docs">
          <DocsSide />
          <article className="docs-main">{children}</article>
          <DocsToc items={toc} />
        </div>
      </section>
      <CTABand title="Questions? Ask in the open." primary={{ href: "https://github.com/tabloy/keygate/discussions", label: "GitHub Discussions" }} secondary={{ href: "/docs/troubleshooting", label: "Troubleshooting" }} />
    </>
  );
}
