import { useRef } from 'react';
import { Copy, Link2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useStagger from '../hooks/useStagger';

export default function DefaultLinkPage() {
  const rootRef = useRef(null);
  useStagger(rootRef, '.panel');
  return <div ref={rootRef}>
    <PageHeader eyebrow="Payments" title="Default payment link" description="Create a reusable link where customers can enter an amount." action={<span className="preview-badge">Preview</span>} />
    <div className="create-grid">
      <section className="panel form-panel">
        <div className="panel-heading"><div><h3>Always-on payment link</h3><p>Customers open this link, enter their own amount, and pay.</p></div></div>
        <label>Link label<input placeholder="Store counter, donations, etc." disabled /></label>
        <label>Minimum amount (₹)<input type="number" placeholder="1" disabled /></label>
        <label>Maximum amount (₹)<input type="number" placeholder="100000" disabled /></label>
        <button className="primary-button" disabled><Link2 />Generate default link</button>
      </section>
      <aside className="panel result-panel">
        <p className="eyebrow accent">Sample link</p>
        <img className="result-qr" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Crect width='128' height='128' fill='%23fff'/%3E%3C/svg%3E" alt="Sample default link QR" />
        <div className="link-box"><code>pay-panda.app/pay/link/demo-xxxx</code><button type="button" disabled><Copy /></button></div>
        <p style={{ fontSize: 11, color: 'var(--muted)' }}>This link stays active until you disable it, unlike order-specific payment sessions.</p>
      </aside>
    </div>
  </div>;
}
