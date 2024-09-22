"use client";

/**
 * THIS COMPONENTS FOR UPDATE FORM FOR UPDATE PART IN  SECTION
 **/

import { Toast } from "@/app/utils/alert";
import { Button, Input, Textarea } from "@nextui-org/react";
import React, { SetStateAction, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { UPDATE_PART_OF_SECTION_IN_COURSE } from "@/app/fetchApi/partOfSection/updatePartOfSection";

interface Props {
  courseId: string;
  sectionId: string;
  partOfSectionTitle: string;
  partOfSectionDetails: string;
  partOfSectionId: number;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  isOpen: any;
  onOpenChange: any;
}

interface InputValues {
  title?: string;
  details?: string;
}

const UpdateFormPartOfSection: React.FC<Props> = ({
  partOfSectionId,
  courseId,
  sectionId,
  partOfSectionTitle,
  reload,
  setReload,
  isOpen,
  onOpenChange,
  partOfSectionDetails,
}) => {
  const [inputsValues, setInputValues] = useState<InputValues>({
    title: partOfSectionTitle,
    details: partOfSectionDetails,
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Delete Section Function
  const handelUpdate = async () => {
    setIsLoading(true);
    const message: any = await UPDATE_PART_OF_SECTION_IN_COURSE(inputsValues, courseId, sectionId, partOfSectionId);

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
      <Modal
        onClose={() => {
          setInputValues({ title: "", details: "" });
        }}
        size="lg"
        backdrop="blur"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">تحديث قسم</h2>
              </ModalHeader>

              <ModalBody>
                <Input
                  color="primary"
                  size="lg"
                  className="font-bold"
                  value={inputsValues.title}
                  onChange={(e) => setInputValues((prev) => ({ ...prev, title: e.target.value }))}
                  label={`العنوان`}
                />
                <Textarea
                  color="primary"
                  size="lg"
                  className="font-bold"
                  value={inputsValues.details}
                  onChange={(e) => setInputValues((prev) => ({ ...prev, details: e.target.value }))}
                  label={`التفاصيل`}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  isLoading={isLoading}
                  color="primary"
                  onClick={() => {
                    handelUpdate();
                  }}
                >
                  حفظ
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateFormPartOfSection;
