// App.jsx
import React from 'react';
import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Speakers from "./components/Speakers/Speakers";
import Workshop from "./components/Workshop/Workshop";


export default function App() {
  return (
      <>
        <Header />
          <Hero/>
          <Speakers/>
          <Workshop/>
      </>
  );
}
