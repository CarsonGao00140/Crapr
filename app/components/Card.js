import styles from './card.module.css';
import ImageCarousel from './ImageCarousel.js';
import checkUser from '../utilities/checkUser.js';
import capitalizeFirstLetter from '../utilities/capitalizeFirstLetter.js';

export default function ({ data }) {
    const params = new URLSearchParams(window.location.search);
    const showTaken = params.get('show_taken') === 'true';
    const mine = window.location.pathname === '/mine';

    const token = document.cookie.split('=')[1];
    const payload = atob(token.split('.')[1]);
    const { id } = JSON.parse(payload);

    const handleClick = () => {
        if (window.location.pathname === `/crap/${data._id}`) return;
        const uri = encodeURIComponent(JSON.stringify(data));
        window.location.href = `/crap/${data._id}?data=${uri}`;
    };

    return (
        <div className={styles.card} onClick={handleClick}>
            <ImageCarousel images={data.images} title={data.title} />
            <div className={styles.info}>   
                <div className={styles.row}>
                    <h2>{data.title}</h2>
                    <h3>{checkUser(data, ['owner']) ? "Yourself" : data.owner?.name}</h3>
                </div>
                <div className={styles.row}>
                    <h3>{capitalizeFirstLetter(data.status)}</h3>
                    {data.buyer?._id === id && <p>You're the Buyer</p>}
                </div>
                <p>{data.description}</p>
            </div>
        </div>
    );
}