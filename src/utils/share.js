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
