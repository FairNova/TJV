import React from 'react';
import styles from './Nav.module.css';

export default function Nav() {
    return (
        <nav className={styles.nav}>
            <ul>
                <li><a href="#speakers">Speakers</a></li>
                <li><a href="#workshops">Workshops</a></li>
                <li><a href="#agenda">Agenda</a></li>
            </ul>
        </nav>
    );
}
