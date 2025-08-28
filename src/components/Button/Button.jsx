import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

export default function Button({as='button', href, variant, children, className,...rest }) {
    if (as === 'a') return <a href={href} {...rest}>{children}</a>;
    return (
        <button className={clsx(
            styles.btn,
            styles[variant],
            className)}>
            {children}
        </button>
    );
}
