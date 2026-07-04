import { useRef, useState } from 'react';
import { Check, Smartphone } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useStagger from '../hooks/useStagger';

const templates = [
  { id: 'midnight', name: 'Midnight', layout: 'Centered card', description: 'The classic balanced layout — logo, QR and pay button stacked in one card.', accent: '#7c3aed', bg: '#101620', panel: '#161d2b', text: '#edf1f7', muted: '#8b94a8' },
  { id: 'daylight', name: 'Daylight', layout: 'Split details', description: 'Business and customer details sit beside the QR instead of below it.', accent: '#6d28d9', bg: '#ffffff', panel: '#f5f3ff', text: '#172033', muted: '#6b7280' },
  { id: 'emerald', name: 'Emerald', layout: 'QR-first minimal', description: 'The QR leads, chrome is stripped back to just the essentials.', accent: '#0d9c74', bg: '#0d1a16', panel: '#0d1a16', text: '#eafff6', muted: '#7fae9c' },
  { id: 'sunrise', name: 'Sunrise', layout: 'Bold banner', description: 'A full-width color banner carries your brand above the payment card.', accent: '#f59e0b', bg: '#1a1410', panel: '#221a12', text: '#fff3e0', muted: '#c9a877' },
];

export default function PaymentThemePage() {
  const rootRef = useRef(null);
  const [active, setActive] = useState('midnight');
  useStagger(rootRef, '.theme-swatch');
  const t = templates.find(item => item.id === active);
  const vars = { '--swatch-bg': t.bg, '--swatch-panel': t.panel, '--swatch-accent': t.accent, '--swatch-text': t.text, '--swatch-muted': t.muted };

  return <div ref={rootRef}>
    <PageHeader eyebrow="Gateway setup" title="Payment page theme" description="Brand the hosted checkout with your logo, colors, and an entirely different page layout — not just a recolor." action={<span className="preview-badge">Preview</span>} />
    <div className="create-grid">
      <section className="panel">
        <div className="panel-heading"><div><h3>Theme presets</h3><p>Each preset is its own layout template, not just a different palette.</p></div></div>
        <div className="theme-grid">
          {templates.map(item => <button type="button" className={`theme-swatch ${active === item.id ? 'active' : ''}`} key={item.id} onClick={() => setActive(item.id)} style={{ '--swatch-bg': item.bg, '--swatch-accent': item.accent, '--swatch-text': item.text }}>
            <span className="theme-swatch-preview" />
            <strong>{item.name}</strong>
            <small>{item.layout}</small>
            {active === item.id && <Check className="theme-swatch-check" />}
          </button>)}
        </div>
        <p className="theme-detail">{t.description}</p>
      </section>
      <aside className="panel result-panel theme-preview-panel">
        <p className="eyebrow accent">Live preview — {t.layout}</p>
        <MiniCheckout template={t} vars={vars} />
      </aside>
    </div>
  </div>;
}

function MiniCheckout({ template, vars }) {
  const props = { className: `mini-checkout layout-${template.id}`, style: vars };
  if (template.id === 'daylight') {
    return <div {...props}>
      <div className="mini-split">
        <div className="mini-split-info">
          <span className="mini-avatar">P</span>
          <small>Paying</small><strong>Your Business</strong>
          <div className="mini-split-amount">₹499.00</div>
          <button className="upi-pay-button" type="button" disabled><Smartphone />Pay with a UPI app</button>
        </div>
        <div className="mini-split-qr"><div className="mini-qr" /></div>
      </div>
    </div>;
  }
  if (template.id === 'emerald') {
    return <div {...props}>
      <div className="mini-qr mini-qr-large" />
      <strong className="mini-minimal-amount">₹499.00</strong>
      <small>Scan with any UPI app</small>
    </div>;
  }
  if (template.id === 'sunrise') {
    return <div {...props}>
      <div className="mini-banner"><span className="mini-avatar">P</span><div><small>Paying</small><strong>Your Business</strong></div><em>₹499.00</em></div>
      <div className="mini-banner-body">
        <div className="mini-qr" />
        <button className="upi-pay-button" type="button" disabled><Smartphone />Pay with a UPI app</button>
      </div>
    </div>;
  }
  return <div {...props}>
    <div className="mini-checkout-head"><span className="mini-avatar">P</span><div><small>Paying</small><strong>Your Business</strong></div><em>₹499.00</em></div>
    <div className="mini-qr" />
    <button className="upi-pay-button" type="button" disabled><Smartphone />Pay with a UPI app</button>
  </div>;
}
