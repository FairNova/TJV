import React from 'react';
import styles from './Agenda.module.css';
import Button from "../Button/Button";

export default function Agenda() {
    return (
        <section className={styles.agendaSection} id="agenda">
            <h2 className={styles.title}>AGENDA</h2>
            <div className={styles.contentWrapper}>
                <div className={styles.videoCircle}>
                    {/* Видео внутри кругового контейнера */}
                    <video
                        className={styles.video}
                        src={`${process.env.PUBLIC_URL}/video/agenda-preview.mp4`}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                    </div>
                <div className={styles.scheduleBox}>
                    <ul className={styles.scheduleList}>
                        <li>
                            <span className={styles.time}>9am – 10am</span>
                            <span className={styles.event}>Meet &amp; Greet</span>
                        </li>
                        <li>
                            <span className={styles.time}>10am – 12pm</span>
                            <span className={styles.event}>Keynote Speakers</span>
                            <span className={styles.place}>Main Auditorium</span>
                        </li>
                        <li>
                            <span className={styles.time}>12pm – 1pm</span>
                            <span className={styles.event}>Lunch Break</span>
                        </li>
                        <li>
                            <span className={styles.time}>1pm – 5pm</span>
                            <span className={styles.event}>Workshop Sessions</span>
                            <span className={styles.place}>Havana Convention Room</span>
                        </li>
                        <li>
                            <span className={styles.time}>7pm – 12am</span>
                            <span className={styles.event}>Closing Party</span>
                            <span className={styles.place}>The Ball Room</span>
                        </li>
                    </ul>
                    <Button variant="chat" >Agenda &amp; Tickets</Button>
                </div>
            </div>
        </section>
    );
}