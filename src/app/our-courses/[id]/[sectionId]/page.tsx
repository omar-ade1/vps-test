"use client";

import Empty from "@/app/components/empty/Empty";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { GET_SINGLE_SECTION_IN_COURSE } from "@/app/fetchApi/sectionCourse/getSingleSection";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Accordion, AccordionItem, Button } from "@nextui-org/react";
import AddPartBtn from "./components/AddPartBtn";
import UpdateOrDeletePart from "./components/UpdateOrDeletePart";
import MediaSection from "./components/MediaSection";
import AddMediaSectionBtn from "./components/AddMediaSectionBtn";
import axios from "axios";
import { DOMAIN_NAME } from "@/app/utils/domainName";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

interface Props {
  params: {
    id: string;
    sectionId: string;
  };
}

interface GroupOfSection {
  id: number;
  title: string;
  type: string;
  details: string;
  createdAt: string;
  updatedAt: string;
  partOfSection: string;
  partOfSectionId: number;
  testId: number | null;
  videoId: number | null;
  fileId: number | null;
  noteId: number | null;
}

interface PartOfSection {
  id: number;
  title: string;
  Section: string;
  sectionId: number;
  details: string;
  createdAt: string;
  updatedAt: string;
  GroupOfSection: GroupOfSection[];
}

interface SectionData {
  courseId: number;
  id: number;
  details: string;
  title: string;
  partOfSection: PartOfSection[];
}

const IdPage = ({ params }: Props) => {
  const [sectionData, setSectionData] = useState<SectionData>();

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reload, setReload] = useState<boolean>(true);

  const [tokenData, setTokenData] = useState<jwtPayLoad>();

  const getSignleSection = async () => {
    setIsLoading(true);
    const message: any = await GET_SINGLE_SECTION_IN_COURSE(params.sectionId, params.id);

    if (message.request.status == 200) {
      setSectionData(message.data.message);
    } else {
      Swal.fire({
        title: "خطأ",
        text: message.response.data.message,
        icon: "error",
      });
    }

    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  useEffect(() => {
    getSignleSection();
  }, [reload]);

  const getToken = async () => {
    const message: any = await axios.get(`${DOMAIN_NAME}/api/token`);
    if (message.request.status === 200) {
      setTokenData(message.data.message);
    } else {
      Swal.fire({
        title: "خطأ",
        text: message.response.data.message,
        icon: "error",
      });
    }
  };

  useEffect(() => {
    getToken();
  }, []);

  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      {isLoading ? (
        <Loader />
      ) : sectionData ? (
        <div>
          <TitleForPage titleText={sectionData.title} />
          {sectionData.partOfSection.length ? (
            <div className="container relative z-10">
              <Accordion selectionMode="multiple" keepContentMounted variant="splitted">
                {sectionData.partOfSection.map((part) => {
                  return (
                    <AccordionItem
                      className="relative"
                      classNames={{
                        trigger: "text-xl",
                        heading: "text-xl font-bold",
                      }}
                      key={part.id}
                      aria-label={part.title}
                      title={part.title}
                      subtitle={
                        <div className="flex flex-col w-fit">
                          <Button
                            onClick={() => {
                              Swal.fire({
                                title: "التفاصيل",
                                text: `${part.details}`,
                                icon: "info",
                                showCloseButton: true,
                              });
                            }}
                            variant="light"
                            color="primary"
                          >
                            التفاصيل
                          </Button>
                        </div>
                      }
                      startContent={
                        // check if user is admin or not
                        tokenData?.isAdmin == true && (
                          <UpdateOrDeletePart
                            courseId={params.id}
                            sectionId={params.sectionId}
                            partOfSectionId={part.id}
                            partOfSectionTitle={part.title}
                            reload={reload}
                            setReload={setReload}
                            partOfSectionDetails={part.details}
                          />
                        )
                      }
                    >
                      {part.GroupOfSection.length ? (
                        <div className="grid gap-5">
                          {part.GroupOfSection.map((f) => {
                            return <MediaSection tokenData={tokenData} courseId={params.id} sectionId={params.sectionId} data={f} key={f.id} />;
                          })}
                        </div>
                      ) : (
                        <h3 className="font-bold text-center w-fit mx-auto">هذا القسم فارغ</h3>
                      )}

                      {tokenData?.isAdmin == true && (
                        <AddMediaSectionBtn
                          setReload={setReload}
                          reload={reload}
                          partOfSectionId={part.id}
                          courseId={params.id}
                          sectionId={params.sectionId}
                        />
                      )}
                    </AccordionItem>
                  );
                })}
              </Accordion>

              {tokenData?.isAdmin == true && (
                <AddPartBtn setReload={setReload} reload={reload} courseId={params.id} sectionId={params.sectionId} setIsLoading={setIsLoading} />
              )}
            </div>
          ) : (
            <Empty textForBtn="كل الدورات" urlForBtn="/our-course">
              {tokenData?.isAdmin == true && (
                <AddPartBtn courseId={params.id} sectionId={params.sectionId} reload={reload} setIsLoading={setIsLoading} setReload={setReload} />
              )}
            </Empty>
          )}
        </div>
      ) : (
        <Empty textForBtn="كل الدورات" urlForBtn="/our-course" />
      )}
    </main>
  );
};

export default IdPage;
