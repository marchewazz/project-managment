export function Task(props: any) {
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
        </div>
    )
}