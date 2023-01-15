

export default function CreateTeamForm () {

    async function submitTeam(event: any): Promise<void> {
        event.preventDefault();
        
        let teamData: any = {
            teamName: event.target.teamName.value,
            userToken: localStorage.getItem("token")
        }

        const req = await fetch("/api/teams/create", { method: "POST", body: JSON.stringify(teamData) })
        const res = await req.json();
        console.log(res);
        
    }

    return (
        <>
            <form onSubmit={submitTeam}>
                <input type="text" 
                name="teamName" />
                <button>
                    CREATE
                </button>
            </form>
        </>
    )
}