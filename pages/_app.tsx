import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/NavBar'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import isUserAuthenticated from '../util/isUserAuthenticated'

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

  const loggedOnlyPaths: string[] = ["/dashboard", "/teams", "/myprofile", "/team/[teamid]"];
  const unloggedOnlyPaths: string[] = ["/login", "/register"];

  useEffect(() => { 
    if (isUserAuthenticated() && unloggedOnlyPaths.includes(router.pathname)) router.push(loggedOnlyPaths[0]);
    if (!isUserAuthenticated() && loggedOnlyPaths.includes(router.pathname)) router.push(unloggedOnlyPaths[0]);
  }, [router.pathname])

  return <>
    <NavBar />
    <Component {...pageProps} />
  </>
  
}
