
import React from 'react';
import styles from './Workshop.module.css';

export default function Workshop() {
    const bgUrl = `${process.env.PUBLIC_URL}/image/conference-crowd.jpg`;
    const sideVideo = `${process.env.PUBLIC_URL}/video/rose.mp4`;

    const workshopsData = [
        { id: 1, title: 'Digital\nStorytelling', description: 'I\'m a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. ' },
        { id: 2, title: 'The\nCreative Lab',      description: 'I\'m a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. ' },
        { id: 3, title: 'Illustration\nMasterclass', description: 'I\'m a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. ' },
    ];

    return (
        <>

            <section
                className={styles.heroImageSection}
                style={{ backgroundImage: `url(${bgUrl})` }}
            >

            </section>


            <section id="workshop" className={styles.workshopsSection}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Workshops<br/> to Blow<br/> Your Mind</h2>
                    <video
                        className={styles.sideVideo}
                        src={sideVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                    />
                </div>

                <div className={styles.grid}>
                    {workshopsData.map(item => (
                        <div key={item.id} className={styles.card}>
                            <span className={styles.badge}>Workshop #{item.id}</span>
                            <h3 className={styles.workshopTitle}>{item.title}</h3>
                            <p className={styles.description}>{item.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}
