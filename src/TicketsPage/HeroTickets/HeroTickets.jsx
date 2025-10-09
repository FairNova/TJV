import styles from './HeroTickets.module.css';
import Button from "../../components/Button/Button";
import React from "react";

export default function Hero() {
    function scrollToAll() {
        const el = document.getElementById("all-tickets");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    return (
        <section className={styles.hero}>
            <div className={styles.inner}>
                <h1 className={styles.title}>CRTVTY/CON 2035</h1>
                <p className={styles.subtitle}>
                    You are now logged in to your account. Here you can view your tickets, buy new ones, and edit all of your purchases.Use the menu on the right to navigate.
                </p>
                <Button variant="chat" onClick={scrollToAll}>Buy Tickets</Button>
            </div>
        </section>
    );
}
