'use client'

import { View } from "@/types/sideBar";

import Button from "../ui/button/Button";
import UserSideBar from "../user/UserSideBar";
import InputText from "../ui/input-text/InputText";
import SettingsIcon from '@mui/icons-material/Settings';

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
            <nav className='flex flex-col h-screen max-w-60 overflow-hidden bg-bg-base gap-20'>
                <div className='flex flex-col gap-10'>
                        <UserSideBar onClick={() => handleClick('user')} isActive={view==='user'} name="Gabriel de Melo Ferreira" photo="pfp.jpg"/>
                        <InputText onClick={() => handleClick('search')} isActive={view === 'search'} placeHolder="Search notes..."/>
                </div>

                <div className='flex flex-col gap-5'>
                    <ul className='flex flex-col gap-5'>
                        <li><Button text='New note' onClick={onSelectNewNote} icon={<DescriptionIcon />}></Button></li>
                        <li><Button text='My notes' onClick={() => handleClick('notes')} isActive={view==='notes'} icon={<NotesIcon />}></Button></li>
                        <li><Button text='To-do' onClick={() => handleClick('todo')} isActive={view==='todo'} icon={<TaskAltIcon />}></Button></li>
                        <li><Button text='Calendar' onClick={() => handleClick('calendar')} isActive={view==='calendar'} icon={<CalendarMonthIcon />}></Button></li>
                    </ul>
                    <div>
                        <p className='text-white text-sm'>Recents</p>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <Button text='Settings' onClick={() => handleClick('settings')} isActive={view==='settings'} icon={<SettingsIcon />}></Button>
                </div>
            </nav>
        </>
    )
}