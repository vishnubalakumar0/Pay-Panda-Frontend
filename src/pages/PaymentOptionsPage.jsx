import { useRef, useState } from 'react';
import { QrCode, Smartphone, Layers } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useStagger from '../hooks/useStagger';

const options = [
  { icon: QrCode, title: 'QR only', description: 'Show only the amount-specific UPI QR on the hosted checkout.' },
  { icon: Smartphone, title: 'UPI intent button', description: 'Show a one-tap "Pay with a UPI app" button for mobile customers.' },
  { icon: Layers, title: 'Both (recommended)', description: 'Show the QR and the intent button together, matching the current checkout.' },
];

export default function PaymentOptionsPage() {
  const rootRef = useRef(null);
  const [active, setActive] = useState(2);
  useStagger(rootRef, '.toggle-row');
  return <div ref={rootRef}>
    <PageHeader eyebrow="Gateway setup" title="Payment options" description="Control which QR and UPI intent elements appear on your hosted checkout." action={<span className="preview-badge">Preview</span>} />
    <div className="create-grid">
      <section className="panel">
        <div className="panel-heading"><div><h3>Checkout layout</h3><p>Choose what customers see when they open a payment link.</p></div></div>
        <div className="option-list">
          {options.map((option, index) => <div className="toggle-row" key={option.title}>
            <span className="toggle-row-icon"><option.icon /></span>
            <div><strong>{option.title}</strong><p>{option.description}</p></div>
            <button type="button" className={`toggle-switch ${active === index ? 'on' : ''}`} onClick={() => setActive(index)} aria-pressed={active === index}><i /></button>
          </div>)}
        </div>
      </section>
      <aside className="panel result-panel">
        <p className="eyebrow accent">Live preview</p>
        <div className="mini-checkout">
          <div className="mini-checkout-head"><span className="mini-avatar">P</span><div><small>Paying</small><strong>Your Business</strong></div></div>
          {active === 0 && <div className="mini-qr" />}
          {active === 1 && <button className="upi-pay-button" type="button" disabled><Smartphone />Pay with a UPI app</button>}
          {active === 2 && <><div className="mini-qr" /><button className="upi-pay-button" type="button" disabled><Smartphone />Pay with a UPI app</button></>}
        </div>
      </aside>
    </div>
  </div>;
}
