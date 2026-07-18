import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';

export default function CopyOtpPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const code = searchParams.get('code');

  useEffect(() => {
    if (!code) { navigate('/login', { replace: true }); return; }
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => navigate('/', { replace: true }), 3000);
    }).catch(() => {
      setTimeout(() => navigate('/', { replace: true }), 5000);
    });
  }, [code, navigate]);

  return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Arial, sans-serif', background: '#f9fafb' }}>
    <div style={{ textAlign: 'center', padding: 32, maxWidth: 400 }}>
      {copied ? <CheckCircle2 size={48} style={{ color: '#22c55e', margin: '0 auto 16px' }} /> : <div style={{ width: 48, height: 48, border: '3px solid #e5e7eb', borderTopColor: '#6d4aff', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin .8s linear infinite' }} />}
      <h2 style={{ margin: '0 0 8px', fontSize: 20 }}>{copied ? 'Code copied!' : 'Copying code…'}</h2>
      <p style={{ color: '#6b7280', fontSize: 14, margin: 0 }}>{copied ? `OTP ${code} copied to clipboard. Redirecting…` : 'Please wait…'}</p>
    </div>
  </div>;
}
