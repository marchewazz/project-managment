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

    const [micOn, setMicOn] = useState(false);
    const [webcamOn, setWebcamOn] = useState(false);

    const router = useRouter();

    function switchMic(): void {
        setMicOn(!micOn)
    }

    function switchWebcam(): void {
        setWebcamOn(!webcamOn)
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
                    
                    <MeetingProvider
                    config={{
                    meetingId: callID,
                    micEnabled: micOn,
                    webcamEnabled: webcamOn,
                    name: userName,
                    }}
                    token={token}>
                        <MeetingConsumer>
                            {() => <MeetingGrid micOn={micOn} switchMic={switchMic} webcamOn={webcamOn} switchWebcam={switchWebcam} />}
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