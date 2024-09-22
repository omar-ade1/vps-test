import React from "react";
import { Button, Link, Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@nextui-org/react";
import LinkNext from "next/link";
import Menu from "./components/Menu";
import "./header.css";
import { cookies } from "next/headers";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { tokenInfo } from "@/app/utils/tokenVerify";

const MainHeader = () => {
  const token = cookies().get("jwtToken")?.value as string;
  const verfiyToken = tokenInfo() as jwtPayLoad;

  return (
    <>
      {/* <OverLay /> */}
      <Navbar id="navBar" className={` border-b-2 shadow-xl !h-fit z-50 bg-white`} shouldHideOnScroll>
        <NavbarBrand>
          <LinkNext href={"/"} className="text-5xl select-none font-bold font-[logo-font] text-orange-600">
            الوجيز
          </LinkNext>
        </NavbarBrand>

        <Menu />

        <NavbarContent
          className={` smT0:w-0 smT0:opacity-0 NavbarContent smT0:flex smT0:flex-col smT0:absolute smT0:top-full smT0:left-0  smT0:bg-black smT0:h-[100vh] smT0:!justify-start smT0:pt-5 smT0:transition-all smT0:duration-500 smT0:overflow-hidden smT0:divide-y-1 smT0:divide-gray-500 smT0:items-start smT0:gap-0`}
          justify="center"
        >
          <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
            <Link className="font-bold smT0:p-4" as={LinkNext} href={"/"}>
              الرئيسية
            </Link>
          </NavbarItem>

          <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
            <Link className="font-bold smT0:p-4" as={LinkNext} href={"/our-courses"}>
              الدورات
            </Link>
          </NavbarItem>

          <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
            <Link className="font-bold smT0:p-4" as={LinkNext} href={"/"}>
              تواصل معنا
            </Link>
          </NavbarItem>

          {verfiyToken?.isAdmin === true && (
            <NavbarItem className="smT0:w-full text-center hover:bg-gray-900">
              <Link className="font-bold smT0:p-4" as={LinkNext} href={"/mangement"}>
                الإدارة
              </Link>
            </NavbarItem>
          )}

          {token ? (
            <NavbarItem className="smT0:w-full smT0:block hidden text-center">
              <Button fullWidth radius="none" size="lg" variant="shadow" color="primary" className="font-bold smT0:p-4" as={LinkNext} href="/">
                حسابي
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="smT0:w-full smT0:block hidden text-center hover:bg-gray-900">
                <Button fullWidth radius="none" className="font-bold smT0:p-4" as={LinkNext} href="/login">
                  تسجيل
                </Button>
              </NavbarItem>
              <NavbarItem className="smT0:w-full smT0:block hidden text-center hover:bg-gray-900">
                <Button fullWidth radius="none" variant="shadow" color="success" className="font-bold smT0:p-4" as={LinkNext} href="/sign-up">
                  إنشاء حساب
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        <NavbarContent justify="end" className="smT0:hidden">
          {token ? (
            <NavbarItem className="">
              <Button size="lg" variant="shadow" color="primary" className="font-bold" as={LinkNext} href="/">
                حسابي
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="">
                <Button className="font-bold" as={LinkNext} href="/login">
                  تسجيل
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button className="font-bold" as={LinkNext} color="primary" href="/sign-up" variant="flat">
                  إنشاء حساب
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        {/* <OverLay /> */}
      </Navbar>
    </>
  );
};

export default MainHeader;
