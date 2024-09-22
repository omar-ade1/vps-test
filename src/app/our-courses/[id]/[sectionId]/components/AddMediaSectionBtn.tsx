"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Textarea } from "@nextui-org/react";
import React, { SetStateAction, useState } from "react";
import { MdNote, MdQuiz } from "react-icons/md";
import "./addBtn.css";
import { FaVideo } from "react-icons/fa";
import { FiFile } from "react-icons/fi";
import RadioInput from "./RadioInput";
import { Toast } from "@/app/utils/alert";
import { ADD_MEDIA_SECTION } from "@/app/fetchApi/mediaSection/addMediaSection";

interface InputsValues {
  title: string;
  details: string;
}

interface Props {
  courseId: string;
  sectionId: string;
  partOfSectionId: number;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  reload: boolean;
}

const AddMediaSectionBtn: React.FC<Props> = ({ reload, setReload, courseId, sectionId, partOfSectionId }) => {
  const [type, setType] = useState<string>("");

  const [inputsValues, setInputsValues] = useState<InputsValues>({
    title: "",
    details: "",
  });

  const [section, setSection] = useState<number>(1);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handelAdd = async () => {
    const message: any = await ADD_MEDIA_SECTION(inputsValues, type, courseId, sectionId, partOfSectionId);

    if (message.request.status == 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
      setReload(!reload);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Button
        onClick={() => {
          onOpen();
        }}
        variant="light"
        color="primary"
        className="font-bold block w-fit mr-auto mt-5"
      >
        اضافة
      </Button>

      <Modal
        onClose={() => {
          setType("");
          setSection(1);
        }}
        size="lg"
        placement="center"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">إضافة قسم</ModalHeader>
              <ModalBody>
                {section == 1 ? (
                  <>
                    <h3 className="font-bold">اختر قسم من الاقسام التالية لإضافته</h3>
                    <div className="flex flex-wrap justify-center items-center gap-5">
                      <RadioInput type={type} setType={setType} idOfInput="test" labelName="اختبار">
                        <MdQuiz className="text-3xl" />
                      </RadioInput>

                      <RadioInput type={type} setType={setType} idOfInput="video" labelName="فيديو">
                        <FaVideo className="text-3xl" />
                      </RadioInput>

                      <RadioInput type={type} setType={setType} idOfInput="file" labelName="ملف">
                        <FiFile className="text-3xl" />
                      </RadioInput>

                      <RadioInput type={type} setType={setType} idOfInput="note" labelName="ملاحظة">
                        <MdNote className="text-3xl" />
                      </RadioInput>
                    </div>
                  </>
                ) : (
                  <div className="grid gap-3">
                    <h3 className="font-bold">اكتب العنوان و التفاصيل الخاصة بهذا القسم</h3>
                    <Input
                      isRequired
                      value={inputsValues.title}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, title: e.target.value }))}
                      size="lg"
                      label="العنوان"
                      variant="flat"
                      color="primary"
                    />
                    <Textarea
                      value={inputsValues.details}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, details: e.target.value }))}
                      size="lg"
                      label="التفاصيل ( اختياري )"
                      variant="flat"
                      color="primary"
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  onClick={() => {
                    if (section == 1) {
                      onClose();
                    } else {
                      setSection((prev: number) => prev - 1);
                    }
                  }}
                  color="danger"
                  variant="light"
                >
                  {section == 1 ? "إلغاء" : "السابق"}
                </Button>
                <Button
                  onClick={() => {
                    if (section == 2) {
                      if (inputsValues.title.length >= 3) {
                        handelAdd();
                      } else {
                        Toast.fire({
                          title: "يجب ان يكون العنوان على الاقل 3 احرف",
                          icon: "error",
                        });
                      }
                    }

                    if (section == 1) {
                      if (type.length) {
                        setSection(2);
                      } else {
                        Toast.fire({
                          title: "يجب اختيار قسم",
                          icon: "error",
                        });
                      }
                    }
                  }}
                  color="primary"
                >
                  {section == 1 ? "التالي" : "انشاء"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddMediaSectionBtn;
