import React, { useState } from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

gsap.registerPlugin(ScrollTrigger);

export default function HomeSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const resumeContentRef = useRef(null);
  const titleRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();
       const titleElement = titleRef.current;
    const lines = titleElement.querySelectorAll('.title-line');
    

        // Title animation - line by line 3D flip effect
    tl.from(lines, {
       rotationX: -100,
      transformOrigin: "50% 50% -160px",
      opacity: 0,
      duration: 1,
      delay: 0.3, 
      ease: "power5.out",
      stagger: 0.35,
    })

    // Title animation - split text effect
    tl.fromTo(titleRef.current, 
      { 
        opacity: 0, 
        y: 100,
        scale: 0.8
      },
      { 
        opacity: 1, 
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out"
      }
    )
    // Image animation with bounce
    .fromTo(imageRef.current,
      {
        opacity: 0,
        scale: 0.5,
        rotation: -10
      },
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1,
        ease: "back.out(1.7)"
      },
      "-=0.5"
    )
    // Button floating animation
    .fromTo(buttonRef.current,
      {
        opacity: 0,
        scale: 0
      },
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "elastic.out(1, 0.5)"
      },
      "-=0.3"
    );

    

    // Continuous floating animation for button
    gsap.to(buttonRef.current, {
      y: -10,
      duration: 2,
      ease: "power2.inOut",
      yoyo: true,
      repeat: -1
    });

    // Image hover effect
    const handleImageHover = () => {
      gsap.to(imageRef.current, {
        scale: 1.05,
        rotation: 2,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleImageLeave = () => {
      gsap.to(imageRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const imageElement = imageRef.current;
    imageElement.addEventListener('mouseenter', handleImageHover);
    imageElement.addEventListener('mouseleave', handleImageLeave);

    return () => {
      imageElement.removeEventListener('mouseenter', handleImageHover);
      imageElement.removeEventListener('mouseleave', handleImageLeave);
    };
  }, []);

  const handleNextClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsOpen(true);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 600); // Match the animation duration
  };

  const handleCloseClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsOpen(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const handleDownloadPDF = async () => {
    try {
      const element = resumeContentRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('Vinay_More_Resume.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };
  return (
    <main className="max-w-7xl mx-auto mt-10 px-4 sm:px-8 relative text-center">
      <h1 ref={titleRef} className="font-geom font-bold text-4xl sm:text-[8vw] leading-tight sm:leading-[7vw] text-black m-0">
        EXPLORE
      </h1>

      <h1 ref={titleRef} className="font-poppins font-bold text-4xl sm:text-[8vw] leading-tight sm:leading-[7vw] text-black m-0">
  MY PORTFOLIO
      </h1>
           


      <div className="relative">
        <img
          ref={imageRef}
          src="/images/profile.png"
          alt="Young man smiling wearing white shirt"
          className="mt-4 sm:mt-[-4vw] w-50 sm:w-[26vw] myImage h-auto rounded-none inline-block"
        />
        
        <button
          ref={buttonRef}
          aria-label="Next"
          className="absolute top-1/2 right-1/4 sm:left-[20.95vw] sm:rotate-[20deg] transform -translate-y-1/2 sm:-translate-y-[220%] w-10 h-10 sm:w-[3vw] sm:h-[3vw] border border-black rounded-full 
                   bg-transparent text-black cursor-pointer flex items-center justify-center 
                   transition-colors hover:bg-black hover:text-white"
          onClick={handleNextClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-base sm:text-[1.2vw]">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
      
      <div className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-500 ease-in-out flex items-center justify-center
                    ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={handleCloseClick}
      >
        {/* Prevent clicks inside the window from closing */}
        <div 
          className={`bg-white rounded-lg shadow-2xl overflow-hidden relative transition-all duration-500 ease-in-out
                     ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
          style={{ width: '700px', maxWidth: '95vw', maxHeight: '90vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Window Header */}
          <div className="bg-gray-100 px-4 py-2 border-b border-gray-200 flex items-center">
            <div className="flex space-x-2">
              <button 
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                onClick={handleCloseClick}
              ></button>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-center flex-1 text-gray-600 text-xs sm:text-sm font-medium truncate">Vinay More - Resume</div>
          </div>
          
          {/* Window Content */}
          <div ref={resumeContentRef} className="p-4 sm:p-6 overflow-auto" style={{ maxHeight: 'calc(90vh - 40px)' }}>
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800"> Resume</h2>
            
            <div className="space-y-6 sm:space-y-8">
              {/* Personal Info */}
              <div className="text-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Vinay More</h3>
                <p className="text-gray-600 text-sm sm:text-base">Computer Engineering Student & Full Stack Developer</p>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-0 sm:space-x-4 mt-2 text-xs sm:text-sm text-gray-600">
                  <span>Mumbai, India</span>
                  <span className="hidden sm:inline">•</span>
                  <span>vinaymore0110@gmail.com</span>
                  <span className="hidden sm:inline">•</span>
                  <span>+91 9137405110</span>
                </div>
              </div>
              
              {/* Experience Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Experience</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Codeterna Private Limited</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Mobile Application Developer · 4 mos</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Navi Mumbai, Maharashtra, India</div>
                    </div>
                    <div className="text-left mt-2">
                      <ul className="list-disc ml-5 text-gray-700 text-sm">
                        <li className="mb-3 sm:mb-4">
                          <div className="font-medium text-gray-800">Mobile Application Developer</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Sep 2025 - Present · 4 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Flutter, iOS Development, Cross-platform Apps</div>
                        </li>
                        <li>
                          <div className="font-medium text-gray-800">Application Developer</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Jul 2025 - Aug 2025 · 2 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Flutter Application Development</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Red Box Agency</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Website Developer & Digital Marketer · 1 yr 4 mos</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Mumbai, Maharashtra, India</div>
                    </div>
                    <div className="text-left mt-2">
                      <ul className="list-disc ml-5 text-gray-700 text-sm">
                        <li className="mb-3 sm:mb-4">
                          <div className="font-medium text-gray-800">Website Development and Social media marketing</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Jul 2024 - Present · 1 yr 1 mo</div>
                          <div className="text-gray-600 text-xs sm:text-sm">WordPress, HTML/CSS/JS, SEO, Social Media Strategy</div>
                        </li>
                        <li className="mb-3 sm:mb-4">
                          <div className="font-medium text-gray-800">Web Development & Social media marketing strategy Development</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Jun 2024 - Jul 2024 · 2 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Digital Marketing Strategy, Content Creation</div>
                        </li>
                        <li>
                          <div className="font-medium text-gray-800">Website Development</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Apr 2024 - Jun 2024 · 3 mos</div>
                          <div className="text-gray-600 text-xs sm:text-sm">Frontend Development, Responsive Design</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Education Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Education</h3>
                
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Xavier Institute Of Engineering</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Aug 2025 - Present</div>
                    </div>
                    <div className="text-left mt-1">
                      <div className="font-medium text-gray-800">Bachelor of Engineering - BE, Computer Engineering</div>
                      <div className="text-xs sm:text-sm text-gray-700 mt-1">
                        Currently pursuing BE in Computer Engineering
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800">Vidyalankar Group of Educational Institutes</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Sep 2022 - Jun 2025</div>
                    </div>
                    <div className="text-left mt-1">
                      <div className="font-medium text-gray-800">High School Diploma, Computer Engineering</div>
                      <div className="text-xs sm:text-sm text-gray-700 mt-1">
                        Grade: 91.61% | Activities: Programming, Technical Projects
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col">
                    <div className="font-medium text-left">
                      <div className="text-gray-800 text-sm sm:text-base">Sadhana Education Society's Malti Jayant Dalal High School</div>
                      <div className="text-gray-600 text-xs sm:text-sm">Jun 2012 - Jun 2022</div>
                    </div>
                    <div className="text-left mt-1">
                      <div className="font-medium text-gray-800">High School/Secondary Certificate Programs</div>
                      <div className="text-xs sm:text-sm text-gray-700 mt-1">
                        Grade: 87.20%<br />
                        Activities and societies: Cricket, Painting
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Projects Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Key Projects</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800">SanChi - Educational Platform</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Web-based volunteering-driven educational platform</p>
                    <p className="text-xs text-gray-500">Technologies: HTML, CSS, JavaScript, Express.js, PostgreSQL</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">VPortfolinK - Portfolio Platform</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Dynamic portfolio creation platform</p>
                    <p className="text-xs text-gray-500">Technologies: PHP, MySQL, HTML, CSS, JavaScript, GSAP</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">V-Visit - Visiting Application</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">Modern visiting card application</p>
                    <p className="text-xs text-gray-500">Technologies: React, Tailwind CSS, Node.js</p>
                  </div>
                </div>
              </div>
              
              {/* Achievements Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Key Achievements</h3>
                
                <div className="space-y-2">
                  <div className="text-xs sm:text-sm text-gray-700">• Winner - Sprint Nova 6-Hour Hackathon, Xavier Institute of Engineering (2025)</div>
                  <div className="text-xs sm:text-sm text-gray-700">• Selected for SIH 2025 - Internal Hackathon Qualifier</div>
                  <div className="text-xs sm:text-sm text-gray-700">• Campus Ambassador - GSSoC 2025, GirlScript Foundation</div>
                  <div className="text-xs sm:text-sm text-gray-700">• Runner Up - Final Year Project Exhibition, Vidyalankar Polytechnic</div>
                  <div className="text-xs sm:text-sm text-gray-700">• Published Research Paper - "SanChi: Empowerment Through Education" (IJRPR, 2025)</div>
                </div>
              </div>
              
              {/* Skills Section */}
              <div>
                <h3 className="text-base sm:text-lg font-bold border-b border-gray-300 pb-2 mb-3 sm:mb-4 text-left">Skills</h3>
                
                <div className="flex flex-wrap gap-2">
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">React.js</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Node.js</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Flutter</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">JavaScript</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">PHP</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">MySQL</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">PostgreSQL</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">HTML/CSS</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Tailwind CSS</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">GSAP</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">WordPress</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-gray-800">Digital Marketing</span>
                </div>
              </div>
              
              {/* Download Button */}
              <div className="text-center pt-6 border-t border-gray-200">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium"
                >
                  Download PDF Resume
                  <i className="fas fa-download ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}