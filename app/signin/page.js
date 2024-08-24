'use client'

import styles from '../page.module.css';
import changesAlert from '../utilities/changesAlert';
import { useState, useEffect } from 'react';

const redirect = () =>
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google${window.location.search}`;

export default function () {
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const redirect_url = params.get('redirect_url');
        const final = () => redirect_url
            ? window.location.replace(redirect_url)
            : (setLoggedIn(true), window.history.replaceState({}, '', window.location.pathname));

        if (document.cookie.includes('token')) return final();

        const token = params.get('token');
        if (token) {
            document.cookie = `token=${token}; path=/`;
            final();
            // changesAlert().then(() => final());
        }
    }, []);

    return (
        <main className={styles.main}>
            {loggedIn
                ? <strong>You are already signed in.</strong>
                : <button onClick={redirect}>Sign in with Google</button>
            }
        </main>
    );
}