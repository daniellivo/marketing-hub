# 🗺️ Implementation Roadmap - Livo Content Platform

## 📊 Estado Actual del Proyecto

**Progreso General**: 60% completado (14/22 tareas)

### ✅ Completado (Fase 1 - Fundación)

- [x] Proyecto Next.js 14 + TypeScript + Tailwind
- [x] shadcn/ui configurado (16 componentes)
- [x] Dependencias instaladas (Supabase, Tiptap, Notion, etc.)
- [x] Estructura de carpetas profesional
- [x] Schema de base de datos completo (001_initial_schema.sql)
- [x] Variables de entorno (.env.example)
- [x] Clientes Supabase (browser, server, middleware)
- [x] Sistema de autenticación (login + protección de rutas)
- [x] Layout principal (sidebar + topbar)
- [x] Página de listado de ideas (básica)

### ✅ Completado (Fase 2 - CRUD de Ideas)

- [x] Componente de formulario con validación (Zod + React Hook Form)
- [x] Página de creación de ideas
- [x] Página de detalle de idea
- [x] Página de edición de idea
- [x] API routes completas (GET, POST, PATCH, DELETE)
- [x] Componente de acciones (editar/eliminar)

### ✅ Completado (Fase 3 - Knowledge Base Sync)

- [x] Script de sincronización de knowledge base
- [x] Script de sincronización de templates
- [x] NPM scripts (sync:kb, sync:templates, sync:all)
- [x] Documentación de scripts

### ✅ Completado (Fase 4 - AI Integration Core)

- [x] Cliente OpenRouter con manejo de errores
- [x] Prompt builder para outlines
- [x] Prompt builder para artículos
- [x] API route para generar outline
- [x] Componente UI para generar outline
- [x] Logging de generaciones en generation_history

---

## 🚧 Por Implementar (40% restante)

### **Fase 2: CRUD de Ideas** (3-4 horas estimadas)

#### Tarea 11: Implementar CRUD completo de Ideas

**Archivos a crear**:

1. **`src/app/(dashboard)/ideas/new/page.tsx`**
   - Formulario de creación de nueva idea
   - Campos: title, description, target_audience, job_category, template_type, keywords, priority
   - Validación con Zod
   - Server Action para guardar

2. **`src/app/(dashboard)/ideas/[id]/page.tsx`**
   - Página de detalle de idea
   - Mostrar información completa
   - Botón "Generar Outline" (deshabilitado por ahora)
   - Botón "Editar"

3. **`src/components/ideas/idea-form.tsx`**
   - Componente reutilizable para crear/editar
   - React Hook Form + Zod
   - Selects para audiences, jobs, templates
   - Input de keywords (array)
   - Select de priority

4. **`src/app/api/ideas/route.ts`**
   - GET: Listar ideas con filtros
   - POST: Crear nueva idea

5. **`src/app/api/ideas/[id]/route.ts`**
   - GET: Obtener idea por ID
   - PATCH: Actualizar idea
   - DELETE: Eliminar idea

**Ejemplo de implementación**:

```typescript
// src/components/ideas/idea-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const ideaSchema = z.object({
  title: z.string().min(10, 'Mínimo 10 caracteres'),
  description: z.string().optional(),
  target_audience: z.enum(['Healthcare Professionals', 'Healthcare Facilities', 'Industry']),
  job_category: z.enum(['All', 'Enfermería', 'TCAEs', 'Médicos']),
  template_type: z.enum(['pillar', 'how-to', 'listicle', 'case-study', 'comparison', 'thought-leadership']),
  keywords: z.array(z.string()).min(1, 'Al menos 1 keyword'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
})

export function IdeaForm({ initialData, onSubmit }) {
  const form = useForm({
    resolver: zodResolver(ideaSchema),
    defaultValues: initialData || {
      priority: 'medium',
      keywords: [],
    },
  })

  return (
    <Form {...form}>
      {/* Form fields aquí */}
    </Form>
  )
}
```

