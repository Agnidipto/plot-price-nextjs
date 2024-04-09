'use client';
import React, { useEffect, useState } from 'react'

function ScrollToTopButton() {
  const [display, setDisplay] = useState('none');
  const [down, setDown] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const percentage = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (percentage > 90) {
        setDown(false)
      } else if (percentage == 0) {
        setDown(true)
      }

    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); 

  const scrollToTop = () => {
    if (!down)
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    else {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      })
    }
  };

  return (
    <button 
    onClick={scrollToTop}
    className="scroll-to-top fixed bottom-4 right-4 
              text-white bg-black hover:bg-gray-950/50 
              border border-gray-300 focus:ring-1 
              focus:outline-none focus:ring-gray-50/50 
              font-medium text-sm px-2.5 py-2.5 text-center 
              inline-flex items-center rounded-full block xl:hidden"
    style={{zIndex:3000, 
    // opacity: display=='none'? 0 : 1, 
    // transition:'all 1s', pointerEvents: display=='none'? 'none' : 'initial'
    }}>

      {!down && 
      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7 7.674 1.3a.91.91 0 0 0-1.348 0L1 7"/>
      </svg>}
      {/* Down */}
      {down && 
      <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 8">
      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 5.326 5.7a.909.909 0 0 0 1.348 0L13 1"/>
      </svg>}
    </button>
  )
}

export default ScrollToTopButton