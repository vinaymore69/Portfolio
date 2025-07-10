import React from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import CircleContainer from './components/CircleContainer';
import FadeInWrapper from './components/FadeInWrapper';
import ScrollIndicator from './components/ScrollIndicator';

function HomePage() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <HomeSection />
        <CircleContainer />
        <ScrollIndicator />
      </div>
    </FadeInWrapper>
  );
}

export default HomePage;
