import React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsPDF from 'jspdf';

gsap.registerPlugin(ScrollTrigger);

function EnhancedAboutSection() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descriptionRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef([]);
  const experienceRef = useRef([]);
  const educationRef = useRef([]);

  useEffect(() => {
    // Split text animation for main title
    if (titleRef.current) {
      const chars = titleRef.current.textContent.split('');
      titleRef.current.innerHTML = chars.map(char => 
        char === ' ' ? ' ' : `<span style="display: inline-block;">${char}</span>`
      ).join('');
      
      gsap.fromTo(titleRef.current.children,
        {
          opacity: 0,
          y: 50,
          rotationX: -90
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.05,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Simple fade-in for subtitle without text splitting
    gsap.fromTo(subtitleRef.current,
      {
        opacity: 0,
        y: 30
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: subtitleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Split text for description
    if (descriptionRef.current) {
      const words = descriptionRef.current.textContent.split(' ');
      descriptionRef.current.innerHTML = words.map(word => 
        `<span style="display: inline-block; margin-right: 0.25em;">${word}</span>`
      ).join('');
      
      gsap.fromTo(descriptionRef.current.children,
        {
          opacity: 0,
          y: 20
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: descriptionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }

    // Image animation
    gsap.fromTo(imageRef.current,
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
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Stats animation
    gsap.fromTo(statsRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: statsRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Experience cards animation
    gsap.fromTo(experienceRef.current,
      {
        opacity: 0,
        x: -100,
        rotationY: -45
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: experienceRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Education cards animation
    gsap.fromTo(educationRef.current,
      {
        opacity: 0,
        x: 100,
        rotationY: 45
      },
      {
        opacity: 1,
        x: 0,
        rotationY: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: educationRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const handleDownloadResume = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // Add content to PDF
    pdf.setFontSize(20);
    pdf.text('Vinay More', 105, 20, { align: 'center' });
    
    pdf.setFontSize(12);
    pdf.text('Computer Engineering Student & Full Stack Developer', 105, 30, { align: 'center' });
    pdf.text('Mumbai, India | vinaymore0110@gmail.com | +91 9137405110', 105, 40, { align: 'center' });
    
    // Experience Section
    pdf.setFontSize(16);
    pdf.text('Experience', 20, 60);
    pdf.line(20, 65, 190, 65);
    
    pdf.setFontSize(12);
    pdf.text('Codeterna Private Limited', 20, 75);
    pdf.setFontSize(10);
    pdf.text('Mobile Application Developer | Nov 2025 - Present', 20, 82);
    pdf.text('• Flutter, iOS Development, Cross-platform Apps', 25, 89);
    pdf.text('• Previous roles: Internship (Sep-Nov 2025), Full-time (Jul-Aug 2025)', 25, 96);
    
    pdf.setFontSize(12);
    pdf.text('Skill Stream', 20, 110);
    pdf.setFontSize(10);
    pdf.text('Video Editor | May 2024 - Present', 20, 117);
    pdf.text('• Video Editing, Content Creation', 25, 124);
    
    pdf.setFontSize(12);
    pdf.text('Red Box Agency', 20, 140);
    pdf.setFontSize(10);
    pdf.text('Web Developer & Creative Head | Aug 2025 - Present', 20, 147);
    pdf.text('• Website Development, Social Media Marketing', 25, 154);
    pdf.text('• Previous roles: Multiple internship positions (Apr 2024 - Aug 2025)', 25, 161);
    
    // Education Section
    pdf.setFontSize(16);
    pdf.text('Education', 20, 180);
    pdf.line(20, 185, 190, 185);
    
    pdf.setFontSize(12);
    pdf.text('Xavier Institute Of Engineering', 20, 195);
    pdf.setFontSize(10);
    pdf.text('Bachelor of Engineering - BE, Computer Engineering | Aug 2025 - Present', 20, 202);
    
    pdf.setFontSize(12);
    pdf.text('Vidyalankar Group of Educational Institutes', 20, 215);
    pdf.setFontSize(10);
    pdf.text('High School Diploma, Computer Engineering | Sep 2022 - Jun 2025', 20, 222);
    pdf.text('Grade: 91.61%', 20, 229);
    
    // Projects Section
    pdf.setFontSize(16);
    pdf.text('Key Projects', 20, 250);
    pdf.line(20, 255, 190, 255);
    
    pdf.setFontSize(12);
    pdf.text('SanChi - Educational Platform', 20, 265);
    pdf.setFontSize(10);
    pdf.text('Web-based volunteering-driven educational platform', 20, 272);
    pdf.text('Technologies: HTML, CSS, JavaScript, Express.js, PostgreSQL', 20, 279);
    
    pdf.setFontSize(12);
    pdf.text('VPortfolinK - Portfolio Platform', 20, 290);
    pdf.setFontSize(10);
    pdf.text('Dynamic portfolio creation platform', 20, 297);
    pdf.text('Technologies: PHP, MySQL, HTML, CSS, JavaScript, GSAP', 20, 304);
    
    // Download the PDF
    pdf.save('Vinay_More_Resume.pdf');
  };

  // Helper function to calculate duration between two dates
  const calculateDuration = (startDate, endDate = null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    
    if (years > 0 && months > 0) {
      return `${years} yr${years > 1 ? 's' : ''} ${months} mo${months > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} yr${years > 1 ? 's' : ''}`;
    } else if (months > 0) {
      return `${months} mo${months > 1 ? 's' : ''}`;
    } else {
      return '1 mo';
    }
  };

  // Helper function to format date range
  const formatDateRange = (startDate, endDate = null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };
    
    const duration = calculateDuration(startDate, endDate);
    const endText = endDate ? formatDate(end) : 'Present';
    
    return `${formatDate(start)} - ${endText} · ${duration}`;
  };

  // Helper function to calculate total company duration
  const calculateCompanyDuration = (positions) => {
    if (!positions || positions.length === 0) return '';
    
    const allDates = positions.flatMap(pos => [
      new Date(pos.startDate),
      pos.endDate ? new Date(pos.endDate) : new Date()
    ]);
    
    const earliestStart = new Date(Math.min(...allDates.filter((_, index) => index % 2 === 0)));
    const latestEnd = new Date(Math.max(...allDates));
    
    return calculateDuration(earliestStart, positions.some(pos => !pos.endDate) ? null : latestEnd);
  };

  const experiences = [
    {
      company: "Codeterna Private Limited",
      logo: "/images/codeternaLogo.png",
      startDate: "2025-07-01",
      location: "Mumbai, Maharashtra, India",
      positions: [
        {
          title: "Mobile Application Developer",
          type: "Full-time",
          startDate: "2025-11-01",
          endDate: null,
          location: "Mumbai, Maharashtra, India · On-site",
          description: "Mobile Application Development and iOS",
          skills: ["Mobile Application Development", "iOS"]
        },
        {
          title: "Mobile Application Developer",
          type: "Internship",
          startDate: "2025-09-01",
          endDate: "2025-11-01",
          location: "Navi Mumbai, Maharashtra, India · Remote",
          description: "Mobile Application Development and iOS",
          skills: ["Mobile Application Development", "iOS"]
        },
        {
          title: "Mobile Application Developer",
          type: "Full-time",
          startDate: "2025-07-01",
          endDate: "2025-08-01",
          location: "Mumbai, Maharashtra, India · On-site",
          description: "Flutter and Application Development",
          skills: ["Flutter", "Application Development"]
        }
      ]
    },
    {
      company: "Skill Stream",
      logo: "/images/portfolioLogo.png", // Using portfolio logo as placeholder
      startDate: "2024-05-01",
      location: "Mumbai, Maharashtra, India · Remote",
      positions: [
        {
          title: "Video Editor",
          type: "Part-time",
          startDate: "2024-05-01",
          endDate: null,
          location: "Mumbai, Maharashtra, India · Remote",
          description: "Video editing and content creation for various projects",
          skills: ["Video Editing", "Content Creation"]
        }
      ]
    },
    {
      company: "Red Box Agency",
      logo: "/images/redboxlogo.png",
      startDate: "2024-04-01",
      location: "Mumbai, Maharashtra, India",
      positions: [
        {
          title: "Web Developer & Creative Head",
          type: "Part-time",
          startDate: "2025-08-01",
          endDate: null,
          location: "Mumbai, Maharashtra, India",
          description: "Leading web development projects and creative initiatives",
          skills: ["Web Development", "Creative Direction", "Team Leadership"]
        },
        {
          title: "Website Development and Social Media Marketing",
          type: "Internship",
          startDate: "2024-07-01",
          endDate: "2025-08-01",
          location: "Mumbai, Maharashtra, India",
          description: "Web Development & Social media marketing strategy Development",
          skills: ["WordPress", "HTML/CSS/JS", "SEO", "Social Media Strategy"]
        },
        {
          title: "Web Development & Social Media Marketing Strategy Development",
          type: "Internship",
          startDate: "2024-06-01",
          endDate: "2024-07-01",
          location: "Mumbai, Maharashtra, India",
          description: "Developing comprehensive digital marketing strategies",
          skills: ["Digital Marketing", "Strategy Development"]
        },
        {
          title: "Website Development",
          type: "Internship",
          startDate: "2024-04-01",
          endDate: "2024-06-01",
          location: "Andheri Mumbai India",
          description: "Frontend development and website creation",
          skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
          certificate: "6 Week Internship Completion Certificate"
        }
      ]
    },
  ];

  const education = [
    {
      institution: "Xavier Institute Of Engineering",
      logo: "/images/xieLogo.jpeg",
      degree: "Bachelor of Engineering - BE, Computer Engineering",
      period: "Aug 2025 - Present",
      activities: ""
    },
    {
      institution: "Vidyalankar Group of Educational Institutes",
      logo: "/images/vpLogo.png", // Using portfolio logo as placeholder
      degree: "High School Diploma, Computer Engineering",
      period: "Sep 2022 - Jun 2025",
       grade: "Grade: 91.61%",
      activities: "Activities and societies: Coder"
    },
    {
      institution: "Sadhana Education Society's Malti Jayant Dalal High School",
      logo: "/images/mjdsLogo.png", // Using portfolio logo as placeholder
      degree: "High School/Secondary Certificate Programs",
      period: "Jun 2012 - Jun 2022",
      grade: "Grade: 87.20%",
      activities: "Activities and societies: Cricket, Painting"
    }
  ];

  return (
    <main className="relative w-full overflow-hidden min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 sm:px-6 py-6 md:py-12 relative min-h-screen">
        
        {/* Left block */}
        <div className="text-left z-10 mb-8 md:mb-12 w-full md:max-w-xs">
          <p ref={subtitleRef} className="text-sm sm:text-base md:text-lg font-medium mb-4">
            Looking for an affordable and passionate developer for your tech solutions
          </p>
          <h1 ref={titleRef} className="font-vujahday text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Hello there!
          </h1>
          <button 
            onClick={handleDownloadResume}
            className="font-geom font-bold bg-black text-white text-base px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Resume <i className="fas fa-download ml-4"></i>
          </button>
        </div>

        {/* Center image section - responsive positioning */}
        <div className="w-full md:absolute md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 flex flex-col items-center md:mb-[7vw] order-last md:order-none my-8 md:my-0">
          
          {/* Stats block - responsive spacing */}
          <div className="flex space-x-8 md:space-x-[8vw] mb-6 md:mb-[6vw]">
            <div className="text-center">
              <h2 ref={el => statsRef.current[0] = el} className="text-4xl md:text-7xl font-bold">10+</h2>
              <p ref={el => statsRef.current[1] = el} className="text-sm md:text-[1.1vw]">Projects</p>
            </div>
            <div className="text-center">
              <h2 ref={el => statsRef.current[2] = el} className="text-4xl md:text-7xl font-bold">1+ Years</h2>
              <p ref={el => statsRef.current[3] = el} className="text-sm md:text-[1.1vw]">Internship</p>
            </div>
          </div>

          {/* Character Image - responsive sizing */}
          <img
            ref={imageRef}
            src="./images/aboutModel.png"
            alt="3D Character"
            className="h-50 sm:h-64 md:h-96 object-contain"
          />
        </div>

        {/* Right block */}
        <div className="text-right z-10 mb-8 md:mb-12 w-full md:max-w-xs md:ml-auto">
          <p ref={descriptionRef} className="text-sm sm:text-base font-medium mb-4">
            <b className="text-base md:text-[1.3vw]">Computer Engineering</b> student at <b className="text-base md:text-[1.3vw]">Vidyalankar Polytechnic</b> passionate about coding.
          </p>
          <h1 className="font-vujahday text-center leading-tight text-5xl md:text-7xl font-bold">
            Vinay<br />Here
          </h1>
        </div>

      </div>

      {/* Experience Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-12 font-poppins">Experience</h2>
        
        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div ref={el => experienceRef.current[index] = el} key={index} className="border-l-2 border-gray-200 pl-6 ml-4">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-2"
                />
                <div>
                  <h3 className="text-xl font-bold font-poppins">{exp.company}</h3>
                  <p className="text-gray-600 font-medium">{calculateCompanyDuration(exp.positions)}</p>
                  <p className="text-gray-500 text-sm">{exp.location}</p>
                </div>
              </div>
              
              <div className="space-y-4 ml-16">
                {exp.positions.map((position, posIndex) => (
                  <div key={posIndex} className="pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{position.title}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {position.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{formatDateRange(position.startDate, position.endDate)}</p>
                    <p className="text-gray-500 text-sm mb-2">{position.location}</p>
                    {position.description && (
                      <p className="text-gray-700">{position.description}</p>
                    )}
                    {position.skills && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {position.skills.map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                    {position.certificate && (
                      <p className="text-green-600 text-sm mt-1 font-medium">📜 {position.certificate}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-12 font-poppins">Education</h2>
        
        <div className="space-y-8">
          {education.map((edu, index) => (
            <div ref={el => educationRef.current[index] = el} key={index} className="border-l-2 border-gray-200 pl-6 ml-4">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={edu.logo}
                  alt={`${edu.institution} logo`}
                  className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-1"
                />
                <div>
                  <h3 className="text-xl font-bold font-poppins">{edu.institution}</h3>
                  <p className="text-gray-600 font-medium">{edu.degree}</p>
                  <p className="text-gray-500 text-sm">{edu.period}</p>
                </div>
              </div>
              
              <div className="ml-16">
                {edu.grade && (
                  <p className="text-gray-700 mb-2">{edu.grade}</p>
                )}
                {edu.activities && (
                  <p className="text-gray-600 text-sm">{edu.activities}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default EnhancedAboutSection;