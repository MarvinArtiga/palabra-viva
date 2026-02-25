import { useState } from 'react';
import { Share2 } from 'lucide-react';
import { shareReading } from '../utils/share';

function ShareButton({ reference, date }) {
  const [status, setStatus] = useState('idle');

  async function onShare() {
    try {
      const result = await shareReading({
        reference,
        date,
        url: window.location.href
      });
      setStatus(result);
      setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('idle');
    }
  }

  const aria = status === 'copied' ? 'Enlace copiado' : 'Compartir lectura';

  return (
    <button type="button" className="icon-btn icon-only" onClick={onShare} aria-label={aria} title={aria}>
      <Share2 size={17} />
    </button>
  );
}

export default ShareButton;
