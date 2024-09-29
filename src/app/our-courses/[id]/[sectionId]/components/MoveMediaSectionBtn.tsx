import React, { useEffect, useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Spinner } from "@nextui-org/react";
import { Select, SelectItem } from "@nextui-org/react";
import { CoursesData } from "@/app/utils/interfaces/courseParts";
import { MOVE_MEDIA_SECTION } from "@/app/fetchApi/moveMediaSection/moveMediaSection";
import Swal from "sweetalert2";
import { GET_ALL_COURSES } from "@/app/fetchApi/our-course/getCourses";
import { useRouter } from "next/navigation";
import { Toast } from "@/app/utils/alert";

interface Props {
  mediaSectionId: number;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  
}

const MoveMediaSectionBtn: React.FC<Props> = ({ mediaSectionId, reload, setReload }) => {
  const { isOpen: isOpen2, onOpen: onOpen2, onOpenChange: onOpenChange2 } = useDisclosure();
  const [coursesData, setCoursesData] = useState<CoursesData[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sectionInMove, setSectionInMove] = useState<number>(1);
  const [courseIdInMove, setCourseIdInMove] = useState<string>("");
  const [sectionIdInMove, setSectionIdInMove] = useState<string>("");
  const [partOfSectionIdInMove, setPartOfSectionIdInMove] = useState<string>("");

  const router = useRouter();

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
      const message: any = await MOVE_MEDIA_SECTION(courseIdInMove, sectionIdInMove, partOfSectionIdInMove, mediaSectionId);
      if (message.request.status === 200) {
        Toast.fire({
          title: message.data.message,
          icon: "success",
        });
        router.refresh();
        setReload(!reload);
      } else {
        Toast.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    }
  };

  return (
    <>
      <Button
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
                <Button color="danger" onPress={onClose}>
                  اغلاق
                </Button>

                <Button color="primary" onClick={handelMoveMediaSection}>
                  نقل
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      
    </>
  );
};

export default MoveMediaSectionBtn
