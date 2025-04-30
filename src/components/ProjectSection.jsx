import React, { useState } from "react";

const projects = [
  {
    id: 1,
    title: "VPortfolinK",
    description: "An in-depth look at crafting and positioning your brand for maximum impact.",
    technologies: ["PHP", "MySQL", "Core HTML CSS JS", "GSAP"],
    link: "https://github.com/vinaymore69/V-PortfolinK",
    image: "/images/PortFoLinK.png",
  },
  {
    id: 2,
    title: "SanChi",
    description: "Bringing brands to life through experiential and digital activations.",
    technologies: ["NodeJs", "Core HTML CSS JS", "GSAP", "Express", "PostGreSQL", "Botpress"],
    link: "https://vinaymore69.github.io/SanChi-UI2/",
    image: "/images/SanChi.png",
  },
  {
    id: 3,
    title: "V-Visit",
    description: "Building responsive, accessible, and performant websites from scratch.",
    technologies: ["React", "Tailwind CSS", "Node.js"],
    link: "https://github.com/vinaymore69/VisitingApplication",
    image: "/images/V_Visit.jpg",
  },
  {
    id: 4,
    title: "6SeasonsStudio",
    description: "Full-scale video production services from scripting to post-production.",
    technologies: ["WordPress"],
    link: "https://yourdomain.com/video-production",
    image: "/images/6SeasonsStudio.png",
  },
  {
    id: 5,
    title: "Event Furniture Rental Service",
    description: "Holistic marketing campaigns that span paid, owned, and earned channels.",
    technologies: ["SEO", "PPC", "Social Media"],
    link: "https://eventfurniture.rent/",
    image: "/images/eventfurniture.png",
  },
];

export default function HomeSection() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);

  // Find the hovered project data
  const hoveredProjectData = projects.find(proj => proj.id === hoveredProject);
  
  // Function to handle project selection and clear hover state
  const handleProjectClick = (projectId) => {
    setSelectedProject(projectId);
    setHoveredProject(null);
  };

  return (
    <main className="relative w-full overflow-hidden min-h-screen bg-white text-black">
      {/* Hover Preview Image */}
      <div 
        className={`fixed left-1/2 transform -translate-x-1/2 top-10 z-10 transition-all duration-300 ease-in-out ${
          hoveredProject ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      >
        {hoveredProjectData && (
          <img 
            src={hoveredProjectData.image} 
            alt={`${hoveredProjectData.title} preview`} 
            className="w-[30vw] h-[70vh] object-contain rounded-lg"
          />
        )}
      </div>

      {/* Initial Button Grid */}
      <div
        className={`max-w-7xl gap-10 mx-auto px-6 py-10 relative h-[80vh] flex flex-col transition-transform duration-1000 ease-in-out ${
          selectedProject !== null ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"
        }`}
      >
        <div className="mb-20">
          <h1 className="text-6xl font-bold mb-2 font-poppins">My Projects</h1>
          <p className="font-poppins-bold text-sm">Learning From my Each project.</p>
        </div>

        {/* Main grid stays unchanged */}
        <div className="flex flex-row items-start">
          <div className="">
            <img
              src="./images/projectsModel.png"
              alt="Project Illustration"
              className="w-[16vw] mt-[-4vw] h-auto object-cover rounded-lg"
            />
          </div>

          <div className="flex-1 self-end mb-14 flex flex-col gap-4">
            <div className="flex flex-col gap-8">
              <div className="flex flex-row-reverse gap-8 justify-start items-end">
                <button
                  onClick={() => handleProjectClick(1)}
                  onMouseEnter={() => setHoveredProject(1)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border border-black rounded-full py-4 px-10 text-m font-poppins-bold flex justify-between items-center gap-16 hover:bg-black hover:text-white transition-all duration-2000 ease-in-out"
                >
                  VPortfolinK
                  <span className="ml-4">→</span>
                </button>
                <button
                  onClick={() => handleProjectClick(2)}
                  onMouseEnter={() => setHoveredProject(2)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border border-black rounded-full py-4 px-10 text-m font-poppins-bold flex justify-between items-center gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  SanChi
                  <span className="ml-4">→</span>
                </button>
              </div>

              <div className="flex flex-row-reverse gap-8 justify-start items-end">
                <button
                  onClick={() => handleProjectClick(3)}
                  onMouseEnter={() => setHoveredProject(3)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border w-full border-black rounded-full py-4 px-10 text-m font-poppins-bold flex justify-between items-center gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  V-Visit
                  <span className="ml-4">→</span>
                </button>
                <button
                  onClick={() => handleProjectClick(4)}
                  onMouseEnter={() => setHoveredProject(4)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border w-full border-black rounded-full py-4 px-10 text-m font-poppins-bold flex justify-between items-center gap-16 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  6SeasonsStudio
                  <span className="ml-4">→</span>
                </button>
                <button
                  onClick={() => handleProjectClick(5)}
                  onMouseEnter={() => setHoveredProject(5)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className="border w-full border-black rounded-full py-4 px-10 text-m font-poppins-bold flex justify-between items-center gap-6 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  Event Furniture
                  <span className="ml-4">→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* UPDATED Project Detail Sections */}
      {projects.map((proj, idx) => {
        const isActive = selectedProject === proj.id;
        const offscreen = idx % 2 === 0 ? "translate-x-full opacity-0" : "-translate-x-full opacity-0";
        const slideIn = isActive ? "translate-x-0 opacity-100" : offscreen;

        return (
          <div
            key={proj.id}
            className={`absolute inset-0 flex items-center justify-center px-6 py-10 transition-transform duration-1000 ease-in-out  ${slideIn}`}
          >
            <div className="max-w-7xl rounded-2xl  p-8 flex flex-col lg:flex-row gap-6 lg:gap-12">
              {/* Image Panel */}
              <div className="w-[33vw] h-[33vh] object-center flex justify-center items-center">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full max-h-[60vh] object-contain rounded-lg"
                />
              </div>

              {/* Text Panel */}
              <div className="lg:w-1/2 w-full flex flex-col justify-between">
                <div>
                  <h2 className="text-5xl font-bold mb-4 font-poppins">
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      {proj.title}
                    </a>
                  </h2>
                  <p className="mb-6 text-xl leading-relaxed font-poppins-bold">{proj.description}</p>
                  <p className="mb-6 text-lg font-poppins-bold">
                    <span className="font-semibold">Technologies:</span> {proj.technologies.join(", ")}
                  </p>
                </div>
      


                <button
                  onClick={() => setSelectedProject(null)}
                  className="self-start border border-black rounded-full py-3 px-8 text-m font-poppins-bold flex justify-between items-center gap-5 hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
                >
                  <span className="text-2xl ">←</span>
                  Back
                  

                  </button>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}