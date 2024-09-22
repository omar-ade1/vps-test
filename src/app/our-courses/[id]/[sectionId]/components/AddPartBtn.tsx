"use client";
import { ADD_PART_OF_SECTION_IN_COURSE } from "@/app/fetchApi/partOfSection/addPartOfSection";
import { Toast } from "@/app/utils/alert";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, Textarea, ModalFooter, Input, useDisclosure } from "@nextui-org/react";
import React, { SetStateAction, useState } from "react";
interface InputValuesNewPart {
  title: string;
  details: string;
}

interface Props {
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  courseId: string;
  sectionId: string;
}

const AddPartBtn: React.FC<Props> = ({ reload, setReload, setIsLoading, courseId, sectionId }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [inputValuesNewPart, setInputValuesNewPart] = useState<InputValuesNewPart>({ title: "", details: "" });
  const handelAddNewPart = async () => {
    setIsLoading(true);
    const message: any = await ADD_PART_OF_SECTION_IN_COURSE(inputValuesNewPart, courseId, sectionId);

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

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  return (
    <div className="w-fit mx-auto mt-5">
      <Button onClick={onOpen} size="lg" variant="flat" color="primary" className=" text-xl font-bold h-fit w-fit p-5">
        إضافة اقسام جديدة
      </Button>
      <Modal
        onClose={() => {
          setInputValuesNewPart({ title: "", details: "" });
        }}
        classNames={{
          closeButton: "text-xl text-red-600",
        }}
        backdrop="blur"
        placement="center"
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">إنشاء قسم جديد</ModalHeader>
              <ModalBody>
                <Input
                  value={inputValuesNewPart.title}
                  onChange={(e) => setInputValuesNewPart((prev) => ({ ...prev, title: e.target.value }))}
                  size="lg"
                  variant="flat"
                  color="primary"
                  label="عنوان القسم"
                  fullWidth
                />
                <Textarea
                  value={inputValuesNewPart.details}
                  onChange={(e) => setInputValuesNewPart((prev) => ({ ...prev, details: e.target.value }))}
                  size="lg"
                  variant="flat"
                  color="primary"
                  label="تفاصيل القسم (اختياري)"
                  fullWidth
                />
              </ModalBody>
              <ModalFooter>
                <Button size="lg" color="danger" variant="shadow" onPress={onClose}>
                  اغلاق
                </Button>
                <Button
                  size="lg"
                  color="primary"
                  variant="shadow"
                  onClick={() => {
                    handelAddNewPart();
                    onClose();
                  }}
                >
                  إنشاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddPartBtn;
