"use client";

import { DELETE_SECTION_IN_COURSE } from "@/app/fetchApi/sectionCourse/deleteSection";
import { Toast } from "@/app/utils/alert";
import { Button, Input } from "@nextui-org/react";
import React, { SetStateAction, useEffect, useState } from "react";

interface Props {
  setShowDeleteForm: React.Dispatch<SetStateAction<boolean>>;
  courseId: number;
  sectionId: number;
  sectionTitle: string;
  sectionDetails: string;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const DeleteSection: React.FC<Props> = ({ setShowDeleteForm, courseId, sectionDetails, sectionId, sectionTitle, reload, setReload }) => {
  const [isLoading, setIsLoading] = useState(false);

  // For Check If Input Value Is Equal To Verification Sentence
  const [checkDelete, setCheckDelete] = useState<string>();

  // If True That Mean Input Value Is Equal To Verification Sentence
  const [checked, setChecked] = useState<boolean>(false);

  // Delete Section Function
  const handelDelete = async () => {
    setIsLoading(true);
    const message: any = await DELETE_SECTION_IN_COURSE(courseId, sectionId);

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

  // For Check If Input Value Is Equal To Verification Sentence Every Time Input Value Changed
  useEffect(() => {
    if (checkDelete === `اريد حذف هذا القسم (${sectionTitle})`) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [checkDelete]);

  return (
    <>
      <div onClick={() => setShowDeleteForm(false)} className="w-full h-screen fixed inset-0 bg-black opacity-70 z-20" />
      <div className="fixed w-[600px] max-w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 grid gap-5 p-5 rounded-xl shadow-xl bg-white">
        <h2 className="font-bold text-xl">حذف قسم</h2>
        <h3 className="font-bold text-red-600">يرجى العلم انه يتم حذف كل شئ يخص هذا القسم من فيديوهات او غيره</h3>
        <h3>يرجى كتابة الجملة الاتية لتأكيد الحذف</h3>
        <Input
          className="font-bold"
          size="lg"
          isInvalid={!checked}
          onChange={(e) => setCheckDelete(e.target.value)}
          color="primary"
          label={`اريد حذف هذا القسم (${sectionTitle})`}
        />

        <div className="flex justify-center items-center gap-5">
          <Button onClick={() => setShowDeleteForm(false)}>الغاء</Button>
          <Button
            isLoading={isLoading}
            onClick={() => {
              if (checked) {
                handelDelete();
              } else {
                Toast.fire({
                  title: "يرجى كتابة جملة التحقق صحيحة",
                  icon: "error",
                });
              }
            }}
            color="primary"
          >
            حذف
          </Button>
        </div>
      </div>
    </>
  );
};

export default DeleteSection;
