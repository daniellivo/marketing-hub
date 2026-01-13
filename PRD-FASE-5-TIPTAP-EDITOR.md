# PRD: Fase 5 - Tiptap Editor Base

**Proyecto:** Livo Content Platform
**Fase:** 5 de 10
**Fecha:** 2026-01-12
**Autor:** Product Team
**Estado:** 🟡 Pendiente de Implementación

---

## 📋 Tabla de Contenidos

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Objetivos](#objetivos)
3. [Contexto y Motivación](#contexto-y-motivación)
4. [Alcance](#alcance)
5. [Requisitos Funcionales](#requisitos-funcionales)
6. [Requisitos Técnicos](#requisitos-técnicos)
7. [Especificaciones de Diseño](#especificaciones-de-diseño)
8. [Estructura de Archivos](#estructura-de-archivos)
9. [Casos de Uso](#casos-de-uso)
10. [Criterios de Aceptación](#criterios-de-aceptación)
11. [Riesgos y Mitigaciones](#riesgos-y-mitigaciones)
12. [Timeline Estimado](#timeline-estimado)

---

## 📝 Resumen Ejecutivo

Esta fase implementa el editor de texto enriquecido (WYSIWYG) basado en Tiptap para visualizar y editar **outlines** generados por AI. Es el componente central que conecta la generación de outlines (Fase 4) con el sistema de comentarios (Fase 6) y la generación de artículos (Fase 7).

**Entregables principales:**
- ✅ Editor Tiptap configurado con extensiones necesarias
- ✅ Toolbar de formateo con controles estándar
- ✅ Página de visualización de outlines
- ✅ Página de edición de outlines
- ✅ Componente reutilizable para outlines y artículos

---

## 🎯 Objetivos

### Objetivos Principales
1. **Visualizar outlines generados** en formato estructurado y legible
2. **Permitir edición** de outlines antes de generar artículos
3. **Establecer la base** para el sistema de comentarios (Fase 6)
4. **Componente reutilizable** para outlines y artículos

### Objetivos Secundarios
- Implementar auto-save para evitar pérdida de datos
- Experiencia de usuario fluida y moderna
- Soporte para múltiples formatos (JSON, HTML, Markdown)
- Fundación para colaboración en tiempo real (futuro)

### Métricas de Éxito
- ✅ El 100% de los outlines generados se pueden visualizar correctamente
- ✅ Los cambios se guardan automáticamente en < 2 segundos
- ✅ El editor carga en < 500ms
- ✅ Soporte para todos los elementos del outline (H2, H3, listas, negritas, etc.)

---

## 🔍 Contexto y Motivación

### Estado Actual
- ✅ **Fase 4 completada:** AI genera outlines en formato JSON estructurado
- ⏳ **Bloqueador:** No hay forma de visualizar/editar estos outlines
- 🔴 **Gap crítico:** Los usuarios no pueden revisar outlines antes de generar artículos

### Problema a Resolver
Los outlines generados por AI se guardan como JSON en la base de datos pero:
1. **No son legibles** para usuarios no técnicos
2. **No son editables** sin modificar JSON directamente
3. **No permiten comentarios** (necesario para Fase 6)
4. **Bloquean el flujo** completo de generación de contenido

### Solución Propuesta
Implementar **Tiptap**, un editor headless basado en ProseMirror que:
- ✅ Renderiza JSON estructurado como contenido visual
- ✅ Permite edición WYSIWYG intuitiva
- ✅ Soporta extensiones (comentarios, colaboración, etc.)
- ✅ Es compatible con React y Next.js
- ✅ Tiene excelente documentación y comunidad

### Por Qué Tiptap
| Criterio | Tiptap | Alternativas (Slate, Draft.js) |
|----------|--------|-------------------------------|
| **React Integration** | ✅ Excelente | ✅ Buena |
| **TypeScript** | ✅ Nativo | ⚠️ Parcial |
| **Extensibilidad** | ✅ Plugin system robusto | ⚠️ Más complejo |
| **Comentarios inline** | ✅ Soporte nativo (Marks) | ⚠️ Custom implementation |
| **Performance** | ✅ Optimizado | ⚠️ Variable |
| **Documentación** | ✅ Excelente | ⚠️ Limitada |
| **Mantenimiento** | ✅ Activo (2024) | ⚠️ Menos activo |

---

## 📦 Alcance

### ✅ Dentro del Alcance (IN SCOPE)

#### 1. Configuración de Tiptap
- Instalar y configurar extensiones base
- StarterKit (headings, bold, italic, lists, etc.)
- Extensiones adicionales: Highlight, Link, Placeholder
- Configuración de tema/estilos

#### 2. Componente TiptapEditor
- Componente React reutilizable
- Modo editable/solo lectura
- Props para contenido inicial y onChange
- Integración con Tailwind CSS
- Clases de estilo profesionales

#### 3. Editor Toolbar
- Botones de formato: Bold, Italic, Strike
- Selectores de heading (H1, H2, H3)
- Listas: Bullet list, Ordered list
- Undo/Redo
- Link inserción
- Diseño responsive

#### 4. Páginas de Outline
- **Listado de Outlines** (`/outlines/page.tsx`)
  - Tabla con filtros por status/idea
  - Ver outlines generados
  - Acciones: Ver, Editar, Eliminar

- **Visualización de Outline** (`/outlines/[id]/page.tsx`)
  - Editor en modo solo lectura
  - Metadata del outline (idea, template, fecha)
  - Botón "Editar Outline"
  - Botón "Generar Artículo" (deshabilitado por ahora)

- **Edición de Outline** (`/outlines/[id]/edit/page.tsx`)
  - Editor en modo editable
  - Auto-save con debounce (2 segundos)
  - Indicador de "Guardando..." / "Guardado"
  - Botón "Guardar Manualmente"

#### 5. Conversión de Datos
- **JSON → Tiptap:** Convertir outline JSON a formato Tiptap
- **Tiptap → JSON:** Guardar cambios del editor a JSON
- Utilidades de parsing y serialización

#### 6. API Endpoints
- `PATCH /api/outlines/[id]` - Actualizar contenido de outline
- `GET /api/outlines/[id]` - Obtener outline específico
- `GET /api/outlines` - Listar todos los outlines

### ❌ Fuera del Alcance (OUT OF SCOPE)

- ❌ Sistema de comentarios (Fase 6)
- ❌ Colaboración en tiempo real
- ❌ Generación de artículos desde outline (Fase 7)
- ❌ Export a Notion (Fase 9)
- ❌ Versionado de outlines
- ❌ Diff/comparación de versiones
- ❌ Imágenes o media embeds
- ❌ Tablas complejas
- ❌ Custom blocks (callouts, alerts, etc.)

---

## ⚙️ Requisitos Funcionales

### RF-1: Visualizar Outline Generado
**Como** usuario del sistema
**Quiero** ver el outline generado por AI en formato legible
**Para** revisar la estructura antes de generar el artículo completo

**Criterios:**
- ✅ El outline debe renderizarse con formato correcto (H2, H3, listas)
- ✅ Debe mostrar: título, introducción, secciones, FAQs, conclusión, CTA
- ✅ El contenido debe ser responsive
- ✅ Debe mostrar metadata: fecha generación, template usado, modelo AI

### RF-2: Editar Outline
**Como** usuario del sistema
**Quiero** editar el outline generado
**Para** ajustar estructura, agregar detalles o corregir información

**Criterios:**
- ✅ Puedo hacer clic en cualquier texto y editarlo
- ✅ Puedo aplicar formatos (bold, italic, links)
- ✅ Puedo cambiar niveles de heading
- ✅ Puedo agregar/eliminar secciones
- ✅ Los cambios se guardan automáticamente

### RF-3: Auto-Save
**Como** usuario del sistema
**Quiero** que mis cambios se guarden automáticamente
**Para** no perder trabajo si cierro la ventana accidentalmente

**Criterios:**
- ✅ Auto-save se dispara 2 segundos después de dejar de escribir
- ✅ Indicador visual muestra "Guardando..." durante el proceso
- ✅ Indicador cambia a "Guardado ✓" cuando completa
- ✅ Si hay error, muestra "Error al guardar" + retry automático

### RF-4: Toolbar de Formato
**Como** usuario del sistema
**Quiero** tener herramientas de formato fáciles de usar
**Para** aplicar estilos al contenido rápidamente

**Criterios:**
- ✅ Toolbar sticky (siempre visible al hacer scroll)
- ✅ Botones con tooltips descriptivos
- ✅ Estados activos visibles (texto seleccionado en negrita → botón highlighted)
- ✅ Atajos de teclado funcionan (Cmd+B, Cmd+I, etc.)

### RF-5: Conversión JSON ↔ Tiptap
**Como** sistema
**Quiero** convertir entre formato JSON de outline y formato Tiptap
**Para** almacenar y renderizar correctamente el contenido

**Criterios:**
- ✅ Conversión bidireccional sin pérdida de datos
- ✅ Manejo de estructura del outline (secciones, subsecciones, key_points)
- ✅ Preservar metadata (template_used, generation_metadata)
- ✅ Manejo de errores si JSON está corrupto

### RF-6: Navegación Entre Estados
**Como** usuario del sistema
**Quiero** navegar entre vista y edición fácilmente
**Para** cambiar entre modos según necesidad

**Criterios:**
- ✅ Botón "Editar" visible en modo visualización
- ✅ Botón "Cancelar" en modo edición (vuelve a vista sin guardar cambios)
- ✅ Botón "Guardar y Salir" en modo edición
- ✅ Confirmación si hay cambios sin guardar al salir

---

## 🔧 Requisitos Técnicos

### RT-1: Extensiones de Tiptap
```typescript
// Extensiones requeridas
- StarterKit (base)
  - Document
  - Paragraph
  - Text
  - Heading (levels: 1, 2, 3)
  - Bold
  - Italic
  - Strike
  - BulletList
  - OrderedList
  - ListItem
  - Code
  - CodeBlock
  - Blockquote
  - HorizontalRule
  - HardBreak
  - History (undo/redo)

- Highlight (resaltar texto)
- Link (enlaces)
- Placeholder (placeholder text)
```

### RT-2: Estructura de Datos

#### Outline JSON Schema (BD)
```typescript
interface OutlineContent {
  title: string
  introduction: string
  sections: Section[]
  faq: string[]
  conclusion: string
  cta: string
}

interface Section {
  h2: string
  h3s: string[]
  key_points: string[]
  notes?: string
}
```

#### Tiptap JSON Schema (Editor)
```typescript
interface TiptapDocument {
  type: 'doc'
  content: TiptapNode[]
}

interface TiptapNode {
  type: 'heading' | 'paragraph' | 'bulletList' | 'orderedList' | ...
  attrs?: Record<string, any>
  content?: TiptapNode[]
  marks?: Mark[]
  text?: string
}
```

### RT-3: Performance

| Métrica | Objetivo | Crítico |
|---------|----------|---------|
| **Primera renderización** | < 500ms | < 1s |
| **Respuesta de teclado** | < 16ms (60fps) | < 33ms (30fps) |
| **Auto-save latency** | < 200ms | < 500ms |
| **Tamaño de bundle** | < 100KB (editor) | < 200KB |

### RT-4: Compatibilidad
- ✅ Next.js 15+ (App Router)
- ✅ React 19+
- ✅ TypeScript 5+
- ✅ Navegadores: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- ✅ Mobile responsive (tablet y móvil)

### RT-5: Dependencias
```json
{
  "@tiptap/react": "^2.x", // Ya instalado
  "@tiptap/starter-kit": "^2.x",
  "@tiptap/extension-highlight": "^2.x",
  "@tiptap/extension-link": "^2.x",
  "@tiptap/extension-placeholder": "^2.x"
}
```

### RT-6: Estado y Gestión de Datos
- **Estado local:** React hooks (useState, useEditor)
- **Persistencia:** Auto-save a Supabase cada 2s
- **Optimistic updates:** UI actualiza antes de confirmar DB
- **Error handling:** Toast notifications para errores

---

## 🎨 Especificaciones de Diseño

### Componentes UI

#### 1. TiptapEditor Component
```
┌─────────────────────────────────────────┐
│ ┌─────────────────────────────────────┐ │
│ │  [B] [I] [S]  H1 H2 H3  • 1.  ↶ ↷  │ │ ← Toolbar
│ └─────────────────────────────────────┘ │
│                                         │
│  Título del Artículo                    │ ← H1
│                                         │
│  Introducción                           │ ← H2
│                                         │
│  Lorem ipsum dolor sit amet...          │ ← Paragraph
│                                         │
│  • Punto clave 1                        │ ← Bullet list
│  • Punto clave 2                        │
│                                         │
│  Sección Principal                      │ ← H2
│                                         │
│    Subsección A                         │ ← H3
│                                         │
│    Contenido de la subsección...        │
│                                         │
└─────────────────────────────────────────┘
```

#### 2. Página de Visualización
```
┌──────────────────────────────────────────────────────┐
│  ← Volver a Ideas                                    │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Outline: "10 Consejos para Enfermeras"             │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │ 📄 Idea Original                               │ │
│  │ Template: how-to-guide                         │ │
│  │ Generado: 12 Ene 2026, 10:30                   │ │
│  │ Modelo: claude-3.5-sonnet                      │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│  [Editar Outline]  [Generar Artículo] (disabled)    │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │   [Editor en modo solo lectura]                │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
└──────────────────────────────────────────────────────┘
```

#### 3. Página de Edición
```
┌──────────────────────────────────────────────────────┐
│  ← Cancelar                          Guardado ✓      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Editando: "10 Consejos para Enfermeras"            │
│                                                      │
│  ┌────────────────────────────────────────────────┐ │
│  │  [B] [I] [S]  H1 H2 H3  • 1.  ↶ ↷             │ │
│  └────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────┐ │
│  │                                                │ │
│  │   [Editor en modo editable]                    │ │
│  │   [Cursor parpadeando]                         │ │
│  │                                                │ │
│  └────────────────────────────────────────────────┘ │
│                                                      │
│           [Guardar Manualmente]  [Cancelar]          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Estilos y Tema

#### Colores
```css
/* Editor background */
--editor-bg: white;
--editor-border: #e5e7eb; /* gray-200 */

/* Toolbar */
--toolbar-bg: #f9fafb; /* gray-50 */
--toolbar-border: #e5e7eb;
--toolbar-button-hover: #e5e7eb;
--toolbar-button-active: #3b82f6; /* blue-500 */

/* Text */
--text-primary: #111827; /* gray-900 */
--text-secondary: #6b7280; /* gray-500 */

/* Focus */
--focus-ring: #3b82f6; /* blue-500 */
```

#### Tipografía
```css
/* Headings */
h1: text-3xl font-bold (30px)
h2: text-2xl font-semibold (24px)
h3: text-xl font-semibold (20px)

/* Body */
p: text-base leading-relaxed (16px, line-height: 1.625)

/* Lists */
ul/ol: ml-6, marker:text-gray-400
```

#### Espaciado
```css
/* Editor padding */
padding: 2rem (32px)

/* Element spacing */
headings: mb-4 mt-6
paragraphs: mb-4
lists: mb-4
```

### Estados Visuales

#### Toolbar Button
```css
/* Default */
bg-transparent, text-gray-600, hover:bg-gray-100

/* Active (formato aplicado) */
bg-blue-100, text-blue-600, border-blue-300

/* Disabled */
opacity-50, cursor-not-allowed
```

#### Auto-save Indicator
```css
/* Guardando */
🟡 "Guardando..." + spinner (text-yellow-600)

/* Guardado */
🟢 "Guardado ✓" (text-green-600)

/* Error */
🔴 "Error al guardar" (text-red-600)
```

---

## 📁 Estructura de Archivos

### Archivos a Crear

```
src/
├── lib/
│   └── editor/
│       ├── tiptap-config.ts          # Configuración de extensiones
│       ├── tiptap-utils.ts           # Utilidades (conversión, etc.)
│       └── outline-converter.ts      # JSON ↔ Tiptap conversión
│
├── components/
│   ├── editor/
│   │   ├── tiptap-editor.tsx         # Componente principal del editor
│   │   ├── editor-toolbar.tsx        # Toolbar de formato
│   │   ├── editor-menu-bar.tsx       # Menu bar (alternativa a toolbar)
│   │   └── auto-save-indicator.tsx   # Indicador de guardado
│   │
│   └── outlines/
│       ├── outline-card.tsx          # Card para listado
│       ├── outline-metadata.tsx      # Metadata display
│       └── outline-list.tsx          # Lista de outlines
│
└── app/
    └── (dashboard)/
        └── outlines/
            ├── page.tsx              # Listado de outlines
            ├── [id]/
            │   ├── page.tsx          # Visualización (readonly)
            │   └── edit/
            │       └── page.tsx      # Edición
            │
            └── api/
                └── outlines/
                    ├── route.ts      # GET /api/outlines
                    └── [id]/
                        └── route.ts  # PATCH /api/outlines/[id]
```

### Código de Referencia

#### `tiptap-config.ts`
```typescript
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc ml-6',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal ml-6',
      },
    },
  }),
  Highlight.configure({
    HTMLAttributes: {
      class: 'bg-yellow-100',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-600 underline hover:text-blue-800',
    },
  }),
  Placeholder.configure({
    placeholder: 'Comienza a escribir...',
  }),
]

export const editorProps = {
  attributes: {
    class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] px-8 py-6',
  },
}
```

#### `tiptap-editor.tsx`
```typescript
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { extensions, editorProps } from '@/lib/editor/tiptap-config'
import { EditorToolbar } from './editor-toolbar'

interface TiptapEditorProps {
  content?: any
  onChange?: (content: any) => void
  editable?: boolean
  placeholder?: string
}

export function TiptapEditor({
  content,
  onChange,
  editable = true,
  placeholder,
}: TiptapEditorProps) {
  const editor = useEditor({
    extensions,
    content,
    editable,
    editorProps,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getJSON())
    },
  })

  if (!editor) {
    return <div>Cargando editor...</div>
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm">
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
```

#### `outline-converter.ts`
```typescript
interface OutlineContent {
  title: string
  introduction: string
  sections: Section[]
  faq: string[]
  conclusion: string
  cta: string
}

interface Section {
  h2: string
  h3s: string[]
  key_points: string[]
  notes?: string
}

/**
 * Convierte outline JSON a formato Tiptap
 */
export function outlineToTiptap(outline: OutlineContent): any {
  const nodes = []

  // Título
  nodes.push({
    type: 'heading',
    attrs: { level: 1 },
    content: [{ type: 'text', text: outline.title }],
  })

  // Introducción
  if (outline.introduction) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Introducción' }],
    })
    nodes.push({
      type: 'paragraph',
      content: [{ type: 'text', text: outline.introduction }],
    })
  }

  // Secciones
  outline.sections.forEach((section) => {
    // H2
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: section.h2 }],
    })

    // H3s
    section.h3s?.forEach((h3) => {
      nodes.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: h3 }],
      })
    })

    // Key points
    if (section.key_points?.length > 0) {
      nodes.push({
        type: 'bulletList',
        content: section.key_points.map((point) => ({
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: point }],
            },
          ],
        })),
      })
    }

    // Notes
    if (section.notes) {
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: section.notes }],
      })
    }
  })

  // FAQ
  if (outline.faq?.length > 0) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Preguntas Frecuentes' }],
    })
    nodes.push({
      type: 'bulletList',
      content: outline.faq.map((question) => ({
        type: 'listItem',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: question }],
          },
        ],
      })),
    })
  }

  // Conclusión
  if (outline.conclusion) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Conclusión' }],
    })
    nodes.push({
      type: 'paragraph',
      content: [{ type: 'text', text: outline.conclusion }],
    })
  }

  // CTA
  if (outline.cta) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Llamada a la Acción' }],
    })
    nodes.push({
      type: 'paragraph',
      content: [{ type: 'text', text: outline.cta }],
    })
  }

  return {
    type: 'doc',
    content: nodes,
  }
}

