export default function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee" aria-hidden>
      <div className="marquee-track">
        {row.concat(row).map((t, i) => <span key={i} className="marquee-item"><b>■</b>{t}</span>)}
      </div>
    </div>
  );
}
