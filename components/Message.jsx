import React from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
const Message = ({ sendBy, message, createdAt }) => {

    const { data: session } = useSession();

    const isSentByMe = session?.user.id === sendBy.userId;

    const endDisplay = `flex justify-end`;
    const startDisplay = `flex justify-start`;


    return (
        <div className={isSentByMe ? endDisplay : startDisplay}>
            <div className='w-fit p-4 font-sans rounded-md bg-white text-gray-700 drop-shadow-sm my-4'>

                <div className='flex items-center'>

                    <Image src={sendBy.image} alt='user_image'
                        width={40}
                        height={40}
                        className='rounded-full object-contain mr-4' />

                    <div>
                        {message}
                        <div className='text-xs text-gray-400'>{createdAt.split('T')[1]}</div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default Message