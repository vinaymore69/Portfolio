import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import ProjectSection from './components/ProjectSection'; 
import CircleContainer from './components/CircleContainer';

function Project() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <ProjectSection />
        <CircleContainer />
      </div>
    </FadeInWrapper>
  );
}

export default Project;
