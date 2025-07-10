import React from 'react';

const HonorsSection = () => {
  const honors = [
    {
      title: "Campus Ambassador – GSSoC 2025 Selected Representative",
      issuer: "GirlScript Foundation",
      date: "Jun 2025",
      description: "Selected as the official Campus Ambassador for GirlScript Summer of Code 2025. Tasked with promoting open-source contributions, conducting awareness sessions, and representing the organization within my college community.",
      icon: "🏆"
    },
    {
      title: "Runner Up – Final Year Project Exhibition",
      issuer: "Vidyalankar Polytechnic",
      date: "Apr 2025",
      description: "Secured Runner Up position in the Final Year Project Exhibition for the Department of Computer Engineering, held at Vidyalankar Polytechnic, Wadala, Mumbai. The event recognized innovation and technical excellence among final-year engineering projects.",
      icon: "🥈"
    },
    {
      title: "Academic Excellence - MSBTE Summer 2023 Examination",
      issuer: "Vidyalankar Polytechnic",
      date: "2023",
      description: "Achieved 86.75% in the Summer 2023 examination conducted by the Maharashtra State Board of Technical Education (MSBTE). Recognized by Vidyalankar Polytechnic, Department of Computer Engineering (NBA Accredited), for outstanding academic performance in Class CO21 Division C.",
      icon: "📚"
    },
    {
      title: "First Rank In Class - MSBTE Winter 2022 Examination",
      issuer: "Vidyalankar Polytechnic",
      date: "2022",
      description: "Secured 1st position in Class CO11 Division C with 86.71% in the Winter 2022 examination, conducted by the Maharashtra State Board of Technical Education (MSBTE). Awarded by Vidyalankar Polytechnic, Department of Computer Engineering (NBA Accredited).",
      icon: "🥇"
    },
    {
      title: "Second Runner-Up – TechSpardha 2024-25",
      issuer: "Vidyalankar Polytechnic",
      date: "2024",
      description: "Awarded Second Runner-Up at TechSpardha 2024-25, an inter-department technical competition organized by TechShala at Vidyalankar Polytechnic. Recognized for outstanding performance in a competitive tech environment fostering innovation and problem-solving skills.",
      icon: "🥉"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-bold mb-4 font-poppins">Honors & Awards</h2>
        <p className="text-lg text-gray-600 font-poppins-bold">Recognition for academic excellence and technical achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {honors.map((honor, index) => (
          <div 
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <div className="text-4xl mb-4">{honor.icon}</div>
            <h3 className="text-lg font-bold mb-2 font-poppins leading-tight">{honor.title}</h3>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-700">{honor.issuer}</p>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{honor.date}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{honor.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HonorsSection;