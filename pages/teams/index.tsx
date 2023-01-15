import { useState } from "react"
import CreateTeamForm from "../../components/CreateTeamForm";

export default function Page() {

    const [showCreateTeamForm, setShowCreateTeamForm] = useState(false);

    return (
        <>
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
    )
}
