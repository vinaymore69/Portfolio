import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import ProjectSection from './components/ProjectSection'; 
import PublicationsSection from './components/PublicationsSection';
import CircleContainer from './components/CircleContainer';
import ScrollIndicator from './components/ScrollIndicator';
import Footer from './components/Footer';

function Project() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <ProjectSection />
        <PublicationsSection />
        <CircleContainer />
        <ScrollIndicator />
        <Footer />
      </div>
    </FadeInWrapper>
  );
}

export default Project;
