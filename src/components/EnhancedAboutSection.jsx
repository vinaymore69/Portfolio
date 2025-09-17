import React from 'react';

function EnhancedAboutSection() {
  const experiences = [
    {
      company: "Codeterna Private Limited",
      logo: "/images/codeternaLogo.png",
      duration: "Internship · 3 mos",
      location: "Navi Mumbai, Maharashtra, India · Remote",
      positions: [
        {
          title: "Mobile Application Developer",
          period: "Sep 2025 - Present · 1 mo",
          location: "Navi Mumbai, Maharashtra, India · Remote",
          description: "Mobile Application Development and iOS"
        },
        {
          title: "Application Developer",
          period: "Jul 2025 - Aug 2025 · 2 mos",
          location: "Mumbai, Maharashtra, India · On-site",
          description: "Flutter and Application Development"
        }
      ]
    },
    {
      company: "Red Box Agency",
      logo: "/images/redboxlogo.png",
      duration: "Internship · 1 yr 4 mos",
      location: "Remote",
      positions: [
        {
          title: "Website Development and Social media marketing",
          period: "Jul 2024 - Present · 1 yr 1 mo",
          location: "Mumbai, Maharashtra, India",
          description: "Web Development & Social media marketing strategy Development."
        },
        {
          title: "Web Development & Social media marketing strategy Development",
          period: "Jun 2024 - Jul 2024 · 2 mos",
          location: "Mumbai, Maharashtra, India"
        },
        {
          title: "Website Development",
          period: "Apr 2024 - Jun 2024 · 3 mos",
          location: "Andheri Mumbai India"
        }
      ]
    },
  ];

  const education = [
    {
      institution: "Vidyalankar Group of Educational Institutes",
      logo: "/images/vpLogo.png", // Using portfolio logo as placeholder
      degree: "High School Diploma, Computer Engineering",
      period: "Sep 2022 - Jun 2025",
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
          <p className="text-sm sm:text-base md:text-lg font-medium mb-4">
            Looking for an affordable and passionate developer for your tech solutions
          </p>
          <h1 className="font-vujahday text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Hello there!
          </h1>
          <button className="font-poppins-bold bg-black text-white text-base px-6 py-2 rounded-full hover:bg-gray-800 transition-colors">
            Resume <i className="fas fa-download ml-4"></i>
          </button>
        </div>

        {/* Center image section - responsive positioning */}
        <div className="w-full md:absolute md:bottom-0 md:left-1/2 md:transform md:-translate-x-1/2 flex flex-col items-center md:mb-[7vw] order-last md:order-none my-8 md:my-0">
          
          {/* Stats block - responsive spacing */}
          <div className="flex space-x-8 md:space-x-[8vw] mb-6 md:mb-[6vw]">
            <div className="text-center">
              <h2 className="text-4xl md:text-7xl font-bold">10+</h2>
              <p className="text-sm md:text-[1.1vw]">Projects</p>
            </div>
            <div className="text-center">
              <h2 className="text-4xl md:text-7xl font-bold">1+ Years</h2>
              <p className="text-sm md:text-[1.1vw]">Internship</p>
            </div>
          </div>

          {/* Character Image - responsive sizing */}
          <img
            src="./images/aboutModel.png"
            alt="3D Character"
            className="h-50 sm:h-64 md:h-96 object-contain"
          />
        </div>

        {/* Right block */}
        <div className="text-right z-10 mb-8 md:mb-12 w-full md:max-w-xs md:ml-auto">
          <p className="text-sm sm:text-base font-medium mb-4">
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
            <div key={index} className="border-l-2 border-gray-200 pl-6 ml-4">
              <div className="flex items-start space-x-4 mb-4">
                <img
                  src={exp.logo}
                  alt={`${exp.company} logo`}
                  className="w-12 h-12 rounded-lg object-contain bg-gray-100 p-2"
                />
                <div>
                  <h3 className="text-xl font-bold font-poppins">{exp.company}</h3>
                  <p className="text-gray-600 font-medium">{exp.duration}</p>
                  <p className="text-gray-500 text-sm">{exp.location}</p>
                </div>
              </div>
              
              <div className="space-y-4 ml-16">
                {exp.positions.map((position, posIndex) => (
                  <div key={posIndex} className="pb-4">
                    <h4 className="font-semibold text-lg">{position.title}</h4>
                    <p className="text-gray-600 text-sm mb-1">{position.period}</p>
                    <p className="text-gray-500 text-sm mb-2">{position.location}</p>
                    {position.description && (
                      <p className="text-gray-700">{position.description}</p>
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
            <div key={index} className="border-l-2 border-gray-200 pl-6 ml-4">
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