'use client';
import Message from "./Message"
import ScrollToBottom from "react-scroll-to-bottom";
import { useEffect } from "react";

const ShowMessages = ({ messages }) => {


    if (messages.length === 0) return <div>No Messages</div>;

    useEffect(() => {
        console.log(messages);
    }, [])


    return (
        <ScrollToBottom mode="bottom" className="h-[37rem]">
            {messages && messages.map((message) => {
                return <Message key={message._id} sendBy={message.sendBy} message={message.message} createdAt={message.createdAt} />
            })}
        </ScrollToBottom>
    )
}

export default ShowMessages