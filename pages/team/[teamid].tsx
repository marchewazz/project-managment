import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CreateTaskForm from '../../components/CreateTaskForm';
import TeamChat from '../../components/TeamChat';

export default function Page() {

    const router = useRouter()
    
    const [teamData, setTeamData]: any = useState({});
    const [buttonText, setButtonText] = useState("Invite");

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
        
        const fetchData = async () => {
            const { teamid } = router.query
            const req = await fetch(`/api/teams/get/${teamid}`, { method: "GET" })
            const res = await req.json();
            
            setTeamData(res.teamData)
            setReady(true)
        }

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
                    <button onClick={generateInvitationLink}
                    disabled={buttonText != "Invite"}>
                        { buttonText }
                    </button>
                    <p>
                        Name: { teamData.teamName }
                    </p>
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
                    <div>
                        <p>
                            Tasks
                        </p>
                        <CreateTaskForm teamData={teamData} />
                    </div>
                    <div>
                        <TeamChat teamID={router.query.teamid} />
                    </div>
                </div>
            )}
        </>
    )
    
}
