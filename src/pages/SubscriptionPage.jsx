import { useRef } from 'react';
import { Check } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useStagger from '../hooks/useStagger';

const tiers = [
  { name: 'Starter', price: '₹0', period: '/mo', current: false, features: ['500 payments / month', 'Email OTP login', '1 BharatPe connection'] },
  { name: 'Growth', price: '₹1,499', period: '/mo', current: true, features: ['10,000 payments / month', '5 app credentials', 'Priority reconciliation'] },
  { name: 'Scale', price: 'Custom', period: '', current: false, features: ['Unlimited payments', 'Multiple connections', 'Dedicated support'] },
];

export default function SubscriptionPage() {
  const rootRef = useRef(null);
  useStagger(rootRef, '.pricing-tier');
  return <div ref={rootRef}>
    <PageHeader eyebrow="Billing" title="Subscription and pricing" description="Choose payment limits and workspace features." action={<span className="preview-badge">Preview</span>} />
    <section className="pricing-grid">
      {tiers.map(tier => <article className={`panel pricing-tier ${tier.current ? 'current' : ''}`} key={tier.name}>
        {tier.current && <span className="pricing-badge">Current plan</span>}
        <h3>{tier.name}</h3>
        <div className="pricing-amount"><strong>{tier.price}</strong><span>{tier.period}</span></div>
        <ul className="pricing-features">{tier.features.map(feature => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
        <button className="primary-button" disabled={tier.current}>{tier.current ? 'Current plan' : 'Upgrade'}</button>
      </article>)}
    </section>
    <section className="panel usage-panel">
      <div className="panel-heading"><div><h3>This month's usage</h3><p>Payments created against your plan's monthly limit.</p></div></div>
      <div className="usage-meter">
        <div className="strength-track"><i className="strength-3" style={{ width: '24%' }} /></div>
        <div className="usage-meter-labels"><span>2,400 payments used</span><small>10,000 / month limit</small></div>
      </div>
    </section>
  </div>;
}
