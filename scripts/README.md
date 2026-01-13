# Sync Scripts

Scripts para sincronizar contenido local con Supabase.

## Prerequisitos

Asegúrate de tener configuradas las siguientes variables de entorno en tu archivo `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Nota:** Necesitas el `SUPABASE_SERVICE_ROLE_KEY` (no el `NEXT_PUBLIC_SUPABASE_ANON_KEY`) para poder escribir en la base de datos.

## Scripts Disponibles

### 1. Sync Knowledge Base

Sincroniza archivos markdown de `knowledge-base/` a la tabla `knowledge_base_files` en Supabase.

```bash
npm run sync:kb
```

**Estructura esperada:**
```
knowledge-base/
├── company/
│   ├── livo-brand-identity.md
│   ├── livo-competitors.md
│   └── ...
├── seo/
│   ├── seo-fundamentals.md
│   └── ...
├── geo/
│   ├── geo-principles.md
│   └── ...
└── quality/
    └── ...
```

### 2. Sync Templates

Sincroniza templates markdown de `templates/` a la tabla `templates` en Supabase.

```bash
npm run sync:templates
```

**Archivos esperados:**
- `template-pillar-content.md`
- `template-how-to-guide.md`
- `template-listicle.md`
- `template-case-study.md`
- `template-comparison.md`
- `template-thought-leadership.md`

### 3. Sync All

Ejecuta ambos scripts de sincronización en secuencia.

```bash
npm run sync:all
```

## Características

- **Upsert automático**: Si el archivo ya existe en la base de datos, se actualiza
- **Frontmatter support**: Extrae metadata del frontmatter YAML si existe
- **Error handling**: Reporta errores individuales sin detener el proceso completo
- **Progress feedback**: Muestra progreso detallado durante la sincronización
- **Timestamps**: Actualiza `last_synced` en cada sincronización

## Notas

- Los scripts usan `tsx` para ejecutar TypeScript directamente
- Los archivos se identifican por su `file_path` (knowledge base) o `template_type` (templates)
- El contenido se almacena sin el frontmatter (solo el contenido markdown)
- La metadata del frontmatter se guarda en el campo `metadata` (JSON)

## Troubleshooting

### Error: Missing environment variables

Verifica que tu archivo `.env.local` contenga las variables correctas y que estés ejecutando el script desde la raíz del proyecto.

### Error: Directory not found

Asegúrate de ejecutar los scripts desde la raíz del proyecto:

```bash
cd /path/to/livo-content-platform
npm run sync:kb
```

### Error: Permission denied

Si obtienes errores de permisos, verifica que el `SUPABASE_SERVICE_ROLE_KEY` sea correcto y tenga los permisos necesarios.
