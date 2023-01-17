import { useEffect, useState } from "react";

export default function Page() {
    
    const [userData, setUserData]: any = useState({});

    const [ready, setReady] = useState(false);

    useEffect(() => {
        
        const fetchData = async () => {
            
            const req = await fetch(`/api/users/get`, { method: "POST", body: JSON.stringify({ userToken: localStorage.getItem("token")}) })
            const res = await req.json();
            setUserData(res.userData)
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
                    <p>
                        { userData.userNick }
                    </p>
                    <p>
                        { userData.userFirstName } { userData.userLastName }
                    </p>
                </>
            )}
        </>
    )
}
