export function Task(props: any) {

    function changeTaskStatus(newStatus: string): void {
        const taskData = props.taskData;
        taskData["taskStatus"] = newStatus;
        
        props.socket.emit("edit-task", taskData)
    }

    function deleteTask(): void {
        props.socket.emit("delete-task", { taskID: props.taskData.taskID })
    }

    return (
        <div>
            <p>
                Created by: { props.taskData.userNick }
            </p>
            <p>
                { props.taskData.taskTitle }
            </p>
            { props.taskData.taskDescription ? (
                <p>
                    { props.taskData.taskDescription }
                </p>
            ) : (null)}
            <p>
                Deadline: { props.taskData.taskDate }
            </p>
            <div className="flex justify-evenly">
                { props.taskData.taskStatus == "to do" ? (
                    <button onClick={() => changeTaskStatus("done")}>
                        MARK AS DONE
                    </button>
                ) : (
                    <button onClick={() => changeTaskStatus("to do")}>
                        MARK AS UNDONE
                    </button>
                )}
                <button onClick={deleteTask}>
                    DELETE
                </button>
            </div>
        </div>
    )
}