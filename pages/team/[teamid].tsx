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
            <button onClick={() => router.push(`/profile/${teamData.teamOwner.userID}`)}
            className="white-button font-bold py-2 px-32">
                { teamData.teamOwner.userNick }
            </button>
        )

        for (const member of teamData.teamMembers) {
            elements.push(
                <button onClick={() => router.push(`/profile/${member.userID}`)}
                className="white-button font-bold py-2 px-32">
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
                <div className="grid grid-flow-row gap-y-4 divide-y-2 divide-gray-300">
                    <div className="flex justify-evenly">
                        <p className="font-extrabold text-2xl">
                            { teamData.teamName }
                        </p>
                        <button onClick={generateInvitationLink}
                        className="flex content-center blue-button px-2 py-1"
                        disabled={buttonText != "Invite"}>
                            { buttonText }
                            { buttonText == "Invite" ? (
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke-width="2" 
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
                        className="flex content-center blue-button px-2 py-1">
                            Create meeting
                            <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            class="w-6 h-6">
                                <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06z" />
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
                                    <div className="grid grid-flow-col grid-cols-10 m-2">
                                        <div className={showCreateTaskForm ? "col-span-8" : "col-span-9"}>
                                            <TasksDisplay socket={socket} teamID={router.query.teamid} /> 
                                        </div>
                                        <div className="grid col-span-2">
                                            { !showCreateTaskForm ? (
                                                <button className="green-button place-self-start justify-self-end"
                                                onClick={() => setshowCreateTaskForm(true)}>
                                                    CREATE
                                                </button>
                                                ) : (
                                                    <>
                                                        <button className="red-button place-self-start justify-self-end"
                                                        onClick={() => setshowCreateTaskForm(false)}>
                                                            HIDE
                                                        </button>
                                                        <CreateTaskForm socket={socket} teamData={teamData}  />
                                                    </>
                                            )} 
                                        </div>    
                                    </div>
                                ) : (
                                    <div className="grid grid-flow-row place-items-center gap-y-2">
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
