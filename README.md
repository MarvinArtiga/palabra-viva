<<<<<<< HEAD
# Palabra Viva Frontend

Frontend en React + Vite para consumir lecturas y audio TTS.

## Configuracion de API

La app usa `import.meta.env.VITE_API_BASE_URL` como base para todas las llamadas al backend (lecturas y TTS).

- Si `VITE_API_BASE_URL` esta definida, se usa como base absoluta.
- Si no esta definida, la app usa rutas relativas (`""`) para funcionar detras de proxy/rewrites.

Ejemplos:

```bash
# Backend externo
VITE_API_BASE_URL=https://tu-backend.com/api/v1

# Con proxy/rewrite (mismo dominio)
VITE_API_BASE_URL=
```

## Deploy en Vercel

1. En Vercel, abre tu proyecto.
2. Ve a `Settings > Environment Variables`.
3. Crea la variable:
   - `VITE_API_BASE_URL`
   - Valor: URL base de tu backend (por ejemplo `https://tu-backend.com/api/v1`) o vacio si usas rewrites/proxy.
4. Aplica la variable en `Production` (y opcionalmente `Preview`/`Development`).
5. Redeploy del proyecto para que Vite inyecte la variable en build.

## Desarrollo local

Puedes usar `.env.local`:

```bash
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

Luego inicia Vite normalmente.
=======
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
>>>>>>> 738cc7cc2b5736fcc778b7e98b33523be291091f