/**
 * Convierte formato Tiptap de vuelta a outline JSON
 * (Más complejo - requiere parsing del documento)
 */
export function tiptapToOutline(tiptapDoc: any): OutlineContent {
  // Implementación compleja - parsing inverso
  // Por ahora, guardamos el JSON completo del editor
  // y mantenemos compatibilidad con estructura original

  // TODO: Implementar parsing completo
  return tiptapDoc as OutlineContent
}
```

---

## 📖 Casos de Uso

### UC-1: Ver Outline Generado

**Actor:** Usuario de contenido
**Precondición:** Outline fue generado exitosamente en Fase 4
**Flujo:**
1. Usuario navega a `/ideas/[id]`
2. Ve botón "Ver Outline" junto a "Generar Outline"
3. Hace clic en "Ver Outline"
4. Sistema redirige a `/outlines/[outline-id]`
5. Editor carga en modo solo lectura
6. Usuario puede scroll y leer el contenido
7. Usuario ve metadata (template, fecha, modelo AI)

**Postcondición:** Outline visualizado correctamente
**Flujos alternativos:**
- **3a.** Si outline no existe → Error 404
- **5a.** Si hay error de conversión → Mostrar JSON raw + error message

---

### UC-2: Editar Outline

**Actor:** Usuario de contenido
**Precondición:** Outline existe en BD
**Flujo:**
1. Usuario está en `/outlines/[id]` (vista)
2. Hace clic en botón "Editar Outline"
3. Sistema redirige a `/outlines/[id]/edit`
4. Editor carga en modo editable con contenido
5. Usuario hace cambios (agregar texto, cambiar headings, etc.)
6. Sistema guarda automáticamente cada 2 segundos
7. Indicador muestra "Guardado ✓"
8. Usuario hace clic en "Guardar y Salir"
9. Sistema redirige a vista de outline

**Postcondición:** Cambios guardados en BD
**Flujos alternativos:**
- **6a.** Error de red → Auto-retry 3 veces → Mostrar error
- **8a.** Usuario hace clic "Cancelar" → Confirmar pérdida de cambios no guardados

---

### UC-3: Aplicar Formato a Texto

**Actor:** Usuario de contenido
**Precondición:** Editor en modo edición
**Flujo:**
1. Usuario selecciona texto
2. Hace clic en botón "Bold" en toolbar
3. Texto se pone en negrita
4. Botón "Bold" se marca como activo
5. Auto-save se dispara
6. Usuario deselecciona texto
7. Botón vuelve a estado normal

**Postcondición:** Formato aplicado y guardado
**Flujos alternativos:**
- **2a.** Usuario usa atajo Cmd+B → Mismo resultado
- **3a.** Texto ya está en negrita → Se quita formato

---

### UC-4: Recuperar de Error de Auto-Save

**Actor:** Usuario de contenido
**Precondición:** Editor abierto, conexión intermitente
**Flujo:**
1. Usuario escribe contenido
2. Auto-save intenta guardar
3. Request falla (error de red)
4. Indicador muestra "Error al guardar 🔴"
5. Sistema reintenta después de 5 segundos
6. Segundo intento exitoso
7. Indicador muestra "Guardado ✓"

**Postcondición:** Datos guardados después de retry
**Flujos alternativos:**
- **5a.** Tres reintentos fallan → Mostrar toast "No se pudo guardar. Revisa tu conexión"
- **5b.** Usuario hace clic "Guardar manualmente" → Force save

---

## ✅ Criterios de Aceptación

### Criterios Funcionales

#### CA-1: Visualización
- [ ] El outline generado se renderiza correctamente con formato visual
- [ ] H1, H2, H3 tienen estilos diferenciados
- [ ] Listas (bullets, numbered) se muestran correctamente
- [ ] El contenido es responsive (mobile, tablet, desktop)
- [ ] Metadata del outline es visible (template, fecha, modelo)

#### CA-2: Edición
- [ ] Puedo hacer clic en cualquier parte del texto y editarlo
- [ ] Los cambios se reflejan inmediatamente en la UI
- [ ] Puedo usar toolbar para aplicar formatos
- [ ] Puedo usar atajos de teclado (Cmd+B, Cmd+I, Cmd+K)
- [ ] Undo/Redo funcionan correctamente

#### CA-3: Auto-Save
- [ ] Los cambios se guardan automáticamente después de 2 segundos de inactividad
- [ ] El indicador muestra el estado correcto (Guardando/Guardado/Error)
- [ ] Si hay error, el sistema reintenta automáticamente
- [ ] Los datos guardados persisten después de recargar la página

#### CA-4: Toolbar
- [ ] Todos los botones de la toolbar funcionan
- [ ] Los botones muestran estado activo cuando el formato está aplicado
- [ ] Los tooltips son descriptivos
- [ ] La toolbar es sticky (no desaparece al hacer scroll)

#### CA-5: Navegación
- [ ] El breadcrumb permite volver atrás
- [ ] El botón "Editar" funciona desde vista
- [ ] El botón "Cancelar" funciona desde edición (con confirmación si hay cambios)
- [ ] El botón "Guardar y Salir" guarda y redirige

### Criterios Técnicos

#### CA-6: Performance
- [ ] El editor carga en menos de 500ms
- [ ] No hay lag al escribir (60fps)
- [ ] El auto-save no bloquea la UI
- [ ] El bundle size del editor es menor a 150KB

#### CA-7: Conversión de Datos
- [ ] La conversión JSON → Tiptap preserva toda la información
- [ ] La conversión Tiptap → JSON es reversible
- [ ] Los errores de parsing se manejan gracefully
- [ ] El contenido corrupto no rompe la UI

#### CA-8: Compatibilidad
- [ ] Funciona en Chrome, Firefox, Safari, Edge
- [ ] Funciona en tablet (iPad)
- [ ] Funciona en móvil (iOS, Android)
- [ ] Todos los atajos de teclado funcionan en Mac y Windows

#### CA-9: Calidad de Código
- [ ] Componentes tienen tipos TypeScript completos
- [ ] No hay errores de ESLint
- [ ] No hay warnings de React en consola
- [ ] Código está documentado con JSDoc

---

## ⚠️ Riesgos y Mitigaciones

### Riesgo 1: Complejidad de Conversión JSON ↔ Tiptap
**Probabilidad:** Alta
**Impacto:** Alto
**Mitigación:**
- Empezar con conversión simple (solo texto y headings)
- Iterar agregando soporte para listas, formatos, etc.
- Crear tests unitarios para cada tipo de conversión
- Tener fallback: si conversión falla, mostrar JSON editable

### Riesgo 2: Performance con Outlines Largos
**Probabilidad:** Media
**Impacto:** Medio
**Mitigación:**
- Lazy load del editor (code splitting)
- Virtualización si outline tiene > 100 nodos
- Debounce en auto-save
- Optimistic updates para UX fluida

### Riesgo 3: Conflictos de Auto-Save
**Probabilidad:** Baja
**Impacto:** Alto (pérdida de datos)
**Mitigación:**
- Implementar versioning básico (guardar timestamp)
- Si hay conflicto (otra pestaña editó), mostrar warning
- Opción de "Ver cambios" antes de sobrescribir
- En futuro: implementar CRDTs para colaboración real

### Riesgo 4: Usuarios No Familiares con Editores WYSIWYG
**Probabilidad:** Media
**Impacto:** Bajo
**Mitigación:**
- Tooltips descriptivos en toolbar
- Placeholder text con instrucciones
- Video tutorial corto (opcional)
- Atajos de teclado visibles

### Riesgo 5: Dependencia de Tiptap (External Library)
**Probabilidad:** Baja
**Impacto:** Alto
**Mitigación:**
- Tiptap es bien mantenido y tiene buena trayectoria
- Encapsular en abstracción (fácil migrar si necesario)
- Mantener conversión a JSON agnóstica del editor
- Considerar self-hosting de CDN resources

---

## ⏱️ Timeline Estimado

### Desglose de Tareas

| # | Tarea | Estimación | Prioridad |
|---|-------|-----------|-----------|
| 1 | Setup: Instalar extensiones de Tiptap | 30 min | Alta |
| 2 | Crear `tiptap-config.ts` con extensiones | 1h | Alta |
| 3 | Crear componente `TiptapEditor` base | 2h | Alta |
| 4 | Crear `EditorToolbar` con botones básicos | 2h | Alta |
| 5 | Crear `AutoSaveIndicator` | 1h | Media |
| 6 | Implementar `outline-converter.ts` (JSON → Tiptap) | 3h | Alta |
| 7 | Implementar conversión inversa (Tiptap → JSON) | 2h | Media |
| 8 | Crear API route `PATCH /api/outlines/[id]` | 1h | Alta |
| 9 | Crear API route `GET /api/outlines` | 1h | Media |
| 10 | Crear página `/outlines` (listado) | 2h | Media |
| 11 | Crear componente `OutlineCard` para listado | 1h | Baja |
| 12 | Crear página `/outlines/[id]` (vista) | 2h | Alta |
| 13 | Crear página `/outlines/[id]/edit` (edición) | 3h | Alta |
| 14 | Implementar auto-save con debounce | 2h | Alta |
| 15 | Implementar error handling + retry | 1h | Media |
| 16 | Estilos y responsive design | 2h | Media |
| 17 | Testing manual de todos los flujos | 2h | Alta |
| 18 | Fix de bugs encontrados | 2h | Alta |
| 19 | Optimización de performance | 1h | Baja |
| 20 | Documentación en código | 1h | Baja |

### **Total Estimado: 28-32 horas**

### Fases de Implementación

#### **Sprint 1: Core Editor (8-10h)**
- Días 1-2
- Setup + TiptapEditor + Toolbar
- Conversión básica JSON → Tiptap
- Página de vista básica

#### **Sprint 2: Edición y Auto-Save (10-12h)**
- Días 3-4
- Página de edición
- Auto-save con debounce
- Error handling + retry
- API routes

#### **Sprint 3: Listado y Polish (8-10h)**
- Días 5-6
- Página de listado
- Estilos responsive
- Testing completo
- Bug fixes

---

## 📚 Referencias y Recursos

### Documentación Oficial
- [Tiptap Docs](https://tiptap.dev/docs)
- [Tiptap Examples](https://tiptap.dev/examples)
- [ProseMirror Guide](https://prosemirror.net/docs/guide/)
- [Next.js App Router](https://nextjs.org/docs/app)

### Ejemplos de Implementación
- [Tiptap React Example](https://tiptap.dev/examples/default)
- [Auto-save Pattern](https://tiptap.dev/docs/guides/collaborative-editing)
- [Custom Toolbar](https://tiptap.dev/docs/examples/formatting)

### Librerías Útiles
```bash
# Ya instaladas
@tiptap/react
@tiptap/starter-kit

