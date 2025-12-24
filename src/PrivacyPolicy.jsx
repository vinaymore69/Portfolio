import React from 'react';
import Header from './components/Header';
import FadeInWrapper from './components/FadeInWrapper';
import PrivacyPolicy from './components/PrivacyPolicy';
import CircleContainer from './components/CircleContainer';
import ScrollIndicator from './components/ScrollIndicator';
import Footer from './components/Footer';

function PrivacyPolicyPage() {
  return (
    <FadeInWrapper>
      <div className="px-5 py-2 m-0 bg-white font-geom pb-0">
        <Header />
        <PrivacyPolicy />
        <CircleContainer />
        <ScrollIndicator />
        <Footer />
      </div>
    </FadeInWrapper>
  );
}

export default PrivacyPolicyPage;