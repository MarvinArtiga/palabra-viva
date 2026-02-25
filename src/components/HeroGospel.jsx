import { BookOpen, Headphones, Volume2 } from 'lucide-react';

function HeroGospel({ day, onListen, onPlayAll, readingMode }) {
  const gospel = day?.gospel;

  if (!day || !gospel) {
    return null;
  }

  return (
    <section className="hero-card" aria-label="Evangelio del dia">
      <div className="hero-meta">
        <p>{day.liturgicalTitle}</p>
        <span className="badge-color">
          {day.liturgicalColor}
          {/* TODO: Conectar color liturgico oficial desde JSON fuente. */}
        </span>
      </div>
      <h1>{gospel.reference}</h1>
      <h2>{gospel.title}</h2>
      {gospel.excerpt && <p className={readingMode ? 'excerpt reading-mode' : 'excerpt'}>{gospel.excerpt}</p>}
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
