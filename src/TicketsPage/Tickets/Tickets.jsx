/*
// import React, { useMemo, useState, useEffect } from "react";
// import s from "./Tickets.module.css";
//
// const ALL_TICKETS = [
//     { id: "t1", startISO: "2035-01-12T09:30:00Z", endISO: "2035-01-12T10:00:00Z", title: "Meet & Greet",       venue: "Main Foyer",      priceUSD: 100 },
//     { id: "t2", startISO: "2035-01-12T10:00:00Z", endISO: "2035-01-12T12:00:00Z", title: "Keynote Speakers",   venue: "Main Auditorium", priceUSD: 250 },
//     { id: "t3", startISO: "2035-01-12T13:00:00Z", endISO: "2035-01-12T14:00:00Z", title: "Lunch & Networking", venue: "Cafeteria",       priceUSD: 30  },
//     { id: "t4", startISO: "2035-01-12T14:00:00Z", endISO: "2035-01-12T15:30:00Z", title: "Workshop A",         venue: "Room B",          priceUSD: 60  },
//     { id: "t5", startISO: "2035-01-12T16:00:00Z", endISO: "2035-01-12T17:00:00Z", title: "Closing",            venue: "Main Auditorium", priceUSD: 0   },
// ];
//
// function toTimeHM(iso, locale = "en-US") {
//     return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" })
//         .format(new Date(iso))
//         .replace(/^0/, "");
// }
// function formatDuration(startISO, endISO, fallbackMinutes) {
//     let minutes =
//         typeof fallbackMinutes === "number"
//             ? fallbackMinutes
//             : Math.round((new Date(endISO) - new Date(startISO)) / 60000);
//     if (minutes < 60) return `${minutes} minut`;
//     const h = Math.round(minutes / 60);
//     if (h === 1) return "1 hodina";
//     if (h >= 2 && h <= 4) return `${h} hodiny`;
//     return `${h} hodin`;
// }
// const Pin = () => (
//     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
//         <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="#111" strokeWidth="1.8"/>
//         <circle cx="12" cy="10" r="2.8" stroke="#111" strokeWidth="1.6"/>
//     </svg>
// );
// const Pencil = () => (
//     <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
//         <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="none" stroke="#111" strokeWidth="1.6"/>
//         <path d="M14.06 4.94l3.75 3.75 1.44-1.44a2 2 0 0 0 0-2.83l-.89-.89a2 2 0 0 0-2.83 0l-1.47 1.41z" fill="none" stroke="#111" strokeWidth="1.6"/>
//     </svg>
// );
// const Trash = () => (
//     <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
//         <path d="M3 6h18" stroke="#111" strokeWidth="1.8"/><path d="M8 6V4h8v2" stroke="#111" strokeWidth="1.6"/>
//         <path d="M6 6l1 14h10l1-14" fill="none" stroke="#111" strokeWidth="1.6"/>
//     </svg>
// );
//
// function SeatPickerModal({
//                              open,
//                              ticket,
//                              mode = "buy",
//                              maxSelect = Infinity,
//                              onClose,
//                              onConfirm,
//                          }) {
//     const [map, setMap] = useState({ rows: 0, cols: 0, statusById: {} });
//     const [loading, setLoading] = useState(false);
//     const [validating, setValidating] = useState(false);
//     const [selected, setSelected] = useState(() => new Set());
//     const [error, setError] = useState("");
//
//     useEffect(() => {
//         if (!open || !ticket) return;
//         let alive = true;
//         (async () => {
//             setLoading(true);
//             setError("");
//             setSelected(new Set());
//             try {
//                 const res = await fetch(`/api/tickets/${ticket.id}/seats`);
//                 if (!res.ok) throw new Error(await res.text());
//                 const data = await res.json();
//                 const statusById = {};
//                 (data.seats || []).forEach((s) => (statusById[s.id] = s.status));
//                 if (!alive) return;
//                 setMap({ rows: data.rows, cols: data.cols, statusById });
//             } catch {
//
//                 const rows = 10, cols = 12;
//                 const statusById = {};
//                 for (let r = 0; r < rows; r++) {
//                     for (let c = 0; c < cols; c++) {
//                         const id = String.fromCharCode(65 + r) + (c + 1);
//                         const sold = (r + c) % 7 === 0 || (r === 8 && c > 8);
//                         statusById[id] = sold ? "sold" : "available";
//                     }
//                 }
//                 if (!alive) return;
//                 setError("Error");
//                 setMap({ rows, cols, statusById });
//             } finally {
//                 if (alive) setLoading(false);
//             }
//         })();
//         return () => { alive = false; };
//     }, [open, ticket]);
//
//     function toggleSeat(id) {
//         if (loading) return;
//         const st = map.statusById[id];
//         if (st !== "available") return;
//         const next = new Set(selected);
//         if (next.has(id)) {
//             next.delete(id);
//         } else {
//             if (next.size >= maxSelect) return;
//             next.add(id);
//         }
//         setSelected(next);
//     }
//
//     const colLabels = useMemo(() => Array.from({ length: map.cols }, (_, i) => i + 1), [map.cols]);
//     const rowLabels = useMemo(() => Array.from({ length: map.rows }, (_, i) => String.fromCharCode(65 + i)), [map.rows]);
//
//     const count = selected.size;
//     const totalPrice = (ticket?.priceUSD ?? 0) * count;
//
//     async function handleConfirm() {
//         if (!ticket || count === 0) return;
//         setValidating(true);
//         setError("");
//         const seats = Array.from(selected);
//
//         // валидация у бэка
//         try {
//             const rv = await fetch(`/api/tickets/${ticket.id}/validate`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ seats }),
//             });
//             if (!rv.ok) throw new Error(await rv.text());
//             const v = await rv.json();
//             if (!v.ok && Array.isArray(v.unavailable) && v.unavailable.length) {
//
//                 const statusById = { ...map.statusById };
//                 v.unavailable.forEach((id) => statusById[id] = "sold");
//                 setMap({ ...map, statusById });
//                 const keep = new Set(seats.filter(id => !v.unavailable.includes(id)));
//                 setSelected(keep);
//                 setError(`Some places is unavailable: ${v.unavailable.join(", ")}`);
//                 setValidating(false);
//                 return;
//             }
//
//             if (mode === "buy") {
//
//                 const rp = await fetch(`/api/tickets/${ticket.id}/purchase`, {
//                     method: "POST",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify({ seats }),
//                 });
//                 if (!rp.ok) throw new Error(await rp.text());
//                 onConfirm(seats);
//             } else {
//
//                 onConfirm(seats);
//             }
//         } catch (e) {
//             setError(e?.message || "Error");
//         } finally {
//             setValidating(false);
//         }
//     }
//
//     if (!open) return null;
//
//     return (
//         <div className={s.modalOverlay} onClick={onClose}>
//             <div className={s.modal} role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
//                 <button className={s.modalClose} onClick={onClose} aria-label="Close">×</button>
//
//                 <div className={s.modalHead}>
//                     <div className={s.modalTitle}>{ticket.title}</div>
//                     <div className={s.modalSub}>
//                         {toTimeHM(ticket.startISO)} – {toTimeHM(ticket.endISO)} · {formatDuration(ticket.startISO, ticket.endISO)} · <Pin /> {ticket.venue}
//                     </div>
//                 </div>
//
//                 <div className={s.stage}>Stage</div>
//
//
//                 <div className={s.board}>
//                     <div className={s.corner} />
//                     {colLabels.map((n) => <div key={`c${n}`} className={s.colLabel}>{n}</div>)}
//
//                     {rowLabels.map((rl) => (
//                         <React.Fragment key={`r${rl}`}>
//                             <div className={s.rowLabel}>{rl}</div>
//                             <div className={s.seatRow}>
//                                 {colLabels.map((n) => {
//                                     const id = `${rl}${n}`;
//                                     const st = map.statusById[id] || "available";
//                                     const sel = selected.has(id);
//                                     const cls =
//                                         st === "sold" ? `${s.seat} ${s.seatUnavailable}` :
//                                             sel ? `${s.seat} ${s.seatSelected}` :
//                                                 `${s.seat} ${s.seatAvailable}`;
//                                     return (
//                                         <button
//                                             key={id}
//                                             className={cls}
//                                             onClick={() => toggleSeat(id)}
//                                             aria-pressed={sel}
//                                             aria-disabled={st !== "available"}
//                                             title={id}
//                                         />
//                                     );
//                                 })}
//                             </div>
//                         </React.Fragment>
//                     ))}
//                 </div>
//
//                 {loading && <div className={s.note}>Loading...</div>}
//                 {error && <div className={s.error}>{error}</div>}
//
//                 <div className={s.totalRow}>
//                     <div className={s.totalLeft}>Selected: <strong>{count}</strong></div>
//                     <div className={s.totalRight}>
//                         {mode === "buy" && <div className={s.priceMain}>${totalPrice.toFixed(2)}</div>}
//                         <button className={s.btnBuy} disabled={count === 0 || validating} onClick={handleConfirm}>
//                             {validating ? "Checking…" : (mode === "buy" ? "Buy" : "Change")}
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
//
//
// export default function TicketsPage() {
//
//     const [myTickets, setMyTickets] = useState([]);
//
//     const [expanded, setExpanded] = useState(false);
//
//     const [buyOpen, setBuyOpen] = useState(false);
//     const [activeTicket, setActiveTicket] = useState(null);
//
//     const [swapOpen, setSwapOpen] = useState(false);
//     const [swapTarget, setSwapTarget] = useState(null);
//
//     const total = ALL_TICKETS.length;
//     const items = expanded ? ALL_TICKETS : ALL_TICKETS.slice(0, 2);
//     const remaining = Math.max(total - items.length, 0);
//
//
//     function openBuy(t) { setActiveTicket(t); setBuyOpen(true); }
//     function confirmBuy(seatIds) {
//
//         const add = seatIds.map((seatId, idx) => ({
//             purchaseId: `p_${activeTicket.id}_${seatId}_${Date.now()}_${idx}`, // мок id покупки
//             eventId: activeTicket.id,
//             seatId,
//             startISO: activeTicket.startISO,
//             endISO: activeTicket.endISO,
//             title: activeTicket.title,
//             venue: activeTicket.venue,
//             priceUSD: activeTicket.priceUSD,
//         }));
//         setMyTickets((prev) => [...add, ...prev]);
//         setBuyOpen(false);
//         setActiveTicket(null);
//     }
//
//
//     function openSwap(purchase) {
//
//         const ticket = ALL_TICKETS.find(t => t.id === purchase.eventId);
//         if (!ticket) return;
//         setSwapTarget(purchase);
//         setActiveTicket(ticket);
//         setSwapOpen(true);
//     }
//     async function confirmSwap(seatIds) {
//         const newSeat = seatIds[0];
//         try {
//
//             const res = await fetch(`/api/purchases/${swapTarget.purchaseId}/exchange`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ newSeat }),
//             });
//             if (!res.ok) throw new Error(await res.text());
//
//             setMyTickets((prev) =>
//                 prev.map((p) => p.purchaseId === swapTarget.purchaseId ? { ...p, seatId: newSeat } : p)
//             );
//             setSwapOpen(false);
//             setSwapTarget(null);
//             setActiveTicket(null);
//         } catch (e) {
//             alert(e?.message || "Error. Can not change a place");
//         }
//     }
//
//     /!* --------- Возврат (Refund) --------- *!/
//     async function refund(purchase) {
//         if (!window.confirm(`Refund a ticket (${purchase.title}, місце ${purchase.seatId})?`)) return;
//         try {
//             const res = await fetch(`/api/purchases/${purchase.purchaseId}/refund`, { method: "POST" });
//             if (!res.ok) throw new Error(await res.text());
//             setMyTickets((prev) => prev.filter((p) => p.purchaseId !== purchase.purchaseId));
//         } catch (e) {
//             alert(e?.message || "Error");
//         }
//     }
//
//     return (
//         <div className={s.page}>
//             <div className={s.container}>
//
//
//                 <h1 className={s.pageTitle}>My tickets</h1>
//                 {myTickets.length === 0 && (
//                     <p className={s.note}>You do not have any tickets.</p>
//                 )}
//                 {myTickets.map((t) => (
//                     <div key={t.purchaseId}>
//                         <div className={`${s.agendaRow} ${s.rowMine}`}>
//                             <div className={s.timeCol}>
//                                 <div className={s.timeRange}>
//                                     {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
//                                 </div>
//                                 <div className={s.duration}>
//                                     {formatDuration(t.startISO, t.endISO)}
//                                 </div>
//                             </div>
//
//                             <div className={s.infoColOnly}>
//                                 <div className={s.titleLine}>
//                                     <div className={s.eventTitle}>
//                                         {t.title} <span className={s.seatChip}>Seat {t.seatId}</span>
//                                     </div>
//                                     <div className={s.iconBar}>
//                                         <button className={s.iconBtn} title="Change seat" onClick={() => openSwap(t)}>
//                                             <Pencil />
//                                         </button>
//                                         <button className={s.iconBtn} title="Refund" onClick={() => refund(t)}>
//                                             <Trash />
//                                         </button>
//                                     </div>
//                                 </div>
//
//                                 <div className={s.place}><Pin /><span>{t.venue}</span></div>
//                             </div>
//                         </div>
//                         <div className={s.hr} />
//                     </div>
//                 ))}
//
//
//                 <div className={s.container_A} id="all-tickets">
//                     <h2 className={s.pageTitleA}>All tickets</h2>
//
//                     {items.map((t) => (
//                         <div key={t.id}>
//                             <div className={`${s.agendaRow} ${s.rowWithBuy}`}>
//                                 <div className={s.timeCol}>
//                                     <div className={s.timeRange}>
//                                         {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
//                                     </div>
//                                     <div className={s.duration}>
//                                         {formatDuration(t.startISO, t.endISO, t.lengthMin)}
//                                     </div>
//                                 </div>
//
//                                 <div className={`${s.infoCol} ${s.infoColSplit}`}>
//                                     <div className={s.infoLeft}>
//                                         <div className={s.eventTitle}>{t.title}</div>
//                                         <div className={s.place}><Pin /><span>{t.venue}</span></div>
//                                     </div>
//                                     <div className={s.buyCol}>
//                                         <div className={s.priceMain}>${t.priceUSD.toFixed(2)}</div>
//                                         <button className={s.btnBuy} onClick={() => openBuy(t)}>Buy</button>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className={s.hr} />
//                         </div>
//                     ))}
//
//                     {total > 2 && (
//                         <div className={s.moreRow}>
//                             <div className={s.leftSpacer} />
//                             <div className={s.moreRight}>
//                                 {!expanded && <div className={s.remaining}>Show more:&nbsp;{remaining}</div>}
//                                 <button className={s.btnAll} aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
//                                     {expanded ? "Hide" : "Show"}
//                                 </button>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//
//
//             <SeatPickerModal
//                 open={buyOpen}
//                 ticket={activeTicket}
//                 mode="buy"
//                 onClose={() => setBuyOpen(false)}
//                 onConfirm={confirmBuy}
//             />
//             <SeatPickerModal
//                 open={swapOpen}
//                 ticket={activeTicket}
//                 mode="pick"
//                 maxSelect={1}
//                 onClose={() => setSwapOpen(false)}
//                 onConfirm={confirmSwap}
//             />
//         </div>
//     );
// }
import React, { useMemo, useState, useEffect, useCallback } from "react";
import s from "./Tickets.module.css";

/!* -------- текущий покупатель (пока захардкожен) -------- *!/
const BUYER_ID = 1;

/!* -------------------- helpers -------------------- *!/
function toTimeHM(iso, locale = "en-US") {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" })
        .format(new Date(iso))
        .replace(/^0/, "");
}
function formatDuration(startISO, endISO, fallbackMinutes) {
    let minutes =
        typeof fallbackMinutes === "number"
            ? fallbackMinutes
            : Math.round((new Date(endISO) - new Date(startISO)) / 60000);
    if (minutes < 60) return `${minutes} minut`;
    const h = Math.round(minutes / 60);
    if (h === 1) return "1 hodina";
    if (h >= 2 && h <= 4) return `${h} hodiny`;
    return `${h} hodin`;
}

/!* -------------------- icons -------------------- *!/
const Pin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="#111" strokeWidth="1.8"/>
        <circle cx="12" cy="10" r="2.8" stroke="#111" strokeWidth="1.6"/>
    </svg>
);
const Pencil = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="none" stroke="#111" strokeWidth="1.6"/>
        <path d="M14.06 4.94l3.75 3.75 1.44-1.44a2 2 0 0 0 0-2.83l-.89-.89a2 2 0 0 0-2.83 0l-1.47 1.41z" fill="none" stroke="#111" strokeWidth="1.6"/>
    </svg>
);
const Trash = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M3 6h18" stroke="#111" strokeWidth="1.8"/><path d="M8 6V4h8v2" stroke="#111" strokeWidth="1.6"/>
        <path d="M6 6l1 14h10l1-14" fill="none" stroke="#111" strokeWidth="1.6"/>
    </svg>
);

/!* -------------------- Seat Picker -------------------- *!/
function SeatPickerModal({
                             open,
                             ticket,                    // { id, startISO, endISO, title, venue, priceUSD }
                             mode = "buy",              // "buy" | "pick" (pick — для смены места)
                             maxSelect = Infinity,
                             currentSeatId,             // нужно только для "pick": старое место (например "B7")
                             onClose,
                             onConfirm,                 // callback после успешной операции
                         }) {
    const [map, setMap] = useState({ rows: 0, cols: 0, statusById: {} });
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [selected, setSelected] = useState(() => new Set());
    const [error, setError] = useState("");

    // локальный хелпер: освободить/занять места без рефетча
    const setSeatStatus = useCallback((ids, status) => {
        setMap((m) => {
            const next = { ...m.statusById };
            ids.forEach((id) => { next[id] = status; });
            return { ...m, statusById: next };
        });
    }, []);

    useEffect(() => {
        if (!open || !ticket) return;
        let alive = true;
        (async () => {
            setLoading(true);
            setError("");
            setSelected(new Set());
            try {
                const res = await fetch(`/api/tickets/${ticket.id}/seats`);
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                const statusById = {};
                (data.seats || []).forEach((s) => (statusById[s.id] = s.status));
                if (!alive) return;
                setMap({ rows: data.rows, cols: data.cols, statusById });

                if (mode === "pick" && currentSeatId) {
                    statusById[currentSeatId] = "sold";
                    setMap({ rows: data.rows, cols: data.cols, statusById: { ...statusById } });
                }
            } catch {
                const rows = 10, cols = 12;
                const statusById = {};
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const id = String.fromCharCode(65 + r) + (c + 1);
                        statusById[id] = "available";
                    }
                }
                if (!alive) return;
                setError("Error");
                setMap({ rows, cols, statusById });
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [open, ticket, mode, currentSeatId]);

    function toggleSeat(id) {
        if (loading) return;
        const st = map.statusById[id];
        if (st !== "available") return;
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else {
            if (next.size >= maxSelect) return;
            next.add(id);
        }
        setSelected(next);
    }

    const colLabels = useMemo(() => Array.from({ length: map.cols }, (_, i) => i + 1), [map.cols]);
    const rowLabels = useMemo(() => Array.from({ length: map.rows }, (_, i) => String.fromCharCode(65 + i)), [map.rows]);

    const count = selected.size;
    const totalPrice = (ticket?.priceUSD ?? 0) * count;

    async function handleConfirm() {
        if (!ticket || count === 0) return;
        setValidating(true);
        setError("");
        const seats = Array.from(selected);

        try {
            // 1) валидация на бэке
            const rv = await fetch(`/api/tickets/${ticket.id}/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ seats }),
            });
            if (!rv.ok) throw new Error(await rv.text());
            const v = await rv.json();

            if (!v.ok && Array.isArray(v.unavailable) && v.unavailable.length) {
                setSeatStatus(v.unavailable, "sold");
                const keep = seats.filter((id) => !v.unavailable.includes(id));
                setSelected(new Set(keep));
                setError(`Some places is unavailable: ${v.unavailable.join(", ")}`);
                setValidating(false);
                return;
            }

            if (mode === "buy") {
                // 2A) покупка
                const rp = await fetch(`/api/tickets/${ticket.id}/purchase`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ buyerId: BUYER_ID, seats }),
                });
                if (!rp.ok) throw new Error(await rp.text());

                setSeatStatus(seats, "sold");
                setSelected(new Set());
                onConfirm(seats);
            } else {
                // 2B) смена места — onConfirm выполнит PUT (мы передаём выбранные места наверх)
                onConfirm(seats, { setSeatStatus });
            }
        } catch (e) {
            setError(e?.message || "Error");
        } finally {
            setValidating(false);
        }
    }

    if (!open) return null;

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modal} role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
                <button className={s.modalClose} onClick={onClose} aria-label="Close">×</button>

                <div className={s.modalHead}>
                    <div className={s.modalTitle}>{ticket.title}</div>
                    <div className={s.modalSub}>
                        {toTimeHM(ticket.startISO)} – {toTimeHM(ticket.endISO)} · {formatDuration(ticket.startISO, ticket.endISO)} · <Pin /> {ticket.venue}
                    </div>
                </div>

                <div className={s.stage}>Stage</div>

                <div className={s.board}>
                    <div className={s.corner} />
                    {colLabels.map((n) => <div key={`c${n}`} className={s.colLabel}>{n}</div>)}

                    {rowLabels.map((rl) => (
                        <React.Fragment key={`r${rl}`}>
                            <div className={s.rowLabel}>{rl}</div>
                            <div className={s.seatRow}>
                                {colLabels.map((n) => {
                                    const id = `${rl}${n}`;
                                    const st = map.statusById[id] || "available";
                                    const sel = selected.has(id);
                                    const cls =
                                        st === "sold" ? `${s.seat} ${s.seatUnavailable}` :
                                            sel ? `${s.seat} ${s.seatSelected}` :
                                                `${s.seat} ${s.seatAvailable}`;
                                    return (
                                        <button
                                            key={id}
                                            className={cls}
                                            onClick={() => toggleSeat(id)}
                                            aria-pressed={sel}
                                            aria-disabled={st !== "available"}
                                            title={id}
                                        />
                                    );
                                })}
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {loading && <div className={s.note}>Loading...</div>}
                {error && <div className={s.error}>{error}</div>}

                <div className={s.totalRow}>
                    <div className={s.totalLeft}>Selected: <strong>{count}</strong></div>
                    <div className={s.totalRight}>
                        {mode === "buy" && <div className={s.priceMain}>${totalPrice.toFixed(2)}</div>}
                        <button className={s.btnBuy} disabled={count === 0 || validating} onClick={handleConfirm}>
                            {validating ? "Checking…" : (mode === "buy" ? "Buy" : "Change")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/!* -------------------- Page -------------------- *!/
export default function TicketsPage() {
    const [events, setEvents] = useState([]);
    const [eventsById, setEventsById] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadErr, setLoadErr] = useState("");

    const [myTickets, setMyTickets] = useState([]);

    // Кнопки Show/Hide
    const [expanded, setExpanded] = useState(false);     // All tickets
    const [myExpanded, setMyExpanded] = useState(false); // My tickets

    const [buyOpen, setBuyOpen] = useState(false);
    const [activeTicket, setActiveTicket] = useState(null);

    const [swapOpen, setSwapOpen] = useState(false);
    const [swapTarget, setSwapTarget] = useState(null); // {purchaseId, eventId, seatId, ...}

    /!* --- загрузка событий --- *!/
    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/events");
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                const mapped = (data || []).map(e => ({
                    id: e.id,
                    startISO: e.startAt,
                    endISO: e.endAt,
                    title: e.title,
                    venue: e.venue,
                    priceUSD: typeof e.price === "string" ? parseFloat(e.price) : (e.price ?? 0)
                }));
                if (alive) {
                    setEvents(mapped);
                    const mapById = {};
                    mapped.forEach(ev => { mapById[ev.id] = ev; });
                    setEventsById(mapById);
                    setLoadErr("");
                }
            } catch (err) {
                if (alive) setLoadErr(err?.message || "Failed to load events");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    /!* --- загрузка моих билетов --- *!/
    const loadMyTickets = useCallback(async () => {
        const res = await fetch(`/api/tickets/by-buyer/${BUYER_ID}`);
        if (!res.ok) throw new Error(await res.text());
        const list = await res.json(); // TicketReadDto[]
        const view = (list || []).map(tk => {
            const ev = eventsById[tk.eventId] || {};
            const priceFromTicket = typeof tk.price === "string" ? parseFloat(tk.price) : tk.price;
            return {
                purchaseId: String(tk.id),
                eventId: tk.eventId,
                seatId: tk.seatId ?? "",
                startISO: ev.startISO,
                endISO: ev.endISO,
                title: ev.title,
                venue: ev.venue,
                priceUSD: ev.priceUSD ?? (priceFromTicket ?? 0),
            };
        });
        setMyTickets(view);
    }, [eventsById]);

    useEffect(() => {
        if (Object.keys(eventsById).length > 0) {
            loadMyTickets().catch(() => {});
        }
    }, [eventsById, loadMyTickets]);

    /!* --- UI helpers --- *!/
    // All tickets
    const total = events.length;
    const items = expanded ? events : events.slice(0, 2);
    const remaining = Math.max(total - items.length, 0);

    // My tickets (новое поведение Show/Hide)
    const myTotal = myTickets.length;
    const myItems = myExpanded ? myTickets : myTickets.slice(0, 2);
    const myRemaining = Math.max(myTotal - myItems.length, 0);

    function openBuy(t) { setActiveTicket(t); setBuyOpen(true); }

    // после покупки — рефетчим «Мои билеты» из БД
    function confirmBuy() {
        loadMyTickets().catch(() => {});
        setBuyOpen(false);
        setActiveTicket(null);
    }

    function openSwap(purchase) {
        const ticket = events.find(t => t.id === purchase.eventId);
        if (!ticket) return;
        setSwapTarget(purchase);
        setActiveTicket(ticket);
        setSwapOpen(true);
    }

    async function confirmSwap(seatIds, helpers) {
        const newSeat = seatIds[0];
        if (!swapTarget) return;
        try {
            const res = await fetch(`/api/tickets/${swapTarget.purchaseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ seatId: newSeat }),
            });
            if (!res.ok) throw new Error(await res.text());

            setMyTickets((prev) =>
                prev.map((p) =>
                    p.purchaseId === swapTarget.purchaseId ? { ...p, seatId: newSeat } : p
                )
            );

            if (helpers?.setSeatStatus) {
                if (swapTarget.seatId) helpers.setSeatStatus([swapTarget.seatId], "available");
                helpers.setSeatStatus([newSeat], "sold");
            }

            setSwapOpen(false);
            setSwapTarget(null);
            setActiveTicket(null);
        } catch (e) {
            alert(e?.message || "Error. Can not change a place");
        }
    }

    async function refund(purchase) {
        try {
            const res = await fetch(`/api/tickets/${purchase.purchaseId}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            setMyTickets((prev) => prev.filter((p) => p.purchaseId !== purchase.purchaseId));
        } catch (e) {
            alert(e?.message || "Error");
        }
    }

    return (
        <div className={s.page}>
            <div className={s.container}>
                {/!* -------- My tickets -------- *!/}
                <h1 className={s.pageTitle}>My tickets</h1>

                {myTotal === 0 && (
                    <p className={s.note}>You do not have any tickets.</p>
                )}

                {myItems.map((t) => (
                    <div key={t.purchaseId}>
                        <div className={`${s.agendaRow} ${s.rowMine}`}>
                            <div className={s.timeCol}>
                                <div className={s.timeRange}>
                                    {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                </div>
                                <div className={s.duration}>
                                    {formatDuration(t.startISO, t.endISO)}
                                </div>
                            </div>

                            <div className={s.infoColOnly}>
                                <div className={s.titleLine}>
                                    <div className={s.eventTitle}>
                                        {t.title} {t.seatId && <span className={s.seatChip}>Seat {t.seatId}</span>}
                                    </div>
                                    <div className={s.iconBar}>
                                        <button className={s.iconBtn} title="Change seat" onClick={() => openSwap(t)}>
                                            <Pencil />
                                        </button>
                                        <button className={s.iconBtn} title="Refund" onClick={() => refund(t)}>
                                            <Trash />
                                        </button>
                                    </div>
                                </div>

                                <div className={s.place}><Pin /><span>{t.venue}</span></div>
                            </div>
                        </div>
                        <div className={s.hr} />
                    </div>
                ))}

                {/!* Кнопка Show/Hide для My tickets *!/}
                {myTotal > 2 && (
                    <div className={s.moreRow}>
                        <div className={s.leftSpacer} />
                        <div className={s.moreRight}>
                            {!myExpanded && <div className={s.remaining}>Show more:&nbsp;{myRemaining}</div>}
                            <button
                                className={s.btnAll}
                                aria-expanded={myExpanded}
                                onClick={() => setMyExpanded((v) => !v)}
                            >
                                {myExpanded ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                )}

                {/!* -------- All tickets -------- *!/}
                <div className={s.container_A} id="all-tickets">
                    <h2 className={s.pageTitleA}>All tickets</h2>

                    {loading && <p className={s.note}>Loading…</p>}
                    {!loading && loadErr && <p className={s.error}>{loadErr}</p>}

                    {!loading && !loadErr && items.map((t) => (
                        <div key={t.id}>
                            <div className={`${s.agendaRow} ${s.rowWithBuy}`}>
                                <div className={s.timeCol}>
                                    <div className={s.timeRange}>
                                        {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                    </div>
                                    <div className={s.duration}>
                                        {formatDuration(t.startISO, t.endISO, t.lengthMin)}
                                    </div>
                                </div>

                                <div className={`${s.infoCol} ${s.infoColSplit}`}>
                                    <div className={s.infoLeft}>
                                        <div className={s.eventTitle}>{t.title}</div>
                                        <div className={s.place}><Pin /><span>{t.venue}</span></div>
                                    </div>
                                    <div className={s.buyCol}>
                                        <div className={s.priceMain}>${t.priceUSD.toFixed(2)}</div>
                                        <button className={s.btnBuy} onClick={() => openBuy(t)}>Buy</button>
                                    </div>
                                </div>
                            </div>
                            <div className={s.hr} />
                        </div>
                    ))}

                    {!loading && !loadErr && total > 2 && (
                        <div className={s.moreRow}>
                            <div className={s.leftSpacer} />
                            <div className={s.moreRight}>
                                {!expanded && <div className={s.remaining}>Show more:&nbsp;{remaining}</div>}
                                <button className={s.btnAll} aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
                                    {expanded ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/!* модалки *!/}
            <SeatPickerModal
                open={buyOpen}
                ticket={activeTicket}
                mode="buy"
                onClose={() => setBuyOpen(false)}
                onConfirm={confirmBuy}
            />
            <SeatPickerModal
                open={swapOpen}
                ticket={activeTicket}
                mode="pick"
                maxSelect={1}
                currentSeatId={swapTarget?.seatId}
                onClose={() => setSwapOpen(false)}
                onConfirm={confirmSwap}
            />
        </div>
    );
}
*/
// TicketsPage.jsx
import React, { useMemo, useState, useEffect, useCallback } from "react";
import s from "./Tickets.module.css";


