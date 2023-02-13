

export default function CreateTeamForm () {

    async function submitTeam(event: any): Promise<void> {
        event.preventDefault();
        
        let teamData: any = {
            teamName: event.target.teamName.value,
            userToken: localStorage.getItem("token")
        }

        const req = await fetch("/api/teams/create", { method: "POST", body: JSON.stringify(teamData) })
        const res = await req.json();   
    }

    return (
        <>
            <form onSubmit={submitTeam}
            className="grid grid-flow-row">
                <input className="border-b-2 text-center" 
                type="text" 
                name="teamName"
                placeholder="Team name" />
                <button className="green-button place-self-center">
                    CREATE
                </button>
            </form>
        </>
    )
}