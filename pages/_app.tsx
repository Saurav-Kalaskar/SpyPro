import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../components/auth/AuthProvider';

export default function MyApp({ Component, pageProps: { session, ...pageProps }}: AppProps){
    return(
        <SessionProvider session = {session}>
        <AuthProvider>
        <Component {...pageProps}/>
        </AuthProvider>
        </SessionProvider>
    );
}