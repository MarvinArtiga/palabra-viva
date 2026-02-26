const DATE_LOCALE = 'es-ES';
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function parseISODateString(isoDateString) {
  if (typeof isoDateString !== 'string' || !ISO_DATE_PATTERN.test(isoDateString)) {
    return null;
  }

  const [year, month, day] = isoDateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function asDate(dateValue) {
  const date =
    typeof dateValue === 'string'
      ? parseISODateString(dateValue) || new Date(dateValue)
      : dateValue;
  return isValidDate(date) ? date : null;
}

function capitalize(word = '') {
  return word ? `${word.charAt(0).toUpperCase()}${word.slice(1)}` : '';
}

export function formatDateLong(dateValue) {
  const date = asDate(dateValue);
  if (!date) return 'Fecha no disponible';
  const formatted = new Intl.DateTimeFormat(DATE_LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
  const match = formatted.match(/^([^\s,]+), (\d{1,2}) de ([^\s]+) de (\d{4})$/i);

  if (!match) {
    return capitalize(formatted);
  }

  const [, weekday, day, month, year] = match;
  return `${capitalize(weekday)}, ${day} de ${month.toLowerCase()} de ${year}`;
}

export function formatWeekdayShort(dateValue) {
  const date = asDate(dateValue);
  if (!date) return '';
  return new Intl.DateTimeFormat(DATE_LOCALE, { weekday: 'short' })
    .format(date)
    .replace('.', '');
}

export function formatWeekDayShort(dateValue) {
  const date = asDate(dateValue);
  if (!date) return '';

  const weekday = formatWeekdayShort(date);

  const day = new Intl.DateTimeFormat(DATE_LOCALE, {
    day: 'numeric'
  }).format(date);

  return `${capitalize(weekday)} ${day}`;
}

export function formatDayNumber(dateValue) {
  const date = asDate(dateValue);
  if (!date) return '';
  return String(date.getDate());
}

export function formatMonthLabel(monthKey) {
  if (typeof monthKey !== 'string' || !monthKey.includes('-')) {
    return 'Mes no disponible';
  }
  const [year, month] = monthKey.split('-').map(Number);
  if (!year || !month) return 'Mes no disponible';
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    month: 'long',
    year: 'numeric'
  }).format(new Date(year, month - 1, 1));
}

export function formatMonthKey(dateValue) {
  const date = asDate(dateValue);
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${date.getFullYear()}-${month}`;
}

export function toISODate(dateValue) {
  const date = asDate(dateValue);
  if (!date) return '';
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function getMonthMatrix(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startWeekday; i += 1) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d += 1) {
    const date = new Date(year, month - 1, d);
    cells.push(toISODate(date));
  }

  return cells;
}
