import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import isUserAuthenticated from "../util/isUserAuthenticated";

export default function NavBar() {

    const router = useRouter();

    const [userAuthenticated, setUserAuthenticated] = useState(false);

    useEffect(() => {
      setUserAuthenticated(isUserAuthenticated())
    }, [router.asPath])

    return (
        <>
            { userAuthenticated ? (
              <>
                <button className="bg-red-700"
                onClick={() => router.push("/dashboard")}>
                  Dashboard
                </button>
                <button className="bg-blue-700"
                onClick={() => router.push("/myprofile")}>
                  Profile
                </button>
              </>
            ) : (
              <>
                 <button className="bg-red-700"
                onClick={() => router.push("/register")}>
                  Register
                </button>
                <button className="bg-blue-700"
                onClick={() => router.push("/login")}>
                  Login
                </button>
              </>
            )}
            
        </>
    )
}
