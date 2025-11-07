import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import ContactSection from './components/ContactSection'; 
import CircleContainer from './components/CircleContainer';
import ScrollIndicator from './components/ScrollIndicator';
import Footer from './components/Footer';

function Contact() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-inter pb-0">
        <Header />
        <ContactSection />
        <CircleContainer />
        <ScrollIndicator />
        <Footer />
      </div>
    </FadeInWrapper>
  );
}

export default Contact;
