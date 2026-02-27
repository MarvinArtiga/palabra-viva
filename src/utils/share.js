import { formatDateLong } from './date';

export async function shareReading({ reference, date, url }) {
  const shareText = `${reference} - ${formatDateLong(date)}`;

  if (navigator.share) {
    await navigator.share({
      title: 'Evangelio del dia',
      text: shareText,
      url
    });
    return 'shared';
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(`${shareText}\n${url}`);
    return 'copied';
  }

  return 'unsupported';
}

function sanitizeText(value = '') {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim();
}

export function buildGospelShareMessage({ reference, excerpt, date, url }) {
  const safeReference = sanitizeText(reference || 'Evangelio del día');
  const safeExcerpt = sanitizeText(excerpt || '');
  const dateLabel = formatDateLong(date);
  const excerptBlock = safeExcerpt ? `\n"${safeExcerpt}"\n` : '\n';

  return `El evangelio de hoy (${dateLabel}) es ${safeReference}.${excerptBlock}\nLeelo y meditalo cada día en Palabra Viva: ${url}`;
}

export function getShareUrlForDate(date) {
  const current = new URL(window.location.href);
  if (date) {
    current.searchParams.set('date', date);
  }
  return current.toString();
}

export function openWhatsAppShare(message) {
  const target = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(target, '_blank', 'noopener,noreferrer');
}

export function openFacebookShare(url, message) {
  const target =
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(message)}`;
  window.open(target, '_blank', 'noopener,noreferrer');
}

export async function prepareInstagramShare(message) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(message);
  }
}
