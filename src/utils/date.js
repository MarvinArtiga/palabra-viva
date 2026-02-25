const DATE_LOCALE = 'es-ES';

function isValidDate(date) {
  return date instanceof Date && !Number.isNaN(date.getTime());
}

function asDate(dateValue) {
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;
  return isValidDate(date) ? date : null;
}

export function formatDateLong(dateValue) {
  const date = asDate(dateValue);
  if (!date) return 'Fecha no disponible';
  return new Intl.DateTimeFormat(DATE_LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);
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
