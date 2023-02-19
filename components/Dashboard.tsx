import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import * as io from "socket.io-client";
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
                <div>
                    <div>
                
                    </div>
                    <div>
                        <div>
                            <UpcomingTasks socket={socket} />
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