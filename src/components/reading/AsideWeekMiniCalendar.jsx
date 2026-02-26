import { CalendarDays } from 'lucide-react';
import { parseISODateLocal } from '../../services/dateUtils';
import { normalizeColorKey } from '../../utils/liturgicalColor';

function formatWeekdayShort(dateStr) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
    .format(parseISODateLocal(dateStr))
    .replace('.', '');
}

function formatDayNumber(dateStr) {
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric' }).format(parseISODateLocal(dateStr));
}

function AsideWeekMiniCalendar({ days = [], selectedDate, todayDate, onSelectDate }) {
  const topRowDays = days.slice(0, 4);
  const bottomRowDays = days.slice(4, 7);

  function renderDay(day) {
    const dateStr = day?.date;
    const colorKey = normalizeColorKey(day?.liturgicalColor || '');
    const isSelected = dateStr === selectedDate;
    const isToday = dateStr === todayDate;

    let chipClass = 'week-mini-chip';
    if (isSelected && isToday) {
      chipClass += ' selected-today';
    } else if (isSelected) {
      chipClass += ' selected';
    } else if (isToday) {
      chipClass += ' today';
    }

    return (
      <li key={dateStr}>
        <button
          type="button"
          className={chipClass}
          onClick={() => onSelectDate(dateStr)}
          aria-label={`Ver lecturas del ${dateStr}`}
          aria-pressed={isSelected}
          aria-current={isToday ? 'date' : undefined}
        >
          {isToday && <span className="week-mini-today-marker" aria-hidden="true" />}
          <span className="week-mini-weekday">{formatWeekdayShort(dateStr)}</span>
          <span className="week-mini-day">{formatDayNumber(dateStr)}</span>
          <span
            className={colorKey ? `week-mini-dot lit-dot-${colorKey}` : 'week-mini-dot'}
            aria-hidden="true"
          />
        </button>
      </li>
    );
  }

  return (
    <section className="aside-card" aria-label="Esta semana">
      <h3 className="aside-title aside-title-calendar">
        <CalendarDays size={14} />
        Esta semana
      </h3>

      <div className="week-mini-stack" role="list" aria-label="Días de la semana">
        <ul className="week-mini-row week-mini-row-top" role="list">
          {topRowDays.map(renderDay)}
        </ul>
        <ul className="week-mini-row week-mini-row-bottom" role="list">
          {bottomRowDays.map(renderDay)}
        </ul>
      </div>
    </section>
  );
}

export default AsideWeekMiniCalendar;