---

### **Fase 3: Knowledge Base & Templates Sync** (2-3 horas)

#### Tarea 12: Scripts de Sincronización

**Archivos a crear**:

1. **`scripts/sync-knowledge-base.ts`**
   - Leer todos los archivos `.md` de `knowledge-base/`
   - Parsear frontmatter con `gray-matter`
   - Insertar en tabla `knowledge_base_files`
   - Ejecutable con: `tsx scripts/sync-knowledge-base.ts`

2. **`scripts/sync-templates.ts`**
   - Leer templates de `templates/`
   - Parsear estructura
   - Insertar en tabla `templates`

3. **Actualizar `package.json`**:
   ```json
   "scripts": {
     "sync:kb": "tsx scripts/sync-knowledge-base.ts",
     "sync:templates": "tsx scripts/sync-templates.ts",
     "sync:all": "npm run sync:kb && npm run sync:templates"
   }
   ```

**Ejemplo de implementación**:

```typescript
// scripts/sync-knowledge-base.ts
import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import matter from 'gray-matter'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function syncKnowledgeBase() {
  const kbPath = path.join(process.cwd(), 'knowledge-base')
  const categories = ['company', 'seo', 'geo', 'quality']

  for (const category of categories) {
    const categoryPath = path.join(kbPath, category)
    if (!fs.existsSync(categoryPath)) continue

    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))

    for (const file of files) {
      const filePath = path.join(categoryPath, file)
      const fileContent = fs.readFileSync(filePath, 'utf-8')
      const { content, data } = matter(fileContent)

      await supabase.from('knowledge_base_files').upsert({
        file_path: `${category}/${file}`,
        file_type: category,
        file_name: file,
        content: content,
        last_synced: new Date().toISOString(),
      }, {
        onConflict: 'file_path'
      })

      console.log(`✓ Synced: ${category}/${file}`)
    }
  }

  console.log('✅ Knowledge base sync complete!')
}

syncKnowledgeBase()
```

**Dependencias a instalar**:
```bash
npm install -D tsx gray-matter @types/node
```

---

### **Fase 4: AI Integration - Core** (4-5 horas)

#### Tarea 13: Implementar Prompt Builder

**Archivos a crear**:

1. **`src/lib/ai/prompt-builder.ts`**
   - `buildOutlinePrompt(idea, template, kbFiles)`
   - `buildArticlePrompt(outline, comments, kbFiles)`
   - `buildRevisionPrompt(article, comments)`

**Estructura**:

```typescript
// src/lib/ai/prompt-builder.ts
import { createClient } from '@/lib/supabase/server'

export async function buildOutlinePrompt(
  idea: ContentIdea,
  template: Template,
  kbFiles: KnowledgeBaseFile[]
) {
  const prompt = `
# CONTEXT
You are an expert SEO/GEO content strategist creating content for Livo, a healthcare staffing marketplace.

## Company Information
${kbFiles.filter(f => f.file_type === 'company').map(f => f.content).join('\n\n')}

## SEO Guidelines
${kbFiles.filter(f => f.file_type === 'seo').map(f => f.content).join('\n\n')}

## GEO Guidelines
${kbFiles.filter(f => f.file_type === 'geo').map(f => f.content).join('\n\n')}

## Template Structure
${template.content}

# TASK
Generate a detailed content outline for the following idea:

**Title**: ${idea.title}
**Description**: ${idea.description || 'No description provided'}
**Target Audience**: ${idea.target_audience}
**Job Category**: ${idea.job_category}
**Keywords**: ${idea.keywords.join(', ')}

# REQUIREMENTS
1. Follow the template structure exactly
2. Apply all SEO and GEO principles from the guidelines
3. Use Livo's tone and voice (professional, empathetic, data-driven)
4. Include specific references to Livo products (Livo Pool, Livo Offers, Livo Interno)
5. Optimize for the target keywords
6. Structure: H2s, H3s, bullet points, key messages
7. Include FAQ section ideas
8. Suggest internal linking opportunities

