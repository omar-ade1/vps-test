"use client"
import React from "react";

const OverLay = () => {
  const navbar = document.getElementById("navBar")
  return <div
    onClick={(e) => {
      document.getElementById("navBar")?.children[0].classList.remove("menu-open");
      
    
    }}
    className="w-screen h-screen hidden smT0:block  fixed inset-0 bg-black opacity-70 z-20"></div>;
};

export default OverLay;

      {/* <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              setIsMenuOpen(false);
              e.target.parentElement?.classList.remove("menu-open")
              
            }}
            className="w-screen h-screen hidden smT0:block fixed inset-0 bg-black opacity-70 z-20"
          ></motion.div>
        )}
      </AnimatePresence> */}