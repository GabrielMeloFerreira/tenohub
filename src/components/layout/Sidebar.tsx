import Button from "../ui/button/Button";


import DescriptionIcon from '@mui/icons-material/Description';
import NotesIcon from '@mui/icons-material/Notes';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

type View = 'notes' | 'todo' | 'calendar' | 'settings'

interface SidebarProps {
    view: View
    onSelectView: (view: View) => void
    onSelectNewNote: () => void
}

export default function Sidebar({ view, onSelectView, onSelectNewNote }: SidebarProps) {

    return (
        <>
            <nav className='flex-col h-screen w-screen overflow-hidden bg-bg-base'>
                <div>
                    <span>Usuario</span>
                </div>

                <div>
                    <span>Search</span>
                </div>

                <ul>
                    <li><Button text='New note' onClick={onSelectNewNote} icon={<DescriptionIcon/> }></Button></li>
                    <li><Button text='My notes' onClick={() => onSelectView('notes')} isActive={view === 'notes'} icon={<NotesIcon/> }></Button></li>
                    <li><Button text='To-do' onClick={() => onSelectView('todo')} isActive={view === 'todo'} icon={<TaskAltIcon/> }></Button></li>
                    <li><Button text='Calendar' onClick={() => onSelectView('calendar')} isActive={view === 'calendar'} icon={<CalendarMonthIcon/> }></Button></li>
                </ul>
            </nav>
        </>
    )
}