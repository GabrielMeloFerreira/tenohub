'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import InputText from "../ui/input-text/InputText"
import ToolBar from "./ToolBar"
import './styles/NoteEditor.css'; 


export default function NoteEditor() {

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types:['heading', 'paragraph'],
        alignments:['left', 'center', 'right', 'justify']
      }),
    ],
    content: '',
    shouldRerenderOnTransaction: true,
    immediatelyRender: false
  })

  return (
    <div className='flex flex-col h-full w-full overflow-x-hidden'>
      <header>
        <div className='text-gray-400 text-sm gap-2 m-2'>Caminho</div>
        <div className='flex flex-col border-b-2 border-t-2 gap-3 text-white text-2xl m-2 justify-start items-center'>
          <InputText
            classNameDiv='flex justify-start mt-2 text-white text-4xl font-bold w-full'
            classNameInput='text-center text-clip'
            placeHolder='Page Title'
          />
          <div className='flex text-white text-2xl justify-center mb-2'>+ Add Tag</div>
        </div>
      </header>

      <ToolBar editor={editor} />

      <div className='flex-1 '>
        <EditorContent editor={editor} className='h-full p-4 text-white outline-none ' />
      </div>
    </div>
  )
}