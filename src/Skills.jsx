import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import CircleContainer from './components/CircleContainer';
import SkillsSection from './components/SkillsSection';
import ScrollIndicator from './components/ScrollIndicator';

function Skills() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <SkillsSection />
        <CircleContainer />
        <ScrollIndicator />
      </div>
    </FadeInWrapper>
  );
}

export default Skills;
