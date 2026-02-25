import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getMonthReadings } from '../services/readingsService';
import { formatMonthKey, formatMonthLabel, getMonthMatrix, toISODate } from '../utils/date';

function CalendarView() {
  const [searchParams] = useSearchParams();
  const monthParam = searchParams.get('month') || formatMonthKey(new Date());
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');
      try {
        const result = await getMonthReadings(monthParam);
        if (cancelled) return;
        setDays(result.days || []);
      } catch {
        if (cancelled) return;
        setDays([]);
        setError('No se pudo cargar. Revisa conexion/servidor.');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [monthParam]);

  const availableByDate = new Set(days.map((day) => day.date));
  const cells = getMonthMatrix(monthParam);
  const todayIso = toISODate(new Date());

  return (
    <section className="calendar-view card">
      <h1>Calendario mensual</h1>
      <p>{formatMonthLabel(monthParam)}</p>
      {loading && <p className="loading">Cargando lecturas...</p>}
      {!loading && error && (
        <p className="loading" role="alert">
          {error}
        </p>
      )}

      <div className="calendar-grid" role="grid" aria-label={`Calendario ${monthParam}`}>
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((w) => (
          <span key={w} className="weekday">
            {w}
          </span>
        ))}

        {cells.map((iso, index) => {
          if (!iso) {
            return <span key={`empty-${index}`} className="day-cell empty" aria-hidden="true" />;
          }

          const hasData = availableByDate.has(iso);
          const dayNumber = new Date(iso).getDate();

          return hasData ? (
            <Link
              key={iso}
              to={`/?date=${iso}`}
              className={iso === todayIso ? 'day-cell active' : 'day-cell'}
              aria-label={`Ir a lecturas del ${iso}`}
            >
              {dayNumber}
            </Link>
          ) : (
            <span key={iso} className="day-cell muted" aria-label={`Sin lectura cargada ${iso}`}>
              {dayNumber}
            </span>
          );
        })}
      </div>
    </section>
  );
}

export default CalendarView;
