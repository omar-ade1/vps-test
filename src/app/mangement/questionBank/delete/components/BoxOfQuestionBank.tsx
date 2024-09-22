"use client";
import { DELETE_QUESTION_BANK } from "@/app/fetchApi/questionBank/deleteQuestionBank";
import { UPDATE_QUESTION_BANK } from "@/app/fetchApi/questionBank/updateQuestionBank";
import { Toast } from "@/app/utils/alert";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@nextui-org/react";
import React, { SetStateAction, useEffect, useState } from "react";

interface Props {
  bankData: {
    name: string;
    id: number;
  };
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

const BoxOfQuestionBank: React.FC<Props> = ({ bankData, reload, setIsLoading, setReload }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [check, setCheck] = useState<string>("");
  const [invalid, setInvalid] = useState<boolean>(true);

  // It's For Check If User Want To Delete Question Bank
  useEffect(() => {
    if (check == `اريد مسح بنك الاسئلة`) {
      setInvalid(false);
    } else {
      setInvalid(true);
    }
  }, [check]);

  // Delete Question Bank Function
  const deleteQuestionBank = async () => {
    setIsLoading(true);
    const message: any = await DELETE_QUESTION_BANK(bankData.id);
    if (message.request.status === 200) {
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

  //todo://fixme:
  //       todo://fixme:
  //            todo://fixme:
  //       todo://fixme:
  //todo://fixme:

  // * Start Updating

  const { isOpen: isOpenUpdate, onOpen: onOpenUpdate, onOpenChange: onOpenChangeUpdate } = useDisclosure();

  const [updateName, setUpdateName] = useState<string>(bankData.name);

  // Handel Update Question Bank Function
  const handelUpdate = async () => {
    const message: any = await UPDATE_QUESTION_BANK(bankData.id, updateName);
    if (message.request.status === 200) {
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
    <div key={bankData.id} className="box shadow-xl rounded-xl p-5 bg-gray-300 border-2 border-gray-400 h-[350px] flex flex-col justify-center gap-2">
      <h2 className="text-center bg-white p-5 rounded-xl text-xl font-extrabold my-5">{bankData.name}</h2>

      {/* 
      : Start Delete Question Bank :
      */}
      <Button
        onClick={() => {
          onOpen();
        }}
        fullWidth
        size="lg"
        color="danger"
        className="text-xl font-bold h-fit p-5"
      >
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
              <ModalHeader className="flex flex-col gap-1 font-bold text-xl">تأكيد حذف لبنك الاسئلة</ModalHeader>
              <ModalBody>
                <h2 className="font-bold text-red-500">يرجى العلم انه سيتم مسح جميع الاسئلة الخاصة بهذا البنك ولا يمكن استراجعها</h2>
                <h3 className="font-bold">يرجى كتابة الجملة الاتية في الحقل</h3>
                <div>
                  <Input
                    onChange={(e) => {
                      setCheck(e.target.value);
                    }}
                    size="lg"
                    classNames={{
                      label: "font-bold text-lg",
                      input: " text-lg",
                    }}
                    color="success"
                    isInvalid={invalid}
                    label={`اريد مسح بنك الاسئلة`}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  اغلاق
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    if (invalid) {
                      Toast.fire({
                        title: "جملة التحقق غير صحيحة",
                        icon: "error",
                      });
                    } else {
                      deleteQuestionBank();
                      onClose();
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
      {/* 
      : End Delete Question Bank :
      */}

      {/* FIXME */}

      {/* 
      : Start Update Question Bank :
      */}
      <Button
        onClick={() => {
          onOpenUpdate();
        }}
        fullWidth
        size="lg"
        color="warning"
        className="text-xl font-bold h-fit p-5"
      >
        تعديل
      </Button>
      <Modal placement="center" backdrop="blur" size="lg" isOpen={isOpenUpdate} onOpenChange={onOpenChangeUpdate}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">تحديث بنك الاسئلة</ModalHeader>
              <ModalBody>
                <Input
                  value={updateName}
                  onChange={(e) => {
                    setUpdateName(e.target.value);
                  }}
                  label="اسم بنك الاسئلة"
                  size="lg"
                  color="primary"
                  classNames={{
                    label: " font-bold",
                    input: "font-bold text-lg",
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  اغلاق
                </Button>
                <Button color="primary" onClick={handelUpdate}>
                  تحديث
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      {/* 
      : END Update Question Bank :
      */}
    </div>
  );
};

export default BoxOfQuestionBank;
