'use client'

import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { LoadScript, GoogleMap, Circle } from '@react-google-maps/api';

const maxRange = 20;

const navigate = path => () =>
    window.location.pathname = path;

const deleteCookie = name =>
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

export default function () {
    const [selectedPosition, setSelectedPosition] = useState({ lat: 45.349, lng: -75.758 });
    const [circle, setCircle] = useState(); 
    const [range, setRange] = useState(5);
    const [keyword, setKeyword] = useState('');
    const [showTaken, setShowTaken] = useState(false);
    const [currentPosition, setCurrentPosition] = useState({ lat: 45.349, lng: -75.758 });
    const [feedback, setFeedback] = useState('');

    const handleMapClick = ({ latLng }) =>
        setSelectedPosition({ lat: latLng.lat(), lng: latLng.lng()});

    const circleOptions = {
        strokeColor: "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.35,
        clickable: true,
        draggable: true,
        editable: true,
        radius: range * 1000,
    };

    const keywordTrimmed = keyword.trim();

    const search = event => {
        event.preventDefault();
    
        const params = {
            query: keywordTrimmed,
            long: selectedPosition.lng,
            lat: selectedPosition.lat,
            distance: range * 1000,
            show_taken: showTaken
        };
    
        window.location.href = `crap?${new URLSearchParams(params)}`;
    };

    const signOut = () => {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/crap/mine`;
        const token = document.cookie.split('; ').find(row => row.startsWith('token=')).split('=')[1];

        fetch(url, { headers: { 'Authorization': `Bearer ${token}` } })
            .then(response => response.json())
            .then(({ data }) => {
                localStorage.setItem('crap', JSON.stringify(data));
                deleteCookie('token');
                window.location.reload();
            })
            .catch(console.error);
    };

    useEffect(() =>
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });
                setSelectedPosition({ lat: latitude, lng: longitude });
            },
            () => setFeedback("Couldn’t get your location.")
        )
    , []);

    return (
        <main className={styles.main}>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={{ height: '25rem', width: '100%' }}
                    center={currentPosition}
                    zoom={11}
                    onClick={handleMapClick}
                >
                    <Circle
                        center={selectedPosition}
                        options={circleOptions}
                        onLoad={setCircle}
                        onRadiusChanged={() => {
                            if (!circle) return;
                            
                            let currentRadius = circle.getRadius();
                            const maxRadius = maxRange * 1000;
                            if (currentRadius > maxRadius) {
                                currentRadius = maxRadius;
                                circle.setRadius(maxRadius);
                            }
                            setRange(currentRadius / 1000);
                        }}
                    />                         
                </GoogleMap>
            </LoadScript>
            <form className={styles.form} onSubmit={search}>
                <label htmlFor='range'>Range: {Math.round(range)} KM</label>
                <input
                    id='range'
                    type='range'
                    min='1'
                    max={maxRange}
                    value={range}
                    onChange={({ target }) => setRange(target.value)}
                />

                {feedback && <strong>{feedback}</strong>}
                <div className={styles.field}>
                    <input
                        type='text'
                        value={keyword}
                        onChange={({ target }) => setKeyword(target.value)}
                        placeholder="Search for crap"
                        autoFocus
                    />
                    <button disabled={!keywordTrimmed}>Search</button>
                </div>

                <div className={styles.field}>
                    <label htmlFor='showTaken'>Show Taken:</label>
                    <input
                        id='showTaken'
                        type='checkbox'
                        checked={showTaken}
                        onChange={({ target }) => setShowTaken(target.checked)}
                    />
                </div>
            </form>
            <button onClick={navigate("offer")}>Offer</button>
            <button onClick={navigate("mine")}>Mine</button>
            <button onClick={signOut}>Sign Out</button>
        </main>
    );
}