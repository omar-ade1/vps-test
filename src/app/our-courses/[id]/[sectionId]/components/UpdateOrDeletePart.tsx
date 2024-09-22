"use client";

import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, useDisclosure } from "@nextui-org/react";
import React, { SetStateAction, useState } from "react";
import { FiSettings } from "react-icons/fi";
import DeletePartOfSection from "./DeletePartOfSection";
import UpdateFormPartOfSection from "./UpdateForm";

interface Props {
  courseId: string;
  sectionId: string;
  partOfSectionId: number;
  partOfSectionTitle: string;
  partOfSectionDetails: string;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const UpdateOrDeletePart: React.FC<Props> = ({
  courseId,
  sectionId,
  partOfSectionId,
  partOfSectionTitle,
  partOfSectionDetails,
  reload,
  setReload,
}) => {
  const [showUpdateForm, setShowUpdateForm] = useState<boolean>(false);
  const [showDeleteForm, setShowDeleteForm] = useState<boolean>(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2 } = useDisclosure();

  return (
    <div className="relative z-20">
      {showDeleteForm && (
        <DeletePartOfSection
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          courseId={courseId}
          partOfSectionId={partOfSectionId}
          partOfSectionTitle={partOfSectionTitle}
          reload={reload}
          sectionId={sectionId}
          setReload={setReload}
        />
      )}
      {showUpdateForm && (
        <UpdateFormPartOfSection
          isOpen={isOpen2}
          onOpenChange={onOpenChange2}
          courseId={courseId}
          partOfSectionId={partOfSectionId}
          partOfSectionTitle={partOfSectionTitle}
          partOfSectionDetails={partOfSectionDetails}
          reload={reload}
          sectionId={sectionId}
          setReload={setReload}
        />
      )}
      <Dropdown>
        <DropdownTrigger>
          <Button variant="shadow" color="primary" size="sm" className=" p-0 min-w-fit w-[30px] h-[30px] rounded-full">
            <FiSettings className="text-xl" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Static Actions">
          <DropdownItem
            onClick={() => {
              setShowUpdateForm(true);
              onOpen2();
            }}
            key="edit"
            color="warning"
            className="text-warning"
          >
            <span className="font-bold">تعديل</span>
          </DropdownItem>
          <DropdownItem
            onClick={() => {
              setShowDeleteForm(true);
              onOpen();
            }}
            key="delete"
            className="text-danger"
            color="danger"
          >
            <span className="font-bold">حذف</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default UpdateOrDeletePart;
