import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getLocalISODate, parseISODateLocal } from '../services/dateUtils';
import { getTodayReadings, getWeekReadings } from '../services/readingsService';
import { normalizeColorKey } from '../utils/liturgicalColor';

function formatWeekdayLabel(dateStr) {
  return new Intl.DateTimeFormat('es-ES', { weekday: 'short' })
    .format(parseISODateLocal(dateStr))
    .replace('.', '');
}

function formatDateLabel(dateStr) {
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'short'
  }).format(parseISODateLocal(dateStr));
}

function CalendarView() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');
  const [week, setWeek] = useState({ start: '', days: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const todayDate = useMemo(() => getLocalISODate(), []);

  useEffect(() => {
    let cancelled = false;

    async function loadWeek() {
      setLoading(true);
      setError('');

      try {
        let baseDate = selectedDate;

        if (!baseDate) {
          const latest = await getTodayReadings();
          if (cancelled) return;
          baseDate = latest?.date || todayDate;
          setSelectedDate(baseDate);
        }

        const result = await getWeekReadings(baseDate);
        if (cancelled) return;

        setWeek({
          start: result?.start || '',
          days: Array.isArray(result?.days) ? result.days : []
        });
      } catch {
        if (cancelled) return;
        setWeek({ start: '', days: [] });
        setError('No se pudo cargar la semana.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWeek();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, todayDate]);

  function handleOpenDay(dateStr) {
    setSelectedDate(dateStr);
    navigate(`/?date=${dateStr}`);
  }

  return (
    <section className="calendar-view card">
      <h1>Semana actual</h1>
      {week.start && <p className="calendar-week-label">Desde {week.start}</p>}

      {loading && <p className="loading">Cargando semana...</p>}
      {!loading && error && (
        <p className="loading" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <ul className="calendar-week-list" role="list">
          {week.days.map((day) => {
            const isSelected = day.date === selectedDate;
            const isToday = day.date === todayDate;
            const colorKey = normalizeColorKey(day?.liturgicalColor || '');

            return (
              <li key={day.date}>
                <button
                  type="button"
                  className={isSelected ? 'calendar-week-item selected' : 'calendar-week-item'}
                  onClick={() => handleOpenDay(day.date)}
                  aria-current={isToday ? 'date' : undefined}
                >
                  <span className="calendar-week-dayline">
                    {formatWeekdayLabel(day.date)} {formatDateLabel(day.date)}
                  </span>
                  <span className="calendar-week-reference">{day?.gospel?.reference || 'Sin referencia'}</span>
                  <span className="calendar-week-meta">
                    <span
                      className={colorKey ? `week-mini-dot lit-dot-${colorKey}` : 'week-mini-dot'}
                      aria-hidden="true"
                    />
                    {isToday && <span className="calendar-week-today">Hoy</span>}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default CalendarView;
