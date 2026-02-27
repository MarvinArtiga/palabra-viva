import { BookOpen, Copy, Share2, Volume2, X } from 'lucide-react';
import { FaFacebook } from 'react-icons/fa';
import { IoLogoWhatsapp } from 'react-icons/io';
import { PiInstagramLogoFill } from 'react-icons/pi';
import { useMemo, useState } from 'react';
import { getLiturgicalColorTheme } from '../utils/liturgicalColor';
import { buildGospelShareMessage, getShareUrlForDate, prepareInstagramShare } from '../utils/share';

function sanitizeExcerpt(text = '') {
  if (typeof text !== 'string') return '';
  return text.replace(/aceptar todo/gi, '').replace(/\s{2,}/g, ' ').trim();
}

function scrollToId(event, id) {
  const element = document.getElementById(id);
  if (!element) return;

  event.preventDefault();
  const headerOffset = 90;
  const elementTop = window.scrollY + element.getBoundingClientRect().top;
  window.scrollTo({
    top: Math.max(0, elementTop - headerOffset),
    behavior: 'smooth'
  });
}

function HeroGospel({ day, onListen, readingMode }) {
  const gospel = day?.gospel;
  const excerpt = sanitizeExcerpt(gospel?.excerpt || '');
  const liturgicalTheme = getLiturgicalColorTheme(day?.liturgicalColor || '');
  const [shareStatus, setShareStatus] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const shareUrl = useMemo(() => getShareUrlForDate(day?.date), [day?.date]);
  const shareMessage = useMemo(
    () =>
      buildGospelShareMessage({
        reference: gospel?.reference,
        excerpt,
        date: day?.date,
        url: shareUrl
      }),
    [day?.date, excerpt, gospel?.reference, shareUrl]
  );
  const whatsappHref = useMemo(
    () => `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
    [shareMessage]
  );
  const facebookHref = useMemo(
    () =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareMessage)}`,
    [shareMessage, shareUrl]
  );

  if (!day || !gospel) {
    return null;
  }

  async function copyShareText() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareMessage);
      }
      setShareStatus('Mensaje copiado.');
      setTimeout(() => setShareStatus(''), 2200);
    } catch {
      setShareStatus('No se pudo copiar.');
      setTimeout(() => setShareStatus(''), 2200);
    }
  }

  async function shareToInstagram() {
    try {
      await prepareInstagramShare(shareMessage);
      setShareStatus('Texto copiado para Instagram.');
      setTimeout(() => setShareStatus(''), 2200);
    } catch {
      setShareStatus('No se pudo preparar Instagram.');
      setTimeout(() => setShareStatus(''), 2200);
    }
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
        <a
          href="#gospel-summary"
          className="primary-btn with-icon"
          onClick={(event) => scrollToId(event, 'gospel-summary')}
        >
          <BookOpen size={17} />
          Leer completo
        </a>
        <button type="button" className="outline-btn with-icon" onClick={() => onListen('gospel')}>
          <Volume2 size={17} />
          Escuchar
        </button>
        <button
          type="button"
          className="icon-btn icon-only"
          onClick={() => setIsShareOpen((prev) => !prev)}
          aria-label="Compartir evangelio"
          title="Compartir evangelio"
          aria-expanded={isShareOpen}
          aria-controls="hero-share-panel"
        >
          <Share2 size={17} />
        </button>
      </div>
      {isShareOpen && (
        <div className="hero-share-panel" id="hero-share-panel" role="region" aria-label="Opciones de compartir">
          <div className="hero-share-header">
            <p className="hero-share-invite">Compartelo e invita a alguien a leer el Evangelio de hoy.</p>
            <button
              type="button"
              className="icon-btn icon-only hero-share-close"
              onClick={() => setIsShareOpen(false)}
              aria-label="Cerrar opciones de compartir"
            >
              <X size={16} />
            </button>
          </div>
          <div className="hero-share-grid">
            <a
              className="outline-btn with-icon"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              title="Compartir en WhatsApp"
              aria-label="Compartir en WhatsApp"
            >
              <IoLogoWhatsapp size={18} />
              WhatsApp
            </a>
            <a
              className="outline-btn with-icon"
              href={facebookHref}
              target="_blank"
              rel="noopener noreferrer"
              title="Compartir en Facebook"
              aria-label="Compartir en Facebook"
            >
              <FaFacebook size={18} />
              Facebook
            </a>
            <a
              className="outline-btn with-icon"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={shareToInstagram}
              title="Compartir en Instagram"
              aria-label="Compartir en Instagram"
            >
              <PiInstagramLogoFill size={18} />
              Instagram
            </a>
            <button type="button" className="outline-btn with-icon" onClick={copyShareText}>
              <Copy size={16} />
              Copiar texto
            </button>
          </div>
        </div>
      )}
      {shareStatus && <p className="hero-share-note">{shareStatus}</p>}
    </section>
  );
}

export default HeroGospel;
