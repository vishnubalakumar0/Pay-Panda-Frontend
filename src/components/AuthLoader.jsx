import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LOTTIE_SRC = 'https://lottie.host/6674826c-8b24-49ea-8911-067fdb480d82/Om1Qhm6dmm.lottie';

export default function AuthLoader({ label, size = 280, fullPage = false }) {
  const content = <div className="auth-loader-inner">
    <div style={{ width: size, height: size }}><DotLottieReact src={LOTTIE_SRC} loop autoplay /></div>
    {label && <p>{label}</p>}
  </div>;
  return fullPage ? <div className="auth-loader-page">{content}</div> : content;
}
