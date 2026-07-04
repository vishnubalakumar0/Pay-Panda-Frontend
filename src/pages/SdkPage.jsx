import { useRef, useState } from 'react';
import { Download } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import useStagger from '../hooks/useStagger';

const languages = [
  { id: 'node', name: 'Node.js', version: 'v1.0 (planned)' },
  { id: 'python', name: 'Python', version: 'v1.0 (planned)' },
  { id: 'php', name: 'PHP', version: 'v1.0 (planned)' },
  { id: 'java', name: 'Java', version: 'v1.0 (planned)' },
];

const samples = {
  node: `const client = new PayPanda({ appId, appSecret });\nconst payment = await client.payments.create({\n  order_id: "ORDER-1001",\n  amount: 499.00,\n});\nconsole.log(payment.checkoutUrl);`,
  python: `client = PayPanda(app_id=APP_ID, app_secret=APP_SECRET)\npayment = client.payments.create(\n    order_id="ORDER-1001",\n    amount=499.00,\n)\nprint(payment.checkout_url)`,
  php: `$client = new PayPanda($appId, $appSecret);\n$payment = $client->payments->create([\n  "order_id" => "ORDER-1001",\n  "amount" => 499.00,\n]);\necho $payment->checkoutUrl;`,
  java: `PayPandaClient client = new PayPandaClient(appId, appSecret);\nPayment payment = client.payments().create(\n  PaymentRequest.builder()\n    .orderId("ORDER-1001")\n    .amount(499.00)\n    .build());`,
};

export default function SdkPage() {
  const rootRef = useRef(null);
  const [active, setActive] = useState('node');
  useStagger(rootRef, '.sdk-card');
  return <div ref={rootRef}>
    <PageHeader eyebrow="API setup" title="SDK downloads" description="Server SDKs will be published after the API contract is finalized." action={<span className="preview-badge">Preview</span>} />
    <section className="sdk-grid">
      {languages.map(lang => <button type="button" className={`panel sdk-card ${active === lang.id ? 'active' : ''}`} key={lang.id} onClick={() => setActive(lang.id)}>
        <strong>{lang.name}</strong><small>{lang.version}</small>
        <span className="sdk-download" aria-disabled><Download size={14} />Download</span>
      </button>)}
    </section>
    <section className="panel code-panel">
      <div><p className="eyebrow accent">Quick start</p><h3>{languages.find(l => l.id === active)?.name} integration</h3><p>A payment session created from your backend, using the App ID / App Secret from App credentials.</p></div>
      <pre><code>{samples[active]}</code></pre>
    </section>
  </div>;
}
