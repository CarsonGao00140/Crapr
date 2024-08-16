'use client'

import { useState, useEffect } from 'react';
import styles from '../page.module.css';
import { LoadScript, GoogleMap, Marker } from '@react-google-maps/api';

export default function UploadForm() {
    const [currentPosition, setCurrentPosition] = useState({ lat: 45.349, lng: -75.758 });
    const [selectedPosition, setSelectedPosition] = useState({ lat: 45.349, lng: -75.758 });
    const [feedback, setFeedback] = useState('');

    useEffect(() => {
        if (!document.cookie.includes('token')){
            window.location.replace('/');
            return;
        };
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentPosition({ lat: latitude, lng: longitude });
                setSelectedPosition({ lat: latitude, lng: longitude });
            },
            () => setFeedback("Couldn’t get your location.")
        ),[]
    }
    );

    const handleMapClick = event =>
        setSelectedPosition({
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        });

    const handleSubmit = event => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            location: {coordinates: [selectedPosition.lng, selectedPosition.lat]}
        };
        formData.delete('title');
        formData.delete('description');
        formData.append('data', JSON.stringify(data));

        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/crap`;
        fetch(url, { method: 'POST', body: formData, credentials: 'include' })
            .then(response => response.json())
            .then(() => window.location.pathname = 'mine')
            .catch(console.error);
    };

    return (
        <main>
            <form className={styles.form} onSubmit={handleSubmit}>
                <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
                    <GoogleMap
                        mapContainerStyle={{ height: '25rem', width: '100%' }}
                        center={currentPosition}
                        zoom={15}
                        onClick={handleMapClick}
                    >
                        {selectedPosition && <Marker position={selectedPosition} />}
                    </GoogleMap>
                </LoadScript>
                {feedback && <strong>{feedback}</strong>}
                <div>
                    <input
                        className={styles.input}
                        type="text"
                        name="title"
                        minLength="3"
                        maxLength="255"
                        placeholder="Title"
                        required />
                </div>
                <div className={styles.field}>
                    <textarea
                        className={styles.textarea}
                        name="description"
                        minLength="3"
                        maxLength="255"
                        placeholder="Description"
                        required></textarea>
                </div>
                <div className={styles.field}>
                    <label htmlFor="images">Upload Images:</label>
                    <input type="file" id="images" name="images" multiple accept="image/*" required />
                </div>
                <button>Post</button>
            </form>
        </main>
    );
}