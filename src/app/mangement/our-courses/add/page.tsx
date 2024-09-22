"use client";

import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { Toast } from "@/app/utils/alert";
import { Button, Input } from "@nextui-org/react";
import React, { useEffect, useRef, useState } from "react";
import { FaCloudDownloadAlt, FaTrashAlt } from "react-icons/fa";
import { FaRegCircleCheck } from "react-icons/fa6";
import Swal from "sweetalert2";

interface InputsValues {
  courseName: string;
  subCourseName: string;
  courseImg: any;
}

const AddCourse = () => {
  const inputFileRef = useRef(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputsValues, setInputsValues] = useState<InputsValues>({ courseName: "", subCourseName: "", courseImg: {} });
  const [imgName, setImgName] = useState<any>();

  const handelAddCourse = async () => {
    setIsLoading(true);
    if (inputFileRef.current) {
      const inputFileEle = inputFileRef.current as HTMLInputElement;

      if (inputFileEle.files) {
        const formData = new FormData();

        const file = inputFileEle.files[0];

        formData.append("file", file);
        formData.append("courseName", inputsValues.courseName);
        formData.append("courseSubName", inputsValues.subCourseName);

        const response = await fetch("/api/our-course", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (response.status == 200) {
          Toast.fire({
            // title: "تم التحميل بنجاح",
            title: result.message,
            icon: "success",
          });
        } else {
          Toast.fire({
            // title: "فشل التحميل",
            title: result.message,
            icon: "error",
          });
        }
      }

      // fixme
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

    // Stop Scrolling Whill Page Is Loading
    useEffect(() => {
      if (isLoading) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    }, [isLoading]);

  return (
    <main className="min-h-[calc(100vh-100px)] py-[50px]">
      <TitleForPage titleText="اضافة دورة جديدة"/>
      <div className="container relative z-10">
        {isLoading && <Loader />}
        <div className="flex gap-5 flex-col">
          <Input
            onChange={(e) => setInputsValues((prev) => ({ ...prev, courseName: e.target.value }))}
            isRequired
            classNames={{
              input: "font-bold text-black",
            }}
            className="text-xl font-bold"
            type="text"
            placeholder="اكتب اسم الدورة"
            label="اسم الدورة"
            size="lg"
            variant="flat"
            color="primary"
          />

          <Input
            onChange={(e) => setInputsValues((prev) => ({ ...prev, subCourseName: e.target.value }))}
            isRequired
            classNames={{
              input: "font-bold text-black",
            }}
            className="text-xl font-bold"
            type="text"
            placeholder="اكتب العنوان الفرعي للدورة"
            label="العنوان الفرعي للدورة"
            size="lg"
            variant="flat"
            color="primary"
          />

          <div className="flex justify-center items-center flex-col border-2 border-dashed rounded-xl shadow-xl border-blue-600 w-full p-10 mx-auto bg-white">
            {imgName?.name ? (
              <h3 className="flex items-center justify-center gap-2 text-2xl text-center font-bold text-success py-5">
                تم التحميل بنجاح <FaRegCircleCheck />
              </h3>
            ) : (
              <label className="cursor-pointer flex justify-center items-center flex-col w-full" htmlFor="input-file-course">
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
              id="input-file-course"
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
                <Button
                  onClick={() => {
                    if (inputFileRef.current) {
                      const inputEle = inputFileRef.current as HTMLInputElement;
                      inputEle.value = "";
                      setImgName(null);
                    }
                  }}
                  className="w-fit h-fit p-3 mx-auto"
                >
                  <FaTrashAlt className="text-xl block text-red-600" />
                </Button>
              </div>
            )}
          </div>

          <Button
            onClick={handelAddCourse}
            isLoading={isLoading}
            size="lg"
            color="success"
            variant="shadow"
            className="min-w-[200px] h-fit mx-auto flex justify-center items-center p-5 text-xl font-bold"
          >
            إضافة
          </Button>
        </div>
        <div className="mt-5 flex gap-5 flex-wrap justify-center items-center"></div>
      </div>
    </main>
  );
};

export default AddCourse;
