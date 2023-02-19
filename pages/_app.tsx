import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/NavBar'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import isUserAuthenticated from '../util/isUserAuthenticated'

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const loggedOnlyPaths: string[] = ["/dashboard", "/teams", "/myprofile", "/team/[teamid]", "call/[callid]", "call/invitation/[callid]"];
  const unloggedOnlyPaths: string[] = ["/login", "/register"];

  useEffect(() => { 
    if (isUserAuthenticated() && unloggedOnlyPaths.includes(router.pathname)) router.push(loggedOnlyPaths[0]);
    if (!isUserAuthenticated() && loggedOnlyPaths.includes(router.pathname)) router.push(unloggedOnlyPaths[0]);
    if (!unloggedOnlyPaths.includes(router.pathname) && !loggedOnlyPaths.includes(router.pathname)) {
      if (isUserAuthenticated()) router.push(loggedOnlyPaths[0])
      if (!isUserAuthenticated()) router.push(unloggedOnlyPaths[0])
    }
  }, [router.pathname])

  useEffect(() => {
    fetch ("/api/socket")
  }, [])

  return (
      <>
        <NavBar />
        <Component {...pageProps} />
      </>
  )
}
