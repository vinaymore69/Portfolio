import React from 'react';

function HomeSection() {
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
         <button
      className="font-poppins-bold bg-black text-white text-base px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
      onClick={() =>
        window.open(
          'https://drive.google.com/file/d/1rxkAqgLNSY0VC4N8xyxZ6FWl4dtbIWmz/view?usp=drive_link',
          '_blank'
        )
      }
    >
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
    </main>
  );
}

export default HomeSection;