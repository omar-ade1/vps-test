"use client";

import { UPDATE_SECTION_IN_COURSE } from "@/app/fetchApi/sectionCourse/updateSection";
import { Toast } from "@/app/utils/alert";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { SetStateAction, useState } from "react";

interface Props {
  setShowUpdateForm: React.Dispatch<SetStateAction<boolean>>;
  courseId: number;
  sectionId: number;
  sectionTitle: string;
  sectionDetails: string;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}
interface InputsValues {
  title: string;
  details: string;
}

const UpdateSection: React.FC<Props> = ({ setShowUpdateForm, courseId, sectionDetails, sectionId, sectionTitle, reload, setReload }) => {
  
  const [inputsValues, setInputsValues] = useState<InputsValues>({
    title: sectionTitle,
    details: sectionDetails,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Edit Section Function
  const handelEdit = async () => {
    setIsLoading(true);
    const message: any = await UPDATE_SECTION_IN_COURSE(inputsValues, courseId, sectionId);

    // While Succeed
    if (message.request.status == 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });

      // Refresh The Page
      setReload(!reload);

      // While Error
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }

    setIsLoading(false);
  };

  return (
    <>
      <div onClick={() => setShowUpdateForm(false)} className="w-full h-screen fixed inset-0 bg-black opacity-70 z-20" />
      <div className="fixed w-[400px] max-w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 grid gap-5 p-5 rounded-xl shadow-xl bg-white">
        <h2 className="font-bold">تحديث قسم</h2>

        <Input
          value={inputsValues.title}
          color="primary"
          onChange={(e) => setInputsValues((prev) => ({ ...prev, title: e.target.value }))}
          label="العنوان"
        />

        <Textarea
          value={inputsValues.details}
          color="primary"
          onChange={(e) => setInputsValues((prev) => ({ ...prev, details: e.target.value }))}
          label="التفاصيل"
        />

        <div className="flex justify-center items-center gap-5">
          <Button onClick={() => setShowUpdateForm(false)}>الغاء</Button>
          <Button
            isLoading={isLoading}
            onClick={() => {
              handelEdit();
            }}
            color="primary"
          >
            حفظ
          </Button>
        </div>
      </div>
    </>
  );
};

export default UpdateSection;
