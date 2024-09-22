"use client";

import React, { useEffect, useState } from "react";
import "./menu.css";
import { AnimatePresence, motion } from "framer-motion";
import { IoMdMenu } from "react-icons/io";
import { IoMdClose } from "react-icons/io";

const Menu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // To Stop Scrolling While Menu Open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              setIsMenuOpen(false);
              e.currentTarget.parentElement?.parentElement?.classList.remove("menu-open");
              console.log(e.currentTarget.parentElement);
            }}
            className="w-full h-[calc(100vh+65px)] hidden smT0:block fixed inset-0 bg-black opacity-70 z-0"
          ></motion.div>
        )}
      </AnimatePresence>

      {isMenuOpen ? (
        <IoMdClose
          onClick={(e) => {
            setIsMenuOpen(false);
            e.currentTarget.parentElement?.parentElement?.classList.remove("menu-open");
          }}
          className={`hidden smT0:block text-5xl cursor-pointer relative z-20 ${isMenuOpen && "bg-red-600 text-white rounded-full"}`}
        />
      ) : (
        <IoMdMenu
          onClick={(e) => {
            setIsMenuOpen(true);
            e.currentTarget.parentElement?.parentElement?.classList.add("menu-open");
          }}
          className="hidden smT0:block text-5xl cursor-pointer"
        />
      )}

      {/* <label className="containerMenu hidden smT0:block overflow-hidden bg-white text-red-500 p-2 rounded-xl">
        <input
          checked={isMenuOpen}
          onChange={(e) => {
            setIsMenuOpen(!isMenuOpen);
            if (isMenuOpen) {
              e.target.parentElement?.parentElement?.classList.remove("menu-open");
            } else {
              e.target.parentElement?.parentElement?.classList.add("menu-open");
            }
          }}
          type="checkbox"
        />
        <div className={`checkmark ${isMenuOpen && "checkmarkActive"}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </label> */}
    </>
  );
};

export default Menu;
// "use client";

// import React, { SetStateAction } from "react";
// import "./menu.css";

// interface Props {
//   isMenuOpen: boolean;
//   setIsMenuOpen: React.Dispatch<SetStateAction<boolean>>;
// }

// const Menu: React.FC<Props> = ({ isMenuOpen, setIsMenuOpen }) => {
//   return (
//     <label className="containerMenu hidden smT0:block overflow-hidden">
//       <input checked={isMenuOpen} onChange={() => setIsMenuOpen(!isMenuOpen)} type="checkbox" />
//       <div className="checkmark">
//         <span></span>
//         <span></span>
//         <span></span>
//       </div>
//     </label>
//   );
// };

// export default Menu;
