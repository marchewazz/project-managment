import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as io from "socket.io-client";
import CreateTaskForm from '../../components/CreateTaskForm';
import { TasksDisplay } from '../../components/TasksDisplay';
import TeamChat from '../../components/TeamChat';

export default function Page() {

    const router = useRouter()
    
    const [socket, setSocket]: any = useState();

    const [teamData, setTeamData]: any = useState({});
    const [buttonText, setButtonText] = useState("Invite");

    const [tab, setTab] = useState("chat");
    const [showCreateTaskForm, setshowCreateTaskForm] = useState(false);

    const [userData, setUserData] = useState();

    const [ready, setReady] = useState(false);

    async function createMeeting(): Promise<void> {

        async function getToken(): Promise<string> {
            const res = await fetch(`/api/videosdk/get-token`, {method: "GET"});
           
            const { token } = await res.json();
           
            return token;
        }

        async function getRoomID(token: string) {
            console.log(token);
            
            const res = await fetch(`/api/videosdk/create-meeting`, {
                method: "POST",
                body: JSON.stringify({ token: token }),
            });
            
            const { roomId } = await res.json();
          
            return roomId;
        }

        const token: string = await getToken();
        const roomID: string = await getRoomID(token);

        router.push({pathname: `/call/${roomID}`, query: { token: token }});
    }

    async function generateInvitationLink(): Promise<void> {
        const { teamid } = router.query

        const invitationData = {
            userToken: localStorage.getItem("token"),
            teamID: teamid
        }

        const req = await fetch("/api/teams/invitations/generate", { method: "POST", body: JSON.stringify(invitationData) })
        const res = await req.json();
        
        await navigator.clipboard.writeText(`http://localhost:3000/invitation/${res.invitationID}`);
        setButtonText("Copied!")
        setTimeout(() => {
            setButtonText("Invite")
        }, 5000);
    }

    function generateMembers() {
        const elements: any[] = [];

        elements.push(
            <button onClick={() => router.push(`/profile/${teamData.teamOwner.userID}`)}>
                { teamData.teamOwner.userNick }
            </button>
        )

        for (const member of teamData.teamMembers) {
            elements.push(
                <button onClick={() => router.push(`/profile/${member.userID}`)}>
                    { member.userNick }
                </button>
            )
        }

        return elements;
    }

    useEffect(() => {
        if (!router.isReady) return
        const { teamid } = router.query

        const fetchData = async () => {
            const req = await fetch(`/api/teams/get/${teamid}`, { method: "POST", body: JSON.stringify({ userToken: localStorage.getItem("token") }) })
            const res = await req.json();
            if (res.message === "ok") {
                setTeamData(res.teamData)
            } else {
                router.push("/dashboard")
            }
            const userReq = await fetch(`/api/users/get`, { method: "POST", body: JSON.stringify({ userToken: localStorage.getItem("token") }) })
            const userRes = await userReq.json();
            setUserData(userRes.userData)
            setReady(true)
        }
        setSocket(io.connect({ query: { teamID: teamid }}));
        fetchData()
    }, [router.isReady])
    

    return ( 
        <div>
            {!ready ? (
                <p>
                    Loading...
                </p>
            ) : (
                <div>
                    <div className="flex justify-evenly">
                        <p className="font-extrabold">
                            { teamData.teamName }
                        </p>
                        <button onClick={generateInvitationLink}
                        className="flex content-center"
                        disabled={buttonText != "Invite"}>
                            { buttonText }
                            { buttonText == "Invite" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke-width="1.5" 
                                stroke="currentColor" 
                                class="w-6 h-6">
                                    <path stroke-linecap="round" 
                                    stroke-linejoin="round" 
                                    d="M12 4.5v15m7.5-7.5h-15" 
                                    />
                                </svg>                              
                            ) : (null)}
                        </button>
                        <button onClick={createMeeting}
                        className="flex content-center">
                            Create meeting
                            <svg xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke-width="1.5" 
                            stroke="currentColor" 
                            class="w-6 h-6">
                                <path stroke-linecap="round" 
                                d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" 
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex justify-evenly">
                        <span>
                            <input className="peer hidden"
                            type="radio" 
                            name="tab" 
                            id="chat"
                            checked={tab == "chat"}
                            onChange={() => setTab("chat")} />
                            <label className="text-xl peer-checked:text-blue-800 peer-checked:font-bold"
                            htmlFor="chat">
                                Chat
                            </label>
                        </span>
                        <span>
                            <input className="peer hidden"
                            type="radio" 
                            name="tab"
                            id="tasks"
                            checked={tab == "tasks"}
                            onChange={() => setTab("tasks")}  />
                            <label className="text-xl peer-checked:text-blue-800 peer-checked:font-bold"
                            htmlFor="tasks">
                                Tasks
                            </label>
                        </span>
                        <span>
                            <input className="peer hidden"
                            type="radio" 
                            name="tab" 
                            id="members"
                            checked={tab == "members"}
                            onChange={() => setTab("members")} />
                            <label className="text-xl peer-checked:text-blue-800 peer-checked:font-bold"
                            htmlFor="members">
                                Members
                            </label>
                        </span>
                    </div>
                    <div>
                        { tab == "chat" ? (
                            <div>
                                <TeamChat socket={socket} teamID={router.query.teamid} userData={userData} />
                            </div>
                        ) : (
                            <>
                                { tab == "tasks" ? (
                                    <div>
                                        { !showCreateTaskForm ? (
                                            <button className="green-button"
                                            onClick={() => setshowCreateTaskForm(true)}>
                                                CREATE
                                            </button>
                                            ) : (
                                                <>
                                                    <button className="red-button"
                                                    onClick={() => setshowCreateTaskForm(false)}>
                                                        HIDE
                                                    </button>
                                                    <CreateTaskForm socket={socket} teamData={teamData}  />
                                                </>
                                        )}  
                                        <TasksDisplay socket={socket} teamID={router.query.teamid} />            
                                    </div>
                                ) : (
                                    <div className="grid grid-flow-row">
                                        { generateMembers() }
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
            )}
        </div>
    )
    
}
