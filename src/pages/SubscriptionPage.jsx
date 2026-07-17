import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Gift, IndianRupee, ReceiptIndianRupee, RefreshCw, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import PageHeader from '../components/PageHeader';
import { useUi } from '../state/ui-store';
import useStagger from '../hooks/useStagger';

export default function SubscriptionPage() {
  const rootRef = useRef(null);
  const { toast } = useUi();
  const [usage, setUsage] = useState(null);
  const [feeTiers, setFeeTiers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trialBusy, setTrialBusy] = useState(false);
  useStagger(rootRef, '.pricing-tier, .metric-card', { dependency: loading });

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/dashboard/subscription'), api.get('/dashboard/plans')])
      .then(([sub, plansRes]) => { setUsage(sub.data.usage); setFeeTiers(sub.data.feeTiers); setPlans(plansRes.data.plans); })
      .catch(() => toast('Could not load subscription details', 'error')).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const activateTrial = async () => {
    setTrialBusy(true);
    try {
      const { data } = await api.post('/dashboard/subscription/trial/activate');
      setUsage(data.usage);
      toast('Free trial activated: 14 days and 100 payments are now free', 'success');
    } catch (err) { toast(err.response?.data?.message || 'Could not activate free trial', 'error'); }
    finally { setTrialBusy(false); }
  };

  if (loading) return <div className="empty-cell"><RefreshCw className="spin"/> Loading subscription…</div>;

  const limit = usage.monthlyPaymentLimit;
  const usedPct = limit ? Math.min(100, Math.round((usage.paymentCount / limit) * 100)) : 0;
  const currentTier = feeTiers.find(t => usage.paymentCount + 1 <= t.upTo) || feeTiers[feeTiers.length - 1];
  const trial = usage.trial || {};
  const displayFee = trial.active ? 0 : currentTier.feeAmount;

  return <div ref={rootRef}>
    <PageHeader eyebrow="Billing" title="Subscription and usage" description="Pay-Panda charges a small per-payment fee that decreases as your volume grows — no flat monthly subscription." action={<Link className="secondary-button" to="/subscription-history">View invoices</Link>} />

    <section className={`panel trial-panel ${trial.active ? 'active' : trial.activated ? 'ended' : ''}`}>
      <div className="trial-copy">
        <span className="trial-icon">{trial.active ? <ShieldCheck/> : <Gift/>}</span>
        <div>
          <p className="eyebrow accent">{trial.active ? 'Free trial active' : trial.activated ? 'Free trial used' : 'Starter free trial'}</p>
          <h3>{trial.active ? 'Your first Pay-Panda payments are free' : trial.activated ? 'Your free trial has already been activated' : 'Activate 14 days free + 100 free payments'}</h3>
          <p>{trial.active ? `${trial.remainingPayments} free payments remaining until ${new Date(trial.endsAt).toLocaleString()}. Fees are not counted for free trial payments.` : trial.activated ? `Activated on ${new Date(trial.activatedAt).toLocaleDateString()}. Normal per-payment billing now applies after the free limit or expiry.` : 'The trial starts only when you activate it. Signup alone will not consume the trial period.'}</p>
        </div>
      </div>
      <div className="trial-actions">
        <strong>{trial.active ? `${trial.freePaymentCount}/${trial.freePaymentLimit}` : trial.activated ? `${trial.freePaymentCount || 0} free payments used` : '100 free payments'}</strong>
        {!trial.activated && <button className="primary-button compact" disabled={trialBusy} onClick={activateTrial}>{trialBusy ? <RefreshCw className="spin"/> : <Gift/>}{trialBusy ? 'Activating…' : 'Activate free trial'}</button>}
      </div>
    </section>

    <section className="metric-grid">
      <article className="metric-card violet"><p>Current plan</p><strong>{usage.plan?.name || 'No plan assigned'}</strong></article>
      <article className="metric-card blue"><p>Payments this month</p><strong>{usage.paymentCount}{limit ? ` / ${limit}` : ''}</strong></article>
      <article className="metric-card amber"><p>Current fee per payment</p><strong>₹{displayFee.toFixed(2)}</strong><span>{trial.active ? 'Trial payment fee' : 'Billable payment fee'}</span></article>
      <article className="metric-card green"><p>Accrued fee this month</p><strong>₹{usage.accruedFeeAmount.toFixed(2)}</strong></article>
    </section>

    <section className="panel usage-panel">
      <div className="panel-heading"><div><h3>This month's usage</h3><p>Successful payments created against your plan's monthly limit.</p></div></div>
      <div className="usage-meter">
        <div className="strength-track"><i className={limit ? `strength-${usedPct >= 90 ? 4 : usedPct >= 60 ? 3 : usedPct >= 30 ? 2 : 1}` : 'strength-2'} style={{ width: `${limit ? usedPct : 100}%` }} /></div>
        <div className="usage-meter-labels"><span>{usage.paymentCount.toLocaleString('en-IN')} payments used</span><small>{trial.active ? `${trial.remainingPayments} trial payments left` : limit ? `${limit.toLocaleString('en-IN')} / month limit` : 'No limit on current plan'}</small></div>
      </div>
    </section>

    <section className="admin-grid subscription-detail-grid">
      <article className="panel">
        <div className="panel-heading"><div><h3>Per-payment fee schedule</h3><p>The fee steps down automatically as your monthly volume grows.</p></div></div>
        <div className="table-wrap"><table><thead><tr><th>Payments this month</th><th>Fee per payment</th></tr></thead><tbody>
          {feeTiers.map((tier, index) => {
            const lower = index === 0 ? 1 : feeTiers[index - 1].upTo + 1;
            const active = currentTier === tier;
            return <tr key={tier.upTo} style={active ? { background: 'var(--accent-soft)' } : undefined}>
              <td>{lower}{Number.isFinite(tier.upTo) ? `–${tier.upTo}` : '+'}</td>
              <td><strong>₹{tier.feeAmount.toFixed(2)}</strong>{active && !trial.active && <span className="status status-active" style={{ marginLeft: 8 }}><i/>Current</span>}{active && trial.active && <span className="status status-pending" style={{ marginLeft: 8 }}><i/>After trial</span>}</td>
            </tr>;
          })}
        </tbody></table></div>
      </article>
      <aside className="panel">
        <div className="panel-heading"><div><h3>How billing works</h3></div></div>
        <div className="billing-explainer">
          <p><ReceiptIndianRupee size={14}/>Every successful billable payment accrues a small platform fee based on how many billable payments you've processed so far this month. Trial payments have ₹0 fee.</p>
          <p><IndianRupee size={14}/>At the end of each month, Pay-Panda generates one invoice for the total accrued fee, payable via UPI from your <Link to="/subscription-history">subscription history</Link> page.</p>
        </div>
      </aside>
    </section>

    {plans.length > 0 && <section className="pricing-grid">
      {plans.map(plan => <article className={`panel pricing-tier ${usage.plan?.id === plan.id ? 'current' : ''}`} key={plan.id}>
        {usage.plan?.id === plan.id && <span className="pricing-badge">Current plan</span>}
        <h3>{plan.name}</h3>
        <div className="pricing-amount"><strong>{plan.monthlyPaymentLimit ? plan.monthlyPaymentLimit.toLocaleString('en-IN') : 'Unlimited'}</strong><span>payments / mo</span></div>
        <ul className="pricing-features">{(plan.features || []).map(feature => <li key={feature}><Check size={14} />{feature}</li>)}</ul>
      </article>)}
    </section>}
  </div>;
}
