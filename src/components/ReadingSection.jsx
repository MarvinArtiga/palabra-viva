import { ChevronDown, Volume2 } from 'lucide-react';
import PsalmText from './reading/PsalmText';
import TextBlocks from './reading/TextBlocks';

function ReadingSection({ id, title, reading, onListen, readingMode, isPsalm = false }) {
  if (!reading) {
    return null;
  }

  const textClassName = readingMode ? 'reading-text reading-mode' : 'reading-text';

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
      {isPsalm ? <PsalmText text={reading.text} className={textClassName} /> : <TextBlocks text={reading.text} className={textClassName} />}
      <button type="button" className="outline-btn with-icon" onClick={() => onListen(title, reading.text)}>
        <Volume2 size={16} />
        Escuchar
      </button>
    </details>
  );
}

export default ReadingSection;
