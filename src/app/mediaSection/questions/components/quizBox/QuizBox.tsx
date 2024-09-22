"use client";

import { GET_QUESTION_BANK } from "@/app/fetchApi/questionBank/getAllQuestionBank";
import { DELETE_QUESTION_FROM_EXAM } from "@/app/fetchApi/questionForExam/deleteQuestionFromExam";
import { UPDATE_QUESTION_FROM_EXAM } from "@/app/fetchApi/questionForExam/updateQuestionExam";
import { Toast } from "@/app/utils/alert";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
  AutocompleteItem,
  Autocomplete,
} from "@nextui-org/react";

import React, { SetStateAction, useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import Swal from "sweetalert2";

interface Props {
  dataQuiz: {
    id: number;
    questionBankId: number;
    testId: number;
    questionText: string;
    questionSection: string;
    createdAt: string;
    updatedAt: string;
    answer1: string;
    answer2: string;
    answer3: string;
    answer4: string;
    asnwerTrue: number;
  };
  courseId: string | null;
  mediaSectionId: string | null;
  testId: string | null;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  i: number;
}
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

const QuizBox: React.FC<Props> = ({ dataQuiz, courseId, mediaSectionId, testId, setReload, reload, i }) => {
  const questionSectionAutoComplete = [
    { label: "تناظر لفظي", key: 1 },
    { label: "إكمال جمل", key: 2 },
    { label: "خطأ سياقي", key: 3 },
    { label: "إستيعاب المقروء", key: 4 },
  ];

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handelDelete = async () => {
    if (courseId && testId) {
      const message: any = await DELETE_QUESTION_FROM_EXAM(courseId, testId, dataQuiz.id);
      if (message.request.status === 200) {
        Toast.fire({
          title: message.data.message,
          icon: "success",
        });
        setReload(!reload);
      }

      // Whill Error
      else {
        Toast.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    }
  };

  const alertDelete = async () => {
    Swal.fire({
      title: "هل انت متأكد",
      text: "هل تريد حذف هذا السؤال من هذا الاختبار",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم احذفه",
      cancelButtonText: "إغلاق",
    }).then((result) => {
      if (result.isConfirmed) {
        handelDelete();
      }
    });
  };

  // todo                :

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
    questionsBankId: dataQuiz.questionBankId,
    questionText: dataQuiz.questionText,
    questionSection: dataQuiz.questionSection,
    answer1: dataQuiz.answer1,
    answer2: dataQuiz.answer2,
    answer3: dataQuiz.answer3,
    answer4: dataQuiz.answer4,
    answerTrue: dataQuiz.asnwerTrue,
  });

  // handel Update Quiz Function
  const handelUpdate = async () => {
    if (courseId && testId) {
      const message: any = await UPDATE_QUESTION_FROM_EXAM(courseId, testId, dataQuiz.id, inputsValues);

      if (message.request.status === 200) {
        Toast.fire({
          title: message.data.message,
          icon: "success",
        });
        setReload(!reload);
      }

      // Whill Error
      else {
        Toast.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="box bg-slate-200 border-2 border-slate-200 p-5">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl text-primary font-bold">{dataQuiz.questionSection}</h2>

        {/* Start Modal For Update Quiz */}
        <Modal
          onClose={() => {
            setInputsValues({
              questionsBankId: dataQuiz.questionBankId,
              questionText: dataQuiz.questionText,
              questionSection: dataQuiz.questionSection,
              answer1: dataQuiz.answer1,
              answer2: dataQuiz.answer2,
              answer3: dataQuiz.answer3,
              answer4: dataQuiz.answer4,
              answerTrue: dataQuiz.asnwerTrue,
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
                <ModalHeader className="flex flex-col gap-1 text-xl font-bold">تعديل السؤال</ModalHeader>
                <ModalBody>
                  <div>
                    <Select
                      onChange={(e) => setInputsValues((prev) => ({ ...prev, questionsBankId: parseInt(e.target.value) }))}
                      size="lg"
                      fullWidth
                      label="اختر بنك الاسئلة"
                      defaultSelectedKeys={String(inputsValues.questionsBankId)}
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
                      defaultInputValue={inputsValues.questionSection}
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
                      />{" "}
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
                  <Button onClick={handelUpdate} color="primary" onPress={onClose}>
                    تحديث
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* End Modal For  Update  Quiz */}

        {/* Start Drop Menu To Update Or Delete */}
        <Dropdown>
          <DropdownTrigger>
            <Button color="primary" className="w-fit h-fit rounded-full p-2 min-w-fit">
              <FiSettings className="text-xl" />
            </Button>
          </DropdownTrigger>

          <DropdownMenu aria-label="Static Actions">
            <DropdownItem onClick={() => onOpen()} key="new" color="warning">
              <span className="font-bold">تعديل</span>
            </DropdownItem>

            <DropdownItem onClick={alertDelete} key="delete" className="text-danger" color="danger">
              <span className="font-bold">حذف</span>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        {/* End Drop  Menu  To Update Or Delete */}
      </div>

      {/* Start Quiz */}
      <div className="quiz">
        <h3 className="font-bold text-xl my-5 text-center">
          {`(${i + 1}) `}
          {dataQuiz.questionText}
        </h3>
        <div className="answer flex flex-wrap smT0:gap-5 justify-around items-center">
          <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${dataQuiz.asnwerTrue === 1 ? "bg-success rounded" : ""}`}>أ) {dataQuiz.answer1}</h4>
          <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${dataQuiz.asnwerTrue === 2 ? "bg-success rounded" : ""}`}>ب) {dataQuiz.answer2}</h4>
          <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${dataQuiz.asnwerTrue === 3 ? "bg-success rounded" : ""}`}>ج) {dataQuiz.answer3}</h4>
          <h4 className={`w-1/2 smT0:w-full text-center font-bold p-2 ${dataQuiz.asnwerTrue === 4 ? "bg-success rounded" : ""}`}>د) {dataQuiz.answer4}</h4>
        </div>
      </div>
      {/* End   Quiz */}
    </div>
  );
};

export default QuizBox;
