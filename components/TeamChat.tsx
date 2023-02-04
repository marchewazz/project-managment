import { MutableRefObject, useEffect, useRef, useState } from 'react'

export default function TeamChat(props: any) {

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
        props.socket.emit("send-message", messageData)
    }

    function generateMessages() {
        const elements = [];
        
        for (const message of messages) {
            if (message.messageSender === props.userData.userID) {
                elements.push(<p className="text-end">
                    { message.messageText } :{ message.userNick } 
                </p>)
            } else {
                elements.push(<p className="text-start">
                    { message.userNick }: { message.messageText }
                </p>)
            }
            
        }

        return elements
    }

    useEffect(() => {
        props.socket.emit("get-messages", { teamID: props.teamID })
    }, [])

    useEffect(() => {
        props.socket.on("update-messages", (data: any) => {        
            setMessages(data)
            setTimeout(() => {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
            }, 100);  
        })
    }, [props.socket])

    return (
        <>
            <div className="max-h-60 overflow-y-auto"
            >
                { generateMessages() }
                <div ref={messagesEndRef}/>
            </div>
            <input onChange={(event: any) => setMessage(event.target.value)}
            onKeyDown={(e) => e.key == 'Enter' && message ? sendMessage() : null }
            type="text" 
            name="message"
            value={message}
            autoFocus={true} />
            <button className="disabled:bg-red-700 bg-green-700"
            onClick={sendMessage}
            disabled={!message}>
                Send
            </button>
        </>
    )
}
