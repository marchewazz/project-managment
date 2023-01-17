import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import CreateTeamForm from "../../components/CreateTeamForm";

export default function Page() {

    const router = useRouter();

    const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);

    const [teamsAvailable, setTeamsAvailable]: any = useState([]);

    const [ready, setReady] = useState(false);

    function generateTeamsButtons() {
        let elements: any[] = [];

        for (const team of teamsAvailable) {
            elements.push(<button onClick={() => router.push(`/team/${team.teamID}`)}>
                { team.teamName }
            </button>)
        }

        return elements
    }

    useEffect(() => {

        const fetchData = async () => {
            const req = await fetch(`/api/users/teams/${localStorage.getItem("token")}`, { method: "GET" })
            const res = await req.json();
            setTeamsAvailable(res.teams)
            setReady(true);
        }

        fetchData()
    }, [])
    

    return (
        <>
            { !ready ? (
                <p>
                    Loading...
                </p>
            ) : (
                <>
                    { teamsAvailable.length == 0 ? (
                        <p>
                            No teams
                        </p>
                    ) : (
                        generateTeamsButtons() 
                    )}
                    { !showCreateTeamForm ? (
                        <button onClick={() => setShowCreateTeamForm(true)}>
                            CREATE
                        </button>
                        ) : (
                             <>
                                 <button onClick={() => setShowCreateTeamForm(false)}>
                                     HIDE
                                 </button>
                                 <CreateTeamForm />
                             </>
                    )}
                </>
            )}
           
        </>
    )
}
