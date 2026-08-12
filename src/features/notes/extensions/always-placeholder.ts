import { Extension, isNodeEmpty } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'

/**
 * Placeholder sempre visível nos blocos vazios (não depende de foco/seleção).
 * 1º bloco → "Título"; 2º bloco → "nota".
 */
export const AlwaysPlaceholder = Extension.create({
  name: 'alwaysPlaceholder',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('alwaysPlaceholder'),
        props: {
          decorations(state) {
            const { doc } = state
            const decos: ReturnType<typeof Decoration.node>[] = []
            let index = 0

            doc.forEach((node, offset) => {
              if (node.isTextblock && isNodeEmpty(node)) {
                const text = index === 0 ? 'Título' : index === 1 ? 'nota' : ''
                if (text) {
                  decos.push(
                    Decoration.node(offset, offset + node.nodeSize, {
                      class: 'is-empty',
                      'data-placeholder': text,
                    })
                  )
                }
              }
              index += 1
            })

            return DecorationSet.create(doc, decos)
          },
        },
      }),
    ]
  },
})
