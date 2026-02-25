import { CalendarDays, Headphones } from 'lucide-react';
import { Link } from 'react-router-dom';

function DesktopAside({ days = [], todayIso, onPlayAll, day }) {
  return (
    <aside className="desktop-aside" aria-label="Panel lateral">
      <section className="aside-card">
        <h3 className="aside-title aside-title-calendar">
          <CalendarDays size={14} />
          Esta semana
        </h3>
        <div className="week-days">
          {days.slice(0, 7).map((day) => (
            <Link
              key={day.date}
              to={`/?date=${day.date}`}
              className={day.date === todayIso ? 'day-pill active' : 'day-pill'}
            >
              {new Date(day.date).getDate()}
            </Link>
          ))}
        </div>
      </section>

      <section className="aside-card">
        <h3 className="aside-title">Acciones</h3>
        <button type="button" className="aside-action-btn" onClick={onPlayAll}>
          <Headphones size={16} aria-hidden="true" />
          Escuchar todo
        </button>
        <Link to="/calendario" className="inline-link with-icon-text">
          <CalendarDays size={15} />
          Ver calendario
        </Link>
      </section>

      <section className="aside-card">
        <p className="aside-kicker">Celebracion</p>
        <p className="aside-celebration">{day?.liturgicalName || 'Tiempo Ordinario'} - {day?.liturgicalTitle || 'Placeholder'}</p>
      </section>
    </aside>
  );
}

export default DesktopAside;
