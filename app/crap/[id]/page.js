'use client'

import { useState, useEffect } from 'react';
import styles from '../../page.module.css';
import Card from '../../components/Card.js';
import checkUser from '../../utilities/checkUser.js';

export default function () {
    const [data, setData] = useState();

    const handleSubmit = event => {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const suggestion = Object.fromEntries(formData);
        const { action } = event.nativeEvent.submitter.dataset;
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crap/${data._id}/${action}`, { 
            method: 'POST', 
            headers: { 'Authorization': `Bearer ${token}` },
            ...(action === 'suggest' && {
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(suggestion)
            })
        })
        .then(response => response.json())
        .then(({ data: { images, ...rest } }) =>
            setData({ ...rest, images: data.images })
        )
        .catch(console.error);
    }

    const handleReset = () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crap/${data._id}/reset`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(response => response.json())
        .then(({ data: { images, ...rest } }) =>
            setData({ ...rest, images: data.images })
        )
        .catch(console.error);
    };

    const handleDelete = () => {
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/crap/${data._id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` },
        })
        .then(() => window.location.href = '/mine')
        .catch(console.error);
    }

    useEffect(() => {
        const { search } = window.location;
        if (search) {
            window.history.replaceState({}, '', window.location.pathname);
            const string = new URLSearchParams(search).get('data');
            setData(JSON.parse((string)));
        } else {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/api${window.location.pathname}`
            const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
                .then(response => response.json())
                .then(({ data }) => setData(data))
                .catch(console.error);
        }
    }, []);

    return (
        <main className={styles.details}>
            {data
                ? <>
                    <Card data={data} />
                    <div className={styles.options}>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {(() => {
                                const suggestion = data.suggestion && <>
                                    <p>{data.suggestion.address}</p>
                                    <p>{new Date(data.suggestion.date).toLocaleDateString('en-CA')} {data.suggestion.time}</p>
                                </>;

                                switch (data.status) {
                                    case 'AVAILABLE':
                                        return (!checkUser(data, ['owner']) && <button data-action='interested'>Interest</button>);

                                    case 'INTERESTED':
                                        return (<>
                                            {checkUser(data, ['owner']) && <>
                                                <input type='text' name='address' placeholder='Address' required/>
                                                <input type="date" name="date" required/>
                                                <input type="time" name="time" required/>
                                                <button data-action='suggest'>Suggest</button>
                                            </>}
                                            {checkUser(data, ['buyer']) && <h2>Awaiting owner’s schedule.</h2>}
                                        </>);

                                    case 'SCHEDULED':
                                        return(<>
                                            {checkUser(data, ['owner']) && <h2>The submitted schedule.</h2>}
                                            {checkUser(data, ['buyer']) && <h2>Owner's proposed schedule.</h2>}
                                            {checkUser(data, ['owner', 'buyer']) && suggestion}
                                            {checkUser(data, ['owner']) && <h2>Awaiting buyer's confirmation.</h2>}
                                            {checkUser(data, ['buyer']) && <>
                                                <button data-action='agree'>Agree</button>
                                                <button data-action='disagree'>Disagree</button>
                                            </>}
                                        </>);

                                    case 'AGREED':
                                        return(<>
                                            {checkUser(data, ['owner']) && <h2>Please confirm that it's flushed.</h2>}
                                            {checkUser(data, ['buyer']) && <h2>Awaiting owner's confirmation.</h2>}
                                            {checkUser(data, ['owner', 'buyer']) && suggestion}
                                            {checkUser(data, ['owner']) && <button data-action='flush'>Confirm</button>}
                                        </>);

                                    case 'FLUSHED':
                                        return(checkUser(data, ['owner', 'buyer']) && <h2>Transaction completed.</h2>);
                                    default:
                                        return <h2>Invalid status.</h2>;
                                }
                            })()}
                        </form>
                        {checkUser(data, ['owner', 'buyer']) && data.status !== 'AVAILABLE' && data.status !== 'FLUSHED' && <button onClick={handleReset}>Reset</button>}
                        {checkUser(data, ['owner']) && <button onClick={handleDelete}>Delete</button>}
                    </div>
                </> 
                : "Loading..."}
        </main>
    );
}