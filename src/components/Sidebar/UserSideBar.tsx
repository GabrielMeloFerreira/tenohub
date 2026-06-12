import Image from "next/image";
import FirstPageIcon from '@mui/icons-material/FirstPage';

export interface SideBarUserProps {
    onClick: () => void;
    isActive?: boolean;
    name: string
    photo: string
}

export default function UserSideBar ({ name, photo, onClick, isActive = false }: SideBarUserProps) {

    return (
        <div className={`w-full text-white h-8 truncate inline-flex items-center justify-start rounded-sm gap-2 transition`}>
                <Image src={`/${photo}`} alt="Profile Image" width={40} height={80} className='rounded-md' />
            <div className="flex gap-2">
                {name}<FirstPageIcon/>
            </div>
            {}
        </div>
    )

}