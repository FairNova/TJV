import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

export default function Button({ variant, children, className }) {
    return (
        <button className={clsx(
            styles.btn,
            styles[variant],
            className)}>
            {children}
        </button>
    );
}
