import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import EnhancedAboutSection from './components/EnhancedAboutSection'; 
import CircleContainer from './components/CircleContainer';
import ScrollIndicator from './components/ScrollIndicator';
import Footer from './components/Footer';

function About() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <EnhancedAboutSection />
        <CircleContainer />
        <ScrollIndicator />
        <Footer />
      </div>
    </FadeInWrapper>
  );
}

export default About;
