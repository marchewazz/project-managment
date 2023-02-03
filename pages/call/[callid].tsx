import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import {
    MeetingProvider,
    MeetingConsumer,
  } from "@videosdk.live/react-sdk";

import MeetingGrid from '../../components/MeetingGrid';

export default function Page() {

    const [token, setToken]: any = useState();
    const [callID, setCallID]: any = useState();
    const [userName, setUserName] = useState("");

    const [buttonText, setButtonText] = useState("Invite");

    const router = useRouter();

    async function generateCallInvitation(): Promise<void> {
        await navigator.clipboard.writeText(`http://localhost:3000/call/invitation/${callID}`);
        setButtonText("Copied!")
        setTimeout(() => {
            setButtonText("Invite");
        }, 5000);
    }

    useEffect(() => {
        if (!router.isReady) return

        setToken(router.query.token)
        setCallID(router.query.callid)

        const fetchData = async () => {
            const req = await fetch(`/api/users/get`, { method: "POST", body: JSON.stringify({ userToken: localStorage.getItem("token") }) })
            const res = await req.json();
            
            setUserName(res.userData.userNick)
        }

        fetchData()
    }, [router.isReady])

    return (
        <>
            { token && callID && userName ? (
                <>
                    <button onClick={generateCallInvitation}
                    disabled={buttonText != "Invite"}>
                        { buttonText }
                    </button>
                    <MeetingProvider
                    config={{
                    meetingId: callID,
                    micEnabled: false,
                    webcamEnabled: false,
                    name: userName,
                    }}
                    token={token}>
                        <MeetingConsumer>
                            {() => <MeetingGrid />}
                        </MeetingConsumer>
                    </MeetingProvider>
                </>
            ) : (
                <p>
                    Loading...
                </p>
            )}
            
        </>
    )
}