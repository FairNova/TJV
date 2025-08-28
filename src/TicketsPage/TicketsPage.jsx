import styles from './TicketsPage.module.css';
import HeroTickets from './HeroTickets/HeroTickets';
import TicketsList from './Tickets/Tickets';

export default function TicketsPage() {
    return (
        <div className={styles.page}>
            <HeroTickets />
            <TicketsList />
        </div>
    );
}
