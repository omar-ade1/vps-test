"use client";

import { ADD_SECTION_IN_COURSE } from "@/app/fetchApi/sectionCourse/addSection";
import { Toast } from "@/app/utils/alert";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, Textarea, ModalFooter, Input, useDisclosure } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import React, { Dispatch, SetStateAction, useState } from "react";
import { FaPlus } from "react-icons/fa";

interface InputsValues {
  title: string;
  details: string;
}

interface Props {
  idCourse: string;
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
}

const AddNewSection: React.FC<Props> = ({ idCourse, reload, setReload }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [inputsValues, setInputsValues] = useState<InputsValues>({ title: "", details: "" });
  const [inputTitleError, setInputTitleError] = useState(false);

  const addNewSection = async () => {
    const message: any = await ADD_SECTION_IN_COURSE(inputsValues, idCourse);
    setReload(!reload);
    if (message.request.status == 200) {
      Toast.fire({
        title: message.data.message,
        icon: "success",
      });
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
        onClick={onOpen}
        size="lg"
        variant="flat"
        color="primary"
        className="text-xl font-bold h-fit p-5 flex justify-center items-center w-fit my-5 mx-auto"
      >
        اضافة اقسام اضافية <FaPlus />
      </Button>

      <Modal
        onClose={() => {
          setInputsValues({ title: "", details: "" });
          setInputTitleError(false);
        }}
        backdrop="blur"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl">اضافة قسم</ModalHeader>
              <ModalBody>
                <AnimatePresence mode="wait">
                  <motion.div
                    layout
                    key={"detailsInputs"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid gap-3"
                  >
                    <Input
                      isRequired
                      isInvalid={inputTitleError}
                      // onChange={(e) => setTitleOfNewSection(e.target.value)}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, title: e.target.value }))}
                      variant="flat"
                      color="primary"
                      size="lg"
                      label="عنوان القسم"
                    />
                    <Textarea
                      // onChange={(e) => setDescOfNewSection(e.target.value)}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, details: e.target.value }))}
                      variant="flat"
                      color="primary"
                      size="lg"
                      label="تفاصيل القسم (اختياري)"
                    />
                  </motion.div>
                </AnimatePresence>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onClick={() => {
                    // setSection(1);
                    onClose();
                  }}
                >
                  اغلاق
                </Button>
                <Button
                  onClick={() => {
                    if (inputsValues.title) {
                      setInputTitleError(false);
                      addNewSection();
                      onClose();
                    } else {
                      setInputTitleError(true);
                    }
                  }}
                  color="primary"
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

export default AddNewSection;
