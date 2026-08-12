import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

export const selectionHighlightKey = new PluginKey('selectionHighlight')

export const SelectionHighlight = Extension.create({
  name: 'selectionHighlight',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: selectionHighlightKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, old) {
            const meta = tr.getMeta(selectionHighlightKey)
            if (meta === null) return DecorationSet.empty
            if (meta && meta.from !== meta.to) {
              return DecorationSet.create(tr.doc, [
                Decoration.inline(meta.from, meta.to, { class: 'selection-highlight' }),
              ])
            }
            return old.map(tr.mapping, tr.doc)
          },
        },
        props: {
          decorations(state) {
            return selectionHighlightKey.getState(state)
          },
        },
      }),
    ]
  },
})
