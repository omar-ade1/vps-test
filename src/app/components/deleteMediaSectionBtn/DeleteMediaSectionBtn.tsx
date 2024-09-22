"use client";

import { DELETE_MEDIA_SECTION } from "@/app/fetchApi/mediaSection/deleteMediaSection";
import { Toast } from "@/app/utils/alert";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface Props {
  courseId: string;
  sectionId: string;
  partOfSectionId: string;
  mediaSectionId: string;
  type: string;
}

const DeleteMediaSectionBtn: React.FC<Props> = ({ courseId, mediaSectionId, partOfSectionId, sectionId, type }) => {
  const router = useRouter();

  const [check, setCheck] = useState<string>("");

  const [invalid, setInvalid] = useState<boolean>(true);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    if (check === "اريد حذف هذا القسم") {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  }, [check]);

  const handelDeleteMediaSection = async () => {
    const message: any = await DELETE_MEDIA_SECTION(courseId, sectionId, partOfSectionId, mediaSectionId, type);

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
    <>
      <Button onClick={onOpen} className="h-fit mx-auto w-[500px] max-w-full block p-5 text-xl font-bold" size="lg" color="danger" variant="flat">
        حذف
      </Button>

      <Modal
        onClose={() => {
          setCheck("");
          setInvalid(true);
        }}
        placement="center"
        backdrop="blur"
        size="lg"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">تأكيد حذف ل قسم</ModalHeader>
              <ModalBody>
                <p className="font-bold text-red-500">بحذف هذا القسم لا يمكن الرجوع مرة اخرى له وسيتم حذف كل البيانات الخاصة به</p>
                <p>يرجى كتابة الجملة الاتية للتأكيد</p>
                <Input onChange={(e) => setCheck(e.target.value)} isInvalid={invalid} size="lg" color="success" label="اريد حذف هذا القسم" />
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  الغاء
                </Button>
                <Button
                  onClick={() => {
                    if (invalid) {
                      Toast.fire({
                        title: "جملة التحقق غير صحيحة",
                        icon: "error",
                      });
                    } else {
                      handelDeleteMediaSection();
                      router.replace(`/our-courses/${courseId}/${sectionId}`);
                      onClose();
                    }
                  }}
                  color="danger"
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

export default DeleteMediaSectionBtn;
