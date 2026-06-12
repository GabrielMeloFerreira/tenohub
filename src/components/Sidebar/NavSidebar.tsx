'use client'

import { Group, Panel } from 'react-resizable-panels'

import { View } from "@/types/sideBar";

import Image from "next/image";

import Button from "../ui/button/Button";
import UserSideBar from "./UserSideBar";
import InputText from "../ui/input-text/InputText";

import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader, SidebarProvider } from '../ui/sidebar';
import { NotebookText, Star, CheckSquare, Calendar, Plus, Settings } from 'lucide-react'

interface SidebarProps {
    view: View
    handleClick: (view: View) => void
    onSelectNewNote: () => void
}

export default function NavSidebar({ view, handleClick, onSelectNewNote }: SidebarProps) {

    const navItems = [
        {label: 'My notes', icon: NotebookText },
        {label: 'Todo', icon: CheckSquare},
        {label: 'Calendar', icon: Calendar}
    ]

    return (
        <>
        <SidebarProvider className='flex flex-col h-screen max-w-60 min-w-60 bg-bg-base overflow-hidden gap-20 mt-2 ml-2 mr-2'>
            <Sidebar className='flex flex-col gap-10 bg-bg-base'>
                <SidebarHeader className='bg-bg-base'>
                    <div className={`truncate flex items-center justify-start rounded-sm gap-2 transition`}>
                            <Image src="/pfp.jpg" alt="Profile Image" width={48} height={48} className='rounded-md object-cover shrink-0' />
                        <div className="flex flex-col text-sm">
                            <span>Gabriel de Melo Ferreira</span>
                            <span>Pro - 14 Dias restantes</span>
                        </div>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup/>
                    <SidebarGroup/>
                </SidebarContent>
                <SidebarFooter/>
            </Sidebar>
            </SidebarProvider>







            {/* <nav className='flex flex-col h-screen max-w-60 min-w-60 overflow-hidden bg-bg-base gap-20 mt-2 ml-2 mr-2'>
                <div className='flex flex-col gap-10'>
                    <UserSideBar onClick={() => handleClick('user')} isActive={view === 'user'} name={'Gabriel de Melo Ferreira'} photo='pfp.jpg' />
                    <InputText onClick={() => handleClick('notes')} isActive={view === 'search'} placeHolder='Search notes...' icon={<SearchIcon />} />
                </div>

                <div className='flex flex-col gap-5'>
                    <ul className='flex flex-col gap-5'>
                        <li><Button text='New note' onClick={onSelectNewNote} icon={<DescriptionIcon />}></Button></li>
                        <li><Button text='My notes' onClick={() => handleClick('notes')} isActive={view === 'notes'} icon={<NotesIcon />}></Button></li>
                        <li><Button text='To-do' onClick={() => handleClick('todo')} isActive={view === 'todo'} icon={<TaskAltIcon />}></Button></li>
                        <li><Button text='Calendar' onClick={() => handleClick('calendar')} isActive={view === 'calendar'} icon={<CalendarMonthIcon />}></Button></li>
                    </ul>
                    <div>
                        <p className='text-white text-sm'>Recents</p>
                    </div>
                </div>

                <div className='flex flex-col'>
                    <Button text='Settings' onClick={() => handleClick('settings')} isActive={view === 'settings'} icon={<SettingsIcon />}></Button>
                </div>
            </nav> */}
        </>
    )
}