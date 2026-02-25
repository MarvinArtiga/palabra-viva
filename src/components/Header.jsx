import { Type } from 'lucide-react';
import LogoPlaceholder from './LogoPlaceholder';
import ShareButton from './ShareButton';
import { formatDateLong } from '../utils/date';

function Header({ day, readingMode, onToggleReadingMode }) {
  return (
    <header className="app-header">
       <a href="/"><div className="header-left">
       
          <LogoPlaceholder />
          <p className="app-name">Palabra Viva</p>
        
      </div></a>

      <div className="header-center">
        <p>{formatDateLong(day?.date || new Date())}</p>
        <strong>{day?.liturgicalName || 'Lecturas del dia'}</strong>
      </div>

      <div className="header-right">
        <ShareButton reference={day?.gospel?.reference || 'Evangelio'} date={day?.date || new Date()} />
        <button
          type="button"
          className="icon-btn icon-only"
          onClick={onToggleReadingMode}
          aria-label="Activar o desactivar modo lectura"
          title={`Modo lectura ${readingMode ? 'activado' : 'desactivado'}`}
        >
          <Type size={17} />
        </button>
      </div>
    </header>
  );
}

export default Header;
