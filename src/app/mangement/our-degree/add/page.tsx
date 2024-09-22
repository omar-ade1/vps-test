"use client";

import { Button, Input } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";

const AddDegree = () => {
  const inputFileRef = useRef(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imgName, setImgName] = useState<any>();

  return (
    <main className="min-h-[calc(100vh-100px)] py-[50px]">
      <TitleForPage titleText="اضافة صورة للدرجات" />
      <div className="container">
        <div className="flex justify-center items-center flex-col border-2 border-dashed rounded-xl shadow-xl border-blue-600 max-w-full p-10 mx-auto">
          {imgName?.name ? (
            <h3 className="flex items-center justify-center gap-2 text-2xl text-center font-bold text-success py-5">
              تم التحميل بنجاح <FaRegCircleCheck />
            </h3>
          ) : (
            <label className="cursor-pointer flex justify-center items-center flex-col w-full" htmlFor="input-file-degree">
              <FaCloudDownloadAlt className="text-5xl" />
              <Button
                onClick={() => {
                  if (inputFileRef.current) {
                    const inputEle = inputFileRef.current as HTMLInputElement;
                    inputEle.click();
                  }
                }}
                variant="light"
                color="primary"
                className="text-xl underline font-bold text-center p-2"
              >
                قم باختيار صورة من الجهاز
              </Button>
            </label>
          )}
          <Input
            id="input-file-degree"
            onChange={(e) => {
              if (e.target.files) {
                setImgName(e.target.files[0]);
              }
            }}
            className="opacity-0 hidden"
            accept="image/*"
            ref={inputFileRef}
            isClearable
            size="lg"
            color="primary"
            variant="flat"
            type="file"
            name="student_degree"
          />
          {imgName?.name && (
            <div className="grid gap-3">
              <div className="flex justify-center p-2 items-center flex-col border-2 border-blue-600 border-dashed rounded-xl">
                <h3 className="font-bold text-blue-600">اسم الصورة</h3>
                <h3>{imgName?.name}</h3>
              </div>
              <div className="flex justify-center items-center flex-col border-2 border-blue-600 border-dashed rounded-xl">
                <h3 className="font-bold text-blue-600">حجم الصورة</h3>
                <p className="text-center ">
                  <span className="font-bold"> {(imgName?.size / 1024).toFixed(2)}KB</span> <br />
                  أو
                  <br />
                  <span className="font-bold">{(imgName?.size / 1024 / 1024).toFixed(4)}MB</span>
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="mt-5 flex gap-5 flex-wrap justify-center items-center">
          <Button
            onClick={async () => {
              if (inputFileRef.current) {
                setIsLoading(true);
                const inputFileEle = inputFileRef.current as HTMLInputElement;

                if (inputFileEle.files) {
                  const formData = new FormData();
                  Object.values(inputFileEle.files).forEach((file) => {
                    formData.append("file", file);
                  });

                  const response = await fetch("/api/our-degree", {
                    method: "POST",
                    body: formData,
                  });

                  const result = await response.json();

                  if (response.status == 200) {
                    Swal.fire({
                      title: "تم التحميل بنجاح",
                      text: result.message,
                      icon: "success",
                    });
                  } else {
                    Swal.fire({
                      title: "فشل التحميل",
                      text: result.message,
                      icon: "error",
                    });
                  }
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 100);
                }
              }
            }}
            size="lg"
            color="success"
            variant="shadow"
            className="w-fit h-fit p-5 text-xl font-bold"
            isLoading={isLoading}
          >
            تحميل
          </Button>
          <Button
            onClick={async () => {
              if (inputFileRef.current) {
                const inputFileEle = inputFileRef.current as HTMLInputElement;
                inputFileEle.value = "";
                setImgName(null);
              }
            }}
            size="lg"
            color="danger"
            variant="shadow"
            isDisabled={isLoading}
            className="w-fit h-fit p-5 text-xl font-bold"
          >
            إلغاء
          </Button>
        </div>
      </div>
    </main>
  );
};

export default AddDegree;
