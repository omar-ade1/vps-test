"use client";

import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { GET_ALL_RESULT_OF_ONE_EXAM_ALL_USER } from "@/app/fetchApi/handelResultOfExam/getAllResultOfExamAllUser";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Input, Button } from "@nextui-org/react";
import { format } from "date-fns";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

interface ResultData {
  id: number;
  allResult: number;
  wrongAnswer: number;
  correctAnswer: number;
  createdAt: string;
  User: {
    userName: string;
    tel: string;
  };
  Test: {
    GroupOfSection: {
      title: string;
    };
  };
}

const AllResultOfExamPage = () => {
  // Ids
  const courseId = useSearchParams().get("courseId");
  const testId = useSearchParams().get("testId") as string;
  const title = useSearchParams().get("title") as string;

  // const sectionId = useSearchParams().get("sectionId");
  // const mediaSectionId = useSearchParams().get("mediaSectionId");
  // const type = useSearchParams().get("type");
  // const partOfSectionId = useSearchParams().get("partOfSectionId") as string;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [resultsData, setResultsData] = useState<ResultData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [searchInput, setSearchInput] = useState<string>("");
  const [resultOfSearch, setResultOfSearch] = useState<ResultData[]>([]);

  // Handel Get All Results
  const handelGetAllResult = async () => {
    setIsLoading(true);
    if (courseId && testId) {
      const message: any = await GET_ALL_RESULT_OF_ONE_EXAM_ALL_USER(courseId, testId);
      if (message.request.status === 200) {
        setResultsData(message.data.message);
      } else {
        Swal.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };
  useEffect(() => {
    handelGetAllResult();
  }, []);

  // Handel Get Result By Search
  const handelSearch = () => {
    const filteredUsers = resultsData.filter((e) => e.User.userName.toLowerCase().includes(searchInput.toLowerCase()));

    setResultOfSearch(filteredUsers);

    onOpen();
  };

  return (
    <main className="min-h-[calc(100vh-64px)] pt-[50px] py-[100px] relative">
      <TitleForPage titleText={`نتائج الطلاب `} />
      <h3 className="text-center text-lg font-bold mb-5">{title}</h3>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container relative z-10">
          {/* Start Search Container */}
          <div className="search-container my-5">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              label="اكتب اسم الطالب لعرض النتيجة"
              className="mb-3"
              size="lg"
              classNames={{
                label: "text-xl font-bold",
                input: "text-lg font-bold",
              }}
            />
            <Button
              isDisabled={!searchInput}
              onClick={() => {
                handelSearch();
              }}
              fullWidth
              color="primary"
              size="lg"
              className="text-lg font-bold p-5 h-fit"
            >
              بحث
            </Button>

            <Modal
              onClose={() => {
                setSearchInput("");
                setResultOfSearch([]);
              }}
              size="full"
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-xl font-bold">نتيجة البحث عن {`" ${searchInput} "`}</ModalHeader>
                    <ModalBody className="container">
                      <Table aria-label="Example static collection table">
                        <TableHeader>
                          <TableColumn className="text-xl font-bold border-2">الاسم</TableColumn>
                          <TableColumn className="text-xl font-bold border-2">رقم الهاتف</TableColumn>
                          <TableColumn className="text-xl font-bold border-2">الدرجة الكلية</TableColumn>
                          <TableColumn className="text-xl font-bold border-2">درجة الطالب</TableColumn>
                          <TableColumn className="text-xl font-bold border-2">النسبة المئوية</TableColumn>
                          <TableColumn className="text-xl font-bold border-2">تاريخ الاختبار</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent={<h2 className="text-xl font-bold">لا توجد نتيجة بهذا الاسم</h2>}>
                          {resultOfSearch.length
                            ? resultOfSearch.map((result) => {
                                return (
                                  <TableRow key={result.id}>
                                    <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap">{result.User.userName}</TableCell>
                                    <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap">{result.User.tel}</TableCell>
                                    <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap">{result.allResult}</TableCell>
                                    <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap">{result.correctAnswer}</TableCell>
                                    <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap">
                                      %{((result.correctAnswer / result.allResult) * 100).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap">
                                      {format(new Date(result.createdAt), "PPpp")}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            : []}
                        </TableBody>
                      </Table>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="primary" onPress={onClose}>
                        إغلاق
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
          {/* End Search Container */}

          {/* Start Table Of Results */}
          <Table cellPadding={"30"} aria-label="Example static collection table">
            <TableHeader>
              <TableColumn className="text-xl font-bold border-2">#</TableColumn>
              <TableColumn className="text-xl font-bold border-2">الاسم</TableColumn>
              <TableColumn className="text-xl font-bold border-2">رقم الهاتف</TableColumn>
              <TableColumn className="text-xl font-bold border-2">الدرجة الكلية</TableColumn>
              <TableColumn className="text-xl font-bold border-2">درجة الطالب</TableColumn>
              <TableColumn className="text-xl font-bold border-2">النسبة المئوية</TableColumn>
              <TableColumn className="text-xl font-bold border-2">تاريخ الاختبار</TableColumn>
            </TableHeader>
            <TableBody emptyContent={<h2 className="text-xl font-bold">لا توجد نتائج لهذا الاختبار</h2>}>
              {resultsData.length
                ? resultsData.map((result, i) => {
                    return (
                      <TableRow key={result.id}>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">{i + 1}</TableCell>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">{result.User.userName}</TableCell>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">{result.User.tel}</TableCell>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">{result.allResult}</TableCell>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">{result.correctAnswer}</TableCell>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">
                          %{((result.correctAnswer / result.allResult) * 100).toFixed(2)}
                        </TableCell>
                        <TableCell className="text-lg font-bold text-nowrap border-2 whitespace-nowrap p-5">
                          {format(new Date(result.createdAt), "PPpp")}
                        </TableCell>
                      </TableRow>
                    );
                  })
                : []}
            </TableBody>
          </Table>
          {/* End Table Of Results */}
        </div>
      )}
    </main>
  );
};

export default AllResultOfExamPage;
