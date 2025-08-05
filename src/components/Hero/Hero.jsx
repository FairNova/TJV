
import React from 'react';
import styles from './Hero.module.css';
import  Button  from '../Button/Button';


export default function Hero() {
    return (
        <section className={styles.hero}>
            <video
                className={styles.hero__video}
                src="/video/bg.mp4"
                autoPlay
                muted
                loop
            />
            <div className={styles.hero__overlay}>
                <h1 className={styles.hero__title}>
                    CRTVTY/CON
                    <br/>
                    CRTVTY/CON
                    <br/>
                    CRTVTY/CON
                </h1>
                <h2 className={styles.hero__subtitle}>
                    CREATIVE MINDS COME TOGETHER
                </h2>
                <p className={styles.hero__meet}>
                    12. 1. 2035 &nbsp;|&nbsp; Conference Venue
                </p>
                <Button variant="chat" >Get Tickets</Button>
            </div>
        </section>
    );
}
