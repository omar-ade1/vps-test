"use client";

/**
 * THIS COMPONENTS FOR DELETE FORM FOR DELETE PART IN  SECTION
 **/

import { DELETE_PART_OF_SECTION_IN_COURSE } from "@/app/fetchApi/partOfSection/deletePartOfSection";
import { Toast } from "@/app/utils/alert";
import { Button, Input } from "@nextui-org/react";
import React, { SetStateAction, useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";

interface Props {
  // setShowDeleteForm: React.Dispatch<SetStateAction<boolean>>;
  courseId: string;
  sectionId: string;
  partOfSectionTitle: string;
  partOfSectionId: number;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  isOpen: any;
  onOpenChange: any;
}

const DeletePartOfSection: React.FC<Props> = ({
  partOfSectionId,
  courseId,
  sectionId,
  partOfSectionTitle,
  reload,
  setReload,
  isOpen,
  onOpenChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // For Check If Input Value Is Equal To Verification Sentence
  const [checkDelete, setCheckDelete] = useState<string>();

  // If True That Mean Input Value Is Equal To Verification Sentence
  const [checked, setChecked] = useState<boolean>(false);

  // Delete Section Function
  const handelDelete = async () => {
    setIsLoading(true);
    const message: any = await DELETE_PART_OF_SECTION_IN_COURSE(courseId, sectionId, partOfSectionId);

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
    if (checkDelete === `اريد حذف هذا القسم (${partOfSectionTitle})`) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  }, [checkDelete]);

  return (
    <>
      <Modal
        size="lg"
        onClose={() => {
          setCheckDelete("");
        }}
        backdrop="blur"
        placement="center"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">حذف قسم</h2>
                <h3 className="text-red-600 font-bold">
                  يرجى العلم انه بحذف هذا القسم سيتم مسح كل محتواياته من فيديوهات او اختبارات او غيره ولا يمكن استرجاعها
                </h3>
                <h4>اكتب الجملة التي في الحقل لتأكيد الحذف</h4>
              </ModalHeader>

              <ModalBody>
                <Input
                  color="success"
                  size="lg"
                  className="font-bold"
                  value={checkDelete}
                  onChange={(e) => setCheckDelete(e.target.value)}
                  isInvalid={!checked}
                  label={`اريد حذف هذا القسم (${partOfSectionTitle})`}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  إلغاء
                </Button>
                <Button
                  isLoading={isLoading}
                  color="danger"
                  onClick={() => {
                    if (checked) {
                      handelDelete();
                      onClose();
                    } else {
                      Toast.fire({
                        title: "يرجى كتابة جملة التحقق صحيحة",
                        icon: "error",
                      });
                    }
                  }}
                >
                  حذف
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeletePartOfSection;