# OUTPUT FORMAT
Return a JSON object with this structure:
{
  "title": "SEO-optimized title",
  "introduction": "Key points for intro",
  "sections": [
    {
      "h2": "Section title",
      "h3s": ["Subsection 1", "Subsection 2"],
      "key_points": ["Point 1", "Point 2"],
      "notes": "Additional context"
    }
  ],
  "faq": ["Question 1?", "Question 2?"],
  "conclusion": "Key takeaways",
  "cta": "Suggested call to action"
}

Generate the outline now:
`

  return prompt
}

export async function getRelevantKBFiles() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('knowledge_base_files')
    .select('*')
  return data || []
}

export async function getTemplate(templateType: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('templates')
    .select('*')
    .eq('template_type', templateType)
    .single()
  return data
}
```

#### Tarea 14: Implementar OpenRouter Client

**Archivos a crear**:

1. **`src/lib/ai/openrouter.ts`**
   - Cliente para OpenRouter API
   - Soporte para streaming
   - Manejo de errores

```typescript
// src/lib/ai/openrouter.ts
export async function generateContent(
  prompt: string,
  options: {
    model?: string
    maxTokens?: number
    temperature?: number
    stream?: boolean
  } = {}
) {
  const {
    model = process.env.OPENROUTER_DEFAULT_MODEL || 'anthropic/claude-3.5-sonnet',
    maxTokens = 4000,
    temperature = 0.7,
    stream = false,
  } = options

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.OPENROUTER_APP_URL || '',
      'X-Title': process.env.OPENROUTER_APP_TITLE || 'Livo Content Platform',
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature,
      stream,
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.statusText}`)
  }

  if (stream) {
    return response.body // Return ReadableStream
  }

  const data = await response.json()
  return data.choices[0].message.content
}
```

2. **`src/app/api/ideas/[id]/generate-outline/route.ts`**
   - Endpoint para generar outline
   - Recuperar idea, template, KB
   - Llamar OpenRouter
   - Guardar resultado en `outlines`

```typescript
// src/app/api/ideas/[id]/generate-outline/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildOutlinePrompt, getRelevantKBFiles, getTemplate } from '@/lib/ai/prompt-builder'
import { generateContent } from '@/lib/ai/openrouter'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const startTime = Date.now()

  try {
    // 1. Get idea
    const { data: idea, error: ideaError } = await supabase
      .from('content_ideas')
      .select('*')
      .eq('id', params.id)
      .single()

    if (ideaError || !idea) {
      return NextResponse.json({ error: 'Idea not found' }, { status: 404 })
    }

    // 2. Get template
    const template = await getTemplate(idea.template_type)
    if (!template) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 })
    }

    // 3. Get knowledge base
    const kbFiles = await getRelevantKBFiles()

    // 4. Build prompt
    const prompt = await buildOutlinePrompt(idea, template, kbFiles)

    // 5. Generate with AI
    const aiResponse = await generateContent(prompt, {
      model: 'anthropic/claude-3.5-sonnet',
      maxTokens: 4000,
      temperature: 0.7,
    })

    // 6. Parse JSON response
    const outlineContent = JSON.parse(aiResponse)

    // 7. Save to database
    const { data: outline, error: outlineError } = await supabase
      .from('outlines')
      .insert({
        idea_id: idea.id,
        content: outlineContent,
        template_used: idea.template_type,
        generation_metadata: {
          model: 'anthropic/claude-3.5-sonnet',
          prompt_length: prompt.length,
          response_length: aiResponse.length,
        },
        status: 'draft',
      })
      .select()
      .single()

    if (outlineError) {
      throw new Error(outlineError.message)
    }

    // 8. Log generation
    await supabase.from('generation_history').insert({
      operation_type: 'outline_generation',
      input_data: { idea_id: idea.id },
      output_data: { outline_id: outline.id },
      ai_model: 'anthropic/claude-3.5-sonnet',
      duration_ms: Date.now() - startTime,
      success: true,
    })

    // 9. Update idea status
    await supabase
      .from('content_ideas')
      .update({ status: 'outline-ready' })
      .eq('id', idea.id)

    return NextResponse.json({ outline })
  } catch (error) {
    console.error('Error generating outline:', error)

    // Log error
    await supabase.from('generation_history').insert({
      operation_type: 'outline_generation',
      input_data: { idea_id: params.id },
      ai_model: 'anthropic/claude-3.5-sonnet',
      duration_ms: Date.now() - startTime,
      success: false,
      error_message: error instanceof Error ? error.message : 'Unknown error',
    })

    return NextResponse.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    )
  }
}
```

3. **`src/components/ideas/generate-outline-button.tsx`**
   - Botón con loading state
   - Llamar API
   - Redirect a outline cuando termine

---

### **Fase 5: Tiptap Editor Base** (3-4 horas)

#### Tarea 15: Crear TiptapEditor

**Archivos a crear**:

1. **`src/lib/editor/tiptap-config.ts`**
   - Configuración de extensiones base

```typescript
// src/lib/editor/tiptap-config.ts
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Highlight,
  Placeholder.configure({
    placeholder: 'Comienza a escribir...',
  }),
  Link.configure({
    openOnClick: false,
  }),
]
```

2. **`src/components/editor/tiptap-editor.tsx`**
   - Componente principal del editor
   - Toolbar
   - Estado de contenido

```typescript
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { extensions } from '@/lib/editor/tiptap-config'
import { EditorToolbar } from './editor-toolbar'

