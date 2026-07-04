import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ value, onChange, className = '', ...props }) {
  const [show, setShow] = useState(false);
  return <div className="input-action">
    <input className={className} type={show ? 'text' : 'password'} value={value} onChange={onChange} {...props} />
    <button type="button" aria-label={show ? 'Hide password' : 'Show password'} onClick={() => setShow(!show)}>{show ? <EyeOff /> : <Eye />}</button>
  </div>;
}
