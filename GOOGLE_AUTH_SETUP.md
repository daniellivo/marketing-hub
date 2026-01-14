# Configuración de Autenticación con Google y Whitelist

Este documento te guía paso a paso para configurar la autenticación con Google y el sistema de whitelist en tu aplicación.

## Paso 1: Configurar Google OAuth

### 1.1 Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Ve a **"APIs & Services"** > **"Credentials"**
4. Haz clic en **"Create Credentials"** > **"OAuth 2.0 Client ID"**
5. Si es necesario, configura el "OAuth consent screen":
   - User Type: External (o Internal si es un Google Workspace)
   - App name: "Livo Content Platform"
   - User support email: tu email
   - Developer contact: tu email
6. En la configuración del OAuth Client ID:
   - **Application type**: Web application
   - **Name**: Livo Content Platform
   - **Authorized JavaScript origins**:
     - `https://marketing-hub-liard.vercel.app`
     - `https://eoqlhmzrodxfpvviugll.supabase.co`
   - **Authorized redirect URIs**:
     - `https://eoqlhmzrodxfpvviugll.supabase.co/auth/v1/callback`
     - `https://marketing-hub-liard.vercel.app/auth/callback`

7. **Copia el Client ID y Client Secret** que se generan

### 1.2 Configurar en Supabase

1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **"Authentication"** > **"Providers"**
3. Busca **"Google"** en la lista y haz clic en él
4. Activa el toggle de **"Enable Sign in with Google"**
5. Pega el **Client ID** y **Client Secret** de Google
6. Haz clic en **"Save"**

## Paso 2: Configurar la URL de tu Sitio

Actualiza el archivo `.env` con la URL de tu aplicación en producción:

```env
NEXT_PUBLIC_SITE_URL=https://tu-dominio-production.vercel.app
```

**IMPORTANTE**: Esta URL es la que Google usará para redirigir después de la autenticación.
- NO uses `localhost` aquí
- Debe ser la URL pública de tu aplicación (Vercel, Netlify, etc.)
- Si no la configuras, usará por defecto la URL de Supabase

## Paso 3: Ejecutar Migración de Base de Datos

Necesitas ejecutar la migración SQL para crear la tabla de whitelist:

```bash
# En el dashboard de Supabase, ve a "SQL Editor" y ejecuta:
# El contenido del archivo: src/lib/supabase/migrations/002_whitelist_system.sql
```

O usando la CLI de Supabase:

```bash
supabase db push
```

## Paso 4: Agregar Emails a la Whitelist

### Opción A: Usando el SQL Editor de Supabase

1. Ve a **"SQL Editor"** en tu proyecto de Supabase
2. Ejecuta este query para agregar emails autorizados:

```sql
INSERT INTO whitelist (email, reason, is_active) VALUES
  ('[email protected]', 'Admin principal', true),
  ('[email protected]', 'Miembro del equipo', true),
  ('[email protected]', 'Editor de contenido', true);
```

### Opción B: Crear un admin panel (próximamente)

Puedes crear una interfaz de administración en tu app para gestionar la whitelist.

## Paso 5: Verificar la Configuración

1. Ve a tu aplicación en producción: `https://marketing-hub-liard.vercel.app/login`
2. Haz clic en **"Iniciar sesión con Google"**
3. Selecciona una cuenta de Google
4. Si el email está en la whitelist, deberías ser redirigido a `/ideas`
5. Si el email NO está en la whitelist, verás un mensaje de error

**Nota**: La aplicación ya NO usa localhost. Siempre redirige a la URL de producción configurada en `NEXT_PUBLIC_SITE_URL`.

## Gestión de la Whitelist

### Ver todos los emails en la whitelist

```sql
SELECT email, reason, is_active, created_at
FROM whitelist
ORDER BY created_at DESC;
```

### Agregar un nuevo email

```sql
INSERT INTO whitelist (email, reason, is_active)
VALUES ('[email protected]', 'Nuevo miembro del equipo', true);
```

### Desactivar un email (sin eliminarlo)

```sql
UPDATE whitelist
SET is_active = false
WHERE email = '[email protected]';
```

### Reactivar un email

```sql
UPDATE whitelist
SET is_active = true
WHERE email = '[email protected]';
```

### Eliminar un email permanentemente

```sql
DELETE FROM whitelist
WHERE email = '[email protected]';
```

## Solución de Problemas

### Error: "unauthorized"

- El email no está en la whitelist
- Solución: Agrega el email usando el SQL de arriba

### Error: "auth-failed"

- Problema con la configuración de Google OAuth
- Verifica que el Client ID y Secret sean correctos
- Verifica que la URL de redirección sea correcta

### Error: "no-email"

- Google no proporcionó el email del usuario
- Verifica que hayas solicitado el scope correcto en Google Cloud Console

## Archivos Modificados

- `src/app/(auth)/login/page.tsx` - Botón de Google añadido
- `src/app/(auth)/signup/page.tsx` - Botón de Google añadido
- `src/app/auth/callback/route.ts` - Handler de callback OAuth (NUEVO)
- `src/lib/supabase/middleware.ts` - Validación de whitelist
- `src/lib/supabase/migrations/002_whitelist_system.sql` - Tabla de whitelist (NUEVA)

## Próximos Pasos Recomendados

1. **Panel de Administración**: Crear una interfaz en `/admin` para gestionar la whitelist
2. **Notificaciones**: Enviar email al admin cuando alguien intente acceder sin estar en whitelist
3. **Solicitudes de Acceso**: Permitir que usuarios soliciten ser añadidos a la whitelist
4. **Logs de Auditoría**: Registrar intentos de acceso no autorizados
