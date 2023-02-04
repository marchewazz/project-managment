import { useState } from "react";


export default function CreateTaskForm (props: any) {

    const [info, setInfo] = useState("");

    function generateUsersOptions() {
        const elements = [];

        elements.push(
            <option value={props.teamData.teamOwner.userID}>
                { props.teamData.teamOwner.userNick }
            </option>
        )

        for (const member of props.teamData.teamMembers) {
            elements.push(
                <option value={member.userID}>
                    { member.userNick }
                </option>
            )
        }

        return elements;
    }

    async function submitTask(event: any): Promise<void> {
        event.preventDefault();
        
        let taskData: any = {
            userToken: localStorage.getItem("token"),
            teamID: props.teamData.teamID,
            taskTitle: event.target.taskTitle.value,
            taskDescription: event.target.taskDescription.value,
            taskDate: event.target.taskDate.value,
            taskResponsibleUsers: Array.from(event.target.taskResponsibleUsers.selectedOptions, (option: any) => option.value)
        }
        if (!taskData.taskTitle) {
            setInfo("Pass title")
            return
        }
        
        props.socket.emit("create-task", taskData)
        
    }

    function getNow(): string {
        let now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0,16);
    }

    return (
        <>
            <form onSubmit={submitTask}>
                <input type="text" 
                placeholder="Title"
                name="taskTitle" />
                <input type="text" 
                placeholder="Description"
                name="taskDescription" />
                <input type="datetime-local" 
                placeholder="Date and time"
                name="taskDate"
                value={getNow()} />
                <select name="taskResponsibleUsers" multiple>
                    { generateUsersOptions() }
                </select>
                <button>
                    CREATE
                </button>
            </form>
            <p>
                { info }
            </p>
        </>
    )
}