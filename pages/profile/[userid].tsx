import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Page() {
    
    const router = useRouter();

    const [userData, setUserData]: any = useState({});

    const [ready, setReady] = useState(false);

    useEffect(() => {

        if (!router.isReady) return

        const fetchData = async () => {
            const { userid } = router.query
            const req = await fetch(`/api/users/get`, { method: "POST", body: JSON.stringify({ userID: userid }) })
            const res = await req.json();
            setUserData(res.userData)
            setReady(true);
        }

        fetchData()
    }, [router.isReady])

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
