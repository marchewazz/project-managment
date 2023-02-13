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
                        <p className="font-extrabold text-center text-2xl">
                            No tasks
                        </p>
                    ): (
                        <div className="grid grid-flow-col">
                            <div className="bg-red-200 border-2 border-red-800">
                                <p className="font-extrabold text-center">
                                    To do
                                </p>
                                <div>
                                    { generateTasks("to do") }
                                </div>
                            </div>
                            <div className="bg-green-200 border-2 border-green-800">
                                <p className="font-extrabold text-center">
                                    Done
                                </p>
                                <div>
                                    { generateTasks("done") }
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}