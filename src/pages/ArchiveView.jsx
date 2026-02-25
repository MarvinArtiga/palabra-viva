import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getArchiveMonths } from '../services/readingsService';
import { formatMonthLabel } from '../utils/date';

function ArchiveView() {
  const [months, setMonths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError('');

      try {
        const result = await getArchiveMonths();
        if (cancelled) return;

        const normalized = (result || [])
          .map((item) => {
            if (typeof item === 'string') {
              return { month: item, label: formatMonthLabel(item) };
            }
            if (!item?.month) return null;
            return {
              month: item.month,
              label: item.label || formatMonthLabel(item.month)
            };
          })
          .filter(Boolean);

        setMonths(normalized);
      } catch {
        if (cancelled) return;
        setMonths([]);
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
  }, []);

  return (
    <section className="archive-view card">
      <h1>Archivo de meses</h1>
      <p>Selecciona un mes para navegar sus lecturas.</p>
      {loading && <p className="loading">Cargando lecturas...</p>}
      {!loading && error && (
        <p className="loading" role="alert">
          {error}
        </p>
      )}

      <div className="archive-list">
        {months.map((item) => (
          <article className="archive-item" key={item.month}>
            <h2>{item.label}</h2>
            <div className="archive-actions">
              <Link to={`/calendario?month=${item.month}`} className="primary-btn">
                Abrir calendario
              </Link>
              <Link to={`/?date=${item.month}-01`} className="outline-btn">
                Ver primer dia
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ArchiveView;
