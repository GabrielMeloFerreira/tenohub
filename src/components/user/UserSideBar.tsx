import Image from "next/image";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

export interface SideBarUserProps {
    onClick: () => void;
    isActive?: boolean;
    name: string
    photo: string
}

export default function UserSideBar ({ name, photo, onClick, isActive = false }: SideBarUserProps) {

    const activeClass = isActive
    ? 'bg-buttons-active cursor-default'
    : 'hover:bg-buttons-hover active:bg-buttons-active cursor-pointer';

    return (
        <div onClick={onClick} className={`w-full text-white h-8 truncate inline-flex items-center justify-start rounded-sm gap-2 transition ${activeClass}`}>
            <div>
                <Image src={`/${photo}`} alt="Profile Image" width={30} height={30} className='rounded-md' />
            </div>
            <div>
                {name}<ArrowDropDownIcon/>
            </div>
        </div>
    )

}