import DocsSide from "@/components/DocsSide";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="sec" style={{ paddingTop: "var(--nav-h)" }}>
      <div className="frame docs">
        <DocsSide />
        <article className="docs-main">{children}</article>
      </div>
    </section>
  );
}
