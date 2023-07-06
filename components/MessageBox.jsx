'use client';
import { useState, useEffect, memo } from "react";
import ShowMessages from "./ShowMessages";
import { useSession } from "next-auth/react";
const MessageBox = memo(({ userName, sendTo ,sendToName}) => {


    const [message, setMessage] = useState("");
    const [issending, setIssending] = useState(false);
    const { data: session } = useSession();

    const [messages, setMessages] = useState([]);

    /* send the message here */
    const handleSendMessage = async (e) => {
        e.preventDefault();

        setIssending(true);

        try {
            const response = await fetch(`/api/message/send-message/${sendTo}`, {
                method: "POST",
                body: JSON.stringify({
                    sendBy: session?.user.id,
                    message,
                }),
            });

            const newmessage = {
                _id: crypto.randomUUID(),
                sendTo:{
                    _id:sendTo,
                    userName:sendToName,
                    email:'dummy@gmail.com',
                    image : 'https://lh3.googleusercontent.com/ogw/AGvuzYan-fO1IuqHbquR-m9YNdqgr-FVmfpEXrfQiVR6Kw=s32-c-mo'
                },
                sendBy:{
                    _id:session.user.id,
                    userName:session.user.name,
                    email:session.user.email,
                    image:session.user.image
                },
                message,
                createdAt: new Date().toISOString(),
            }

            if (response.ok) {
                setMessages((prevMessages) => [...prevMessages, newmessage]);
                console.log("message sent");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setMessage("");
            setIssending(false);
        }
    };

    /* get all the messages here */
    const GetChatMessages = async () => {


        const response = await fetch(`/api/message/get-messages/${sendTo}`, {
            method: "POST",
            body: JSON.stringify({
                myself: session?.user.id,
            })
        });
        const data = await response.json();

        console.log(data);
        setMessages(data);

    }

    useEffect(() => {
        console.log('this is useeffect');
        GetChatMessages();
    }, [])
    
    return (
        <div className=" h-fit drop-shadow-2xl p-4 rounded-xl">
            <div className="text-center text-4xl text-gray-400 blue_gradient">ChatBox</div>


            {/* previous messages  */}

            <ShowMessages messages={messages} />


            <form onSubmit={handleSendMessage} className="h-fit flex items-center " >
                <input className="search_input" type="text" placeholder={`Write Something to ${sendToName} `} value={message}
                    onChange={(e) => setMessage(e.target.value)} />
                {
                    issending ? <div>sending...</div> : <button type="submit" disabled={issending}>
                        <i className="fa-regular fa-paper-plane ml-2 text-gray-400"  ></i>
                    </button>
                }

            </form>
        </div>
    )
})

export default MessageBox