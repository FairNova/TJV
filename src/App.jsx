// App.jsx
import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Speakers from "./components/Speakers/Speakers";
import Workshop from "./components/Workshop/Workshop";
import Agenda from "./components/Agenda/Agenda";
import Sponsors from "./components/Sponsores/Sponsors";
import Footer from "./components/Footer/Footer";
import { Routes, Route } from "react-router-dom";
import TicketsPage from "./TicketsPage/TicketsPage";


function Home() {
    return (
        <>
            <Hero />
            <Agenda />
            <Speakers />
            <Sponsors />
            <Workshop />
        </>
    );
}

export default function App() {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tickets" element={<TicketsPage />} />
            </Routes>
            <Footer />
        </>
    );
}