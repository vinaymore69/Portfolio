import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import AboutSection from './components/AboutSection'; 
import CircleContainer from './components/CircleContainer';

function About() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <AboutSection />
        <CircleContainer />
      </div>
    </FadeInWrapper>
  );
}

export default About;