const BUYER_ID = 1;

function toTimeHM(iso, locale = "en-US") {
    return new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" })
        .format(new Date(iso))
        .replace(/^0/, "");
}
function formatDuration(startISO, endISO, fallbackMinutes) {
    let minutes =
        typeof fallbackMinutes === "number"
            ? fallbackMinutes
            : Math.round((new Date(endISO) - new Date(startISO)) / 60000);
    if (minutes < 60) return `${minutes} minut`;
    const h = Math.round(minutes / 60);
    if (h === 1) return "1 hodina";
    if (h >= 2 && h <= 4) return `${h} hodiny`;
    return `${h} hodin`;
}

const Pin = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 22s7-5.33 7-12a7 7 0 1 0-14 0c0 6.67 7 12 7 12Z" stroke="#111" strokeWidth="1.8"/>
        <circle cx="12" cy="10" r="2.8" stroke="#111" strokeWidth="1.6"/>
    </svg>
);
const Pencil = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" fill="none" stroke="#111" strokeWidth="1.6"/>
        <path d="M14.06 4.94l3.75 3.75 1.44-1.44a2 2 0 0 0 0-2.83l-.89-.89a2 2 0 0 0-2.83 0l-1.47 1.41z" fill="none" stroke="#111" strokeWidth="1.6"/>
    </svg>
);
const Trash = () => (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path d="M3 6h18" stroke="#111" strokeWidth="1.8"/>
        <path d="M8 6V4h8v2" stroke="#111" strokeWidth="1.6"/>
        <path d="M6 6l1 14h10l1-14" fill="none" stroke="#111" strokeWidth="1.6"/>
    </svg>
);

