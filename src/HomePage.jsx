import React from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import HonorsSection from './components/HonorsSection';
import CircleContainer from './components/CircleContainer';
import FadeInWrapper from './components/FadeInWrapper';
import ScrollIndicator from './components/ScrollIndicator';
import Footer from './components/Footer';

function HomePage() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <HomeSection />
        <HonorsSection />
        <CircleContainer />
        <ScrollIndicator />
        <Footer />
      </div>
    </FadeInWrapper>
  );
}

export default HomePage;
