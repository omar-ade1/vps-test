/**
 * AddQuizBtnFromQuizBank Component
 *
 * This component renders a button that opens a modal to add questions from a question bank to a quiz.
 *
 * Props:
 * - reload: A boolean indicating whether to reload the data.
 * - setReload: A function to set the reload state.
 *
 * State:
 * - isLoading: A boolean indicating whether the data is being loaded.
 * - banksData: An array of question banks fetched from the API.
 * - selectedBankId: The ID of the selected question bank.
 * - selectedBankData: The data of the selected question bank.
 * - step: The current step in the modal (1 or 2).
 * - selectedQuestionsCount: The count of selected questions.
 * - startCount: A boolean indicating whether to start counting selected questions.
 * - selectedQuestionsId: An array of selected question IDs.
 * - isLoadingAddQuestion: A boolean indicating whether questions are being added to the exam.
 *
 * Dependencies:
 * - @nextui-org/react: UI components library.
 * - GET_QUESTION_BANK: Function to fetch question banks from the API.
 * - Toast: Utility for displaying alerts.
 * - QuestionBank: Interface for question bank data.
 * - QuestionFromBankToAdd: Component to display questions from the selected bank.
 * - ADD_QUESTION_BY_BANK: Function to add questions to the quiz by bank.
 * - useSearchParams: Hook to get search parameters from the URL.
 * - react-hot-toast: Library for displaying toast notifications.
 *
 * Usage:
 * ```tsx
 * <AddQuizBtnFromQuizBank reload={reload} setReload={setReload} />
 * ```
 */

"use client";
import React, { SetStateAction } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Button, Select, SelectItem, Spinner } from "@nextui-org/react";
import { GET_QUESTION_BANK } from "@/app/fetchApi/questionBank/getAllQuestionBank";
import { Toast } from "@/app/utils/alert";
import { QuestionBank } from "@/app/utils/interfaces/questionBanks";
import QuestionFromBankToAdd from "./QuestionFromBankToAdd";
import { ADD_QUESTION_BY_BANK } from "@/app/fetchApi/questionForExam/addQuestionsByBank";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import AddRandomQustionFromBank from "./AddRandomQustionFromBank";

