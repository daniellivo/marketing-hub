/**
 * Outline Converter
 * Converts between Outline JSON format and Tiptap document format
 * Supports both new format (objects) and legacy format (strings) for backward compatibility
 */

// Types for Outline structure (new format)
export interface OutlineContent {
  title: string
  meta_description?: string
  introduction: {
    hook: string
    context: string
    key_points: string[]
  } | string  // Legacy format support
  sections: Section[]
  faq: FAQItem[] | string[]  // Legacy format support
  conclusion: {
    summary: string
    cta: string
    next_steps: string[]
  } | string  // Legacy format support
  cta?: string  // Legacy separate CTA field
  internal_linking?: InternalLink[]
  seo_notes?: SEONotes
}

export interface Section {
  h2: string
  h3s: string[]
  key_points: string[]
  notes?: string
}

export interface FAQItem {
  question: string
  answer_guidance: string
}

export interface InternalLink {
  anchor: string
  target: string
  section: string
}

export interface SEONotes {
  primary_keyword: string
  secondary_keywords: string[]
  keyword_density: string
  search_intent: string
}

/**
 * Converts outline JSON to Tiptap document format
 * Supports both new format (objects) and legacy format (strings) for backward compatibility
 */
export function outlineToTiptap(outline: OutlineContent | any): any {
  const nodes: any[] = []

  // Title (H1)
  if (outline.title) {
    nodes.push({
      type: 'heading',
      attrs: { level: 1 },
      content: [{ type: 'text', text: outline.title }],
    })
  }

  // Introduction - support both new (object) and legacy (string) formats
  if (outline.introduction) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Introducción' }],
    })

    // Check if it's the new format (object with hook/context/key_points)
    if (typeof outline.introduction === 'object' && !Array.isArray(outline.introduction)) {
      // NEW FORMAT
      // Hook (destacado)
      if (outline.introduction.hook) {
        nodes.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Hook' }],
        })
        nodes.push({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: outline.introduction.hook,
              marks: [{ type: 'bold' }],
            },
          ],
        })
      }

      // Context
      if (outline.introduction.context) {
        nodes.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Contexto' }],
        })
        nodes.push({
          type: 'paragraph',
          content: [{ type: 'text', text: outline.introduction.context }],
        })
      }

      // Key Points
      if (outline.introduction.key_points?.length > 0) {
        nodes.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Puntos Clave' }],
        })
        nodes.push({
          type: 'bulletList',
          content: outline.introduction.key_points.map((point: string) => ({
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
    } else {
      // LEGACY FORMAT (string)
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: String(outline.introduction) }],
      })
    }
  }

  // Sections
  outline.sections?.forEach((section: Section) => {
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

  // FAQ section - support both new (array of objects) and legacy (array of strings) formats
  if (outline.faq?.length > 0) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Preguntas Frecuentes (FAQ)' }],
    })

    // Check if first item is object (new format) or string (legacy format)
    const isNewFormat = typeof outline.faq[0] === 'object' && outline.faq[0].question

    if (isNewFormat) {
      // NEW FORMAT - Each FAQ item as Q&A format
      outline.faq.forEach((faqItem: FAQItem) => {
        // Question (bold)
        nodes.push({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `❓ ${faqItem.question}`,
              marks: [{ type: 'bold' }],
            },
          ],
        })

        // Answer guidance (normal text)
        if (faqItem.answer_guidance) {
          nodes.push({
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `💡 ${faqItem.answer_guidance}`,
              },
            ],
          })
        }

        // Add spacing between FAQ items
        nodes.push({
          type: 'paragraph',
          content: [],
        })
      })
    } else {
      // LEGACY FORMAT - Simple bullet list
      nodes.push({
        type: 'bulletList',
        content: outline.faq.map((question: string) => ({
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
  }

  // Conclusion - support both new (object) and legacy (string) formats
  if (outline.conclusion) {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Conclusión' }],
    })

    // Check if it's the new format (object with summary/cta/next_steps)
    if (typeof outline.conclusion === 'object' && !Array.isArray(outline.conclusion)) {
      // NEW FORMAT
      // Summary
      if (outline.conclusion.summary) {
        nodes.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Resumen' }],
        })
        nodes.push({
          type: 'paragraph',
          content: [{ type: 'text', text: outline.conclusion.summary }],
        })
      }

      // CTA (destacado con bold)
      if (outline.conclusion.cta) {
        nodes.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Llamada a la Acción' }],
        })
        nodes.push({
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: `🎯 ${outline.conclusion.cta}`,
              marks: [{ type: 'bold' }],
            },
          ],
        })
      }

      // Next Steps (numbered list)
      if (outline.conclusion.next_steps?.length > 0) {
        nodes.push({
          type: 'heading',
          attrs: { level: 3 },
          content: [{ type: 'text', text: 'Próximos Pasos' }],
        })
        nodes.push({
          type: 'orderedList',
          content: outline.conclusion.next_steps.map((step: string) => ({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text: step }],
              },
            ],
          })),
        })
      }
    } else {
      // LEGACY FORMAT (string)
      nodes.push({
        type: 'paragraph',
        content: [{ type: 'text', text: String(outline.conclusion) }],
      })
    }
  }

  // Legacy CTA field (separate from conclusion) - only if conclusion is not an object
  if (outline.cta && typeof outline.conclusion !== 'object') {
    nodes.push({
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'Llamada a la Acción' }],
    })
    nodes.push({
      type: 'paragraph',
      content: [{ type: 'text', text: String(outline.cta) }],
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
