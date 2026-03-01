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
