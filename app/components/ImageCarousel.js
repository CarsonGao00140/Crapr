import { useState } from 'react';
import styles from './card.module.css';

export default function ({ images, title }) {
    const [image, setImage] = useState(0);

    const next = event => {
        event.stopPropagation();
        setImage(prevImage => (prevImage + 1) % images.length);
    };

    const prev = event => {
        event.stopPropagation();
        setImage(prevImage => (prevImage - 1 + images.length) % images.length);
    }

    return (
        <div className={styles.imageContainer}>
            <img src={images[image]} alt={title} className={styles.image} />
            {images.length > 1 && <>
                <button className={styles.prev} onClick={prev}>⬅️</button>
                <button className={styles.next} onClick={next}>➡️</button>
            </>}
        </div>
    );
}