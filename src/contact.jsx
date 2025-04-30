import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import ContactSection from './components/ContactSection'; 
import CircleContainer from './components/CircleContainer';

function Contact() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter">
        <Header />
        <ContactSection />
        <CircleContainer />
      </div>
    </FadeInWrapper>
  );
}

export default Contact;
