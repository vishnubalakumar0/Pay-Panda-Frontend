import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, KeyRound, ShieldCheck } from 'lucide-react';
import api from '../lib/api';
import PasswordInput from '../components/PasswordInput';

export default function ActivationPage() {
  const [params] = useSearchParams(); const token = params.get('token');
  const [state,setState] = useState({ loading:true, email:'', error:'' }); const [password,setPassword]=useState(''); const [busy,setBusy]=useState(false);
  const navigate=useNavigate();
  useEffect(()=>{if(!token){setState({loading:false,error:'Activation token is missing.'});return}api.get(`/auth/activation/${encodeURIComponent(token)}`).then(({data})=>setState({loading:false,email:data.email,error:''})).catch(err=>setState({loading:false,error:err.response?.data?.message||'Activation link is invalid.'}))},[token]);
  const activate=async e=>{e.preventDefault();setBusy(true);setState(s=>({...s,error:''}));try{await api.post('/auth/activate',{token,password});navigate('/login',{replace:true})}catch(err){setState(s=>({...s,error:err.response?.data?.message||'Activation failed.'}))}finally{setBusy(false)}};
  return <div className="activation-page"><main className="activation-card"><div className="activation-icon">{state.error?<KeyRound/>:<ShieldCheck/>}</div><p className="eyebrow accent">Email verification</p><h1>Activate your account</h1>{state.loading?<p>Checking your secure activation link…</p>:state.error?<><div className="alert error">{state.error}</div><Link className="primary-button" to="/login">Return to login</Link></>:<form onSubmit={activate}><div className="verified-email"><CheckCircle2/><span>Email verified for <strong>{state.email}</strong></span></div><p>Confirm the password you selected during signup to activate this workspace.</p><label>Signup password<PasswordInput autoFocus required value={password} onChange={e=>setPassword(e.target.value)}/></label>{state.error&&<div className="alert error">{state.error}</div>}<button className="primary-button" disabled={busy}>{busy?'Activating…':'Activate and continue'}</button></form>}</main></div>;
}
