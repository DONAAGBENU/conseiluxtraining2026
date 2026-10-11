import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { Bold, Italic, List } from 'lucide-react'

export interface FormationSection {
  title: string
  content: string
}

export function normalizeFormationSections(value: unknown): FormationSection[] {
  if (!Array.isArray(value)) return []

  const sections = value.flatMap((item): FormationSection[] => {
    if (typeof item === 'string' && item.trim()) {
      return [{ title: 'Points forts', content: `- ${item.trim()}` }]
    }
    if (item && typeof item === 'object') {
      const section = item as Partial<FormationSection>
      if (typeof section.title === 'string' || typeof section.content === 'string') {
        return [{
          title: typeof section.title === 'string' ? section.title : '',
          content: typeof section.content === 'string' ? section.content : '',
        }]
      }
    }
    return []
  })

  const legacySections = sections.filter((section) => section.title === 'Points forts')
  const otherSections = sections.filter((section) => section.title !== 'Points forts')
  if (legacySections.length > 1) {
    return [
      { title: 'Points forts', content: legacySections.map((section) => section.content).join('\n') },
      ...otherSections,
    ]
  }
  return sections
}

function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let cursor = 0
  let plainTextStart = 0

  while (cursor < text.length) {
    const marker = text.startsWith('**', cursor)
      ? '**'
      : text[cursor] === '*' || text[cursor] === '_'
        ? text[cursor]
        : null

    if (!marker) {
      cursor += 1
      continue
    }

    let closingMarker = text.indexOf(marker, cursor + marker.length)
    while (
      marker === '*' &&
      closingMarker !== -1 &&
      (text[closingMarker - 1] === '*' || text[closingMarker + 1] === '*')
    ) {
      closingMarker = text.indexOf(marker, closingMarker + marker.length)
    }

    if (closingMarker === -1) {
      cursor += marker.length
      continue
    }

    if (cursor > plainTextStart) {
      nodes.push(<span key={`text-${nodes.length}`}>{text.slice(plainTextStart, cursor)}</span>)
    }

    const children = renderInline(text.slice(cursor + marker.length, closingMarker))
    nodes.push(marker === '**'
      ? <strong key={`bold-${nodes.length}`}>{children}</strong>
      : <em key={`italic-${nodes.length}`}>{children}</em>)
    cursor = closingMarker + marker.length
    plainTextStart = cursor
  }

  if (plainTextStart < text.length) {
    nodes.push(<span key={`text-${nodes.length}`}>{text.slice(plainTextStart)}</span>)
  }
  return nodes
}

export function RichTextInline({ text }: { text: string }) {
  return <>{renderInline(text)}</>
}

export function RichText({ content, className = '' }: { content: string; className?: string }) {
  const blocks: ReactNode[] = []
  const lines = content.split('\n')
  let listItems: string[] = []

  const flushList = () => {
    if (!listItems.length) return
    blocks.push(
      <ul key={`list-${blocks.length}`} className="list-disc space-y-1 pl-5">
        {listItems.map((item, index) => <li key={index}>{renderInline(item)}</li>)}
      </ul>
    )
    listItems = []
  }

  lines.forEach((line) => {
    const bullet = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.+)$/)
    if (bullet) {
      listItems.push(bullet[1])
      return
    }

    flushList()
    blocks.push(
      <p key={`paragraph-${blocks.length}`}>
        {line.trim() ? renderInline(line) : <br />}
      </p>
    )
  })
  flushList()

  return <div className={`space-y-2 ${className}`}>{blocks}</div>
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineMarkdownToHtml(text: string): string {
  let html = ''
  let cursor = 0
  let plainTextStart = 0

  while (cursor < text.length) {
    const marker = text.startsWith('**', cursor)
      ? '**'
      : text[cursor] === '*' || text[cursor] === '_'
        ? text[cursor]
        : null

    if (!marker) {
      cursor += 1
      continue
    }

    let closingMarker = text.indexOf(marker, cursor + marker.length)
    while (
      marker === '*' &&
      closingMarker !== -1 &&
      (text[closingMarker - 1] === '*' || text[closingMarker + 1] === '*')
    ) {
      closingMarker = text.indexOf(marker, closingMarker + marker.length)
    }

    if (closingMarker === -1) {
      cursor += marker.length
      continue
    }

    html += escapeHtml(text.slice(plainTextStart, cursor))
    const children = inlineMarkdownToHtml(text.slice(cursor + marker.length, closingMarker))
    html += marker === '**' ? `<strong>${children}</strong>` : `<em>${children}</em>`
    cursor = closingMarker + marker.length
    plainTextStart = cursor
  }

  return html + escapeHtml(text.slice(plainTextStart))
}