interface TiptapEditorProps {
  content?: any
  onChange?: (content: any) => void
  editable?: boolean
}

export function TiptapEditor({ content, onChange, editable = true }: TiptapEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] px-8 py-6',
      },
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg bg-white">
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
```

3. **`src/components/editor/editor-toolbar.tsx`**
   - Botones de formato
   - Bold, Italic, Heading, List, etc.

---

### **Fase 6: Sistema de Comentarios** (6-8 horas) ⭐ **MÁS COMPLEJO**

#### Tarea 16: CommentExtension para Tiptap

**Archivos a crear**:

1. **`src/lib/editor/extensions/comment.ts`**
   - Custom Tiptap Mark para comentarios
   - Plugin para manejar clicks
   - Decoraciones visuales

```typescript
// src/lib/editor/extensions/comment.ts
import { Mark } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

export const CommentExtension = Mark.create({
  name: 'comment',

  addAttributes() {
    return {
      threadId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-thread-id'),
        renderHTML: (attributes) => ({
          'data-thread-id': attributes.threadId,
          class: 'bg-yellow-100 cursor-pointer hover:bg-yellow-200 transition-colors',
        }),
      },
      resolved: {
        default: false,
      },
    }
  },

  parseHTML() {
    return [{ tag: 'span[data-thread-id]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('commentClick'),
        props: {
          handleClick(view, pos, event) {
            const { schema } = view.state
            const mark = schema.marks.comment
            const $pos = view.state.doc.resolve(pos)
            const marks = $pos.marks()
            const commentMark = marks.find((m) => m.type === mark)

            if (commentMark) {
              // Emit event to open comment thread
              const threadId = commentMark.attrs.threadId
              window.dispatchEvent(
                new CustomEvent('openCommentThread', {
                  detail: { threadId },
                })
              )
              return true
            }
            return false
          },
        },
      }),
    ]
  },
})
```

#### Tarea 17: UI de Comentarios

**Archivos a crear**:

1. **`src/components/comments/comments-sidebar.tsx`**
   - Lista de threads
   - Real-time subscriptions

2. **`src/components/comments/comment-thread.tsx`**
   - Thread individual con replies

3. **`src/components/comments/comment-form.tsx`**
   - Form para nuevo comentario

4. **`src/app/api/comments/route.ts`**
   - POST: Crear comentario
   - GET: Listar comentarios

---

### **Fase 7: Generación de Artículos** (4-5 horas)

#### Tarea 18: Generate Article from Outline

**Archivos a crear**:

1. **`src/app/api/outlines/[id]/generate-article/route.ts`**
   - Recuperar outline + comments
   - Construir prompt con feedback
   - Generar artículo completo
   - Convertir markdown → Tiptap JSON
   - Guardar en `articles`

2. **`src/lib/ai/markdown-to-tiptap.ts`**
   - Parser de markdown a formato Tiptap

```typescript
import { marked } from 'marked'

