import React from 'react';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HonorsSection = () => {
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    // Title animation
    gsap.fromTo(titleRef.current,
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: titleRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Cards stagger animation
    gsap.fromTo(cardsRef.current,
      {
        opacity: 0,
        y: 80,
        rotationX: -45,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: cardsRef.current[0],
          start: "top 80%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, []);

  const honors = [
    {
      title: "Selected for SIH 2025 – Internal Hackathon Qualifier",
      issuer: "Smart India Hackathon",
      date: "2025",
      description: "Successfully qualified through the internal hackathon round for Smart India Hackathon 2025, demonstrating innovative problem-solving skills and technical expertise in developing solutions for real-world challenges.",
      icon: "🏅"
    },
    {
      title: "Winner – Sprint Nova 6-Hour Hackathon",
      issuer: "Xavier Institute of Engineering",
      date: "2025",
      description: "Won the Sprint Nova 6-hour hackathon competition at Xavier Institute of Engineering, demonstrating rapid prototyping skills, innovative problem-solving, and technical excellence under time constraints. Successfully developed and presented a complete solution within the challenging 6-hour timeframe.",
      icon: "🚀"
    },
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
      title: "First Prize - 10th Standard Academic Excellence",
      issuer: "Sadhana Education Society's Malti Jayant Dalal High School",
      date: "2022",
      description: "Achieved First Prize for outstanding academic performance in 10th Standard examinations, demonstrating consistent excellence across all subjects and maintaining top position in the class.",
      icon: "🏆"
    },
    {
      title: "Academic Excellence - MSBTE Summer 2023 Examination",
      issuer: "Vidyalankar Polytechnic",
      date: "2023",
      description: "Achieved 86.75% in the Summer 2023 examination conducted by the Maharashtra State Board of Technical Education (MSBTE). Recognized by Vidyalankar Polytechnic, Department of Computer Engineering (NBA Accredited), for outstanding academic performance in Class CO5IC Division C.",
      icon: "📚"
    },
    {
      title: "First Rank In Class - MSBTE Winter 2022 Examination",
      issuer: "Vidyalankar Polytechnic",
      date: "2022",
      description: "Secured 1st position in Class CO3IC Division C with 86.71% in the Winter 2022 examination, conducted by the Maharashtra State Board of Technical Education (MSBTE). Awarded by Vidyalankar Polytechnic, Department of Computer Engineering (NBA Accredited).",
      icon: "🥇"
    },
    {
      title: "Second Runner-Up – TechSpardha 2024-25",
      issuer: "Vidyalankar Polytechnic",
      date: "2024",
      description: "Awarded Second Runner-Up at TechSpardha 2024-25, an inter-department technical competition organized by TechShala at Vidyalankar Polytechnic. Recognized for outstanding performance in a competitive tech environment fostering innovation and problem-solving skills.",
      icon: "🥉"
    } ,{
      title: "Appreciation for Creative Sketches – Alila Competition 2022",
      issuer: "Vidyalankar Polytechnic",
      date: "2022",
      description: "Received appreciation for showcasing creative sketching skills under the banner of Alila – Surprisingly Charming, a creative initiative by Vidyalankar to spark imagination and artistic expression in young minds.",
      icon: "🤗"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
      <div className="text-center mb-12">
        <h2 ref={titleRef} className="text-4xl md:text-6xl font-bold mb-4 font-poppins">Honors & Awards</h2>
        <p className="text-lg text-gray-600 font-poppins-bold">Recognition for academic excellence and technical achievements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {honors.map((honor, index) => (
          <div 
            ref={el => cardsRef.current[index] = el}
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