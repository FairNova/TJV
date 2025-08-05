import React from 'react'
import styles from './Header.module.css'
import Button from "../Button/Button";

export default function Header() {
    return (
        <header className={styles.header}>

            <div className={styles.inner}>
                {/* Логотип: первая часть норм, вторая полужирная */}
                <div className={styles.logoText}>
                    <span className={styles.logoBold}>CRTVTY/</span>
                    <span className={styles.logoLight}>CON</span>
                </div>

                <nav className={styles.nav}>
                    <a href="#speakers">Speakers</a>
                    <a href="#workshops">Workshops</a>
                    <a href="#agenda">Agenda</a>
                    <Button variant="primary" className={styles.cta}>Get Tickets</Button>
                </nav>


            </div>
        </header>
    )
}
