import React from "react";
import styles from "./Footer.module.css";

export default function Footer({
                                   year = new Date().getFullYear(),
                                   brand = "CRTVTY/CON",
                                   className = "",
                               }) {
    return (
        <footer className={`${styles.footer} ${className}`}>
            <div className={styles.inner}>
        <span className={styles.text}>
          &copy; {year} by {brand}.&nbsp;

        </span>
            </div>
        </footer>
    );
}
