"use client";
import { GET_QUESTION_BANK } from "@/app/fetchApi/questionBank/getAllQuestionBank";
import { Toast } from "@/app/utils/alert";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Textarea,
  Input,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import React, { SetStateAction, useEffect, useState } from "react";

// INTERFACE FOR INPUTSVALUES
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

// INTERFACE FOR PROPS
interface Props {
  courseId: string | null;
  mediaSectionId: string | null;
  testId: string | null;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

// INTERFACE FOR QUESTION BANK
interface QuestionBankData {
  id: number;
  name: string;
}

const AddQuizByJson: React.FC<Props> = ({ courseId, mediaSectionId, testId, reload, setReload }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // STATES
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [jsonData, setJsonData] = useState<InputsValues[]>(); // لتخزين البيانات المحملة
  const [error, setError] = useState<string | null>(); // لتخزين الأخطاء إذا حدثت
  const [questionBankData, setQuestionBankData] = useState<QuestionBankData[]>([]);
  const [questionBankId, setQuestionBankId] = useState<number>();

  // Handel Get Question Bank Data
  const getQuestionBank = async () => {
    setIsLoading(true);
    const message: any = await GET_QUESTION_BANK();
    if (message.request.status === 200) {
      setQuestionBankData(message.data.message);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  // Handel Get Question Bank Data WHEN RELOAD
  useEffect(() => {
    getQuestionBank();
  }, []);

  // Handel File Change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // CHECK IF FILE IS SELECTED
    if (!event.target.files) return;

    // CHECK IF FILE IS JSON
    const file = event.target.files[0]; // الحصول على أول ملف يتم تحميله
    if (!file) return;

    // READER FOR PARSING JSON
    const reader = new FileReader();

    // READER ONLOAD
    reader.onload = (e) => {
      try {
        // CHECK IF READER ONLOAD IS SUCCESSFUL
        if (e.target) {
          if (e.target.result) {
            // PARSE JSON
            const data = e.target.result as string;
            const result = JSON.parse(data);

            // SET JSON DATA
            setJsonData(result);
            // SET ERROR TO NULL
            setError(null);
          } else {
            // SET ERROR TO ERROR PARSING JSON
            Toast.fire({
              title: "Error parsing JSON file",
              icon: "error",
            });
          }

          // IF READER ONLOAD IS NOT SUCCESSFUL
        } else {
          Toast.fire({
            title: "Error parsing JSON file",
            icon: "error",
          });
        }

        // IF READER ONLOAD IS NOT SUCCESSFUL
      } catch (err) {
        setError("Error parsing JSON file");
        Toast.fire({
          title: "Error parsing JSON file",
          icon: "error",
        });
      }
    };

    // READER ONLOADEND
    reader.readAsText(file);
  };

  // Handel Add Question
  const addQuestion = async () => {
    setIsLoading(true);

    // CHECK IF JSON DATA AND COURSE ID AND TEST ID ARE NOT NULL
    if (jsonData && courseId && testId) {
      try {
        // SEND POST REQUEST TO ADD QUESTION BY JSON
        const res = await axios.post(`/api/addQuizByJson?courseId=${courseId}&testId=${testId}&questionBankId=${questionBankId}`, {
          jsonData,
        });

        // CHECK IF REQUEST IS SUCCESSFUL
        if (res.request.status === 200) {
          Toast.fire({
            title: res.data.message,
            icon: "success",
          });

          // IF REQUEST IS NOT SUCCESSFUL
        } else {
          Toast.fire({
            title: res.data.message,
            icon: "error",
          });
        }

        setReload(!reload);

        // IF REQUEST IS NOT SUCCESSFUL
      } catch (error: any) {
        Toast.fire({
          title: error.response.data.message,
          icon: "error",
        });
        console.log("error", error);
      }
    }

    // SET LOADING TO FALSE AND JSON DATA TO UNDEFINED AND ERROR TO NULL
    setIsLoading(false);
    setJsonData(undefined);
    setError(null);
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
          setQuestionBankId(undefined);
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
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">إضافة أسئلة بواسطة JSON</ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <Spinner size="lg" color="primary" />
                ) : (
                  <>
                    <div>
                      <Select onChange={(e) => setQuestionBankId(parseInt(e.target.value))} size="lg" fullWidth label="اختر بنك الاسئلة">
                        {questionBankData.map((bank) => (
                          <SelectItem variant="shadow" color="primary" key={bank.id}>
                            {bank.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <Input size="lg" variant="flat" color="primary" type="file" accept=".json" onChange={(e) => handleFileChange(e)} />
                    <h3 className="text-xl font-bold text-red-600">{error}</h3>
                  </>
                )}
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