interface Props {
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const AddQuizBtnFromQuizBank: React.FC<Props> = ({ reload, setReload }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [banksData, setBanksData] = React.useState<QuestionBank[]>([]);
  const [selectedBankId, setSelectedBankId] = React.useState<number | null>(null);
  const [selectedBankData, setSelectedBankData] = React.useState<QuestionBank | null>(null);
  const [step, setStep] = React.useState<number>(1);
  const [selectedQuestionsCount, setSelectedQuestionsCount] = React.useState<number>(0);
  const [startCount, setStartCount] = React.useState<boolean>(false);
  const [selectedQuestionsId, setSelectedQuestionsId] = React.useState<number[]>([]);
  const [isLoadingAddQuestion, setIsLoadingAddQuestion] = React.useState<boolean>(false);

  const params = useSearchParams();
  const courseId = params.get("courseId");
  const testId = params.get("testId");

  /**
   * Fetches question banks from the API and updates the state.
   */
  const getBankQuestions = async () => {
    setIsLoading(true);
    const message: any = await GET_QUESTION_BANK();
    if (message.request.status === 200) {
      setBanksData(message.data.message);
    } else {
      Toast.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  /**
   * Retrieves the selected question bank data based on the selectedBankId.
   */
  const getQuestionFromBank = () => {
    if (selectedBankId) {
      const selectedBank = banksData.find((bank) => bank.id === selectedBankId);
      if (selectedBank) {
        setSelectedBankData(selectedBank);
      }
    }
  };

  /**
   * Adds selected questions to the exam by calling the API.
   * Displays success or error notifications based on the API response.
   */
  const addQuestionToExam = async () => {
    setIsLoadingAddQuestion(true);

    if (selectedQuestionsId.length === 0) {
      toast.error("يجب اختيار سؤال واحد على الاقل");
      setIsLoadingAddQuestion(false);
      return;
    }

    //! BY CHAT GPT
    try {
      // تنفيذ كل الطلبات في نفس الوقت وانتظار انتهائها
      await Promise.all(
        selectedQuestionsId.map(async (questionId) => {
          if (courseId && testId && selectedBankId) {
            try {
              const message: any = await ADD_QUESTION_BY_BANK(courseId, testId, questionId, selectedBankId);

              if (message.request.status === 200) {
                toast.success(message.data.message);
              } else {
                toast.error(message.response.data.message);
              }
            } catch (error: any) {
              toast.error("حدث خطأ أثناء الإضافة");
            }
          }
        })
      );
    } finally {
      setIsLoadingAddQuestion(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      {/* Button to open the modal */}
      <Button
        onClick={() => {
          onOpen();
          if (banksData.length === 0) {
            getBankQuestions();
          }
        }}
        fullWidth
        size="lg"
        color="secondary"
        variant="light"
      >
        اضافة سؤال من بنك الاسئلة
      </Button>
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Modal
          scrollBehavior="inside"
          size={step == 1 ? "md" : "full"}
          onClose={() => {
            setSelectedBankId(null);
            setStep(1);
            setReload(!reload);
            setSelectedQuestionsCount(0);
            setSelectedQuestionsId([]);
            setStartCount(false);
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
                  {step === 1 ? (
                    "اختر بنك الاسئلة"
                  ) : (
                    <div>
                      <h2 className="text-xl font-bold">بنك الاسئلة المختار</h2>
                      <h3>عدد الاسئلة المختارة: {selectedQuestionsCount}</h3>
                    </div>
                  )}
                </ModalHeader>
                <ModalBody>
                  {banksData.length ? (
                    step == 1 ? (
                      <Select
                        onChange={(e) => {
                          setSelectedBankId(parseInt(e.target.value));
                        }}
                        fullWidth
                        size="lg"
                        label={"اختر بنك الاسئلة"}
                        defaultSelectedKeys={selectedBankId ? [selectedBankId.toString()] : []}
                      >
                        {banksData.map((questionBank) => (
                          <SelectItem key={questionBank.id}>{questionBank.name}</SelectItem>
                        ))}
                      </Select>
                    ) : (
                      <div>
                        {selectedBankData ? (
                          <div>
                            <div>
                              <h3 className="text-xl font-bold">{selectedBankData.name}</h3>
                              <h3 className="text-lg font-semibold">عدد الاسئلة: {selectedBankData.questions.length}</h3>
                            </div>

                            <AddRandomQustionFromBank bankData={selectedBankData} courseId={courseId} testId={testId} />

                            <div className="">
                              <span className="text-xl text-red-600 font-extrabold">أو</span> <span className="font-bold">اختر الاسئلة</span>
                            </div>

                            <div className="grid grid-cols-1 gap-2 mt-5">
                              {selectedBankData.questions.map((question) => {
                                return (
                                  <QuestionFromBankToAdd
                                    selectedQuestionsCount={selectedQuestionsCount}
                                    setSelectedQuestionsCount={setSelectedQuestionsCount}
                                    question={question}
                                    setStartCount={setStartCount}
                                    startCount={startCount}
                                    setSelectedQuestionsId={setSelectedQuestionsId}
                                    key={question.id}
                                  />
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          <div>لا يوجد بيانات</div>
                        )}
                      </div>
                    )
                  ) : (
                    <div className="text-red-700 underline">لا يوجد بنوك اسئلة لديك يرجى اضافة بنك والمحاولة مرة اخرى</div>
                  )}
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    إغلاق
                  </Button>
                  {selectedBankId &&
                    (step == 1 ? (
                      <Button
                        onClick={() => {
                          setStep(2);
                          getQuestionFromBank();
                        }}
                        color="primary"
                      >
                        التالي
                      </Button>
                    ) : (
                      <Button
                        onClick={() => {
                          addQuestionToExam();
                        }}
                        color="primary"
                        isDisabled={selectedQuestionsCount === 0}
                        isLoading={isLoadingAddQuestion}
                      >
                        إضافة
                      </Button>
                    ))}
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      )}
    </div>
  );
};

export default AddQuizBtnFromQuizBank;
