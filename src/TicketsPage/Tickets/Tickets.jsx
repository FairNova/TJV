import React, { useState } from "react";
import s from "./Tickets.module.css";

// 🔹 Моки (заменишь данными с бэка позже)
const MY_TICKETS = [
    {
        id: "t1",
        startISO: "2035-01-12T09:30:00Z",
        endISO:   "2035-01-12T10:00:00Z",
        title: "Meet & Greet",
        venue: "Main Foyer",
    },
    {
        id: "t2",
        startISO: "2035-01-12T10:00:00Z",
        endISO:   "2035-01-12T12:00:00Z",
        title: "Keynote Speakers",
        venue: "Main Auditorium",
    },
    {
        id: "t3",
        startISO: "2035-01-12T13:00:00Z",
        endISO:   "2035-01-12T14:00:00Z",
        title: "Lunch & Networking",
        venue: "Cafeteria",
    },
    {
        id: "t4",
        startISO: "2035-01-12T14:00:00Z",
        endISO:   "2035-01-12T15:30:00Z",
        title: "Workshop A",
        venue: "Room B",
    },
    {
        id: "t5",
        startISO: "2035-01-12T16:00:00Z",
        endISO:   "2035-01-12T17:00:00Z",
        title: "Closing",
        venue: "Main Auditorium",
    },
];

function toTimeHM(iso, locale = "uk-UA") {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" })
        .format(d)
        .replace(/^0/, ""); // как на макете
}

function formatDuration(startISO, endISO, fallbackMinutes) {
    let minutes =
        typeof fallbackMinutes === "number"
            ? fallbackMinutes
            : Math.round((new Date(endISO) - new Date(startISO)) / 60000);

    if (minutes < 60) return `${minutes} minutes`;
    const h = Math.round(minutes / 60);
    if (h === 1) return "1 hour";
    if (h >= 2 && h <= 4) return `${h} hours`;
    return `${h} hours`;
}

const Pin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="#111" strokeWidth="1.8"/>
        <circle cx="12" cy="10" r="2.8" stroke="#111" strokeWidth="1.6"/>
    </svg>
);

export default function TicketsPage() {

    const [expanded, setExpanded] = useState(false);

    const total = MY_TICKETS.length;
    const visibleCount = expanded ? total : Math.min(2, total);
    const items = MY_TICKETS.slice(0, visibleCount);
    const remaining = Math.max(total - visibleCount, 0); // сколько скрыто

    return (
        <div className={s.page}>
            <div className={s.container_M}>
                <h1 className={s.pageTitle}>My tickets</h1>

                {items.map((t) => (
                    <div key={t.id}>
                        <div className={s.agendaRow}>

                            <div className={s.timeCol}>
                                <div className={s.timeRange}>
                                    {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                </div>
                                <div className={s.duration}>
                                    {formatDuration(t.startISO, t.endISO, t.lengthMin)}
                                </div>
                            </div>


                            <div className={s.infoCol}>
                                <div className={s.eventTitle}>{t.title}</div>
                                <div className={s.place}>
                                    <Pin />
                                    <span>{t.venue}</span>
                                </div>
                            </div>
                        </div>
                        <div className={s.hr} />
                    </div>
                ))}


                {total > 2 && (
                    <div className={s.moreRow}>
                        <div className={s.leftSpacer} />
                        <div className={s.moreRight}>

                            {!expanded && (
                                <div className={s.remaining}>
                                    Show more: &nbsp;{remaining}
                                </div>
                            )}

                            <button
                                className={s.btnAll}
                                aria-expanded={expanded}
                                onClick={() => setExpanded((v) => !v)}
                            >
                                {expanded ? "Hide" : `Show`}

                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className={s.container_A}>
                <h1 className={s.pageTitle}>All tickets</h1>

                {items.map((t) => (
                    <div key={t.id}>
                        <div className={s.agendaRow}>

                            <div className={s.timeCol}>
                                <div className={s.timeRange}>
                                    {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                </div>
                                <div className={s.duration}>
                                    {formatDuration(t.startISO, t.endISO, t.lengthMin)}
                                </div>
                            </div>


                            <div className={s.infoCol}>
                                <div className={s.eventTitle}>{t.title}</div>
                                <div className={s.place}>
                                    <Pin />
                                    <span>{t.venue}</span>
                                </div>
                            </div>
                        </div>
                        <div className={s.hr} />
                    </div>
                ))}


                {total > 2 && (
                    <div className={s.moreRow}>
                        <div className={s.leftSpacer} />
                        <div className={s.moreRight}>

                            {!expanded && (
                                <div className={s.remaining}>
                                    Show more: &nbsp;{remaining}
                                </div>
                            )}

                            <button
                                className={s.btnAll}
                                aria-expanded={expanded}
                                onClick={() => setExpanded((v) => !v)}
                            >
                                {expanded ? "Hide" : `Show`}

                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
