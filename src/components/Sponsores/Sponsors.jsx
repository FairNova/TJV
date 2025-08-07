import React from 'react';
import styles from './Sponsors.module.css';

const sponsorsData = [
    { id: 1, logo: '/image/sponsors.png', alt: 'UXMT' }
];

export default function Sponsors() {

    const bgUrl = `${process.env.PUBLIC_URL}/image/conference-crowd.jpg`;

    return (

        <>

            <section
                className={styles.heroImageSection}
                style={{ backgroundImage: `url(${bgUrl})` }}
            >
                <section className={styles.sponsorsSection} id="sponsors">
                    <h2 className={styles.title}>OUR SPONSORS</h2>
                    <div className={styles.grid}>
                        {sponsorsData.map(item => (
                            <div key={item.id} className={styles.card}>
                                <img src={item.logo} alt={item.alt} className={styles.logo} />
                            </div>
                        ))}
                    </div>
                </section>
            </section>

            </>
    );
}