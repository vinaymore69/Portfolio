import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { Link } from 'react-router-dom'; // important for internal routing

function Header() {
  return (
    <header className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center relative font-poppins-bold text-[2vw] text-black fade-in">
      <div className="flex items-center gap-2 text-[1vw] text-black">
        <img
          src="/images/portfolioLogo.png"
          alt="Logo with a triangle inside a square"
          className="w-[1.5vw] h-[1.5vw]"
        />
        VinayMore69
      </div>

      <nav className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-[2vw] md:static md:transform-none md:justify-center md:mt-4 md:gap-[1vw]">
        <Link
          to="/"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline  hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline transition-colors hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          About
        </Link>
        <a
          href="/project" // (later if you have projects section in homepage, you can scroll)
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline transition-colors hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Projects
        </a>
        <a
          href="/skills" // (same for skills)
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline transition-colors hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Skills
        </a>
        <a
          href="/contact" // (same for contact)
          className="text-[1vw] px-[2vw] py-[0.5vw] border border-black rounded-full text-black no-underline transition-colors hover:bg-black hover:text-white whitespace-nowrap transition-all duration-300 ease-in-out"
        >
          Contact
        </a>
      </nav>

      <div className="flex items-center mt-[0.5vw] gap-4 text-[1vw] text-black fade-in-delay">
        <a
          href="https://www.instagram.com/redboxaggency"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[2.2vw] hover:text-black transition-colors"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          href="https://github.com/vinaymore69"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[2.2vw] hover:text-black transition-colors"
        >
          <FontAwesomeIcon icon={faGithub} />
        </a>
        <a
          href="https://www.linkedin.com/in/vinay--more/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[2.2vw] hover:text-black transition-colors"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </div>
    </header>
  );
}

export default Header;
