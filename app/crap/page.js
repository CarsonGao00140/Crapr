'use client'

import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Card from '../components/Card.js';

export default function () {
    const [results, setResults] = useState();

    useEffect(() => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api${window.location.pathname}${window.location.search}`;
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(response => response.json())
            .then(({ data }) => setResults(data))
            .catch(console.error);
    }, []);

    return (
        <main>
            {results === undefined
                ? <p>Loading...</p>
                :results.length !== 0
                    ? <ul className={styles.list}>
                        {results.map((result, index) => <Card key={index} data={result} />)}
                    </ul>
                    : <p>No results found</p>
            }
        </main>
    );
}