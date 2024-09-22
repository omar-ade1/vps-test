"use client";

import { GET_SINGLE_VIDEO } from "@/app/fetchApi/video/getSingleVideo";
import { Toast } from "@/app/utils/alert";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import VideoPlayer from "./VideoPlayer";
import UploadVideo from "../setting/components/UploadVideo";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import Loader from "@/app/components/Loading/Loader";
import TitleForPage from "@/app/components/titleForPage/TitleForPage";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

interface VideoData {
  allowForStudent: boolean;
  createdAt: string;
  id: number;
  updatedAt: string;
  videoUrl: string;
  courseName: string;
  mediaSectionName: string;
  partOfSectionName: string;
  sectionName: string;
  videoName: string;
}

interface Props {
  verfiyToken: jwtPayLoad;
}

const VideoAndBtn: React.FC<Props> = ({ verfiyToken }) => {
  const router = useRouter();

  // Get Ids
  const courseId = useSearchParams().get("courseId");
  const sectionId = useSearchParams().get("sectionId");
  const mediaSectionId = useSearchParams().get("mediaSectionId");
  const type = useSearchParams().get("type");
  const partOfSectionId = useSearchParams().get("partOfSectionId") as string;
  const testId = useSearchParams().get("testId") as string;
  const title = useSearchParams().get("title") as string;

  // To Reload Page
  const [reload, setReload] = useState<boolean>(false);

  const [videoData, setVideoData] = useState<VideoData>();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Handel Get Signle Video Data Function
  const getSingleVideo = async () => {
    setIsLoading(true);
    if (testId) {
      const message: any = await GET_SINGLE_VIDEO(testId);

      // While Success
      if (message.request.status === 200) {
        setVideoData(message.data.message);

        // While Error
      } else {
        Swal.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
      // It TestId (VideoId) Is Not Founded
    } else {
      Toast.fire({
        title: "لم يتم العثور على ال ID الخاص بالفيديو",
        icon: "error",
      });
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 100);
  };

  // While Reload Changed Run Function Get Single Video
  useEffect(() => {
    getSingleVideo();
  }, [reload]);

  // To Protect The Video (Simple Protect)
  useEffect(() => {
    function disableRightClick(e: MouseEvent) {
      e.preventDefault();
    }

    function disableShortcuts(e: KeyboardEvent) {
      if ((e.ctrlKey && e.key === "s") || (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "C")) || (e.ctrlKey && e.key === "u")) {
        e.preventDefault();
      }
    }

    function disableDrag(e: DragEvent) {
      e.preventDefault();
    }

    // إضافة الـ EventListeners
    document.addEventListener("contextmenu", disableRightClick, false);
    document.addEventListener("keydown", disableShortcuts, false);
    document.addEventListener("dragstart", disableDrag, false);

    // إزالة الـ EventListeners عند تدمير المكون
    return () => {
      document.removeEventListener("contextmenu", disableRightClick, false);
      document.removeEventListener("keydown", disableShortcuts, false);
      document.removeEventListener("dragstart", disableDrag, false);
    };
  }, []);

  return (
    <div>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="container relative z-10">
          <TitleForPage titleText={title} />
          {verfiyToken?.isAdmin && (
            <div className="setting-bar border shadow-xl p-5 rounded-xl flex justify-center items-center gap-2 bg-gray-700 ">
              {/* Start Setting Button */}
              <Button
                as={Link}
                href={`/videoPage/setting?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&type=${type}`}
                variant="shadow"
                color="primary"
                size="lg"
                className="text-xl font-bold h-fit p-4"
              >
                الاعدادات
              </Button>
              {/* End Setting Button */}
            </div>
          )}

          {/* If Video Founded */}
          {videoData?.videoUrl && videoData.videoName ? (
            <div className="my-5">
              <VideoPlayer titleOfVideo={title} urlOfVideo={`/video/${videoData.videoUrl}`} />
            </div>
          ) : // If No Video
          verfiyToken.isAdmin == true ? (
            <div className="video-site flex justify-center items-center flex-col max-w-full rounded-xl shadow-2xl mt-5 mx-auto p-5 bg-gray-300">
              <h2 className="text-xl font-bold">لم تقم بتحميل فيديو بعد</h2>
              <UploadVideo
                reload={reload}
                setReload={setReload}
                courseId={courseId}
                sectionId={sectionId}
                partOfSectionId={partOfSectionId}
                mediaSectionId={mediaSectionId}
                testId={testId}
              />
            </div>
          ) : (
            <div className=" py-[60px]">
              <h2 className="text-4xl smT0:text-2xl text-black opacity-60 font-extrabold text-center mx-auto">
                هذا القسم فارغ لم يتم تحميل فيديو بعد
              </h2>
              <Button
                size="lg"
                variant="light"
                color="primary"
                className="my-10 block mx-auto h-fit p-5 font-bold text-xl underline"
                onClick={() => router.back()}
              >
                عودة للصفحة السابقة
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoAndBtn;
