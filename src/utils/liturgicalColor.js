const DEFAULT_COLOR = '#b0b8c5';

const LITURGICAL_COLORS = {
  verde: { accent: '#45653a', soft: '#f4f9f1' },
  morado: { accent: '#5a3f78', soft: '#f6f2fb' },
  blanco: { accent: '#8b98aa', soft: '#f8f9fb' },
  rojo: { accent: '#8a2f2f', soft: '#fdf3f3' }
};

export function normalizeColorKey(color = '') {
  return String(color)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function getLiturgicalColorTheme(color = '') {
  const key = normalizeColorKey(color);
  return LITURGICAL_COLORS[key] || null;
}

export function getLiturgicalAccent(color = '') {
  return getLiturgicalColorTheme(color)?.accent || DEFAULT_COLOR;
}
