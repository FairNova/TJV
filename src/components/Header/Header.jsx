import React from 'react'
import styles from './Header.module.css'
import Button from "../Button/Button";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
export default function Header() {

    const navigate = useNavigate();
    return (
        <header className={styles.header}>

            <div className={styles.inner}>

                <div className={styles.logoText}>
                    <span className={styles.logoBold}>CRTVTY/</span>
                    <span className={styles.logoLight}>CON</span>
                </div>

                <nav className={styles.nav}>
                    <a href="#speakers">Speakers</a>
                    <a href="#workshop">Workshops</a>
                    <a href="#agenda">Agenda</a>
                    <Link to="/tickets" className={styles.cta}>Get Tickets</Link>

                </nav>


            </div>
        </header>
    )
}
