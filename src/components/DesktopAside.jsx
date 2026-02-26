import { Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';
import AsideWeekMiniCalendar from './reading/AsideWeekMiniCalendar';

function sanitizeText(text = '') {
  if (typeof text !== 'string') return '';
  return text.replace(/aceptar todo/gi, '').replace(/\s{2,}/g, ' ').trim();
}

function DesktopAside({ selectedDate, days, todayDate, onSelectDate, onPlayAll, day }) {
  const liturgicalName = sanitizeText(day?.liturgicalName || '') || 'Tiempo Ordinario';
  const liturgicalTitle = sanitizeText(day?.liturgicalTitle || '');

  return (
    <aside className="desktop-aside" aria-label="Panel lateral">
      <AsideWeekMiniCalendar
        selectedDate={selectedDate}
        days={days}
        todayDate={todayDate}
        onSelectDate={onSelectDate}
      />

      <section className="aside-card">
        <h3 className="aside-title">Acciones</h3>
        <button type="button" className="aside-action-btn" onClick={onPlayAll}>
          <Headphones size={16} aria-hidden="true" />
          Escuchar todo
        </button>
      </section>

      <section className="aside-card">
        <h3 className="aside-title">Rosario</h3>
        <p className="aside-kicker">Próximamente</p>
        <Link to="/rosario" className="aside-action-btn">
          Abrir
        </Link>
      </section>

      <section className="aside-card">
        <p className="aside-kicker">Celebración</p>
        <p className="aside-celebration">
          {liturgicalName}
          {liturgicalTitle ? ` - ${liturgicalTitle}` : ''}
        </p>
      </section>
    </aside>
  );
}

export default DesktopAside;
