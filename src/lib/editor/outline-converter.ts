/**
 * Outline Converter
 * Converts between Outline JSON format and Tiptap document format
 */

// Types for Outline structure
export interface OutlineContent {
  title: string
  introduction: string
  sections: Section[]
  faq: string[]
  conclusion: string
  cta: string
}

export interface Section {
  h2: string
  h3s: string[]
  key_points: string[]
  notes?: string
}

/**
 * Converts outline JSON to Tiptap document format
 */
export function outlineToTiptap(outline: OutlineContent): any {
  const nodes: any[] = []

  // Title (H1)
  if (outline.title) {
    nodes.push({
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: outline.title }],
    })
  }

  // Introduction
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

  // Sections
  outline.sections?.forEach((section) => {
    // Section title (H2)
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: section.h2 }],
    })

    // Subsections (H3s)
    section.h3s?.forEach((h3) => {
      nodes.push({
        type: 'heading',
        attrs: { level: 3 },
        content: [{ type: 'text', text: h3 }],
      })
    })

    // Key points (bullet list)
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

    // Notes (if any)
    if (section.notes) {
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: section.notes }],
      })
    }
  })

  // FAQ section
  if (outline.faq?.length > 0) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Preguntas Frecuentes (FAQ)' }],
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

  // Conclusion
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

  // Call to Action (CTA)
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
 * Converts Tiptap document back to Outline JSON
 * For now, we'll keep the Tiptap JSON format as-is for editing
 * This can be enhanced later for full bidirectional conversion
 */
export function tiptapToOutline(tiptapDoc: any): any {
  // For v1, we'll just store the Tiptap JSON directly
  // The original outline structure can be preserved in metadata
  return tiptapDoc
}
