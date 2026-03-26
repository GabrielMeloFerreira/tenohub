import { ReactNode } from 'react';

interface ButtonProps {
    text: string;
    onClick: () => void;
    icon?: ReactNode;
    isActive?: boolean;
}

export default function Button({ text, onClick, icon, isActive = false }: ButtonProps) {

    const activeClass = isActive
        ? 'bg-buttons-active cursor-default'
        : 'hover:bg-buttons-hover active:bg-buttons-active cursor-pointer';

    return (
        <button
            onClick={onClick}
            className={`w-full text-white h-7 inline-flex items-center justify-start rounded-sm gap-2 transition ${activeClass}`}>
            {icon ? <span aria-hidden='true'>{icon}</span> : null}
            {text}
        </button>
    )
}