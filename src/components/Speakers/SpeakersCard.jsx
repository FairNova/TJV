import React from 'react';
import styles from './Speakers.module.css';

export default function SpeakerCard({ photo, name, role }) {
    return (
        <div className={styles.card}>
            <img src={photo} alt={name} className={styles.photo} />
            <h3 className={styles.name}>{name}</h3>
            <span className={styles.role}>{role}</span>
        </div>
    );
}
