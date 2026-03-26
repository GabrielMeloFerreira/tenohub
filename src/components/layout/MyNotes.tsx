import NoteModal from "../notes/NoteModal";

interface MyNotesProps {
    username: string;
}

export default function MyNotes ({ username }: MyNotesProps) {

    return(
        <>
        <div className='max-w-90'>
            <div className='flex flex-col h-screen gap-8 shadow-sm bg-base text-white border-x-2 border-border'>
                    <header className='flex flex-col gap-2 mt-2 ml-2 mr-2'>
                        <div className='text-white'>{username} Notes</div>
                        <div className='text-white text-sm'>{'total notes'} Notes</div>
                    </header>
                    <main className='flex flex-wrap gap-2 ml-2 mr-2 overflow-y-scroll '>
                        <NoteModal /><NoteModal /><NoteModal /><NoteModal /><NoteModal /><NoteModal /><NoteModal /><NoteModal /><NoteModal />
                    </main>
            </div>
        </div>
        </>
    )
}