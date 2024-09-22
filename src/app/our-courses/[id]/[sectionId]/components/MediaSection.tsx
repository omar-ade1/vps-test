import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@nextui-org/react";
import Link from "next/link";
import React from "react";
import { FaFile, FaVideo } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { MdQuiz } from "react-icons/md";

interface Props {
  data: {
    id: number;
    title: string;
    details: string;
    type: string;
    partOfSectionId: number;
    testId: number | null;
    videoId: number | null;
    fileId: number | null;
    noteId: number | null;
  };
  courseId: string;
  sectionId: string;
  tokenData: jwtPayLoad | undefined;
}

const MediaSection: React.FC<Props> = ({ data, courseId, sectionId, tokenData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="border p-2 rounded-xl shadow-xl bg-primary-100">
      <Button
        endContent={
          <Button
            as={Link}
            href={`
            ${
              data.type === "test"
                ? `/mediaSection/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&title=${data.title}`
                : data.type == "video"
                ? `/videoPage/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&title=${data.title}`
                : data.type === "file"
                ? `/filePage/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&title=${data.title}`
                : `/notePage/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&title=${data.title}`
            }
  
            `}
            variant="light"
            color="default"
            className="flex justify-center items-center p-2 w-[30px] h-[30px] min-w-fit  mr-auto"
          >
            <FiSettings className="text-xl text-white" />
          </Button>
        }
        startContent={
          data.type === "test" ? (
            <MdQuiz className="text-2xl" />
          ) : data.type == "video" ? (
            <FaVideo className="text-2xl" />
          ) : data.type === "file" ? (
            <FaFile className="text-2xl" />
          ) : (
            <FaNoteSticky className="text-2xl" />
          )
        }
        size="lg"
        variant="shadow"
        color="primary"
        className="flex justify-center items-center h-fit p-5 text-lg font-bold"
        as={Link}
        href={`          
          ${
            data.type === "test"
              ? `/mediaSection?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&testId=${data.testId}&title=${data.title}`
              : data.type == "video"
              ? `/videoPage?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&testId=${data.videoId}&title=${data.title}`
              : data.type === "file"
              ? `/filePage?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&testId=${data.fileId}&title=${data.title}`
              : `/notePage?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${data.partOfSectionId}&mediaSectionId=${data.id}&type=${data.type}&testId=${data.noteId}&title=${data.title}`
          }

          `}
      >
        <h2 className="block ">{data.title}</h2>
      </Button>
      <Button onClick={onOpen} variant="light" color="default" className="font-bold w-fit">
        التفاصيل
      </Button>{" "}
      <Modal placement="center" size="lg" backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">التفاصيل</ModalHeader>
              <ModalBody>
                <p>{data.details ? data.details : "لا يوجد تفاصيل"}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  اغلاق
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default MediaSection;