function markdownToHtml(content: string): string {
  if (!content) return ''

  const blocks: string[] = []
  const listItems: string[] = []
  const flushList = () => {
    if (!listItems.length) return
    blocks.push(`<ul>${listItems.map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`).join('')}</ul>`)
    listItems.length = 0
  }

  content.split('\n').forEach((line) => {
    const bullet = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.+)$/)
    if (bullet) {
      listItems.push(bullet[1])
      return
    }

    flushList()
    blocks.push(line ? `<div>${inlineMarkdownToHtml(line)}</div>` : '<div><br></div>')
  })
  flushList()
  return blocks.join('')
}

function htmlToMarkdown(editor: HTMLElement): string {
  const serializeInline = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent || ''
    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const element = node as HTMLElement
    const children = Array.from(element.childNodes).map(serializeInline).join('')
    switch (element.tagName) {
      case 'STRONG':
      case 'B':
        return `**${children}**`
      case 'EM':
      case 'I':
        return `_${children}_`
      case 'BR':
        return '\n'
      default:
        return children
    }
  }

  const blocks = Array.from(editor.childNodes).map((node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return serializeInline(node)

    const element = node as HTMLElement
    if (element.tagName === 'UL' || element.tagName === 'OL') {
      return Array.from(element.children)
        .filter((item) => item.tagName === 'LI')
        .map((item) => `- ${Array.from(item.childNodes).map(serializeInline).join('')}`)
        .join('\n')
    }
    return Array.from(element.childNodes).map(serializeInline).join('')
  })

  return blocks.join('\n').replace(/\n+$/, '')
}

export function RichTextEditor({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  rows?: number
  placeholder?: string
}) {
  const editorRef = useRef<HTMLDivElement>(null)
  const lastEmittedValue = useRef<string | null>(null)

  useEffect(() => {
    const editor = editorRef.current
    if (!editor) return
    if (lastEmittedValue.current === value) {
      lastEmittedValue.current = null
      return
    }
    if (htmlToMarkdown(editor) !== value) editor.innerHTML = markdownToHtml(value)
  }, [value])

  const syncValue = () => {
    const editor = editorRef.current
    if (!editor) return
    const nextValue = htmlToMarkdown(editor)
    lastEmittedValue.current = nextValue === value ? null : nextValue
    if (nextValue !== value) onChange(nextValue)
  }

  const applyCommand = (command: 'bold' | 'italic' | 'insertUnorderedList') => {
    editorRef.current?.focus()
    document.execCommand(command, false)
    syncValue()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 focus-within:ring-2 focus-within:ring-orange-500">
      <div className="flex gap-1 border-b border-slate-800 px-2 py-1">
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyCommand('bold')}
          aria-label="Gras"
          title="Gras"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyCommand('italic')}
          aria-label="Italique"
          title="Italique"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => applyCommand('insertUnorderedList')}
          aria-label="Liste à puces"
          title="Liste à puces"
          className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
        >
          <List className="h-4 w-4" />
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={syncValue}
        className="rich-text-editor w-full resize-y overflow-auto bg-transparent px-3.5 py-2.5 text-sm text-white outline-none"
        style={{ minHeight: `${rows * 24}px` }}
      />
    </div>
  )
}