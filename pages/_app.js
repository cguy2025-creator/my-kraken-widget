import { SessionProvider } from "next-auth/react"
import '../styles/globals.css' // This keeps your styles working

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
