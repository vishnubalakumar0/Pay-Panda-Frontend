import { useEffect, useRef } from 'react';

export default function OtpInput({ value, onChange, length = 6, disabled, autoFocus }) {
  const refs = useRef([]);
  useEffect(() => { if (autoFocus) refs.current[0]?.focus(); }, [autoFocus]);
  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const applyDigits = (startIndex, raw) => {
    const next = digits.slice();
    for (let i = 0; i < raw.length && startIndex + i < length; i++) next[startIndex + i] = raw[i];
    onChange(next.join(''));
    const lastFilled = Math.min(startIndex + raw.length, length - 1);
    refs.current[lastFilled]?.focus();
  };

  const handleChange = (index, event) => {
    const raw = event.target.value.replace(/\D/g, '');
    if (!raw) {
      const next = digits.slice(); next[index] = ''; onChange(next.join(''));
      return;
    }
    applyDigits(index, raw);
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) refs.current[index - 1]?.focus();
  };

  const handlePaste = (index, event) => {
    const raw = event.clipboardData.getData('text').replace(/\D/g, '');
    if (!raw) return;
    event.preventDefault();
    applyDigits(index, raw);
  };

  return <div className="otp-box-group">
    {digits.map((digit, index) => <input
      key={index}
      ref={el => { refs.current[index] = el; }}
      className="otp-box"
      inputMode="numeric"
      maxLength={1}
      autoComplete={index === 0 ? 'one-time-code' : 'off'}
      value={digit}
      disabled={disabled}
      onChange={event => handleChange(index, event)}
      onKeyDown={event => handleKeyDown(index, event)}
      onPaste={event => handlePaste(index, event)}
    />)}
  </div>;
}
