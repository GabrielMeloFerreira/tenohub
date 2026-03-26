import { ReactNode } from 'react';
import SearchIcon from '@mui/icons-material/Search';

interface InputTextProps {
    placeHolder: string;
    icon?: ReactNode
    isActive?: boolean;
    onClick: () => void;
}

export default function InputText ({ placeHolder, isActive = false, onClick }: InputTextProps) {

    const activeClass = isActive
    ? 'bg-transparent cursor-default'
    : 'hover:bg-buttons-hover active:bg-transparent';

    return (
        <div onClick={onClick} className={`flex items-center gap-2 rounded-sm transition h-7 ${activeClass}`}>
            <SearchIcon className='text-sm text-white'/>
            <input type='text' name='search' placeholder={placeHolder} className='text-sm bg-transparent outline-none text-white'/>
        </div>
    )
}