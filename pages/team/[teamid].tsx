import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function Page() {

    const router = useRouter()
    
    const [teamData, setTeamData]: any = useState({});

    const [ready, setReady] = useState(false);

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
                </div>
                
            )}
        </>
    )
    
}
