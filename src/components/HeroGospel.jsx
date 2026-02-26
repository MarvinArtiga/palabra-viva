import { BookOpen, Headphones, Volume2 } from 'lucide-react';
import { getLiturgicalColorTheme } from '../utils/liturgicalColor';

function sanitizeExcerpt(text = '') {
  if (typeof text !== 'string') return '';
  return text.replace(/aceptar todo/gi, '').replace(/\s{2,}/g, ' ').trim();
}

function HeroGospel({ day, onListen, onPlayAll, readingMode }) {
  const gospel = day?.gospel;
  const excerpt = sanitizeExcerpt(gospel?.excerpt || '');
  const liturgicalTheme = getLiturgicalColorTheme(day?.liturgicalColor || '');

  if (!day || !gospel) {
    return null;
  }

  return (
    <section className="hero-card" aria-label="Evangelio del dia">
      <div className="hero-meta">
        <span className="hero-eyebrow">Evangelio del día</span>
        {liturgicalTheme && (
          <span
            className="hero-liturgical-dot"
            style={{ backgroundColor: liturgicalTheme.accent }}
            aria-label="Color litúrgico"
            title="Color litúrgico"
          />
        )}
      </div>
      <h1>{gospel.reference}</h1>
      {excerpt && <p className={readingMode ? 'excerpt reading-mode' : 'excerpt'}>{excerpt}</p>}
      <div className="hero-actions">
        <button type="button" className="primary-btn with-icon">
          <BookOpen size={17} />
          Leer completo
        </button>
        <button type="button" className="outline-btn with-icon" onClick={() => onListen('Evangelio', gospel.text)}>
          <Volume2 size={17} />
          Escuchar
        </button>
        <button type="button" className="link-btn with-icon" onClick={onPlayAll}>
          <Headphones size={17} />
          Escuchar todo
        </button>
      </div>
    </section>
  );
}

export default HeroGospel;
