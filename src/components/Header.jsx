import { parseISODateLocal } from '../services/dateUtils';
import { normalizeColorKey } from '../utils/liturgicalColor';
import LogoPlaceholder from './LogoPlaceholder';

function sanitizeText(text = '') {
  if (typeof text !== 'string') return '';
  return text.replace(/aceptar todo/gi, '').replace(/\s{2,}/g, ' ').trim();
}

function formatHeaderDate(dateStr) {
  if (!dateStr) return 'Fecha no disponible';
  const date = parseISODateLocal(dateStr);
  if (Number.isNaN(date.getTime())) return 'Fecha no disponible';
  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

function Header({ day }) {
  const liturgicalColorKey = normalizeColorKey(day?.liturgicalColor || '');
  const liturgicalName = sanitizeText(day?.liturgicalName || '') || 'Lecturas del día';

  const centerClassName = liturgicalColorKey
    ? `header-center liturgical-text-${liturgicalColorKey}`
    : 'header-center';

  return (
    <header className="app-header">
      <a href="/">
        <div className="header-left">
          <LogoPlaceholder />
          <p className="app-name">Palabra Viva</p>
        </div>
      </a>

      <div className={centerClassName}>
        <p>{formatHeaderDate(day?.date)}</p>
        <strong>{liturgicalName}</strong>
      </div>

      <div className="header-right" />
    </header>
  );
}

export default Header;
