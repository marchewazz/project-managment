import { MutableRefObject, useEffect, useRef, useState } from 'react'
import * as io from "socket.io-client";

export default function TeamChat(props: any) {

    const socket = io.connect({ query: { teamID: props.teamID }});

    const [message, setMessage] = useState("");
    
    const [messages, setMessages]: any = useState([]);

    const messagesEndRef = useRef() as MutableRefObject<HTMLDivElement>;

    function sendMessage() {
        const messageData = {
            userToken: localStorage.getItem("token"),
            message: message,
            teamID: props.teamID
        }
        setMessage("")
        socket.emit("send-message", messageData)
    }

    function generateMessages() {
        const elements = [];

        for (const message of messages) {
            elements.push(<p>
                { message.userNick }: { message.messageText }
            </p>)
        }

        return elements
    }

    useEffect(() => {
        socket.emit("get-messages", { teamID: props.teamID })
    }, [])

    useEffect(() => {
        socket.on("update-messages", (data: any) => {        
            setMessages(data)
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            }, 100);
            
        })
        
    }, [socket])

    return (
        <>
            <div className="max-h-60 overflow-y-auto"
            >
                { generateMessages() }
                <div ref={messagesEndRef}/>
            </div>
            <input onChange={(event: any) => setMessage(event.target.value)}
            type="text" 
            name="message"
            value={message} />
            <button className="disabled:bg-red-700 bg-green-700"
            onClick={sendMessage}
            disabled={!message}>
                Send
            </button>
        </>
    )
}
