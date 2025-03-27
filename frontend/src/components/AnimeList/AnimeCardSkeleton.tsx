import Image from 'next/image'

const AnimeCardSkeleton = () => {
    return (
            <div className='w-fit flex flex-col gap-3'>

                <div className='w-[150px] h-[20px] rounded-[9px] bg-white/[0.02]'></div>
                <div className='w-[100px] h-[10px] rounded-[9px] bg-white/[0.02]'></div>
            </div>
    )
}

export default AnimeCardSkeleton
