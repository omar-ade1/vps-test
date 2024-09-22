"use client";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Image from "next/image";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import Swal from "sweetalert2";
import LinkNext from "next/link";
import { Toast } from "@/app/utils/alert";

interface InputsValues {
  courseName: string;
  courseSubName: string;
}

interface CourseData {
  id: number;
  courseName: string;
  courseSubName: string;
  courseImg: string;
}

interface Props {
  reload: boolean;
  setReload: Dispatch<SetStateAction<boolean>>;
  course: CourseData;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
}

const CardFUpdate: React.FC<Props> = ({ reload, setReload, course, setIsLoading }) => {
  const inputFileRef = useRef(null);
  const [inputsValues, setInputsValues] = useState<InputsValues>({ courseName: "", courseSubName: "" });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const alert = () => {
    Swal.fire({
      title: "هل انت متأكد",
      text: "يرجى العلم انه بتحديث بيانات الكورس لا يمكن الرجوع مرة اخرى للبيانات السابقة و ستم حذف صورة الكورس القديمة من النظام",
      icon: "warning",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#767676",
      confirmButtonText: "استمرار",
      cancelButtonText: "إلغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        onOpen();
      }
    });
  };

  const handelUpdateCourse = async (id: number) => {
    setIsLoading(true);
    if (inputFileRef.current) {
      const inputFileEle = inputFileRef.current as HTMLInputElement;

      if (inputFileEle.files) {
        const formData = new FormData();

        const file = inputFileEle.files[0];

        formData.append("file", file);
        formData.append("courseName", inputsValues.courseName);
        formData.append("courseSubName", inputsValues.courseSubName);

        const response = await fetch(`/api/our-course/${id}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (response.status == 200) {
          setReload(!reload);
          Toast.fire({
            // title: "تم التحديث بنجاح",
            title: result.message,
            icon: "success",
          });
        } else {
          Toast.fire({
            // title: "فشل التحديث",
            title: result.message,
            icon: "error",
          });
        }
      }

      // fixme
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  return (
    <Card key={course.id} className="py-4 rounded-xl max-w-[500px] ">
      <CardHeader className="flex-col items-start">
        <p className={`text-2xl font-bold text-orange-600`}>{course.courseName}</p>
        <h4 className={`text-xl font-bold`}>{course.courseSubName}</h4>
      </CardHeader>
      <CardBody className="overflow-visible py-2 relative">
        <Image
          alt="Card background"
          className="object-cover rounded-xl max-w-full w-[400px] block mx-auto"
          width={200}
          height={200}
          src={`/${process.env.NEXT_PUBLIC_PATH_FOR_IMAGE_COURSES}/${course.courseImg}`}
        />
      </CardBody>

      <CardFooter className="grid gap-2">
        <Button
          fullWidth
          variant="ghost"
          color="primary"
          size="lg"
          className="text-xl font-bold h-fit p-5"
          href={`/our-courses/${course.id}?courseName=${course.courseName}`}
          as={LinkNext}
        >
          الذهاب للدورة
        </Button>
        <Button
          onClick={() => {
            alert();
          }}
          fullWidth
          variant="ghost"
          color="warning"
          size="lg"
          className="text-xl font-bold h-fit p-5"
        >
          تعديل
        </Button>
        <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange} placement="center" key={course.id}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">تحديث معلومات الكورس {course.courseName}</ModalHeader>
                <ModalBody className="grid gap-5">
                  <Input
                    onChange={(e) => setInputsValues((prev) => ({ ...prev, courseName: e.target.value }))}
                    autoFocus
                    label="اسم الكورس الجديد"
                    placeholder="أدخل اسم الكورس الجديد"
                    classNames={{
                      input: "text-black",
                    }}
                    className="text-xl font-bold"
                    color="primary"
                    size="lg"
                    variant="flat"
                    value={inputsValues.courseName}
                  />
                  <Input
                    onChange={(e) => setInputsValues((prev) => ({ ...prev, courseSubName: e.target.value }))}
                    label="الاسم الفرعي الجديد للـكورس"
                    placeholder="ادخل الاسم الفرعي الجديد للـكورس"
                    type="text"
                    classNames={{
                      input: "text-black",
                    }}
                    className="text-xl font-bold"
                    color="primary"
                    size="lg"
                    variant="flat"
                    value={inputsValues.courseSubName}
                  />
                  <Input
                    ref={inputFileRef}
                    label="اختيار صورة جديدة للـكورس"
                    type="file"
                    classNames={{
                      input: "text-black",
                    }}
                    className="text-xl font-bold"
                    color="primary"
                    size="lg"
                    variant="flat"
                    name="upd_img_course"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    إغلاق
                  </Button>
                  <Button
                    onClick={() => {
                      console.log(course.id);
                      handelUpdateCourse(course.id);
                      onClose();
                    }}
                    color="primary"
                  >
                    تحديث
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </CardFooter>
    </Card>
  );
};

export default CardFUpdate;
