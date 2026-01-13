/**
 * Tiptap Editor Configuration
 * Defines extensions and settings for the rich text editor
 */

import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'

/**
 * Tiptap extensions configuration
 */
export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
    bulletList: {
      HTMLAttributes: {
        class: 'list-disc ml-6 mb-4',
      },
    },
    orderedList: {
      HTMLAttributes: {
        class: 'list-decimal ml-6 mb-4',
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: 'mb-4',
      },
    },
  }),
  Highlight.configure({
    HTMLAttributes: {
      class: 'bg-yellow-100 rounded px-1',
    },
  }),
  Link.configure({
    openOnClick: false,
    HTMLAttributes: {
      class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
    },
  }),
  Placeholder.configure({
    placeholder: 'Comienza a escribir tu contenido aquí...',
  }),
]

/**
 * Editor props configuration for styling
 */
export const editorProps = {
  attributes: {
    class: 'prose prose-slate max-w-none focus:outline-none min-h-[500px] px-8 py-6',
  },
}
