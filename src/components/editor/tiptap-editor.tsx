'use client'

/**
 * TiptapEditor Component
 * Main rich text editor component with editable/readonly modes
 */

import { useEditor, EditorContent } from '@tiptap/react'
import { extensions, editorProps } from '@/lib/editor/tiptap-config'
import { EditorToolbar } from './editor-toolbar'

interface TiptapEditorProps {
  content?: any
  onChange?: (content: any) => void
  editable?: boolean
  placeholder?: string
  className?: string
}

export function TiptapEditor({
  content,
  onChange,
  editable = true,
  placeholder,
  className = '',
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
    return (
      <div className="flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando editor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg bg-white shadow-sm ${className}`}>
      {editable && <EditorToolbar editor={editor} />}
      <EditorContent editor={editor} />
    </div>
  )
}
