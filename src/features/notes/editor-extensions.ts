import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Placeholder from '@tiptap/extension-placeholder'

import { Callout } from './extensions/callout'
import { SelectionHighlight } from './extensions/selection-highlight'

export const editorExtensions = [
  StarterKit.configure({
    heading: { levels: [1, 2, 3] },
    link: {
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
    },
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
    alignments: ['left', 'center', 'right', 'justify'],
  }),
  Highlight,
  TaskList,
  TaskItem.configure({ nested: true }),
  Callout,
  SelectionHighlight,
  Placeholder.configure({
    showOnlyCurrent: false,
    placeholder: ({ node, editor }) =>
      editor.state.doc.firstChild === node ? 'Sem título' : '',
  }),
]