export function markdownToTiptap(markdown: string) {
  // Parse markdown to HTML
  const html = marked(markdown)

  // Convert HTML to Tiptap JSON
  // (usar DOMParser o similar)

  return tiptapJSON
}
```

---

### **Fase 8: Editor de Artículos** (3-4 horas)

#### Tarea 19: Article Editor Page

**Archivos a crear**:

1. **`src/app/(dashboard)/articles/page.tsx`**
   - Lista de artículos
   - Filtros por status, category

2. **`src/app/(dashboard)/articles/[id]/page.tsx`**
   - TiptapEditor con contenido
   - CommentsSidebar
   - Metadata form

3. **`src/components/articles/article-meta-form.tsx`**
   - Title, slug, meta_description
   - Category, job, tags, keywords
   - Auto-save con debounce

---

### **Fase 9: Notion Integration** (3-4 horas)

#### Tarea 20: Notion Client

**Archivos a crear**:

1. **`src/lib/notion/client.ts`**
   - Cliente Notion API
   - `publishArticle(articleId, databaseId)`

2. **`src/lib/notion/converters.ts`**
   - `tiptapToNotionBlocks(tiptapJSON)`
   - Convertir cada tipo de nodo

3. **`src/app/api/articles/[id]/publish-to-notion/route.ts`**
   - Validar artículo
   - Convertir formato
   - Llamar Notion API
   - Guardar `notion_page_id`

```typescript
// src/lib/notion/converters.ts
export function tiptapToNotionBlocks(tiptapJSON: any): any[] {
  const blocks: any[] = []

  tiptapJSON.content?.forEach((node: any) => {
    switch (node.type) {
      case 'heading':
        blocks.push({
          type: `heading_${node.attrs.level}`,
          [`heading_${node.attrs.level}`]: {
            rich_text: [{ text: { content: extractText(node) } }],
          },
        })
        break

      case 'paragraph':
        blocks.push({
          type: 'paragraph',
          paragraph: {
            rich_text: convertTextToRichText(node.content),
          },
        })
        break

      case 'bulletList':
        node.content.forEach((item: any) => {
          blocks.push({
            type: 'bulleted_list_item',
            bulleted_list_item: {
              rich_text: convertTextToRichText(item.content[0].content),
            },
          })
        })
        break

      // ... más tipos
    }
  })

  return blocks
}
```

---

### **Fase 10: Testing & Polish** (2-3 horas)

#### Tarea 21: Settings Pages

**Archivos a crear**:

1. **`src/app/(dashboard)/settings/page.tsx`**
   - Dashboard de settings

2. **`src/app/(dashboard)/settings/knowledge-base/page.tsx`**
   - Ver KB files sincronizados
   - Botón para re-sync

3. **`src/app/(dashboard)/settings/notion/page.tsx`**
   - Test de conexión
   - Ver últimas publicaciones

#### Tarea 22: Testing End-to-End

**Flujo completo a testear**:

1. Login → Dashboard
2. Crear idea → Guardar
3. Generar outline → Revisar
4. Añadir comentarios → Guardar
5. Generar artículo → Revisar
6. Añadir más comentarios → Solicitar revisión
7. Completar metadata → Publicar a Notion
8. Verificar en Notion → Verificar en Framer

---

## 🎯 Orden de Implementación Recomendado

### Semana 1: Core Features (32-40 horas)

**Día 1-2**: CRUD de Ideas + Formularios (6-8h)
- Crear/editar ideas
- Validación
- API endpoints

**Día 3**: Knowledge Base Sync (4h)
- Scripts de sincronización
- Verificar datos en Supabase

**Día 4-5**: AI Integration Base (8-10h)
- Prompt builder
- OpenRouter client
- Generate outline endpoint
- UI para trigger generación

**Día 6-7**: Tiptap Editor Base (6-8h)
- Editor component
- Toolbar
- Página de outline viewer

### Semana 2: Features Avanzados (32-40 horas)

**Día 8-10**: Sistema de Comentarios (12-16h) ⚠️ **COMPLEJO**
- CommentExtension
- Comments UI
- Real-time
- API endpoints

**Día 11-12**: Generación de Artículos (8-10h)
- Generate article endpoint
- Markdown to Tiptap
- Article editor page

**Día 13-14**: Notion Integration (6-8h)
- Notion client
- Converters
- Publish endpoint

**Día 15**: Testing & Polish (4-6h)
- Settings pages
- Testing end-to-end
- Bug fixes

---

## 📋 Checklist de Verificación

Antes de considerar cada fase completa:

### CRUD de Ideas ✅
- [ ] Puedes crear una idea nueva
- [ ] Puedes editar una idea existente
- [ ] Puedes eliminar una idea
- [ ] La validación funciona correctamente
- [ ] Los selects muestran las opciones correctas
- [ ] Keywords se pueden añadir/remover

### Knowledge Base Sync ✅
- [ ] Script lee todos los archivos .md
- [ ] Datos se insertan en Supabase
- [ ] Se puede re-ejecutar sin duplicados
- [ ] Templates también se sincronizan

### AI - Outline Generation ✅
- [ ] Botón "Generar Outline" funciona
- [ ] Loading state visible
- [ ] Outline se guarda en DB
- [ ] Outline se muestra correctamente
- [ ] Status de idea se actualiza

### Tiptap Editor ✅
- [ ] Editor carga correctamente
- [ ] Toolbar funciona (bold, italic, etc.)
- [ ] Contenido se guarda
- [ ] Editor es responsive

### Sistema de Comentarios ✅
- [ ] Puedes seleccionar texto
- [ ] Modal de comentario se abre
- [ ] Comentario se guarda con posición
- [ ] Highlight amarillo aparece
- [ ] Sidebar muestra comentarios
- [ ] Real-time funciona
- [ ] Puedes resolver comentarios

### Generación de Artículos ✅
- [ ] Outline + comments se usan en prompt
- [ ] Artículo se genera completamente
- [ ] Markdown → Tiptap funciona
- [ ] Artículo se guarda correctamente
- [ ] Word count y reading time calculados

### Editor de Artículos ✅
- [ ] Lista de artículos funciona
- [ ] Editor carga con contenido
- [ ] Metadata form funciona
- [ ] Auto-save funciona
- [ ] Comentarios inline funcionan

### Notion Integration ✅
- [ ] Conversión Tiptap → Notion correcta
- [ ] Propiedades se mapean bien
- [ ] Publicación exitosa
- [ ] notion_page_id se guarda
- [ ] Link a Notion funciona

---

## 🚨 Puntos Críticos de Atención

### 1. **Sistema de Comentarios** (Más Complejo)

**Desafíos**:
- Mantener posición de comentarios cuando el contenido cambia
- Real-time subscriptions con Supabase
- UI/UX similar a Notion
- Performance con muchos comentarios

**Solución**:
- Usar ProseMirror positions (from/to)
- Store positions relativas, no absolutas
- Debounce para real-time updates
- Pagination para threads

### 2. **Conversión de Formatos**

**Desafíos**:
- Markdown → Tiptap JSON
- Tiptap JSON → Notion blocks
- Mantener formato (bold, italic, links)

**Solución**:
- Usar `marked` para markdown parsing
- Crear mapper completo de nodos
- Testear con múltiples tipos de contenido

### 3. **AI Prompts**

**Desafíos**:
- Construir prompts efectivos
- Manejar respuestas inconsistentes
- Costos de API

**Solución**:
- Iterar en prompts con ejemplos
- Parsear JSON con try/catch
- Usar modelos apropiados (Sonnet para calidad, Haiku para rápido)

### 4. **Performance**

**Desafíos**:
- Editor puede ser lento con mucho contenido
- Knowledge base grande
- Real-time con muchos usuarios

**Solución**:
- Lazy load editor
- Pagination en listas
- Debounce en auto-save
- Indexes en Supabase

---

## 💰 Estimación de Costos (Mensual)

Asumiendo 100 artículos/mes:

- **Vercel**: $0 - $20 (Free tier debería funcionar)
- **Supabase**: $0 - $25 (Free tier: 500MB, 2GB bandwidth)
- **OpenRouter**: $50 - $150
  - Outline: 1000 tokens × $0.003 = $0.003
  - Article: 4000 tokens × $0.015 = $0.06
  - 100 artículos = ~$6-10 (+ revisiones)
- **Notion**: $0 (ya tienen cuenta)

**Total**: $50 - $200/mes

---

## 📚 Recursos de Referencia

### Documentación Esencial

- **Next.js**: https://nextjs.org/docs
- **Supabase**: https://supabase.com/docs
- **Tiptap**: https://tiptap.dev/docs
- **OpenRouter**: https://openrouter.ai/docs
- **Notion API**: https://developers.notion.com
- **shadcn/ui**: https://ui.shadcn.com

### Ejemplos de Código

- **Tiptap Examples**: https://tiptap.dev/examples
- **Supabase Real-time**: https://supabase.com/docs/guides/realtime
- **Next.js Server Actions**: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions

### Librerías Útiles

```bash
# Ya instaladas
@supabase/supabase-js, @supabase/ssr
@tiptap/react, @tiptap/starter-kit
@notionhq/client
zod, react-hook-form

