import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, CircleCheck, Clock3, IndianRupee, PlugZap, Rocket, KeyRound, QrCode, RefreshCw } from 'lucide-react';
import api from '../lib/api';
import PageHeader from '../components/PageHeader';
import { useUi } from '../state/ui-store';
import useStagger from '../hooks/useStagger';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null); const [payments, setPayments] = useState([]);
  const [clientCount,setClientCount]=useState(0);const [loading,setLoading]=useState(true);
  const rootRef = useRef(null);
  const {toast}=useUi();
  useEffect(() => { Promise.all([api.get('/dashboard/summary'), api.get('/dashboard/payments?limit=6'),api.get('/clients')]).then(([a,b,c]) => { setSummary(a.data.summary); setPayments(b.data.payments);setClientCount(c.data.clients.length); }).catch(()=>toast('Could not load dashboard data','error')).finally(()=>setLoading(false)); }, [toast]);
  useStagger(rootRef, '.metric-card, .table-wrap tbody tr', { dependency: payments.length });
  const today = summary?.today || {};
  const cards = [
    ['Received today', loading ? '—' : `₹${(today.SUCCESS?.amount || 0).toLocaleString('en-IN')}`, CircleCheck, 'green'],
    ['Pending today', loading ? '—' : `₹${(today.PENDING?.amount || 0).toLocaleString('en-IN')}`, Clock3, 'amber'],
    ['Successful payments', loading ? '—' : today.SUCCESS?.count || 0, IndianRupee, 'violet'],
    ['Active connections', loading ? '—' : summary?.activeConnections || 0, PlugZap, 'blue'],
  ];
  return <div ref={rootRef}>
    <PageHeader eyebrow="Live overview" title="Your payment command centre" description="Track collections, gateway health, and recent activity from one place." action={summary?.activeConnections ? <Link className="primary-button compact" to="/payments/create">Create payment<ArrowUpRight size={17}/></Link> : null}/>
    {summary && !summary.activeConnections && <section className="welcome-setup"><div className="welcome-copy"><div className="welcome-icon"><Rocket/></div><p className="eyebrow accent">Welcome to Pay-Panda</p><h2>Complete your gateway setup</h2><p>Connect the business account that will receive payments. Payment creation stays locked until Pay-Panda verifies your merchant and QR.</p></div><div className="setup-steps"><Link to="/connect" className="setup-step current"><span><QrCode/></span><div><small>Step 1</small><strong>Connect BharatPe</strong><p>Verify mobile, merchant and UPI QR.</p></div><ArrowUpRight/></Link><Link to="/api-keys" className={clientCount?'setup-step done':'setup-step'}><span><KeyRound/></span><div><small>Step 2</small><strong>Create app credentials</strong><p>Secure your server integration with OAuth.</p></div>{clientCount?<CircleCheck/>:<ArrowUpRight/>}</Link><div className="setup-step locked"><span><IndianRupee/></span><div><small>Step 3</small><strong>Create first payment</strong><p>Unlocked after your merchant is active.</p></div></div></div></section>}
    <section className="metric-grid">{cards.map(([label,value,Icon,tone]) => <article className={`metric-card ${tone}`} key={label}><div className="metric-icon"><Icon/></div><p>{label}</p><strong>{value}</strong><span>Live from your workspace</span></article>)}</section>
    <section className={`dashboard-grid ${summary?.lifetime?.count ? 'checklist-complete' : ''}`}><article className="panel activity-panel"><div className="panel-heading"><div><h3>Recent payments</h3><p>Latest sessions created through API and dashboard.</p></div><Link to="/payments/history">View all</Link></div>
      <div className="table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead><tbody>{loading ? <tr><td colSpan="4" className="empty-cell"><RefreshCw className="spin"/> Loading payments…</td></tr> : payments.length ? payments.map(p => <tr key={p.id}><td><strong>{p.clientOrderId}</strong><small>{new Date(p.createdAt).toLocaleString()}</small></td><td>{p.customerName || 'Guest'}</td><td>₹{Number(p.amount).toFixed(2)}</td><td><span className={`status status-${p.status.toLowerCase()}`}><i/>{p.status}</span></td></tr>) : <tr><td colSpan="4" className="empty-cell">No payments yet.</td></tr>}</tbody></table></div>
    </article>{!summary?.lifetime?.count&&<article className="panel quick-panel"><div className="panel-heading"><div><h3>Go live checklist</h3><p>Complete these steps before integration.</p></div></div><ol><li className={(summary?.activeConnections || 0) ? 'done' : ''}><span>1</span><div><strong>Connect BharatPe</strong><p>Verify merchant and import QR.</p></div></li><li className={clientCount?'done':''}><span>2</span><div><strong>Create app credentials</strong><p>Use OAuth from your backend.</p></div></li><li><span>3</span><div><strong>Test a payment</strong><p>Confirm your first live transaction.</p></div></li></ol></article>}</section>
  </div>;
}
