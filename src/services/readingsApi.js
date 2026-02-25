import apiClient from './apiClient';
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

function normalizeReadingText(value) {
  if (!value || typeof value !== 'object') return null;
  return {
    reference: pick(value, ['reference', 'cita', 'ref'], ''),
    title: pick(value, ['title', 'titulo'], ''),
    text: pick(value, ['text', 'contenido', 'body'], ''),
    excerpt: pick(value, ['excerpt', 'resumen'], '')
  };
}

function normalizeDailyReading(value) {
  if (!value || typeof value !== 'object') return null;

  const date =
    pick(value, ['date', 'reading_date', 'readingDate', 'day'], '') || toISODate(new Date());

  return {
    date,
    liturgicalName: pick(value, ['liturgicalName', 'liturgical_name', 'season', 'season_name'], ''),
    liturgicalTitle: pick(value, ['liturgicalTitle', 'liturgical_title', 'celebration'], ''),
    liturgicalColor: pick(value, ['liturgicalColor', 'liturgical_color', 'color'], ''),
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

export async function getArchiveMonths() {
  const { data } = await apiClient.get('/archive/months');
  if (Array.isArray(data)) return data;
  return Array.isArray(data?.months) ? data.months : [];
}
