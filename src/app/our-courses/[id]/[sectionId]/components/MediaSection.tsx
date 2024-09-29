import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner } from "@nextui-org/react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaFile, FaVideo } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { FiSettings } from "react-icons/fi";
import { MdQuiz } from "react-icons/md";
import { Select, SelectItem } from "@nextui-org/react";
import { CoursesData, PartOfSection } from "@/app/utils/interfaces/courseParts";
import { GET_ALL_COURSES } from "@/app/fetchApi/our-course/getCourses";
import Swal from "sweetalert2";
import { MOVE_MEDIA_SECTION } from "@/app/fetchApi/moveMediaSection/moveMediaSection";
import MoveMediaSectionBtn from "./MoveMediaSectionBtn";

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
  partsOfSection: PartOfSection[];
}

const MediaSection: React.FC<Props> = ({ partsOfSection, data, courseId, sectionId, tokenData }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2 } = useDisclosure();

  const [coursesData, setCoursesData] = useState<CoursesData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sectionInMove, setSectionInMove] = useState<number>(1);

  const [courseIdInMove, setCourseIdInMove] = useState<string>("");
  const [sectionIdInMove, setSectionIdInMove] = useState<string>("");
  const [partOfSectionIdInMove, setPartOfSectionIdInMove] = useState<string>("");

  const handelGetCoursesData = async () => {
    setIsLoading(true);
    const message: any = await GET_ALL_COURSES();
    console.log(message);

    if (message.request.status === 200) {
      setCoursesData(message.data.message);
    } else {
      Swal.fire({
        title: message.response.data.message,
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!courseIdInMove.length) {
      setSectionInMove(1);
    }
  }, [courseIdInMove]);

  useEffect(() => {
    if (!sectionIdInMove.length) {
      setSectionInMove(2);
    }
  }, [sectionIdInMove]);

  const handelMoveMediaSection = async () => {
    if (courseIdInMove && sectionIdInMove && partOfSectionIdInMove) {
      const message: any = await MOVE_MEDIA_SECTION(courseIdInMove, sectionIdInMove, partOfSectionIdInMove, data.id);
      console.log(message);
    }
  };
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
      </Button>
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

      {/* <Button
        onClick={() => {
          onOpen2();
          handelGetCoursesData();
        }}
        variant="light"
        color="default"
        className="font-bold w-fit"
      >
        نقل
      </Button>

      <Modal
        onClose={() => {
          setSectionInMove(1);
          setCourseIdInMove("");
          setSectionIdInMove("");
          setPartOfSectionIdInMove("");
        }}
        placement="center"
        size="lg"
        backdrop="blur"
        isOpen={isOpen2}
        onOpenChange={onOpenChange2}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-xl font-bold">التفاصيل</ModalHeader>
              <ModalBody>
                {isLoading ? (
                  <Spinner size="lg" />
                ) : coursesData ? (
                  <>
                    {sectionInMove >= 1 && (
                      <Select
                        onChange={(e) => {
                          setCourseIdInMove(e.target.value);
                          setSectionInMove(2);
                        }}
                        label="اختر الدورة التي تريد ان يتم النقل اليه"
                        className="max-w-full"
                      >
                        {coursesData.map((course) => (
                          <SelectItem value={course.id} key={course.id}>
                            {course.courseName}
                          </SelectItem>
                        ))}
                      </Select>
                    )}

                    {sectionInMove >= 2 && (
                      <Select
                        onChange={(e) => {
                          setSectionIdInMove(e.target.value);
                          setSectionInMove(3);
                        }}
                        label="اختر القسم الرئيسي التي تريد ان يتم النقل اليه"
                        className="max-w-full"
                      >
                        {coursesData.filter((course) => course.id == parseInt(courseIdInMove))[0] &&
                          coursesData
                            .filter((course) => course.id == parseInt(courseIdInMove))[0]
                            .sections.map((section) => (
                              <SelectItem value={section.id} key={section.id}>
                                {section.title}
                              </SelectItem>
                            ))}
                      </Select>
                    )}

                    {sectionInMove >= 3 && (
                      <Select
                        onChange={(e) => setPartOfSectionIdInMove(e.target.value)}
                        label="اختر القسم الفرعي التي تريد ان يتم النقل اليه"
                        className="max-w-full"
                      >
                        {coursesData
                          .filter((course) => course.id == parseInt(courseIdInMove))[0]
                          .sections.filter((section) => section.id == parseInt(sectionIdInMove))[0] &&
                          coursesData
                            .filter((course) => course.id == parseInt(courseIdInMove))[0]
                            .sections.filter((section) => section.id == parseInt(sectionIdInMove))[0]
                            .partOfSection.map((part) => (
                              <SelectItem value={part.id} key={part.id}>
                                {part.title}
                              </SelectItem>
                            ))}
                      </Select>
                    )}
                  </>
                ) : (
                  ""
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={onClose}>
                  اغلاق
                </Button>

                <Button color="primary" onClick={handelMoveMediaSection}>
                  نقل
                </Button>

              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal> */}

      <MoveMediaSectionBtn mediaSectionId={data.id} />
    </div>
  );
};

export default MediaSection;
