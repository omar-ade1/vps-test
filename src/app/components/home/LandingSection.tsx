"use client";

import { variantHomePage, variantHomePage2 } from "@/app/utils/variant";
import { Button } from "@nextui-org/react";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { TypeAnimation } from "react-type-animation";
import landingImage from "../../../../public/test2.jpg";
import Image from "next/image";
import paintImage from "../../../../public/paint.png";
import { Cairo } from "next/font/google";

const cairo = Cairo({ subsets: ["latin"] });

const LandingSection = () => {


  return (
    <div className="relative overflow-hidden">
      {/* Svg Animation */}
      <div className="absolute z-10 w-full top-1/2 -translate-y-1/2 rotate-6 scale-110">
        <svg
          width="100%"
          height="5%"
          className="h-[200px] "
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          overflow="auto"
          shapeRendering="auto"
          fill="#000"
        >
          <defs>
            <path id="wavepath" d="M 0 2000 0 500 Q 121.5 409 243 500 t 243 0 243 0 243 0 243 0 243 0 243 0 v1000 z" />
            <path id="motionpath" d="M -486 0 0 0" />
          </defs>
          <g>
            <use xlinkHref="#wavepath" y="306" fill="#EAE8E9">
              <animateMotion dur="5s" repeatCount="indefinite">
                <mpath xlinkHref="#motionpath" />
              </animateMotion>
            </use>
          </g>
        </svg>
        <svg
          width="100%"
          height="5%"
          className="rotate-180  h-[200px] "
          viewBox="0 0 1000 1000"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          overflow="auto"
          shapeRendering="auto"
          fill="#000"
        >
          <defs>
            <path id="wavepath" d="M 0 2000 0 500 Q 121.5 409 243 500 t 243 0 243 0 243 0 243 0 243 0 243 0 v1000 z" />
            <path id="motionpath" d="M -486 0 0 0" />
          </defs>
          <g>
            <use xlinkHref="#wavepath" y="306" fill="#D1E2F2">
              <animateMotion dur="5s" repeatCount="indefinite">
                <mpath xlinkHref="#motionpath" />
              </animateMotion>
            </use>
          </g>
        </svg>
      </div>

      <section className=" relative">


        <Image className="block h-full absolute object-cover" src={landingImage} alt="background image" />
        <div className="container min-h-[calc(100vh-64px)] relative z-10 flex justify-center flex-col items-center">
          <div className="flex justify-center items-center flex-col gap-5 text-xl">
            <div className="relative logo-container">
              <motion.div variants={variantHomePage} initial="hidden" animate="animate">
                <Image className="absolute image-for-logo block top-[-20px] transition-all duration-300" src={paintImage} alt="" />
              </motion.div>
              <motion.h2
                variants={variantHomePage}
                initial="hidden"
                animate="animate"
                className="font-[logo-font] relative select-none text-9xl xxsm:text-8xl text-orange-600"
              >
                الوجيز
              </motion.h2>
            </div>
            <TypeAnimation
              className={`${cairo.className} font-bold text-5xl smT0:text-4xl xxsm:!text-3xl`}
              speed={75}
              sequence={[
                "طريقك للقدرات في القسم اللفظي",
                4000,
                "فوق الـ 1000 طالب بدرجة فوق 98%",
                4000,
                "اختبارات تتحدث باستمرار",
                4000,
                "سرعة الرد على أي سؤال",
                4000,
              ]}
              wrapper="span"
              cursor={true}
              repeat={Infinity}
              style={{ display: "inline-block", lineHeight: 1.2, textAlign: "center" }}
            />
            <motion.h3
              variants={variantHomePage2}
              initial="hidden"
              animate="animate"
              className="font-bold text-4xl xxsm:text-3xl text-center tracking-[1px] font-[logo-font]"
            >
              أ/عــادل عــاشــور
            </motion.h3>
            <motion.h3
              variants={variantHomePage}
              initial="hidden"
              animate="animate"
              className="font-bold text-3xl xxsm:text-2xl flex justify-center items-center"
            >
              <span className="font-[logo-font] text-orange-600">هاتف:</span> 0557364408
            </motion.h3>
          </div>
          <motion.div
            variants={variantHomePage2}
            initial="hidden"
            animate="animate"
            className="flex justify-center items-center gap-5 mt-5 smT0:flex-col"
          >
            <Button
              variant="ghost"
              color="primary"
              size="lg"
              className="shadow-button-start font-bold font-[logo-font] text-4xl block p-5 w-fit h-fit tracking-[1px]"
            >
              ابـــدأ الان
            </Button>

            <Button
              variant="ghost"
              color="secondary"
              size="lg"
              className="font-bold shadow-xl shadow-button font-[logo-font] text-4xl block p-5 w-fit h-fit tracking-[1px]"
            >
              تواصل معنا
            </Button>
          </motion.div>

          <Link href={"#our-degrees"} className="absolute top-[calc(100%-100px)] cursor-pointer">
            <div className="w-[20px] arrow-home-page h-[20px] border-l-4 border-b-4 rounded-sm border-orange-600"></div>
            <div className="w-[20px] arrow-home-page h-[20px] border-l-4 border-b-4 rounded-sm border-orange-600"></div>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingSection;
