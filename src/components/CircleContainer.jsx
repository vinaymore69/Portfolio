import React from 'react';

function CircleContainer() {
  return (
    <div 
      className="absolute top-[15vw] right-[8vw] m-4 w-24 h-24 pointer-events-none z-10"
      style={{ transform: 'rotate(90deg)', transformOrigin: 'top right' }}
      aria-hidden="true"
    >
      <svg 
        className="absolute w-20 h-20 top-0 left-0" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ stroke: 'black', fill: 'none', strokeWidth: 1 }}
      >
        <circle cx="50" cy="50" r="50"></circle>
      </svg>
      <svg 
        className="absolute w-20 h-20 top-3 left-5" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ stroke: 'black', fill: 'none', strokeWidth: 1 }}
      >
        <circle cx="50" cy="50" r="45"></circle>
      </svg>
      <svg 
        className="absolute w-20 h-20 top-6 left-10" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ stroke: 'black', fill: 'none', strokeWidth: 1 }}
      >
        <circle cx="50" cy="50" r="40"></circle>
      </svg>
    </div>
  );
}

export default CircleContainer;