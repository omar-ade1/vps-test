// "use client";

// import React, { useState } from "react";
// import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
// import LinkNext from "next/link";
// import { Cairo } from "next/font/google";
// import Menu from "./components/Menu";
// import { AnimatePresence, motion } from "framer-motion";

// const cairo = Cairo({ subsets: ["latin"] });

// const Header = () => {
//   // This For Open And Close The Menu
//   const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

//   return (
//     <>
//       <AnimatePresence>
//         {isMenuOpen && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 0.8 }}
//             exit={{ opacity: 0 }}
//             onClick={() => setIsMenuOpen(false)}
//             className="w-screen h-screen hidden smT0:block fixed inset-0 bg-black opacity-70 "
//           ></motion.div>
//         )}
//       </AnimatePresence>

//       <Navbar className={`${cairo.className} border-b-2 shadow-xl !h-fit`} shouldHideOnScroll>
//         <NavbarBrand>
//           <LinkNext href={"/"} className="text-5xl select-none font-bold font-[logo-font] text-orange-600">
//             الوجيز
//           </LinkNext>
//         </NavbarBrand>

//         <Menu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

//         <NavbarContent
//           className={`${
//             isMenuOpen ? "smT0:w-[clamp(250px,50%,300px)] smT0:opacity-100" : "smT0:w-0 smT0:opacity-0"
//           } smT0:flex smT0:flex-col smT0:absolute smT0:top-full smT0:left-0  smT0:bg-black smT0:h-[calc(100vh-64px)] smT0:!justify-start smT0:pt-5 smT0:transition-all smT0:duration-500 smT0:overflow-hidden smT0:divide-y-1 smT0:divide-gray-500 smT0:items-start smT0:gap-0`}
//           justify="center"
//         >
//           <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
//             <Link className="font-bold smT0:p-4" as={LinkNext} href={"/"}>
//               الرئيسية
//             </Link>
//           </NavbarItem>

//           <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
//             <Link className="font-bold smT0:p-4" as={LinkNext} href={"/"}>
//               الدورات
//             </Link>
//           </NavbarItem>

//           <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
//             <Link className="font-bold smT0:p-4" as={LinkNext} href={"/"}>
//               تواصل معنا
//             </Link>
//           </NavbarItem>

//           <NavbarItem className="smT0:w-full smT0:block hidden text-center hover:bg-gray-900">
//             <Button fullWidth radius="none" className="font-bold smT0:p-4" as={LinkNext} href="/login">
//               تسجيل
//             </Button>
//           </NavbarItem>

//           <NavbarItem className="smT0:w-full smT0:block hidden text-center hover:bg-gray-900">
//             <Button fullWidth radius="none" variant="shadow" color="success" className="font-bold smT0:p-4" as={LinkNext} href="/sign-up">
//               إنشاء حساب
//             </Button>
//           </NavbarItem>
//         </NavbarContent>
//         <NavbarContent justify="end" className="smT0:hidden">
//           <NavbarItem className="">
//             <Button className="font-bold" as={LinkNext} href="/login">
//               تسجيل
//             </Button>
//           </NavbarItem>
//           <NavbarItem>
//             <Button className="font-bold" as={LinkNext} color="primary" href="/sign-up" variant="flat">
//               إنشاء حساب
//             </Button>
//           </NavbarItem>
//         </NavbarContent>
//       </Navbar>
//     </>
//   );
// };

// export default Header;

import React from 'react'

const Header = () => {
  return (
    <div>Header</div>
  )
}

export default Header