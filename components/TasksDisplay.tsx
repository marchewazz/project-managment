import { useEffect, useState } from "react"
import { Task } from "./Task";

export function TasksDisplay (props: any) {

    const [tasks, setTasks] = useState([]);
    const [ready, setReady] = useState(false);

    function generateTasks() {
        let elements: any[] = [];

        for (const task of tasks) {
            elements.push(<Task taskData={task} />)
        }

        return elements
    }

    useEffect(() => {
        props.socket.emit("get-tasks")
    }, [])
    
    useEffect(() => {
        props.socket.on("update-tasks", (data: any) => {        
            console.log(data);
            setTasks(data);
            setReady(true)
        })
    }, [props.socket])

    return (
        <div>
            { !ready ? (
                <p>
                    Loading...
                </p>
            ) : (
                <>
                    { tasks.length == 0 ? (
                        <p>
                            No tasks
                        </p>
                    ): (
                        <>
                            { generateTasks() }
                        </>
                    )}
                </>
            )}
        </div>
    )
}