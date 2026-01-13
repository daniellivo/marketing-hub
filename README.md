# Livo Content Platform 🚀

Sistema completo de gestión y generación de contenidos con AI para Livo, que permite crear artículos SEO/GEO optimizados desde ideas hasta publicación en Notion/Framer.

## ✨ Características Principales

- **📝 Gestión de Ideas**: Base de datos de ideas de contenido con priorización
- **🤖 Generación de Outlines**: AI genera estructura completa usando templates y knowledge base
- **💬 Comentarios Inline**: Sistema de comentarios tipo Notion para feedback colaborativo
- **✍️ Generación de Artículos**: AI escribe artículos completos considerando comentarios
- **🔄 Revisiones Iterativas**: Mejora contenido con AI basado en feedback
- **📤 Publicación Automática**: Push directo a Notion → Framer con un click

## 🛠 Stack Tecnológico

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI**: shadcn/ui, Radix UI, Tailwind CSS
- **Editor**: Tiptap (ProseMirror) con extensiones custom
- **Database**: Supabase (PostgreSQL + Auth + Real-time)
- **AI**: OpenRouter (Claude, GPT-4, etc.)
- **Integration**: Notion API
- **Deploy**: Vercel

## 🚀 Setup Rápido

### 1. Prerrequisitos

- Node.js 18+ instalado
- Cuenta de [Supabase](https://supabase.com)
- API Key de [OpenRouter](https://openrouter.ai)
- Integración de [Notion](https://www.notion.so/my-integrations)

### 2. Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
```

### 3. Configurar Supabase

1. Crear nuevo proyecto en [Supabase](https://app.supabase.com)
2. Copiar URL y keys del proyecto
3. Ejecutar migration en SQL Editor:
   - Copiar contenido de `src/lib/supabase/migrations/001_initial_schema.sql`
   - Pegar en SQL Editor y ejecutar

4. Habilitar Real-time:
   - Settings → Replication → Enable para `comments` y `comment_threads`

### 4. Configurar OpenRouter

1. Crear cuenta en [OpenRouter](https://openrouter.ai)
2. Crear API key y añadir créditos
3. Copiar key a `.env.local`

### 5. Configurar Notion

1. Crear integración en [Notion](https://www.notion.so/my-integrations)
2. Compartir database de contenidos con la integración
3. Copiar API key y database ID a `.env.local`

### 6. Sincronizar Knowledge Base y Templates

Antes de empezar a generar contenido, sincroniza los archivos de knowledge base y templates con Supabase:

```bash
# Sincronizar knowledge base
npm run sync:kb

# Sincronizar templates
npm run sync:templates

# O sincronizar todo de una vez
npm run sync:all
```

Ver [`scripts/README.md`](scripts/README.md) para más detalles.

### 7. Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) 🎉

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Rutas de autenticación
│   ├── (dashboard)/       # Rutas protegidas
│   └── api/               # API Routes
├── components/            # React Components
│   ├── ui/               # shadcn/ui components
│   ├── editor/           # Tiptap Editor
│   ├── comments/         # Sistema de comentarios
│   └── ...
├── lib/                  # Core libraries
│   ├── supabase/        # Database clients
│   ├── ai/              # OpenRouter + prompts
│   └── notion/          # Notion API
knowledge-base/           # Livo KB (company, SEO, GEO)
templates/                # Content templates
scripts/                  # Sync scripts
```

## 🔑 Variables de Entorno Requeridas

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenRouter AI
OPENROUTER_API_KEY=

# Notion
NOTION_API_KEY=
NOTION_DATABASE_ID=
```

Ver [`.env.example`](.env.example) para la lista completa.

## 📖 Flujo de Trabajo

1. **Crear Idea** → Define título, keywords, audiencia, template
2. **Generar Outline** → AI crea estructura (15-30s)
3. **Añadir Comentarios** → Feedback específico en secciones
4. **Generar Artículo** → AI escribe contenido completo (60-90s)
5. **Revisiones** → Mejora con AI basado en comentarios
6. **Publicar** → Push a Notion → Framer automáticamente

## 🤖 AI Features

- **Modelos**: Claude 3.5 Sonnet, GPT-4 Turbo, Claude 3 Opus
- **Prompts automáticos**: Combina KB + Templates + Comentarios
- **Optimización**: SEO y GEO integrados en generación

## 🚢 Deploy a Vercel

```bash
git push origin main
```

Conectar en [vercel.com](https://vercel.com) y configurar environment variables.

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tiptap Docs](https://tiptap.dev/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

Hecho con ❤️ por el equipo de Livo
