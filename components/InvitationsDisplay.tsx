import { useEffect, useState } from "react";


export default function InvitationsDisplay(props: any) {

    const [invitations, setInvitations] = useState([]);

    const [ready, setReady] = useState(false);

    function generateInvitations() {

        function acceptInvitation(invitationID: string) {
            props.socket.emit("accept-invitation", { userToken: localStorage.getItem("token"), invitationID: invitationID })
        }
    
        function rejectInvitation(invitationID: string) {
            props.socket.emit("reject-invitation", { userToken: localStorage.getItem("token"), invitationID: invitationID })
        }

        const elements: any[] = [];

        for (const invitation of invitations) {
            if (!invitation.isUserSender) {
                elements.push(
                    <div>
                        <p>
                            { invitation.invitationSender.nick } wants to be your friend
                        </p>
                        <button onClick={() => acceptInvitation(invitation.invitationID)}
                        className="green-button">
                            Accept
                        </button>
                        <button onClick={() => rejectInvitation(invitation.invitationID)}
                         className="red-button">
                            Reject
                        </button>
                    </div>
                )
            }
        }
        return elements
    }

    useEffect(() => {
        if (props.socket) {
            props.socket.emit("get-invitations", { userToken: localStorage.getItem("token") })
            props.socket.on("update-invitations", (data: any) => {
                setInvitations(data)
                setReady(true)
            })  
        }       
    }, [props.socket])
    

    return (
        <div>
            { ready ? (
                <div>
                    { invitations.length ? (
                        <>
                            <p>
                            Your invitations
                            </p>
                            <div>
                                { generateInvitations() }
                            </div>
                        </>
                        
                    ) : (
                        <p>
                            No invitations
                        </p>
                    )}
                </div>
            ) : (
                <p>
                    Loading...
                </p>
            )}
        </div>
        
        
    )
}