import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Page() {

    const router = useRouter();

    useEffect(() => {
       
        async function getToken(): Promise<void> {
            const res = await fetch(`/api/videosdk/get-token`, {method: "GET"});
           
            const { token } = await res.json();
           
            router.push({pathname: `/call/${router.query.callid}`, query: { token: token }});
        }
        getToken();
    }, [router.isReady])
    

    return (
        <>
            <p>
                Please wait...
            </p>
        </>
    )
}
