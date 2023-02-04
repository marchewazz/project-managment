export function Task(props: any) {

    function deleteTask() {
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
                    <button>
                        MARK AS DONE
                    </button>
                ) : (
                    <button>
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