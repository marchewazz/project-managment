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
    const [ready, setReady] = useState(false);

    async function generateInvitationLink(): Promise<void> {
        const { teamid } = router.query

        const invitationData = {
            userToken: localStorage.getItem("token"),
            teamID: teamid
        }

        const req = await fetch("/api/teams/invitations/generate", { method: "POST", body: JSON.stringify(invitationData) })
        const res = await req.json();
        
        await navigator.clipboard.writeText(`http://localhost:3000/invitations/${res.invitationID}`);
        setButtonText("Copied!")
    }

    useEffect(() => {
       
        if (!router.isReady) return
        const { teamid } = router.query

        const fetchData = async () => {
            const req = await fetch(`/api/teams/get/${teamid}`, { method: "GET" })
            const res = await req.json();
            
            setTeamData(res.teamData)
            setReady(true)
        }
        setSocket(io.connect({ query: { teamID: teamid }}));
        fetchData()
    }, [router.isReady])
    

    return ( 
        <>
            {!ready ? (
                <p>
                    Loading...
                </p>
            ) : (
                <div>
                    <div>
                        <button onClick={generateInvitationLink}
                        disabled={buttonText != "Invite"}>
                            { buttonText }
                        </button>
                        <p>
                            Name: { teamData.teamName }
                        </p>
                    </div>
                    <div>
                        <span>
                            Chat
                            <input type="radio" 
                            name="tab" 
                            checked={tab == "chat"}
                            onChange={() => setTab("chat")} />
                        </span>
                        <span>
                            Tasks
                            <input type="radio" 
                            name="tab"
                            checked={tab == "tasks"}
                            onChange={() => setTab("tasks")}  />
                        </span>
                        <span>
                            Members
                            <input type="radio" 
                            name="tab" 
                            checked={tab == "members"}
                            onChange={() => setTab("members")} />
                        </span>
                    </div>
                    <div>
                        { tab == "chat" ? (
                            <div>
                             <TeamChat teamID={router.query.teamid} socket={socket} />
                            </div>
                        ) : (
                            <>
                                { tab == "tasks" ? (
                                    <div>
                                        <TasksDisplay socket={socket} teamID={router.query.teamid} />
                                        <CreateTaskForm teamData={teamData} socket={socket} />
                                    </div>
                                ) : (
                                    <div>
                                        { teamData.teamMembers.length == 0 ? (
                                            <p>
                                                No members
                                            </p>
                                        ) : (
                                            <p>
                                                members here
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
            )}
        </>
    )
    
}
