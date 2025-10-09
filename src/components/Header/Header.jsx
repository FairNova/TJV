/*
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
*/
import React from "react";
import styles from "./Header.module.css";
// Button и useNavigate не нужны — удалил
/*
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const { pathname } = useLocation();
    const isTickets = pathname.startsWith("/tickets");
    const cta = isTickets
        ? { label: "EXIT", to: "/" }
        : { label: "Get Tickets", to: "/tickets" };

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <div className={styles.logoText}>
                    <span className={styles.logoBold}>CRTVTY/</span>
                    <span className={styles.logoLight}>CON</span>
                </div>

                <nav className={styles.nav}>
                    {/!* Если хочешь, на /tickets лучше вести на секции главной: "/#speakers" и т.п. *!/}
                    <a href="#speakers">Speakers</a>
                    <a href="#workshop">Workshops</a>
                    <a href="#agenda">Agenda</a>

                    <Link to={cta.to} className={styles.cta}>
                        {cta.label}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
*/
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const { pathname } = useLocation();
    const onTickets = pathname.startsWith("/tickets");
    const isHome = pathname === "/";

    const ExitOrTickets = onTickets
        ? { label: "EXIT", to: "/" }
        : { label: "Get Tickets", to: "/tickets" };

    const HashLink = ({ hash, children, className }) =>
        isHome ? (
            <a href={`#${hash}`} className={className}>{children}</a>
        ) : (
            <Link to={`/#${hash}`} className={className}>{children}</Link>
        );

    return (
        <header className={styles.header}>
            <div className={styles.inner}>
                <div className={styles.logoText}>
                    <span className={styles.logoBold}>CRTVTY/</span>
                    <span className={styles.logoLight}>CON</span>
                </div>

                <nav className={styles.nav}>
                    <HashLink hash="speakers">Speakers</HashLink>
                    <HashLink hash="workshop">Workshops</HashLink>
                    <HashLink hash="agenda">Agenda</HashLink>

                    <Link to={ExitOrTickets.to} className={styles.cta}>
                        {ExitOrTickets.label}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
