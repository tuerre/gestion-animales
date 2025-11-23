**Gestion Animales**

Proyecto backend para la gestión de animales y perfiles de usuario, construido con Node.js + TypeScript y Supabase. Provee autenticación basada en cookies/JWT, CRUD para animales, subida de avatar con procesado de imagen, y endpoints públicos/privados para perfiles.

**Descripción**

Aplicación backend para gestionar animales (registro, edición, borrado, listado) y perfiles de usuario. Está pensado como API para una SPA o app móvil que consume los endpoints protegidos por JWT almacenado en cookies.

**Características**
- **Autenticación**: Registro, login y logout; sesión verificada por cookie con JWT.
- **CRUD de animales**: Obtener lista, ver detalle, crear, actualizar y eliminar (con permisos por propietario).
- **Subida de avatar**: Redimensiona a 256x256 y guarda en el bucket `avatars` de Supabase (formato `webp`).
- **Integración Supabase**: Uso de la base de datos y storage de Supabase.

**Stack**
- **Lenguaje**: TypeScript
- **Servidor**: Express
- **Base y storage**: Supabase (`@supabase/supabase-js`)
- **Autenticación**: `jsonwebtoken` + cookies
- **File upload**: `multer`; procesamiento de imágenes con `sharp`
- **Otros**: `bcrypt` para hashing de contraseñas, `cors`, `cookie-parser`

**Arquitectura / Estructura importante**
- `backend/src/index.ts`: punto de entrada y registro de rutas.
- `backend/src/supabase-client.ts`: cliente Supabase, usa `PROJECT_URL` y `ANON_KEY`.
- Rutas principales:
  - `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/status`
  - `GET /animals`, `GET /animals/:id`, `POST /animals`, `PUT /animals/:id`, `DELETE /animals/:id`
  - `GET /users/:username` (obtiene perfil y animales del usuario)
  - `POST /profile/upload-avatar` (subida de avatar; multipart/form-data, requiere auth)
- Middlewares:
  - `verifyToken` en `middlewares/authMiddleware.ts` (lee cookie `token` y verifica JWT)
  - `upload` en `middlewares/uploadMiddleware.ts` (multer con memoryStorage y restricciones)

**Instalación (desarrollo)**
Recomendado: usar `pnpm` (hay `pnpm-lock.yaml` en `backend/`). Si usas `npm` también funciona.

En PowerShell:

```powershell
cd backend
pnpm install
# iniciar en desarrollo (nodemon + ts-node)
pnpm run dev
```

Si no tienes `pnpm`:

```powershell
npm install -g pnpm
```

El servidor se espera que use la variable `PORT`. Por defecto el `index.ts` usa `process.env.PORT`.

**Variables de entorno**
Crear un archivo `.env` en `backend/` con al menos las siguientes variables:

```env
PROJECT_URL=https://<tu-supabase-project>.supabase.co
ANON_KEY=<tu-anon-key>
JWT_SECRET=<clave-secreta-para-jwt>
PORT=4000
NODE_ENV=development
```

Notas:
- `PROJECT_URL` y `ANON_KEY` se usan para crear `supabase` en `supabase-client.ts`.
- `JWT_SECRET` firma/valida tokens. No lo compartas.

**API — Endpoints y ejemplos**

Autenticación / sesión
- **POST** `/auth/register` — Registrar usuario
  - Body JSON: `{ "username": "juan", "name": "Juan", "email": "juan@x.com", "password": "secret" }`
  - Respuesta: `201` con el usuario creado.

- **POST** `/auth/login` — Iniciar sesión
  - Body JSON: `{ "username": "juan", "password": "secret" }`
  - Respuesta: cookie `token` (httpOnly) + `{ token }` en JSON.
  - Ejemplo `curl`:
    ```bash
    curl -i -X POST http://localhost:4000/auth/login \
      -H "Content-Type: application/json" \
      -d '{"username":"juan","password":"secret"}' -c cookie.txt
    ```

- **POST** `/auth/logout` — Cerrar sesión (borra cookie)

- **GET** `/auth/status` — Verifica token y devuelve info de usuario (requiere auth)

Perfil / Avatares
- **POST** `/profile/upload-avatar` — Subir avatar (requiere auth)
  - multipart/form-data: campo `avatar` (jpeg/png/webp)
  - Redimensiona a 256x256, convierte a `webp` y guarda en bucket `avatars`.
  - Ejemplo `curl` (usa cookie guardada por login):
    ```bash
    curl -X POST http://localhost:4000/profile/upload-avatar \
      -F "avatar=@/ruta/a/mi/avatar.jpg" -b cookie.txt
    ```

Animales (requieren autenticación)
- **GET** `/animals` — Lista todos los animales
- **GET** `/animals/:id` — Detalle por id
- **POST** `/animals` — Crear animal
  - Body JSON: `{ "name": "Firulais", "species": "Perro", "race": "Labrador", "age": 3, "animal_photo_url": "https://..." }`
- **PUT** `/animals/:id` — Actualizar (solo propietario)
- **DELETE** `/animals/:id` — Eliminar (solo propietario)

Usuarios
- **GET** `/users/:username` — Devuelve perfil público y animales del usuario (formatea created_at en "time ago").

Headers y cookies
- La API usa cookies `httpOnly` para mantener el `token`. Para llamadas desde frontend, configurar `fetch`/axios con `credentials: 'include'` y en el servidor `cors` permite `credentials`.

**Base de datos / Supabase (esquema esperado)**
- Tablas mínimas usadas por el backend:
  - `users`:
    - `id` (pk), `username`, `name`, `email`, `password_hash`, `avatar_url`
  - `animals`:
    - `id` (pk), `name`, `species`, `race`, `age`, `animal_photo_url`, `user_id` (fk), `created_at`
  - `profiles` (opcional según tu modelo; el código actual actualiza `profiles.avatar_url`):
    - `id`, `avatar_url` (asegúrate que coincida con ids de usuarios si lo usas)
- Storage:
  - Bucket `avatars` para almacenar avatares (public read) — el código usa `getPublicUrl`.

Si usas Supabase, crea las tablas y permisos necesarios o adapta las queries a tu esquema.

**Problemas comunes y soluciones rápidas**
- Error `Token inválido`: verifica `JWT_SECRET` y que el token no haya expirado.
- Errores de Supabase (`error.message` en respuesta): revisa `PROJECT_URL` y `ANON_KEY` y que la tabla exista.
- CORS / Cookies: asegúrate `cors` en `index.ts` incluya `credentials: true` y que el frontend use `credentials: 'include'`.
- Subida de imagen rechazada: `uploadMiddleware` sólo permite `image/jpeg`, `image/png`, `image/webp` y tamaño máximo 1MB.

**Contribuir**
- Pasos recomendados:
  - Haz un fork / branch y crea PRs claros.
  - Añade pruebas y/o ejemplos de requests para cambios en endpoints.
  - Mantén el estilo TypeScript y configuración existente (Prettier/ESLint).

**Licencia & Contacto**
- MIT ¿? idk

---

