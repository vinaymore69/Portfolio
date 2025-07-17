import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/portfolioLogo.png"
                alt="Portfolio Logo"
                className="w-8 h-8"
              />
              <span className="text-xl font-bold font-poppins">Vinay More</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Computer Engineering student passionate about web development, 
              creating innovative solutions, and contributing to open-source projects. 
              Always eager to learn and take on new challenges.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.instagram.com/nothing_captures?igsh=enFoZnBnNGYycmFh"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-lg" />
              </a>
              <a
                href="https://github.com/vinaymore69"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faGithub} className="text-lg" />
              </a>
              <a
                href="https://www.linkedin.com/in/vinay--more"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <FontAwesomeIcon icon={faLinkedin} className="text-lg" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-poppins">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="/project" className="text-gray-300 hover:text-white transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="/skills" className="text-gray-300 hover:text-white transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-bold mb-4 font-poppins">Get In Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                <a 
                  href="mailto:vinaymore.dev@gmail.com" 
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  vinaymore.dev@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-gray-400" />
                <a 
                  href="https://maps.google.com/?q=Mumbai,Maharashtra,India" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 text-sm hover:text-white transition-colors"
                >
                  Mumbai, Maharashtra, India
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Vinay More. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Built with React & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;