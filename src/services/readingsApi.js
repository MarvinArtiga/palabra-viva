import apiClient, { getWeekReadings as getWeekReadingsRequest } from './apiClient';
import { formatMonthKey, toISODate } from '../utils/date';

function pick(obj, keys, fallback = null) {
  if (!obj || typeof obj !== 'object') return fallback;
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) {
      return obj[key];
    }
  }
  return fallback;
}

function sanitizeText(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/aceptar todo/gi, '').replace(/\s{2,}/g, ' ').trim();
}

function normalizeReadingText(value) {
  if (!value || typeof value !== 'object') return null;
  return {
    reference: sanitizeText(pick(value, ['reference', 'cita', 'ref', 'gospel_reference', 'evangelio_cita'], '')),
    title: sanitizeText(pick(value, ['title', 'titulo'], '')),
    text: sanitizeText(pick(value, ['text', 'contenido', 'body'], '')),
    excerpt: sanitizeText(pick(value, ['excerpt', 'resumen'], ''))
  };
}

function normalizeDailyReading(value) {
  if (!value || typeof value !== 'object') return null;

  const date =
    pick(value, ['date', 'reading_date', 'readingDate', 'day'], '') || toISODate(new Date());

  return {
    date,
    liturgicalName: sanitizeText(
      pick(value, ['liturgicalName', 'liturgical_name', 'season', 'season_name'], '')
    ),
    liturgicalTitle: sanitizeText(pick(value, ['liturgicalTitle', 'liturgical_title', 'celebration'], '')),
    liturgicalColor: sanitizeText(pick(value, ['liturgicalColor', 'liturgical_color', 'color'], '')),
    gospel: normalizeReadingText(pick(value, ['gospel', 'evangelio'])),
    firstReading: normalizeReadingText(pick(value, ['firstReading', 'first_reading', 'reading1'])),
    psalm: normalizeReadingText(pick(value, ['psalm', 'salmo', 'salm'])),
    secondReading: normalizeReadingText(pick(value, ['secondReading', 'second_reading', 'reading2']))
  };
}

function normalizeMonthReadings(value, requestedMonth) {
  if (Array.isArray(value)) {
    return {
      month: requestedMonth,
      days: value.map(normalizeDailyReading).filter(Boolean)
    };
  }

  const rawDays = pick(value, ['days', 'readings', 'items'], []);
  const days = Array.isArray(rawDays) ? rawDays.map(normalizeDailyReading).filter(Boolean) : [];

  return {
    month: pick(value, ['month', 'month_key', 'monthKey'], requestedMonth),
    days
  };
}

function normalizeWeekReadings(value, requestedDate = '') {
  if (Array.isArray(value)) {
    const days = value.map(normalizeDailyReading).filter(Boolean);
    return {
      start: days[0]?.date || requestedDate,
      days
    };
  }

  const rawDays = pick(value, ['days', 'readings', 'items', 'week'], []);
  const days = Array.isArray(rawDays) ? rawDays.map(normalizeDailyReading).filter(Boolean) : [];

  return {
    start: pick(value, ['start', 'weekStart', 'week_start'], days[0]?.date || requestedDate),
    days
  };
}

export async function getTodayReadings() {
  const { data } = await apiClient.get('/readings/latest');
  return normalizeDailyReading(data);
}

export async function getReadingsByDate(date) {
  const { data } = await apiClient.get(`/readings/date/${date}`);
  return normalizeDailyReading(data);
}

export async function getMonthReadings(month) {
  const { data } = await apiClient.get(`/readings/month/${month}`);
  return normalizeMonthReadings(data, month || formatMonthKey(new Date()));
}

export async function getWeekReadings(date) {
  const data = await getWeekReadingsRequest(date);
  return normalizeWeekReadings(data, date);
}

export async function getArchiveMonths() {
  const { data } = await apiClient.get('/archive/months');
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.months) ? data.months : [];
}
