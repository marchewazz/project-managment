import { useEffect, useState } from "react"
import { Task } from "./Task";

export function TasksDisplay (props: any) {

    const [tasks, setTasks] = useState([]);
    const [ready, setReady] = useState(false);

    const [taskTab, setTaskTab] = useState("to do")

    function generateTasks(status: string) {
        let elements: any[] = [];

        for (const task of tasks) {
            if (task.taskStatus == status) elements.push(<Task taskData={task} status={status} socket={props.socket} />)
        }

        return elements
    }

    useEffect(() => {
        props.socket.emit("get-tasks")
    }, [])
    
    useEffect(() => {
        props.socket.on("update-tasks", (data: any) => {  
            console.log(`task`);
                  
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
                            <div>
                                <span>
                                    To do
                                    <input type="radio" 
                                    name="taskTab" 
                                    checked={taskTab == "to do"}
                                    onChange={() => setTaskTab("to do")} />
                                </span>
                                <span>
                                    Done
                                    <input type="radio" 
                                    name="taskTab"
                                    checked={taskTab == "done"}
                                    onChange={() => setTaskTab("done")}  />
                                </span>
                            </div>
                            <div>
                                { generateTasks(taskTab) }
                            </div>
                        </>
                    )}
                </>
            )}
        </div>
    )
}