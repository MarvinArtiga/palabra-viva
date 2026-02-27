# Palabra Viva ✨  
Lecturas católicas del día en una interfaz rápida, limpia y con **audio (TTS)**.

> Fuente de lecturas: **dominicos.org** (Dominicos – Liturgia del día).  
> Este proyecto no está afiliado oficialmente a dominicos.org.

## Demo
- 🌐 Sitio: (pon tu URL de deploy aquí)
- 🗓️ Lecturas por fecha + semana
- 🔊 Botón “Escuchar” para oír el Evangelio/Salmo/Lecturas (según disponibilidad)

---

## Features
- ✅ Lecturas del día (Evangelio, etc.)
- ✅ Navegación por semana (Lun–Dom)
- ✅ Manejo de fechas en **LOCAL** (evita el bug del “día anterior”)
- ✅ TTS (Text-to-Speech) desde backend (audio)
- ✅ UI enfocada en lectura: simple, rápida y sin ruido

---

## Stack
**Frontend**
- React + Vite

**Backend (servicio separado)**
- FastAPI
- Scraping + cache
- Endpoint TTS que genera audio por fecha/sección

---

## API (resumen)
El frontend espera un backend compatible con estos endpoints:

### Readings
- `GET /api/v1/readings/latest`
- `GET /api/v1/readings/date/{YYYY-MM-DD}`
- `GET /api/v1/readings/week/{YYYY-MM-DD}` (siempre 7 días Lun–Dom)

### TTS
- `GET /api/v1/tts/date/{YYYY-MM-DD}?section=gospel&rate=1.0&format=mp3`

Secciones típicas:
- `gospel` (evangelio)
- `first` (primera lectura)
- `psalm` (salmo)
- `second` (segunda lectura)
- `all` (todo)

---

## Ejecutar en local (Frontend)
### 1) Instalar dependencias
```bash
npm install
