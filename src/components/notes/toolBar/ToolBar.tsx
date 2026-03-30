import { RichTextProvider } from 'reactjs-tiptap-editor'
import { Document } from '@tiptap/extension-document'
import { Text } from '@tiptap/extension-text'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { HardBreak } from '@tiptap/extension-hard-break'
import { TextStyle } from '@tiptap/extension-text-style';
import { ListItem } from '@tiptap/extension-list';

import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history';
import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold'; 

import './styles/style.css'
 
import 'reactjs-tiptap-editor/style.css';

import { EditorContent, useEditor } from "@tiptap/react"

const extensions = [
  // Base Extensions
  Document,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  Paragraph,
  TrailingNode,
  ListItem,
  TextStyle,
  Placeholder.configure({
    placeholder: 'Press \'/\' for commands',
  }),
  History,
  Bold
];

const RichTextToolbar = () => {
  return (
    <div className="flex fixed w-full z-1 bg-base text-white">
      <RichTextUndo />
      <RichTextRedo />
      <RichTextBold />
    </div>
  )
}

export default function ToolBar() {
    const editor = useEditor({
        textDirection: 'auto',
        extensions,
        immediatelyRender: false
    })

    return (
        <>
            <div className='flex flex-col h-full w-full overflow-y-auto'>
                {editor && (
                    <RichTextProvider editor={editor}>
                        <RichTextToolbar />
                        <EditorContent className='bg-base text-white flex-1 overflow-y-auto w-full' editor={editor}/>
                    </RichTextProvider>
                )}
            </div>
        </>
    )
}