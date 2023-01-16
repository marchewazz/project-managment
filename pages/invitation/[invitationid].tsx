import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import isUserAuthenticated from "../../util/isUserAuthenticated";

export default function Page() {

    const router = useRouter();

    const [invitationData, setInvitationData]: any = useState({});

    const [ready, setReady] = useState(false);

    async function acceptInvitation(): Promise<void> {
        const { invitationid } = router.query;

        const invitationData = {
            userToken: localStorage.getItem("token"),
            invitationID: invitationid,
        }   

        const req = await fetch("/api/teams/invitations/accept", { method: "POST", body: JSON.stringify(invitationData) })
        const res = await req.json();
        
        if (res.message == "inserted") router.push(`/team/${res.teamID}`)
    }

    useEffect(() => {
       
        if (!router.isReady) return
        
        const fetchData = async () => {
            const { invitationid } = router.query
            const invitationData: any = {
                invitationID: invitationid,
                userToken: localStorage.getItem("token")
            }
            const req = await fetch(`/api/teams/invitations/get`, { method: "POST", body: JSON.stringify(invitationData) })
            const res = await req.json();
           
            setInvitationData(res);
            setReady(true);
        }

        if (isUserAuthenticated()) fetchData()
        else {
            setInvitationData({ message: "not logged" })
            setReady(true)
        }
        
        
    }, [router.isReady])
    

    return (
        <>
            { !ready ? (
                <p>
                    Loading...
                </p>
            ) : (
                <>
                    { invitationData.message == "not logged" ? (
                        <p>
                            You must be logged
                            <button onClick={() => router.push("/login")}>
                                Login
                            </button>
                        </p>
                    ) : (
                        <>
                            { invitationData.message == "no invitation" ? (
                                <p>
                                    Invitation doesnt exist
                                </p>
                            ) : (
                                <>
                                    { invitationData.message == "you are in this team" ? (
                                        <p>
                                            You are in this team already
                                        </p>
                                    ) : (
                                        <p>
                                            { invitationData.invitationData.userNick } wants to invite you to { invitationData.invitationData.teamName }
                                            <button onClick={acceptInvitation}>
                                                Accept invitation
                                            </button>
                                        </p>
                                    )}
                                </>
                               
                            )}
                        </>
                       
                    )}
                </>
            )}
        </>
    )
}
