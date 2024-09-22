"use client";

import Image from "next/image";
import React, { SetStateAction, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import backgroundTitle from "../../../../public/modern-splash-frame-with-yellow-background (1).png";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { GET_OUR_DEGREES_IMAGES_URL } from "@/app/fetchApi/our-degrees/getImagesUrl";

interface ImgsUrl {
  id: number;
  imgUrl: string;
}
interface Props {
  setLoadingDegreeImg: React.Dispatch<SetStateAction<boolean>>;
}

const OurDegrees: React.FC<Props> = ({ setLoadingDegreeImg }) => {
  const [imgsUrl, setImgsUrl] = useState<ImgsUrl[]>();

  // This To Get Data Of Images From Database
  const handelGetUrls = async () => {
    setLoadingDegreeImg(true);
    const message: any = await GET_OUR_DEGREES_IMAGES_URL();
    if (message.request.status == 200) {
      setImgsUrl(message.data.message);
    }
    setLoadingDegreeImg(false);
  };

  useEffect(() => {
    handelGetUrls();
  }, []);

  return (
    <section id="our-degrees" className="container">
      <div className="relative w-fit mx-auto text-center flex justify-center items-center flex-col">
        <Image className="absolute w-3/4 block mx-auto" src={backgroundTitle} alt="background title" />
        <h2 className="relative font-[logo-font] text-5xl text-orange-600">درجــات طــلابــنــا</h2>
      </div>
      <div className=" mt-[50px]">
        <Swiper
          pagination={{
            dynamicBullets: true,
            clickable: true,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          modules={[Autoplay, Pagination, Navigation]}
          navigation={true}
          className="mySwiper h-full flex"
        >
          {imgsUrl?.map((img) => {
            return (
              <SwiperSlide key={img.id} className="!flex relative justify-center items-center text-xl font-bold">
                <Image className="shadow-xl rounded-xl border block" width={650} height={100} src={`/uploads/${img.imgUrl}`} alt="" />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default OurDegrees;
