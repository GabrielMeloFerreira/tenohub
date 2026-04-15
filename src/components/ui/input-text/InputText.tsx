import { ReactNode } from 'react';


interface InputTextProps {
    placeHolder: string;
    icon?: ReactNode
    isActive?: boolean;
    name?: string;
    classNameDiv?: string;
    classNameInput?: string;
    onClick?: () => void;
}

export default function InputText ({ classNameDiv, classNameInput, icon, placeHolder, isActive = false, onClick, }: InputTextProps) {

    // const activeClass = isActive
    // ? 'bg-transparent cursor-default'
    // : 'hover:bg-buttons-hover active:bg-transparent';

    return (
        <div onClick={onClick} className={`flex items-center justify-center gap-2 rounded-sm transition ${classNameDiv}`}>
            {icon ? <span aria-hidden='true' className='text-sm text-white'>{icon}</span> : null}
            <input type='text' placeholder={placeHolder} className={`${classNameInput} bg-transparent outline-none text-white w-full`}/>
        </div>
    )
}