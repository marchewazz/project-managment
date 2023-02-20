import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as io from "socket.io-client";

export default function Page() {
    
    const router = useRouter();

    const [socket, setSocket]: any = useState();

    const [userData, setUserData]: any = useState({});
    const [localUserData, setLocalUserData]: any = useState();

    const [invitations, setInvitations] = useState([]);
    const [friends, setFriends] = useState(false);

    const [invitationStatus, setInvitationStatus] = useState("");

    const [ready, setReady] = useState(false);

    function sendInvitation() {
        const { userid } = router.query
        socket.emit("send-invitation", { userToken: localStorage.getItem("token"), receiverUserID: userid })
    }

    function cancelInvitation() {
        const { userid } = router.query
        const invitation = invitations.find((element: any) => element.invitationReceiver == userid || element.invitationSender == userid)
        socket.emit("cancel-invitation", { userToken: localStorage.getItem("token"), invitationID: invitation.invitationID })
    }

    function acceptInvitation() {
        const { userid } = router.query
        const invitation = invitations.find((element: any) => element.invitationSender == userid)
        socket.emit("accept-invitation", { userToken: localStorage.getItem("token"), invitationID: invitation.invitationID })
    }

    function rejectInvitation() {
        const { userid } = router.query
        const invitation = invitations.find((element: any) => element.invitationSender == userid)
        socket.emit("reject-invitation", { userToken: localStorage.getItem("token"), invitationID: invitation.invitationID })
    }

    function deleteFriend() {
        const { userid } = router.query
        socket.emit("delete-friend", { userToken: localStorage.getItem("token"), friendID: userid })
    }

    useEffect(() => {
        if (!router.isReady) return

        const fetchData = async () => {
            const { userid } = router.query
            const req = await fetch(`/api/users/get`, { method: "POST", body: JSON.stringify({ userID: userid }) })
            const res = await req.json();
            setUserData(res.userData)
            const localUserReq = await fetch(`/api/users/get`, { method: "POST", body: JSON.stringify({ userToken: localStorage.getItem("token")}) })
            const localUserRes = await localUserReq.json();

            if (localUserRes.userData.userID === userid) router.push("/myprofile")
            
            setLocalUserData(localUserRes.userData)
            setReady(true);
        }
        setSocket(io.connect());
        fetchData()
    }, [router.isReady])

    useEffect(() => {
        if (socket) {
            socket.emit("get-invitations", { userToken: localStorage.getItem("token") })
            socket.on("update-invitations", (data: any) => {
                setInvitations(data)
            })  
        }       
    }, [socket])

    useEffect(() => {
        const { userid } = router.query
        const invitation = invitations.find((element: any) => element.invitationReceiver == userid || element.invitationSender == userid)
       
        if (invitation) {
            if (invitation.isUserSender) setInvitationStatus("sent")
            else setInvitationStatus("received")
        } else {
            setInvitationStatus("no invitation")
        }
        
    }, [invitations])

    useEffect(() => {
        if (localUserData) {
            const { userid } = router.query
            if (localUserData.userFriends.includes(userid)) setFriends(true)
            else setFriends(false)
        }
        
    }, [localUserData])
    
    return (
        <>
            { !ready ? (
                <p>
                    Loading...
                </p>
            ) : (
                <>
                    <p>
                        { userData.userNick }
                    </p>
                    <p>
                        { userData.userFirstName } { userData.userLastName }
                    </p>
                    { invitationStatus == "no invitation" ? (
                        <>
                            { friends ? (
                                <button onClick={deleteFriend}>
                                    Delete friend
                                </button>
                            ) : (
                                <button onClick={sendInvitation}>
                                    ADD FRIEND
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            { invitationStatus == "sent" ? (
                                <button onClick={cancelInvitation}>
                                    cancel
                                </button>
                            ) : (
                                <div>
                                    <button onClick={acceptInvitation}>
                                        Accept
                                    </button>
                                    <button onClick={rejectInvitation}>
                                        Reject
                                    </button>
                                </div>
                            )}
                        </>
                        
                    )}
                    
                </>
            )}
        </>
    )
}
