import React from 'react';
import styles from './Button.module.css';
import clsx from 'clsx';

export default function Button({
                                   as = 'button',
                                   href,
                                   variant,
                                   children,
                                   className = '',
                                   ...rest
                               }) {
    const classes = clsx(styles.btn, variant && styles[variant], className);

    if (as === 'a') {
        return (
            <a href={href} className={classes} {...rest}>
                {children}
            </a>
        );
    }

    return (
        <button type="button" className={classes} {...rest}>
            {children}
        </button>
    );
}
