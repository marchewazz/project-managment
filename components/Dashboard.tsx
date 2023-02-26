import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as io from "socket.io-client";
import InvitationsDisplay from "./InvitationsDisplay";
import UpcomingTasks from "./UpcomingTasks";

export default function Dashboard(props: any) {

    const router = useRouter();

    const [socket, setSocket]: any = useState();

    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        if (!router.isReady) return
        
        setSocket(io.connect());
        setReady(true)
    }, [router.isReady])

    return (
        <>
            { ready ? (
                <div className="grid grid-flow-col">
                    <div>
                
                    </div>
                    <div className="grid grid-flow-row">
                        <div>
                            <UpcomingTasks socket={socket} />
                        </div>
                        <div>
                            <InvitationsDisplay socket={socket} />
                        </div>
                    </div>
                </div>
            ) : (
                <p>
                    Loading
                </p>
            )}
        </>
    )
}