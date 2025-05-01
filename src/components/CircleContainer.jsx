import React from 'react'; 
 
function CircleContainer() { 
  return ( 
    <div  
      className="absolute top-16 sm:top-24 md:top-[15vw] right-4 sm:right-6 md:right-[8vw] m-2 sm:m-4 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 pointer-events-none z-10" 
      style={{ transform: 'rotate(90deg)', transformOrigin: 'top right' }} 
      aria-hidden="true" 
    > 
      <svg  
        className="absolute w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 top-0 left-0"  
        viewBox="0 0 100 100"  
        xmlns="http://www.w3.org/2000/svg" 
        style={{ stroke: 'black', fill: 'none', strokeWidth: 1 }} 
      > 
        <circle cx="50" cy="50" r="50"></circle> 
      </svg> 
      <svg  
        className="absolute w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 top-2 sm:top-2 md:top-3 left-3 sm:left-4 md:left-5"  
        viewBox="0 0 100 100"  
        xmlns="http://www.w3.org/2000/svg" 
        style={{ stroke: 'black', fill: 'none', strokeWidth: 1 }} 
      > 
        <circle cx="50" cy="50" r="45"></circle> 
      </svg> 
      <svg  
        className="absolute w-12 sm:w-16 md:w-20 h-12 sm:h-16 md:h-20 top-4 sm:top-5 md:top-6 left-6 sm:left-8 md:left-10"  
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