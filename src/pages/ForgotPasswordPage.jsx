import { useState } from 'react';
import { ArrowLeft,CheckCircle2,Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export default function ForgotPasswordPage(){
  const [email,setEmail]=useState('');const [result,setResult]=useState(null);const [error,setError]=useState('');const [busy,setBusy]=useState(false);
  const submit=async event=>{event.preventDefault();setBusy(true);setError('');try{const {data}=await api.post('/auth/forgot-password',{email});setResult(data)}catch(err){setError(err.response?.data?.message||'Unable to request a reset link')}finally{setBusy(false)}};
  return <div className="activation-page"><main className="activation-card"><div className="activation-icon">{result?<CheckCircle2/>:<Mail/>}</div><p className="eyebrow accent">Account recovery</p><h1>Forgot your password?</h1>{result?<><p>{result.message}</p>{result.developmentResetUrl&&<a className="development-link" href={result.developmentResetUrl}>Open development reset link</a>}<Link className="secondary-button" to="/login"><ArrowLeft/>Return to login</Link></>:<form onSubmit={submit}><p>Enter your activated account email. We’ll send a secure, single-use reset link.</p><label>Email address<input type="email" required autoFocus value={email} onChange={e=>setEmail(e.target.value)}/></label>{error&&<div className="alert error">{error}</div>}<button className="primary-button" disabled={busy}>{busy?'Sending…':'Send reset link'}</button><Link className="text-back" to="/login"><ArrowLeft/>Back to login</Link></form>}</main></div>;
}
