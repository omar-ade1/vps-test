"use client";
import DeleteMediaSectionBtn from "@/app/components/deleteMediaSectionBtn/DeleteMediaSectionBtn";
import Loader from "@/app/components/Loading/Loader";
import { GET_SINGLE_MEDIA_SECTION } from "@/app/fetchApi/mediaSection/getSingleMediaSection";
import { UPDATE_MEDIA_SECTION } from "@/app/fetchApi/mediaSection/updateMediaSection";
import { Toast } from "@/app/utils/alert";
import { getTokenData } from "@/app/utils/checkIfUserSubInCourse";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Button, Checkbox, Input, Textarea } from "@nextui-org/react";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface InputsValues {
  title: string;
  details: string;
  type: string;
  fullMark: number;
  allowForStudent: boolean;
}

const SettingTest = () => {
  // Get Ids From The Url
  const courseId = useSearchParams().get("courseId") as string;
  const sectionId = useSearchParams().get("sectionId") as string;
  const mediaSectionId = useSearchParams().get("mediaSectionId") as string;
  const type = useSearchParams().get("type") as string;
  const partOfSectionId = useSearchParams().get("partOfSectionId") as string;

  // For Refersh Page
  const [reload, setReload] = useState<boolean>(false);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [inputsValues, setInputsValues] = useState<InputsValues>({
    title: "",
    details: "",
    type: type,
    fullMark: 0,
    allowForStudent: false,
  });

  // Get Data Of Media Section
  const getData = async () => {
    setIsLoading(true);
    // Check The Params
    if (!courseId || !sectionId || !mediaSectionId || !type || !partOfSectionId) {
      return Toast.fire({
        title: "المعطيات غير كافية",
        icon: "error",
      });
    }

    // Start Get Function
    const message: any = await GET_SINGLE_MEDIA_SECTION(courseId, sectionId, partOfSectionId, type, mediaSectionId);
    if (message.request.status == 200) {
      // Update InputsValuse With A MediaSection Data
      setInputsValues((prev) => ({
        ...prev,
        title: message.data.message.title,
        details: message.data.message.details,
        fullMark: message.data.message.Test.fullMark,
        allowForStudent: message.data.message.Test.allowQuiz,
      }));
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // Update Data Function
  const updateData = async () => {
    // Start Update Function
    const message: any = await UPDATE_MEDIA_SECTION(inputsValues, courseId, sectionId, partOfSectionId, mediaSectionId, type);

    // Whill Succeed
    if (message.request.status === 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });

      setReload(!reload);
      router.replace(`/our-courses/${courseId}/${sectionId}`);

      // Whill Error
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  };

  // Get The Data When The Reload State Update
  useEffect(() => {
    getData();
  }, [reload]);

  // Get Token
  const getToken = async () => {
    const token: jwtPayLoad = await getTokenData();
    if (typeof token === "object") {
      if (token?.isAdmin === false) {
        router.back();
      }
    } else {
      Swal.fire({
        title: token,
        icon: "error",
      });
    }
  };
  useEffect(() => {
    getToken();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container">
          <h2 className="text-2xl font-bold rounded-xl shadow-xl p-5 border-2 w-[400px] max-w-full">اعدادات الاختبار</h2>

          <div className="flex flex-col gap-4 mt-5">
            <Input
              value={inputsValues.title}
              className="text-xl font-bold"
              color="primary"
              size="lg"
              label="اسم الاختبار"
              onChange={(e) => {
                setInputsValues((prev) => ({ ...prev, title: e.target.value }));
              }}
            />

            <Textarea
              value={inputsValues.details}
              className="text-xl font-bold"
              color="primary"
              size="lg"
              label="التفاصيل"
              onChange={(e) => {
                setInputsValues((prev) => ({ ...prev, details: e.target.value }));
              }}
            />

            <Input
              value={String(inputsValues.fullMark)}
              className="w-fit text-xl font-bold"
              color="primary"
              size="lg"
              type="number"
              label="الدرجة الكلية"
              min={0}
              classNames={{
                input: "text-xl font-bold",
              }}
              onChange={(e) => {
                setInputsValues((prev) => ({ ...prev, fullMark: parseInt(e.target.value) }));
              }}
            />

            <Checkbox
              onChange={(e) => {
                setInputsValues((prev) => ({ ...prev, allowForStudent: e.currentTarget?.checked }));
              }}
              isSelected={inputsValues.allowForStudent}
              size="lg"
            >
              السماح للطلاب بالاختبار
            </Checkbox>

            <Button
              onClick={() => {
                updateData();
              }}
              variant="shadow"
              color="primary"
              className="h-fit mx-auto w-[500px] max-w-full block p-5 text-xl font-bold"
            >
              حفظ البيانات
            </Button>

            <DeleteMediaSectionBtn
              courseId={courseId}
              mediaSectionId={mediaSectionId}
              partOfSectionId={partOfSectionId}
              sectionId={sectionId}
              type={type}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default SettingTest;
