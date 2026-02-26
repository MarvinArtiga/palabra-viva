import { ChevronDown, Volume2 } from 'lucide-react';

function ReadingSection({ id, title, reading, onListen, readingMode }) {
  if (!reading) {
    return null;
  }

  return (
    <details className="reading-section" open={id === 'gospel-full'}>
      <summary>
        <span className="section-title">{title}</span>
        <span className="summary-meta">
          <span className="section-ref">{reading.reference}</span>
          <span className="summary-indicator" aria-hidden="true">
            <ChevronDown size={16} strokeWidth={2.2} />
          </span>
        </span>
      </summary>
      <h3>{reading.title}</h3>
      <p className={readingMode ? 'reading-text reading-mode' : 'reading-text'}>{reading.text}</p>
      <button type="button" className="outline-btn with-icon" onClick={() => onListen(title, reading.text)}>
        <Volume2 size={16} />
        Escuchar
      </button>
    </details>
  );
}

export default ReadingSection;
