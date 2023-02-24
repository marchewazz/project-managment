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
        <div className="grid grid-flow-col place-items-stretch">
            { userAuthenticated ? (
              <>
                <button className={"py-4 " + (router.asPath === "/dashboard" ? "active-tab-button" : "tab-button")}
                onClick={() => router.push("/dashboard")}>
                  Dashboard
                </button>
                <button className={"py-4 " + (router.asPath === "/teams" ? "active-tab-button" : "tab-button")}
                onClick={() => router.push("/teams")}>
                  Teams
                </button>
                <button className={"py-4 " + (router.asPath === "/myprofile" ? "active-tab-button" : "tab-button")}
                onClick={() => router.push("/myprofile")}>
                  Profile
                </button>
              </>
            ) : (
              <>
                <button className={"py-4 " + (router.asPath === "/register" ? "active-tab-button" : "tab-button")}
                onClick={() => router.push("/register")}>
                  Register
                </button>
                <button className={"py-4 " + (router.asPath === "/login" ? "active-tab-button" : "tab-button")}
                onClick={() => router.push("/login")}>
                  Login
                </button>
              </>
            )}
        </div>
    )
}
