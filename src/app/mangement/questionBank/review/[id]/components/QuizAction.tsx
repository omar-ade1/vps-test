import { DELETE_QUESTION_FROM_QUESTION_BANK } from "@/app/fetchApi/questionBank/question/deleteQuestion";
import { UPDATE_QUESTION_FROM_QUESTION_BANK } from "@/app/fetchApi/questionBank/question/updateQuestion";
import { Toast } from "@/app/utils/alert";
import { Question } from "@/app/utils/interfaces/courseParts";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import React, { SetStateAction, useEffect, useState } from "react";
import { FiSettings } from "react-icons/fi";
import Swal from "sweetalert2";
const questionSectionAutoComplete = [
  { label: "تناظر لفظي", key: 1 },
  { label: "إكمال جمل", key: 2 },
  { label: "خطأ سياقي", key: 3 },
  { label: "إستيعاب المقروء", key: 4 },
];

interface Bank {
  id: number;
  name: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
  _count: {
    questions: number;
  };
}

interface Props {
  bankData: Bank;
  questionData: Question;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
  numberOfCurrentPage: string;
  setNumberOfCurrentPage: React.Dispatch<SetStateAction<string>>;
  banksData: { id: number; name: string }[];
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

const QuizAction: React.FC<Props> = ({ questionData, reload, setReload, bankData, numberOfCurrentPage, setNumberOfCurrentPage,banksData }) => {
  // For Update Modal
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  //TODO: For Info Modal
  // const { isOpen: isOpenInfo, onOpen: onOpenInfo, onOpenChange: onOpenChangeInfo } = useDisclosure();

  // Inputs For Question
  const [inputsValues, setInputsValues] = useState<InputValues>({
    questionsBankId: questionData.questionBankId,
    questionText: questionData.questionText,
    questionSection: questionData.questionSection,
    answer1: questionData.answer1,
    answer2: questionData.answer2,
    answer3: questionData.answer3,
    answer4: questionData.answer4,
    answerTrue: questionData.asnwerTrue,
  });

  // handel Update Quiz Function
  const handelUpdate = async () => {
    // If Id Of Bank Is Exist
    if (questionData.id) {
      const message: any = await UPDATE_QUESTION_FROM_QUESTION_BANK(questionData.id, inputsValues);

      // While Succeed
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

  // Handel Delete Question Function
  const handelDelete = async () => {
    // If Id Of Bank Is Exist
    if (questionData.id) {
      const message: any = await DELETE_QUESTION_FROM_QUESTION_BANK(questionData.id);

      // While Succeed
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

  // Alert For Delete Question
  const alertDelete = async () => {
    Swal.fire({
      title: "هل انت متأكد",
      text: "هل تريد حذف هذا السؤال نهائيا من النظام ؟!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "نعم احذفه",
      cancelButtonText: "إغلاق",
    }).then((result) => {
      if (result.isConfirmed) {
        // If Result Is Confirmed Delete The Question
        handelDelete();
      }
    });
  };

  // console.log(bankData.questions.length);

  useEffect(() => {
    console.log(bankData.questions.length);

    if (bankData.questions.length < 1 || !bankData.questions) {
      if (parseInt(numberOfCurrentPage) > 1) {
        setNumberOfCurrentPage(String(parseInt(numberOfCurrentPage) - 1));
        console.log("hi");
      }
      console.log(true);
    }
  }, [bankData]);

  return (
    <div>
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

          {/* TODO: For Info Of Question */}
          {/* <DropdownItem onClick={onOpenInfo} key="info" className="text-gray-500" color="default">
            <span className="font-bold">معلومات</span>
          </DropdownItem> */}
        </DropdownMenu>
      </Dropdown>
      {/* End Drop  Menu  To Update Or Delete */}

      {/* Start Modal For Update Quiz */}
      <Modal
        onClose={() => {
          setInputsValues({
            questionsBankId: questionData.questionBankId,
            questionText: questionData.questionText,
            questionSection: questionData.questionSection,
            answer1: questionData.answer1,
            answer2: questionData.answer2,
            answer3: questionData.answer3,
            answer4: questionData.answer4,
            answerTrue: questionData.asnwerTrue,
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
                    {banksData.map((bank) => (
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
                  <Textarea
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

      {/* TODO: Modal For Info Of Quiz */}
      {/* <Modal backdrop="blur" placement="center" isOpen={isOpenInfo} onOpenChange={onOpenChangeInfo}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">معلومات السؤال</ModalHeader>
              <ModalBody>
                <h1>hello omar</h1>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </div>
  );
};

export default QuizAction;
