import React, { useEffect, useState } from 'react';

function FadeInWrapper({ children }) {
  const [fadeIn, setFadeIn] = useState([]);

  useEffect(() => {
    const childrenArray = React.Children.toArray(children); 
    const timeouts = childrenArray.map((_, index) => 
      setTimeout(() => {
        setFadeIn((prevState) => {
          const newState = [...prevState];
          newState[index] = true;
          return newState;
        });
      }, 100 * index)
    );

    return () => {
      timeouts.forEach(clearTimeout); 
    };
  }, [children]);

  return (
    <div>
      {React.Children.map(children, (child, index) => (
        <div
          className={`transition-opacity duration-1000 ${fadeIn[index] ? 'opacity-100' : 'opacity-0'}`}
          style={{ transitionDelay: `${100 * index}ms` }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

export default FadeInWrapper;
