'use client'

import { useEffect, useState } from 'react';
import styles from '../page.module.css';
import Card from '../components/Card.js';

export default function () {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!document.cookie.includes('token')){
            window.location.replace('/');
            return;
        };    
    
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/crap${window.location.pathname}`;
        fetch(url, {credentials: 'include'})
            .then(response => response.json())
            .then(({ data }) => {
                console.log(data);
                setResults(data);
            })
            .then(() => setLoading(false))
            .catch(console.error);
    }, []);

    return (
        <main>
            {loading
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