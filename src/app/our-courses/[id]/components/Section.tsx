"use client";

import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import React, { SetStateAction, useState } from "react";
import UpdateSection from "./UpdateSection";
import { AnimatePresence } from "framer-motion";
import DeleteSection from "./DeleteSection";

interface Props {
  id: number;
  title: string;
  details: string;
  verfiyToken: jwtPayLoad;
  courseId: number;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const SectionOfCourse: React.FC<Props> = ({ id, courseId, title, details, verfiyToken, reload, setReload }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);

  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);

  return (
    <div
      className="box  flex-grow w-[400px] !max-w-full shadow-2xl select-none p-5 rounded-xl border-2 min-h-[300px] flex flex-col justify-around items-center bg-white
      hover:border-primary hover:shadow-inner hover:shadow-primary transition-all duration-300
    "
    >
      <h2 className="text-5xl text-center font-[l] font-extrabold border w-full p-4 rounded-xl shadow-xl">{title}</h2>

      <AnimatePresence mode="wait">
        {showUpdateForm && (
          <UpdateSection
            reload={reload}
            setReload={setReload}
            courseId={courseId}
            sectionId={id}
            sectionTitle={title}
            sectionDetails={details}
            setShowUpdateForm={setShowUpdateForm}
          />
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {showDeleteForm && (
          <DeleteSection
            reload={reload}
            setReload={setReload}
            courseId={courseId}
            sectionId={id}
            sectionTitle={title}
            sectionDetails={details}
            setShowDeleteForm={setShowDeleteForm}
          />
        )}
      </AnimatePresence>

      <div className="w-full flex flex-col justify-center items-center mt-5">
        <Button
          as={Link}
          href={`/our-courses/${courseId}/${id}`}
          size="lg"
          fullWidth
          color="primary"
          className="text-xl font-bold flex-shrink-0 h-fit p-5"
        >
          انتقال
        </Button>
        <div>
          <Button variant="light" className="text-sm font-bold" onPress={onOpen}>
            التفاصيل
          </Button>
          <Modal placement="center" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-xl font-extrabold">التفاصيل</ModalHeader>
                  <ModalBody>
                    <p className="text-lg  font-semibold py-2">{details || "لا توجد تفاصيل"}</p>
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
          {verfiyToken.isAdmin && (
            <Dropdown backdrop="blur" size="lg">
              <DropdownTrigger>
                <Button variant="light" className="text-sm font-bold">
                  اعدادات
                </Button>
              </DropdownTrigger>
              <DropdownMenu variant="shadow" aria-label="Static Actions">
                <DropdownItem
                  onClick={() => {
                    setShowUpdateForm(true);
                  }}
                  key="edit"
                  color="warning"
                >
                  <span className="font-bold">تعديل القسم</span>
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setShowDeleteForm(true);
                  }}
                  key="delete"
                  className="text-danger"
                  color="danger"
                >
                  <span className="font-bold">حذف القسم</span>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionOfCourse;
