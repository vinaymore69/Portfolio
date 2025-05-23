import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center relative font-poppins-bold text-base sm:text-[2vw] text-black fade-in">
      {/* Logo */}
      <div className="flex items-center gap-2 text-sm sm:text-[1vw] text-black z-20">
        <img
          src="/images/portfolioLogo.png"
          alt="Logo with a triangle inside a square"
          className="w-6 h-6 sm:w-[1.5vw] sm:h-[1.5vw]"
        />
        <span className="hidden sm:inline">VinayMore69</span>
      </div>

      {/* Mobile Menu Button */}
      <button 
        className="md:hidden z-20 text-black"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
      >
        <FontAwesomeIcon 
          icon={mobileMenuOpen ? faXmark : faBars} 
          className="text-2xl"
        />
      </button>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 gap-[2vw]">
        <a
          href="/"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Home
        </a>
        <a
          href="/about"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          About
        </a>
        <a
          href="/project"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Projects
        </a>
        <a
          href="/skills"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Skills
        </a>
        <a
          href="/contact"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Contact
        </a>
      </nav>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 bg-white z-20 flex flex-col justify-center items-center transition-opacity duration-300 md:hidden ${
        mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <nav className="flex flex-col gap-4 items-center">
          <a
            href="/"
            className="text-lg px-6 py-2 border border-black rounded-full text-black no-underline hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/about"
            className="text-lg px-6 py-2 border border-black rounded-full text-black no-underline hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </a>
          <a
            href="/project"
            className="text-lg px-6 py-2 border border-black rounded-full text-black no-underline hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            Projects
          </a>
          <a
            href="/skills"
            className="text-lg px-6 py-2 border border-black rounded-full text-black no-underline hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            Skills
          </a>
          <a
            href="/contact"
            className="text-lg px-6 py-2 border border-black rounded-full text-black no-underline hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
        
        {/* Social icons in mobile menu */}
        <div className="flex items-center mt-8 gap-6">
          <a
            href="https://www.instagram.com/redboxaggency"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
          <a
            href="https://github.com/vinaymore69"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a
            href="https://www.linkedin.com/in/vinay--more/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-3xl hover:text-gray-700 transition-colors"
          >
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
      </div>

      {/* Desktop Social Icons */}
      <div className="hidden sm:flex items-center mt-[0.5vw] gap-4 text-[1vw] text-black fade-in-delay">
        <a
          href="https://www.instagram.com/redboxaggency"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[2.2vw] hover:text-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://github.com/vinaymore69"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[2.2vw] hover:text-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a
          href="https://www.linkedin.com/in/vinay--more/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[2.2vw] hover:text-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </div>
    </header>
  );
}

export default Header;