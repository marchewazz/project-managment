import { useEffect, useState } from "react"

import { Task } from "./Task"

export default function UpcomingTasks(props: any) {

    const [upcomingTasks, setUpcomingTasks] = useState([]);

    function generateTasks() {
        let elements: any[] = [];

        for (const task of upcomingTasks.slice(0, 3)) {
            elements.push(<Task taskData={task} socket={props.socket} />)
        }

        return elements
    }

    useEffect(() => {
        props.socket.emit("get-upcoming-user-tasks", { userToken: localStorage.getItem("token") })
    }, [])

    useEffect(() => {
        props.socket.on("update-upcoming-user-tasks", (data: any) => {        
            setUpcomingTasks(data); 
        })
    }, [props.socket])

    return (
       <>
        { upcomingTasks.length > 0 ? (
            <div>
                <p className="font-bold">
                    Upcoming tasks
                </p>
                { generateTasks() }
            </div>
        ) : (
            <p>
                No tasks :)
            </p>
        )}
       </>
    )
}