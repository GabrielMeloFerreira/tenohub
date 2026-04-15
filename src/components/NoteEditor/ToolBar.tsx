'use client'
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import AddLinkIcon from '@mui/icons-material/AddLink';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import Divider from '@mui/material/Divider';

import { getButtonClass, getStatelessButtonClass } from '@/utils/styles/toolbarStyles';


import { Editor } from '@tiptap/react'

interface ToolBarProps {
  editor: Editor | null
}

export default function ToolBar({ editor }: ToolBarProps) {

  if (!editor) return null

  return (
    <div className='flex sticky top-0 z-100 bg-black text-xl p-2 ml-2 gap-0.5'>
      <button onClick={() => editor.chain().focus().undo().run()} className={getStatelessButtonClass()}>
        <UndoIcon />
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} className={getStatelessButtonClass()}>
        <RedoIcon />
      </button>
      <Divider orientation='vertical' variant='middle' className='bg-white' flexItem/>
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={getButtonClass(editor.isActive('bold'))}>
        <FormatBoldIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={getButtonClass(editor.isActive('italic'))}>
        <FormatItalicIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={getButtonClass(editor.isActive('underline'))}>
        <FormatUnderlinedIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={getButtonClass(editor.isActive('strike'))}>
        <StrikethroughSIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleLink().run()} className={getStatelessButtonClass()}>
        <AddLinkIcon />
      </button>
      <Divider orientation='vertical' variant='middle' className='bg-white' flexItem/>
      <button onClick={() => editor.chain().focus().toggleTextAlign('left').run()} className={getStatelessButtonClass()}>
        <FormatAlignLeftIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleTextAlign('center').run()} className={getStatelessButtonClass()}>
        <FormatAlignCenterIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleTextAlign('right').run()} className={getStatelessButtonClass()}>
        <FormatAlignRightIcon />
      </button>
      <button onClick={() => editor.chain().focus().toggleTextAlign('justify').run()} className={getStatelessButtonClass()}>
        <FormatAlignJustifyIcon />
      </button>
    </div>
  )
}