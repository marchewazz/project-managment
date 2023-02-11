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
        <div className="flex justify-evenly">
            { userAuthenticated ? (
              <>
                <button className="tab-button"
                onClick={() => router.push("/dashboard")}>
                  Dashboard
                </button>
                <button className="tab-button"
                onClick={() => router.push("/teams")}>
                  Teams
                </button>
                <button className="tab-button"
                onClick={() => router.push("/myprofile")}>
                  Profile
                </button>
              </>
            ) : (
              <>
                 <button className="tab-button"
                onClick={() => router.push("/register")}>
                  Register
                </button>
                <button className="tab-button"
                onClick={() => router.push("/login")}>
                  Login
                </button>
              </>
            )}
        </div>
    )
}
