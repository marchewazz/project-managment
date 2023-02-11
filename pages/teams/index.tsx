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
            elements.push(<button onClick={() => router.push(`/team/${team.teamID}`)}
            className="border border-blue-800 rounded-md text-blue-800 py-1 font-bold">
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
                <div className="grid grid-flow-col">
                    { teamsAvailable.length == 0 ? (
                        <p>
                            No teams
                        </p>
                    ) : (
                        <div className="grid grid-flow-row gap-2">
                            { generateTeamsButtons() }
                        </div>
                    )}
                    { !showCreateTeamForm ? (
                        <button onClick={() => setShowCreateTeamForm(true)}
                        className="bg-green-600 px-2 text-white place-self-start justify-self-end">
                            CREATE
                        </button>
                        ) : (
                            <div className="grid grid-flow-col">
                                <CreateTeamForm />
                                <button onClick={() => setShowCreateTeamForm(false)}
                                className="bg-red-600 px-2 text-white place-self-start justify-self-end">
                                    HIDE
                                </button>
                            </div>
                    )}
                </div>
            )}
           
        </>
    )
}
