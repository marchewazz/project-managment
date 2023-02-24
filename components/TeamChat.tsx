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
        <div className="m-2">
            <div className="max-h-96 overflow-y-auto bg-gray-200 p-4 rounded-lg border-2 border-gray-400 text-xl">
                { generateMessages() }
                <div ref={messagesEndRef}/>
            </div>
            <div className="grid grid-flow-col grid-cols-10">
                <input className="border-b-2 col-span-8" 
                onChange={(event: any) => setMessage(event.target.value)}
                onKeyDown={(e) => e.key == 'Enter' && message ? sendMessage() : null }
                type="text" 
                name="message"
                placeholder="Write a message..."
                value={message}
                autoFocus={true}
                maxLength={100} />
                <button className="group p-1 col-span-2"
                onClick={sendMessage}
                disabled={!message}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke-width="1.5" 
                    stroke="currentColor" 
                    class="w-6 h-6">
                        <path stroke-linecap="round" 
                        className="group-disabled:text-gray-400 group-disabled:fill-gray-300 fill-blue-800"
                        stroke-linejoin="round" 
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" 
                        />
                    </svg>
                </button>
            </div>
        </div>
    )
}
