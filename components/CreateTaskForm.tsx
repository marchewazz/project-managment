import { useEffect, useState } from "react";


export default function CreateTaskForm (props: any) {

    const [availableUsers, setAvailableUsers]: any[] = useState([]);
    const [responsibleUsers, setResponsibleUsers]: any[] = useState([]);

    const [info, setInfo] = useState("");

    function generateAvailableUsers() {

        function moveUserToResponsible(member: any) {
            const tempAvailableUsers = availableUsers.filter((user: any) => {return user !== member})
            const tempResponsibleUsers = responsibleUsers;
            tempResponsibleUsers.push(member)
            setAvailableUsers(tempAvailableUsers);
            setResponsibleUsers(tempResponsibleUsers);
        }

        const elements = [];

        for (const member of availableUsers) {
            elements.push(
                <button onClick={() => moveUserToResponsible(member)}
                className="white-button p-2">
                    { member.userNick }
                </button>
            )
        }

        return elements;
    }

    function generateResponsibleUsers() {

        function moveUserToResponsible(member: any) {
            const tempAvailableUsers = availableUsers;
            availableUsers.push(member)
            const tempResponsibleUsers = responsibleUsers.filter((user: any) => {return user !== member})
            setAvailableUsers(tempAvailableUsers);
            setResponsibleUsers(tempResponsibleUsers);
        }

        const elements = [];
        
        for (const member of responsibleUsers) {
            elements.push(
                <button onClick={() => moveUserToResponsible(member)}
                className="white-button p-2">
                    { member.userNick }
                </button>
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
            taskResponsibleUsers: Array.from(responsibleUsers, (user: any) => user.userID)
        }
        if (!taskData.taskTitle) {
            setInfo("Pass title")
            setTimeout(() => {
                setInfo("");
            }, 5000);
            return
        }
        
        props.socket.emit("create-task", taskData)
        
    }

    useEffect(() => {
        let users = [];
        users = props.teamData.teamMembers;
        setAvailableUsers(users);
    }, [])
    

    return (
        <>
            <form className="grid grid-flow-row place-items-center"
            onSubmit={submitTask}>
                <input className="border-b-2 text-center" 
                type="text" 
                placeholder="Title"
                name="taskTitle" />
                <input className="border-b-2 text-center" 
                type="text" 
                placeholder="Description"
                name="taskDescription" />
                <input className="border-b-2 text-center" 
                type="datetime-local" 
                placeholder="Date and time"
                name="taskDate" />
                <div className="flex divide-x divide-blue-800">
                    <div>
                        <p>
                            Available users
                        </p>
                        <div className="flex justify-center">
                            { generateAvailableUsers() }
                        </div>
                    </div>
                    <div>
                        <p>
                            ResponsibleUsers
                        </p>
                        <div className="flex justify-center">
                            { generateResponsibleUsers() }
                        </div>
                    </div>
                </div>
                <p>
                    { info }
                </p>
                <button className="green-button">
                    CREATE
                </button>
            </form>
        </>
    )
}