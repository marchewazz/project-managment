import '../styles/globals.css'
import type { AppProps } from 'next/app'
import NavBar from '../components/NavBar'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    
    
  }, [])

  return <>
    <NavBar />
    <Component {...pageProps} />
  </>
  
}
