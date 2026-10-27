import Link from "next/link";
import { GITHUB } from "@/lib/data";
import { Logo } from "./Nav";

export default function Footer() {
  return (
    <footer className="sec footer">
      <div className="frame">
        <div className="foot-grid">
          <div className="foot-col">
            <Logo size={32} />
            <p className="muted" style={{ maxWidth: 280, marginTop: 14 }}>Open source license management for any software business. Self hosted, every feature included.</p>
          </div>
          <div className="foot-col"><h4>Product</h4><Link href="/#features">Features</Link><Link href="/compare">Compare</Link><Link href="/docs">Docs</Link><Link href="/sponsorships">Sponsor</Link></div>
          <div className="foot-col"><h4>Compare</h4><Link href="/compare/keygen">vs Keygen</Link><Link href="/compare/cryptlex">vs Cryptlex</Link><Link href="/compare/licensespring">vs LicenseSpring</Link></div>
          <div className="foot-col"><h4>Community</h4><a href={GITHUB}>GitHub</a><a href={`${GITHUB}/releases`}>Releases</a><a href={`${GITHUB}/discussions`}>Discussions</a><a href={`${GITHUB}/issues`}>Issues</a><a href="mailto:hello@keygate.app">hello@keygate.app</a></div>
        </div>
        <div className="wordmark" aria-hidden>keygate</div>
        <div className="legal"><span>© 2026 Keygate. AGPL v3.</span><span>Powered by Keygate</span></div>
      </div>
    </footer>
  );
}
