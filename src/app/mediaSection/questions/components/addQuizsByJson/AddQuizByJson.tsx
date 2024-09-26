"use client";
import { ADD_QUESTION_FOR_EXAM } from "@/app/fetchApi/questionForExam/addNewQuestion";
import { Toast } from "@/app/utils/alert";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Textarea, Input } from "@nextui-org/react";
import axios from "axios";
import React, { SetStateAction, useEffect, useState } from "react";
import { json } from "stream/consumers";

interface InputsValues {
  questionText: string;
  questionsBankId: number;
  questionSection?: string;
  answer1?: string;
  answer2?: string;
  answer3?: string;
  answer4?: string;
  answerTrue: number;
}

interface Props {
  courseId: string | null;
  mediaSectionId: string | null;
  testId: string | null;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const AddQuizByJson: React.FC<Props> = ({ courseId, mediaSectionId, testId, reload, setReload }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [inputText, setInputText] = useState<string>("");

  const [jsonData, setJsonData] = useState<InputsValues[]>(); // لتخزين البيانات المحملة
  const [error, setError] = useState<string | null>(); // لتخزين الأخطاء إذا حدثت

  // التعامل مع تحميل الملف
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const file = event.target.files[0]; // الحصول على أول ملف يتم تحميله
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        if (e.target) {
          if (e.target.result) {
            // تحويل المحتوى النصي إلى JSON
            const data = e.target.result as string;
            const result = JSON.parse(data);
            setJsonData(result); // تخزين البيانات JSON في state
            setError(null); // إعادة ضبط الأخطاء
          } else {
            Toast.fire({
              title: "Error parsing JSON file",
              icon: "error",
            });
          }
        } else {
          Toast.fire({
            title: "Error parsing JSON file",
            icon: "error",
          });
        }
      } catch (err) {
        setError("Error parsing JSON file");
        Toast.fire({
          title: "Error parsing JSON file",
          icon: "error",
        });
      }
    };

    reader.readAsText(file); // قراءة الملف كـ نص
  };

  const addQuestion = async () => {
    if (jsonData && courseId && testId) {
      try {
        const res = await axios.post(`/api/addQuizByJson?courseId=${courseId}&testId=${testId}`, {
          jsonData,
        });

        if (res.request.status === 200) {
          Toast.fire({
            title: res.data.message,
            icon: "success",
          });
        } else {
          console.log(false);

          Toast.fire({
            title: res.data.message,
            icon: "error",
          });
        }
        setReload(!reload);
        console.log(true);
      } catch (error: any) {
        Toast.fire({
          title: error.response.data.message,
          icon: "error",
        });
        console.log("error", error);
      }
    }
  };

  return (
    <>
      <Button onClick={onOpen} color="warning" variant="flat" className="text-xl font-bold h-fit p-5 block w-fit mx-auto">
        إضافة أسئلة بواسطة JSON
      </Button>

      <Modal
        onClose={() => {
          setJsonData(undefined);
          setError(null);
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
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">إضافة أسئلة</ModalHeader>
              <ModalBody>
                <Input size="lg" variant="flat" color="primary" type="file" accept=".json" onChange={(e) => handleFileChange(e)} />
                <h3 className="text-xl font-bold text-red-600">{error}</h3>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button isDisabled={!jsonData} color="primary" onClick={addQuestion}>
                  إضافة
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddQuizByJson;
