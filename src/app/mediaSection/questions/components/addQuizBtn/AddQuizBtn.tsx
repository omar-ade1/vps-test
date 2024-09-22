"use client";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Radio, RadioGroup } from "@nextui-org/react";
import React, { SetStateAction, useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { GET_QUESTION_BANK } from "@/app/fetchApi/questionBank/getAllQuestionBank";
import { Toast } from "@/app/utils/alert";
import { ADD_QUESTION_FOR_EXAM } from "@/app/fetchApi/questionForExam/addNewQuestion";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";

interface QuestionBankData {
  id: number;
  name: string;
}

interface InputValues {
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

const AddQuizBtn: React.FC<Props> = ({ courseId, mediaSectionId, testId, reload, setReload }) => {
  const questionSectionAutoComplete = [
    { label: "تناظر لفظي", key: 1 },
    { label: "إكمال جمل", key: 2 },
    { label: "خطأ سياقي", key: 3 },
    { label: "إستيعاب المقروء", key: 4 },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [questionBankData, setQuestionBankData] = useState<QuestionBankData[]>([]);

  // Handel Get Question Bank Data
  const getQuestionBank = async () => {
    const message: any = await GET_QUESTION_BANK();
    if (message.request.status === 200) {
      setQuestionBankData(message.data.message);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getQuestionBank();
  }, []);

  // Inputs For Question
  const [inputsValues, setInputsValues] = useState<InputValues>({
    questionsBankId: 0,
    questionText: "",
    questionSection: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answerTrue: 1,
  });


  // Handel Add Question Function
  const handelAdd = async () => {
    if (courseId && mediaSectionId && testId) {
      const message: any = await ADD_QUESTION_FOR_EXAM(inputsValues, courseId, testId);
      if (message.request.status === 200) {
        Toast.fire({
          title: message.data.message,
          icon: "success",
        });
        // Return Inputs To Default Value Except Question Bank Id And Quesiton Section
        setInputsValues((prev) => ({ ...prev, questionText: "", answer1: "", answer2: "", answer3: "", answer4: "", answerTrue: 0 }));
      }

      // Whill Error
      else {
        Toast.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }

      // If CourseId , MediaSectionId Or TestId
    } else {
      Toast.fire({
        title: "بيانات الطلب غير مكتملة",
        icon: "error",
      });
    }
  };

  return (
    <>
      <Button
        onClick={() => {
          if (!questionBankData.length) {
            Toast.fire({
              title: "لا يوجد بنك اسئلة يجب انشاء واحد قبل البدء في اضافة اسئلة",
              icon: "error",
            });
          } else {
            onOpen();
          }
        }}
        className="font-bold text-lg"
        size="lg"
        variant="light"
        color="primary"
      >
        إضافة سؤال
      </Button>
      <Modal
        onClose={() => {
          setReload(!reload);
          setInputsValues({
            questionsBankId: 0,
            questionText: "",
            questionSection: "",
            answer1: "",
            answer2: "",
            answer3: "",
            answer4: "",
            answerTrue: 0,
          });
        }}
        placement="center"
        size="lg"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">إضافة سؤال</ModalHeader>
              <ModalBody>
                <div>
                  <Select
                    onChange={(e) => setInputsValues((prev) => ({ ...prev, questionsBankId: parseInt(e.target.value) }))}
                    size="lg"
                    fullWidth
                    label="اختر بنك الاسئلة"
                  >
                    {questionBankData.map((bank) => (
                      <SelectItem variant="shadow" color="primary" key={bank.id}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div>
                  <Autocomplete
                    size="lg"
                    allowsCustomValue
                    onInputChange={(e) => {
                      setInputsValues((prev) => ({ ...prev, questionSection: e }));
                    }}
                    label="قسم السؤال"
                  >
                    {questionSectionAutoComplete.map((section) => (
                      <AutocompleteItem
                        classNames={{
                          title: "font-bold",
                        }}
                        showDivider
                        variant="shadow"
                        color="primary"
                        key={section.label}
                        value={section.label}
                      >
                        {section.label}
                      </AutocompleteItem>
                    ))}
                  </Autocomplete>
                </div>

                <div>
                  <Input
                    value={inputsValues.questionText}
                    onChange={(e) => setInputsValues((prev) => ({ ...prev, questionText: e.target.value }))}
                    label="السؤال"
                    size="lg"
                    variant="flat"
                    color="primary"
                  />
                </div>

                <RadioGroup
                  value={String(inputsValues.answerTrue)}
                  defaultValue={"1"}
                  onValueChange={(e) => setInputsValues((prev) => ({ ...prev, answerTrue: parseInt(e) }))}
                  label="اختر الاجابة الصحيحة"
                >
                  <div className="flex items-center">
                    <Radio value={"1"}></Radio>
                    <Input
                      value={inputsValues.answer1}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, answer1: e.target.value }))}
                      label="أ )"
                      size="lg"
                      variant="faded"
                    />
                  </div>
                  <div className="flex items-center">
                    <Radio value={"2"}></Radio>
                    <Input
                      value={inputsValues.answer2}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, answer2: e.target.value }))}
                      label="ب )"
                      size="lg"
                      variant="faded"
                    />
                  </div>
                  <div className="flex items-center">
                    <Radio value={"3"}></Radio>
                    <Input
                      value={inputsValues.answer3}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, answer3: e.target.value }))}
                      label="جـ )"
                      size="lg"
                      variant="faded"
                    />
                  </div>
                  <div className="flex items-center">
                    <Radio value={"4"}></Radio>
                    <Input
                      value={inputsValues.answer4}
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, answer4: e.target.value }))}
                      label="د )"
                      size="lg"
                      variant="faded"
                    />
                  </div>
                </RadioGroup>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  إغلاق
                </Button>
                <Button
                  color="primary"
                  onClick={() => {
                    handelAdd();
                    // onClose();
                  }}
                >
                  إنشاء
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddQuizBtn;
