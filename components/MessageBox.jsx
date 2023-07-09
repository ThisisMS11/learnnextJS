'use client';
import { useState, useEffect } from "react";
import ShowMessages from "./ShowMessages";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";
import axios from "axios";

const MessageBox = (({ userName, sendTo, sendToName, sendToImage }) => {

    const [message, setMessage] = useState("");
    const [issending, setIssending] = useState(false);
    const { data: session } = useSession();

    const [messages, setMessages] = useState([]);


    /* initialize the socket usestate here */
    const [socket, setSocket] = useState(null);

    /* send the message here */
    const handleSendMessage = async (e) => {
        e.preventDefault();
        /* emit the send message event here */

        // setIssending(true);

        if (socket) {
            const newmessage = {
                sendTo: {
                    userId: sendTo,
                    userName: sendToName,
                    image: sendToImage
                },
                sendBy: {
                    userId: session.user.id,
                    userName: session.user.name,
                    image: session.user.image
                },
                message
            }

            socket.emit('send-message', newmessage);


            /* dynamically changing the local view of messages */
            newmessage._id = crypto.randomUUID();
            newmessage.createdAt = new Date().toISOString();

            setMessages((prevMessages) => [...prevMessages, newmessage]);

            setMessage("");
        }
    }




    useEffect(() => {

        /* get all the messages here */
        const GetChatMessages = async () => {

            const myself = session?.user.id;
            try {
                const response = await axios.post(`${process.env.NEXT_PUBLIC_CHATSERVER}/api/getmessages/${sendTo}`, { myself }, {});
                setMessages(response.data.data);
            } catch (error) {
                console.log(error);
            }
        }

        GetChatMessages();

        const END_POINT = process.env.NEXT_PUBLIC_CHATSERVER

        const s = io.connect(END_POINT, {
            query: { userId: session?.user.id, userName: session?.user.name }
        });

        s.on('connect', () => {
            console.log('connected');
        })

        /* setting the socket here on */
        setSocket(s);

        return () => {
            s.disconnect();
        }

    }, [session?.user.id, session?.user.name])

    /* listening to events */
    useEffect(() => {
        if (socket) {

            socket.on('receive-message', (newmessage) => {
                setMessages((prevMessages) => [...prevMessages, newmessage]);
            })
        }

    }, [socket])


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