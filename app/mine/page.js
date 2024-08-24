'use client'

import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Card from '../components/Card.js';

export default function () {
    const [results, setResults] = useState();

    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/crap${window.location.pathname}`;
        console.log(document.cookie);

        fetch(url, {credentials: 'include'})
            .then(response => response.json())
            .then(({ data }) => setResults(data))
            .catch(console.error);
    }, []);

    return (
        <main>
            {results === undefined
                ? <p>Loading...</p>
                : results.length !== 0
                    ? <ul className={styles.list}>
                        {results.map((result, index) => <Card key={index} data={result} />)}
                    </ul>
                    : <p>No results found</p>
            }
        </main>
    );
}