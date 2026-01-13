'use client'

/**
 * EditorToolbar Component
 * Formatting toolbar for the Tiptap editor
 */

import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link as LinkIcon,
} from 'lucide-react'

interface EditorToolbarProps {
  editor: Editor
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) {
    return null
  }

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
    title: string
  }) => (
    <Button
      type="button"
      onClick={onClick}
      variant={active ? 'default' : 'ghost'}
      size="sm"
      className="h-8 w-8 p-0"
      title={title}
    >
      {children}
    </Button>
  )

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-gray-50 sticky top-0 z-10">
      {/* Text formatting */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrita (Cmd+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Cursiva (Cmd+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          title="Tachado"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Headings */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Título 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Lists */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista con viñetas"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Deshacer (Cmd+Z)"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Rehacer (Cmd+Shift+Z)"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}
