import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PageWrapper from './components/PageWrapper';
import HomePage from './HomePage'; // <- use new HomePage
import About from './about'; // <- your about page
import Contact from './contact';
import Project from './Project';
import Skills from './Skills';

function App() {
  return (
    <Router>
      <PageWrapper>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/project" element={<Project />} />
          <Route path="/skills" element={<Skills />} />
        </Routes>
      </PageWrapper>
    </Router>
  );
}

export default App;
