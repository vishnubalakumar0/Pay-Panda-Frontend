import { useRef } from 'react';
import { CalendarDays, IndianRupee, ReceiptIndianRupee } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import useStagger from '../hooks/useStagger';

const rows = [
  { plan: 'Growth', date: '2026-07-01', amount: 1499, status: 'SUCCESS' },
  { plan: 'Growth', date: '2026-06-01', amount: 1499, status: 'SUCCESS' },
  { plan: 'Starter', date: '2026-05-01', amount: 0, status: 'SUCCESS' },
  { plan: 'Growth', date: '2026-08-01', amount: 1499, status: 'PENDING' },
];

export default function SubscriptionHistoryPage() {
  const rootRef = useRef(null);
  useStagger(rootRef, '.table-wrap tbody tr, .history-summary article');
  return <div ref={rootRef}>
    <PageHeader eyebrow="Billing" title="Subscription history" description="Review plan purchases, start dates, and collection limits." action={<span className="preview-badge">Preview</span>} />
    <section className="history-summary">
      <article><span><IndianRupee /></span><div><small>Total spent</small><strong>₹4,497.00</strong></div></article>
      <article><span><ReceiptIndianRupee /></span><div><small>Active plan</small><strong>Growth</strong></div></article>
      <article className="range-card"><span><CalendarDays /></span><div><small>Next renewal</small><strong>1 Aug 2026</strong></div></article>
    </section>
    <section className="panel">
      <div className="table-wrap"><table><thead><tr><th>Plan</th><th>Billed on</th><th>Amount</th><th>Status</th></tr></thead><tbody>
        {rows.map(row => <tr key={row.date}><td><strong>{row.plan}</strong></td><td>{new Date(row.date).toLocaleDateString()}</td><td>₹{row.amount.toFixed(2)}</td><td><StatusBadge status={row.status} /></td></tr>)}
      </tbody></table></div>
    </section>
  </div>;
}
