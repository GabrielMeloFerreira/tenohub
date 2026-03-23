'use client'

import { View } from "@/types/sideBar";

import Button from "../ui/button/Button";
import UserSideBar from "../user/UserSideBar";
import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

interface SidebarProps {
    view: View
    handleClick: (view: View) => void
    onSelectNewNote: () => void
}

export default function Sidebar({ view, handleClick, onSelectNewNote }: SidebarProps) {

    return (
        <>
            <nav className='flex flex-col h-screen max-w-60 overflow-hidden bg-bg-base gap-28'>
                <div className='flex flex-col gap-2'>
                        <UserSideBar onClick={() => handleClick('user')} isActive={view==='user'} name="Gabriel de Melo Ferreira" photo="pfp.jpg"/>
                        <span>Search</span>

                </div>

                <div>
                    <ul>
                        <li><Button text='New note' onClick={onSelectNewNote} icon={<DescriptionIcon/> }></Button></li>
                        <li><Button text='My notes' onClick={() => handleClick('notes')} isActive={view === 'notes'} icon={<NotesIcon/> }></Button></li>
                        <li><Button text='To-do' onClick={() => handleClick('todo')} isActive={view === 'todo'} icon={<TaskAltIcon/> }></Button></li>
                        <li><Button text='Calendar' onClick={() => handleClick('calendar')} isActive={view === 'calendar'} icon={<CalendarMonthIcon/> }></Button></li>
                    </ul>
                </div>
            </nav>
        </>
    )
}