# A instalar
@tiptap/extension-highlight
@tiptap/extension-link
@tiptap/extension-placeholder

# Útiles (opcional)
use-debounce  # Para auto-save
react-hot-toast  # Para notifications
```

---

## 📝 Notas Adicionales

### Decisiones de Diseño

**¿Por qué no usar Markdown como formato intermedio?**
- JSON es más estructurado y fácil de validar
- Tiptap JSON es el formato nativo del editor
- Markdown perdería información (metadata, atributos)
- En Fase 7 convertiremos a Markdown para artículos finales

**¿Por qué auto-save cada 2 segundos?**
- Balance entre frecuencia y carga del servidor
- Google Docs usa ~1-2 segundos
- Notion usa ~2-3 segundos
- Podemos ajustar basado en feedback

**¿Por qué no colaboración en tiempo real en esta fase?**
- Complejidad alta (requiere CRDTs o OT)
- Uso actual es single-user (un creator por outline)
- Se puede agregar en futuro con Supabase Realtime + Tiptap Collaboration

### Extensiones Futuras (Out of Scope)

**Fase 6:** Sistema de Comentarios
- CommentExtension (Tiptap Mark)
- Thread sidebar
- Real-time updates

**Fase 7:** Generación de Artículos
- Convertir outline + comments → prompt
- Generar artículo completo con AI
- Renderizar en mismo editor

**Fase 9:** Export a Notion
- Convertir Tiptap JSON → Notion blocks
- Publicar a workspace de Livo

---

## ✅ Checklist de Implementación

### Pre-Implementación
- [ ] Revisar y aprobar este PRD
- [ ] Confirmar que Fase 4 funciona correctamente
- [ ] Verificar que outlines se guardan en BD
- [ ] Preparar datos de prueba (3-5 outlines generados)

### Durante Implementación
- [ ] Crear branch `feature/phase-5-tiptap-editor`
- [ ] Seguir estructura de archivos propuesta
- [ ] Escribir código con TypeScript estricto
- [ ] Documentar funciones complejas
- [ ] Testear cada componente individualmente
- [ ] Testear flujo completo end-to-end

### Post-Implementación
- [ ] Todos los criterios de aceptación cumplidos
- [ ] No hay errores en consola
- [ ] Performance dentro de objetivos
- [ ] Código reviewed y aprobado
- [ ] PR merged a `main`
- [ ] Deploy a staging para testing
- [ ] Actualizar IMPLEMENTATION-ROADMAP.md

---

## 🎯 Definición de "Done"

Esta fase se considera **COMPLETADA** cuando:

1. ✅ **Funcionalidad completa:**
   - Puedo ver un outline generado en formato visual
   - Puedo editar el outline con toolbar y formatos
   - Los cambios se guardan automáticamente
   - Puedo navegar entre vista y edición

2. ✅ **Calidad técnica:**
   - No hay errores TypeScript
   - No hay warnings en consola
   - Performance cumple objetivos (< 500ms carga)
   - Código está documentado

3. ✅ **Testing:**
   - Todos los casos de uso funcionan
   - Probado en Chrome, Firefox, Safari
   - Probado en mobile/tablet
   - Auto-save funciona incluso con conexión inestable

4. ✅ **Documentación:**
   - README actualizado con instrucciones
   - Comentarios en código para lógica compleja
   - Roadmap actualizado

5. ✅ **Ready para Fase 6:**
   - El editor puede ser extendido con CommentExtension
   - La estructura permite agregar sidebar
   - El auto-save no interferirá con real-time

---

**Aprobado por:** [Pendiente]
**Fecha de aprobación:** [Pendiente]
**Start date:** [Pendiente]
**Target completion:** [Pendiente]