function SeatPickerModal({
                             open,
                             ticket,                    // { id, startISO, endISO, title, venue, priceUSD }
                             mode = "buy",              // "buy" | "pick" (pick — для смены места)
                             maxSelect = Infinity,
                             currentSeatId,             // только для "pick": старое место (например "B7")
                             onClose,
                             onConfirm,                 // callback после успешной операции
                         }) {
    const [map, setMap] = useState({ rows: 0, cols: 0, statusById: {} });
    const [loading, setLoading] = useState(false);
    const [validating, setValidating] = useState(false);
    const [selected, setSelected] = useState(() => new Set());
    const [error, setError] = useState("");


    const setSeatStatus = useCallback((ids, status) => {
        setMap((m) => {
            const next = { ...m.statusById };
            ids.forEach((id) => { next[id] = status; });
            return { ...m, statusById: next };
        });
    }, []);

    useEffect(() => {
        if (!open || !ticket) return;
        let alive = true;
        (async () => {
            setLoading(true);
            setError("");
            setSelected(new Set());
            try {
                const res = await fetch(`/api/tickets/${ticket.id}/seats`);
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                const statusById = {};
                (data.seats || []).forEach((s) => (statusById[s.id] = s.status));
                if (!alive) return;
                setMap({ rows: data.rows, cols: data.cols, statusById });

                if (mode === "pick" && currentSeatId) {
                    statusById[currentSeatId] = "sold";
                    setMap({ rows: data.rows, cols: data.cols, statusById: { ...statusById } });
                }
            } catch {
                const rows = 10, cols = 12;
                const statusById = {};
                for (let r = 0; r < rows; r++) {
                    for (let c = 0; c < cols; c++) {
                        const id = String.fromCharCode(65 + r) + (c + 1);
                        statusById[id] = "available";
                    }
                }
                if (!alive) return;
                setError("Error");
                setMap({ rows, cols, statusById });
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [open, ticket, mode, currentSeatId]);

    function toggleSeat(id) {
        if (loading) return;
        const st = map.statusById[id];
        if (st !== "available") return;
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else {
            if (next.size >= maxSelect) return;
            next.add(id);
        }
        setSelected(next);
    }

    const colLabels = useMemo(() => Array.from({ length: map.cols }, (_, i) => i + 1), [map.cols]);
    const rowLabels = useMemo(() => Array.from({ length: map.rows }, (_, i) => String.fromCharCode(65 + i)), [map.rows]);

    const count = selected.size;
    const totalPrice = (ticket?.priceUSD ?? 0) * count;

    async function handleConfirm() {
        if (!ticket || count === 0) return;
        setValidating(true);
        setError("");
        const seats = Array.from(selected);

        try {

            const rv = await fetch(`/api/tickets/${ticket.id}/validate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ seats }),
            });
            if (!rv.ok) throw new Error(await rv.text());
            const v = await rv.json();

            if (!v.ok && Array.isArray(v.unavailable) && v.unavailable.length) {
                setSeatStatus(v.unavailable, "sold");
                const keep = seats.filter((id) => !v.unavailable.includes(id));
                setSelected(new Set(keep));
                setError(`Some places is unavailable: ${v.unavailable.join(", ")}`);
                setValidating(false);
                return;
            }

            if (mode === "buy") {

                const rp = await fetch(`/api/tickets/${ticket.id}/purchase`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ buyerId: BUYER_ID, seats }),
                });
                if (!rp.ok) throw new Error(await rp.text());

                setSeatStatus(seats, "sold");
                setSelected(new Set());
                onConfirm(seats);
            } else {
                onConfirm(seats, { setSeatStatus });
            }
        } catch (e) {
            setError(e?.message || "Error");
        } finally {
            setValidating(false);
        }
    }

    if (!open) return null;

    return (
        <div className={s.modalOverlay} onClick={onClose}>
            <div className={s.modal} role="dialog" aria-modal="true" onClick={(e)=>e.stopPropagation()}>
                <button className={s.modalClose} onClick={onClose} aria-label="Close">×</button>

                <div className={s.modalHead}>
                    <div className={s.modalTitle}>{ticket.title}</div>
                    <div className={s.modalSub}>
                        {toTimeHM(ticket.startISO)} – {toTimeHM(ticket.endISO)} · {formatDuration(ticket.startISO, ticket.endISO)} · <Pin /> {ticket.venue}
                    </div>
                </div>

                <div className={s.stage}>Stage</div>

                <div className={s.board}>
                    <div className={s.corner} />
                    {colLabels.map((n) => <div key={`c${n}`} className={s.colLabel}>{n}</div>)}

                    {rowLabels.map((rl) => (
                        <React.Fragment key={`r${rl}`}>
                            <div className={s.rowLabel}>{rl}</div>
                            <div className={s.seatRow}>
                                {colLabels.map((n) => {
                                    const id = `${rl}${n}`;
                                    const st = map.statusById[id] || "available";
                                    const sel = selected.has(id);
                                    const cls =
                                        st === "sold" ? `${s.seat} ${s.seatUnavailable}` :
                                            sel ? `${s.seat} ${s.seatSelected}` :
                                                `${s.seat} ${s.seatAvailable}`;
                                    return (
                                        <button
                                            key={id}
                                            className={cls}
                                            onClick={() => toggleSeat(id)}
                                            aria-pressed={sel}
                                            aria-disabled={st !== "available"}
                                            title={id}
                                        />
                                    );
                                })}
                            </div>
                        </React.Fragment>
                    ))}
                </div>

                {loading && <div className={s.note}>Loading...</div>}
                {error && <div className={s.error}>{error}</div>}

                <div className={s.totalRow}>
                    <div className={s.totalLeft}>Selected: <strong>{count}</strong></div>
                    <div className={s.totalRight}>
                        {mode === "buy" && <div className={s.priceMain}>${totalPrice.toFixed(2)}</div>}
                        <button className={s.btnBuy} disabled={count === 0 || validating} onClick={handleConfirm}>
                            {validating ? "Checking…" : (mode === "buy" ? "Buy" : "Change")}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default function TicketsPage() {
    const [events, setEvents] = useState([]);
    const [eventsById, setEventsById] = useState({});
    const [loading, setLoading] = useState(true);
    const [loadErr, setLoadErr] = useState("");

    const [myTickets, setMyTickets] = useState([]);


    const [expanded, setExpanded] = useState(false);     // All tickets
    const [myExpanded, setMyExpanded] = useState(false); // My tickets

    const [buyOpen, setBuyOpen] = useState(false);
    const [activeTicket, setActiveTicket] = useState(null);

    const [swapOpen, setSwapOpen] = useState(false);
    const [swapTarget, setSwapTarget] = useState(null); // {purchaseId, eventId, seatId, ...}


    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/events");
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                const mapped = (data || []).map(e => ({
                    id: e.id,
                    startISO: e.startAt,
                    endISO: e.endAt,
                    title: e.title,
                    venue: e.venue,
                    priceUSD: typeof e.price === "string" ? parseFloat(e.price) : (e.price ?? 0)
                }));
                if (alive) {
                    setEvents(mapped);
                    const mapById = {};
                    mapped.forEach(ev => { mapById[ev.id] = ev; });
                    setEventsById(mapById);
                    setLoadErr("");
                }
            } catch (err) {
                if (alive) setLoadErr(err?.message || "Failed to load events");
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, []);

    /* --- загрузка моих билетов --- */
    const loadMyTickets = useCallback(async () => {
        const res = await fetch(`/api/tickets/by-buyer/${BUYER_ID}`);
        if (!res.ok) throw new Error(await res.text());
        const list = await res.json(); // TicketReadDto[]
        const view = (list || []).map(tk => {
            const ev = eventsById[tk.eventId] || {};
            const priceFromTicket = typeof tk.price === "string" ? parseFloat(tk.price) : tk.price;
            return {
                purchaseId: String(tk.id),
                eventId: tk.eventId,
                seatId: tk.seatId ?? "",
                startISO: ev.startISO,
                endISO: ev.endISO,
                title: ev.title,
                venue: ev.venue,
                priceUSD: ev.priceUSD ?? (priceFromTicket ?? 0),
            };
        });
        setMyTickets(view);
    }, [eventsById]);

    useEffect(() => {
        if (Object.keys(eventsById).length > 0) {
            loadMyTickets().catch(() => {});
        }
    }, [eventsById, loadMyTickets]);


    const total = events.length;
    const items = expanded ? events : events.slice(0, 2);
    const remaining = Math.max(total - items.length, 0);


    const myTotal = myTickets.length;
    const myItems = myExpanded ? myTickets : myTickets.slice(0, 2);
    const myRemaining = Math.max(myTotal - myItems.length, 0);

    function openBuy(t) { setActiveTicket(t); setBuyOpen(true); }


    function confirmBuy() {
        loadMyTickets().catch(() => {});
        setBuyOpen(false);
        setActiveTicket(null);
    }

    function openSwap(purchase) {
        const ticket = events.find(t => t.id === purchase.eventId);
        if (!ticket) return;
        setSwapTarget(purchase);
        setActiveTicket(ticket);
        setSwapOpen(true);
    }

    async function confirmSwap(seatIds, helpers) {
        const newSeat = seatIds[0];
        if (!swapTarget) return;
        try {
            const res = await fetch(`/api/tickets/${swapTarget.purchaseId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ seatId: newSeat }),
            });
            if (!res.ok) throw new Error(await res.text());

            setMyTickets((prev) =>
                prev.map((p) =>
                    p.purchaseId === swapTarget.purchaseId ? { ...p, seatId: newSeat } : p
                )
            );

            if (helpers?.setSeatStatus) {
                if (swapTarget.seatId) helpers.setSeatStatus([swapTarget.seatId], "available");
                helpers.setSeatStatus([newSeat], "sold");
            }

            setSwapOpen(false);
            setSwapTarget(null);
            setActiveTicket(null);
        } catch (e) {
            alert(e?.message || "Error. Can not change a place");
        }
    }

    async function refund(purchase) {
        try {
            const res = await fetch(`/api/tickets/${purchase.purchaseId}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await res.text());
            setMyTickets((prev) => prev.filter((p) => p.purchaseId !== purchase.purchaseId));
        } catch (e) {
            alert(e?.message || "Error");
        }
    }


    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [searchErr, setSearchErr] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const mapEventsFromApi = useCallback((data) => {
        return (data || []).map(e => ({
            id: e.id,
            startISO: e.startAt,
            endISO: e.endAt,
            title: e.title,
            venue: e.venue,
            priceUSD: typeof e.price === "string" ? parseFloat(e.price) : (e.price ?? 0)
        }));
    }, []);

    const runServerSearch = useCallback(async (q) => {
        const urls = [
            `/api/events/search?q=${encodeURIComponent(q)}`,
            `/api/events?search=${encodeURIComponent(q)}`,
            `/api/events?query=${encodeURIComponent(q)}`
        ];
        let lastErr = null;
        for (const url of urls) {
            try {
                const r = await fetch(url);
                if (r.status === 404) continue; // пробуем следующий вариант
                if (!r.ok) throw new Error(await r.text());
                const data = await r.json();
                return mapEventsFromApi(data);
            } catch (e) {
                lastErr = e;
            }
        }
        if (lastErr) throw lastErr;
        return [];
    }, [mapEventsFromApi]);

    const onSubmitSearch = useCallback(async (e) => {
        e?.preventDefault?.();
        const q = search.trim();
        if (!q) {
            setSearchResults([]);
            setSearchErr("");
            return;
        }
        setSearching(true);
        setSearchErr("");
        try {
            const list = await runServerSearch(q);
            setSearchResults(list);
        } catch (err) {
            setSearchResults([]);
            setSearchErr(err?.message || "Search failed");
        } finally {
            setSearching(false);
        }
    }, [search, runServerSearch]);

    const clearSearch = useCallback(() => {
        setSearch("");
        setSearchResults([]);
        setSearchErr("");
    }, []);

    return (
        <div className={s.page}>
            <div className={s.container}>

                <h1 className={s.pageTitle}>My tickets</h1>

                {myTotal === 0 && (
                    <p className={s.note}>You do not have any tickets.</p>
                )}

                {myItems.map((t) => (
                    <div key={t.purchaseId}>
                        <div className={`${s.agendaRow} ${s.rowMine}`}>
                            <div className={s.timeCol}>
                                <div className={s.timeRange}>
                                    {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                </div>
                                <div className={s.duration}>
                                    {formatDuration(t.startISO, t.endISO)}
                                </div>
                            </div>

                            <div className={s.infoColOnly}>
                                <div className={s.titleLine}>
                                    <div className={s.eventTitle}>
                                        {t.title} {t.seatId && <span className={s.seatChip}>Seat {t.seatId}</span>}
                                    </div>
                                    <div className={s.iconBar}>
                                        <button className={s.iconBtn} title="Change seat" onClick={() => openSwap(t)}>
                                            <Pencil />
                                        </button>
                                        <button className={s.iconBtn} title="Refund" onClick={() => refund(t)}>
                                            <Trash />
                                        </button>
                                    </div>
                                </div>

                                <div className={s.place}><Pin /><span>{t.venue}</span></div>
                            </div>
                        </div>
                        <div className={s.hr} />
                    </div>
                ))}


                {myTotal > 2 && (
                    <div className={s.moreRow}>
                        <div className={s.leftSpacer} />
                        <div className={s.moreRight}>
                            {!myExpanded && <div className={s.remaining}>Show more:&nbsp;{myRemaining}</div>}
                            <button
                                className={s.btnAll}
                                aria-expanded={myExpanded}
                                onClick={() => setMyExpanded((v) => !v)}
                            >
                                {myExpanded ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>
                )}


                <div className={s.container_A} id="all-tickets">
                    <h2 className={s.pageTitle}>All tickets</h2>


                    <form className={s.searchBar} onSubmit={onSubmitSearch} role="search" aria-label="Search events">
                        <input
                            className={s.searchInput}
                            type="search"
                            placeholder="Search by title, venue…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search query"
                        />
                        <button className={s.btnSearch} type="submit" disabled={searching}>
                            {searching ? "Searching…" : "Search"}
                        </button>
                        {!!search && (
                            <button type="button" className={s.btnClear} onClick={clearSearch} aria-label="Clear search">
                                Clear
                            </button>
                        )}
                    </form>

                    {search && (
                        <div className={s.searchResultsBox}>
                            <h3 className={s.pageTitleB}>Search results</h3>

                            {searching && <p className={s.note}>Searching…</p>}
                            {!searching && searchErr && <p className={s.error}>{searchErr}</p>}

                            {!searching && !searchErr && searchResults.length === 0 && (
                                <p className={s.note}>No matches found.</p>
                            )}

                            {!searching && !searchErr && searchResults.map((t) => (
                                <div key={`sr_${t.id}`}>
                                    <div className={`${s.agendaRow} ${s.rowWithBuy}`}>
                                        <div className={s.timeCol}>
                                            <div className={s.timeRange}>
                                                {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                            </div>
                                            <div className={s.duration}>
                                                {formatDuration(t.startISO, t.endISO, t.lengthMin)}
                                            </div>
                                        </div>

                                        <div className={`${s.infoCol} ${s.infoColSplit}`}>
                                            <div className={s.infoLeft}>
                                                <div className={s.eventTitle}>{t.title}</div>
                                                <div className={s.place}><Pin /><span>{t.venue}</span></div>
                                            </div>
                                            <div className={s.buyCol}>
                                                <div className={s.priceMain}>${t.priceUSD.toFixed(2)}</div>
                                                <button className={s.btnBuy} onClick={() => openBuy(t)}>Buy</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={s.hr} />
                                </div>
                            ))}
                        </div>
                    )}


                    {loading && <p className={s.note}>Loading…</p>}
                    {!loading && loadErr && <p className={s.error}>{loadErr}</p>}

                    {!loading && !loadErr && items.map((t) => (
                        <div key={t.id}>
                            <div className={`${s.agendaRow} ${s.rowWithBuy}`}>
                                <div className={s.timeCol}>
                                    <div className={s.timeRange}>
                                        {toTimeHM(t.startISO)} – {toTimeHM(t.endISO)}
                                    </div>
                                    <div className={s.duration}>
                                        {formatDuration(t.startISO, t.endISO, t.lengthMin)}
                                    </div>
                                </div>

                                <div className={`${s.infoCol} ${s.infoColSplit}`}>
                                    <div className={s.infoLeft}>
                                        <div className={s.eventTitle}>{t.title}</div>
                                        <div className={s.place}><Pin /><span>{t.venue}</span></div>
                                    </div>
                                    <div className={s.buyCol}>
                                        <div className={s.priceMain}>${t.priceUSD.toFixed(2)}</div>
                                        <button className={s.btnBuy} onClick={() => openBuy(t)}>Buy</button>
                                    </div>
                                </div>
                            </div>
                            <div className={s.hr} />
                        </div>
                    ))}

                    {!loading && !loadErr && total > 2 && (
                        <div className={s.moreRow}>
                            <div className={s.leftSpacer} />
                            <div className={s.moreRight}>
                                {!expanded && <div className={s.remaining}>Show more:&nbsp;{remaining}</div>}
                                <button className={s.btnAll} aria-expanded={expanded} onClick={() => setExpanded((v) => !v)}>
                                    {expanded ? "Hide" : "Show"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>


            <SeatPickerModal
                open={buyOpen}
                ticket={activeTicket}
                mode="buy"
                onClose={() => setBuyOpen(false)}
                onConfirm={confirmBuy}
            />
            <SeatPickerModal
                open={swapOpen}
                ticket={activeTicket}
                mode="pick"
                maxSelect={1}
                currentSeatId={swapTarget?.seatId}
                onClose={() => setSwapOpen(false)}
                onConfirm={confirmSwap}
            />
        </div>
    );
}
