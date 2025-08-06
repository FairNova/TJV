import React from 'react';
import styles from './Speakers.module.css';
import SpeakerCard from './SpeakersCard';

const speakersData = [
    {
        photo: '/image/sp1.png',
        name: 'Nina Rashid',
        role: 'Founder of DigiArt',
    },
    {
        photo: '/image/sp2.png',
        name: 'Matias Flores',
        role: 'Art Director at Studio UnZoom',
    },
    {
        photo: '/image/sp3.png',
        name: 'Isaac Wright',
        role: 'Head of Product Design at TFS',
    },
    {
        photo: '/image/sp4.png',
        name: 'Liu Yang',
        role: 'Indie Illustrator',
    },
];

export default function Speakers() {
    return (
        <section className={styles.speakers} id="speakers">
            <h2 className={styles.title}>Main<br/> Stage<br/> Highlights</h2>
            <div className={styles.grid}>
                {speakersData.map((sp, idx) => (
                    <SpeakerCard
                        key={idx}
                        photo={sp.photo}
                        name={sp.name}
                        role={sp.role}
                    />
                ))}
            </div>
        </section>
    );
}