# Por instalar si necesario
date-fns         # Formateo de fechas
slugify          # Generar slugs
marked           # Markdown parser
gray-matter      # Frontmatter parser
tsx              # Ejecutar TypeScript scripts
```

---

## 🎓 Tutoriales Recomendados (Si te atascas)

1. **Tiptap Custom Extensions**
   - https://tiptap.dev/docs/guides/custom-extensions
   - https://tiptap.dev/docs/examples/basics/collaborative-editing

2. **Supabase Real-time**
   - https://supabase.com/docs/guides/realtime/presence
   - https://supabase.com/docs/guides/realtime/postgres-changes

3. **Next.js 14 Patterns**
   - https://nextjs.org/docs/app/building-your-application/data-fetching/patterns
   - https://nextjs.org/docs/app/building-your-application/routing/middleware

4. **Notion API**
   - https://developers.notion.com/docs/create-a-notion-integration
   - https://developers.notion.com/reference/page

---

## 🏁 Conclusión

Has completado **45% del proyecto**. El trabajo más complejo que queda es:

1. **Sistema de Comentarios** (más difícil técnicamente)
2. **Conversión de formatos** (requiere testing extenso)
3. **AI Integration** (requiere iteración en prompts)

El resto son CRUDs y formularios relativamente estándar.

**Tiempo estimado para completar**: 60-80 horas de desarrollo

**Prioridad recomendada**:
1. CRUD de Ideas (para poder usar la app)
2. KB Sync (para tener datos)
3. AI Outline Generation (primera feature wow)
4. Todo lo demás en orden

¡Buena suerte! 🚀
