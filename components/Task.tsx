export function Task(props: any) {

    function changeTaskMark(newStatus: string): void {
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
            <div className="flex">
                { props.status == "to do" ? (
                    <button onClick={() => changeTaskMark("done")}>
                        MARK AS DONE
                    </button>
                ) : (
                    <button onClick={() => changeTaskMark("to do")}>
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