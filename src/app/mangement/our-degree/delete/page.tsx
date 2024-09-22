"use client";

import Empty from "@/app/components/empty/Empty";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { DELETE_OUR_DEGREE_IMG } from "@/app/fetchApi/our-degrees/deleteImg";
import { GET_OUR_DEGREES_IMAGES_URL } from "@/app/fetchApi/our-degrees/getImagesUrl";
import { Toast } from "@/app/utils/alert";
import { Button } from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DeleteDgree = () => {
  interface ImgsUrl {
    id: number;
    imgUrl: string;
  }

  const [imgsUrl, setImgsUrl] = useState<ImgsUrl[]>();
  const [reload, setReload] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // This To Get Data Of Images From Database
  const handelGetUrls = async () => {
    setIsLoading(true);
    const message: any = await GET_OUR_DEGREES_IMAGES_URL();
    if (message.request.status == 200) {
      setImgsUrl(message.data.message);
    }
    setIsLoading(false);
  };

  // This To Get Data Of Images From Database
  const handelDeleteImg = async (id: number) => {
    setIsLoading(true);

    const message: any = await DELETE_OUR_DEGREE_IMG(String(id));
    if (message.request.status == 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
      setReload(!reload);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "success",
      });
    }
    setIsLoading(false);
  };

  const alert = (id: number) => {
    Swal.fire({
      title: "هل انت متأكد",
      text: "هل تريد مسح هذه الصورة نهائيا من الموقع",
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#767676",
      confirmButtonText: "نعم! احذفها",
      cancelButtonText: "إلغاء العملية",
    }).then((result) => {
      if (result.isConfirmed) {
        handelDeleteImg(id);
      }
    });
  };

  useEffect(() => {
    handelGetUrls();
  }, [reload]);

  return (
    <div className="min-h-[calc(100vh-100px)] py-[50px]">
      <TitleForPage titleText="حذف صور الدرجات" />

      {isLoading && <Loader />}
      {imgsUrl?.length ? (
        <div className="container grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5 relative z-10">
          {imgsUrl?.map((img) => {
            return (
              <div className="box relative shadow-xl rounded-xl border p-5 flex flex-col gap-5 bg-white" key={img.id}>
                <Image
                  className="w-full h-full block border rounded-xl shadow-xl"
                  width={300}
                  height={100}
                  src={`/uploads/${img.imgUrl}`}
                  alt="degree"
                />
                <Button onClick={() => alert(img.id)} size="lg" fullWidth color="danger" variant="shadow" className="text-xl font-bold h-fit p-5">
                  حذف
                </Button>
              </div>
            );
          })}
        </div>
      ) : (
        <Empty urlForBtn="/mangement/our-degree/add" textForBtn="إضافة صورة" />
      )}
    </div>
  );
};

export default DeleteDgree;
