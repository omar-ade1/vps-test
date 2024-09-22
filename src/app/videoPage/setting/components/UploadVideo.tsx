"use client";

import { Button, Input } from "@nextui-org/react";
import React, { SetStateAction, useRef, useState } from "react";
import { Progress } from "@nextui-org/react";
import { Toast } from "@/app/utils/alert";
import axios from "axios";
import { BsUpload } from "react-icons/bs";

interface Props {
  courseId: string | null;
  sectionId: string | null;
  partOfSectionId: string | null;
  mediaSectionId: string | null;
  testId: string | null;
  reload: boolean;
  setReload: React.Dispatch<SetStateAction<boolean>>;
}

const UploadVideo: React.FC<Props> = ({ courseId, sectionId, partOfSectionId, mediaSectionId, testId, reload, setReload }) => {
  // Value Of Loader To Show The Progress Of DownLoad
  const [valueOfLoader, setValueOfLoader] = useState<number>(0);

  // For Input File
  const inputFileRef = useRef(null);

  // The Video That User Choose It From His Device
  const [video, setVideo] = useState<File | null>(null);

  const [startLoading, setStartLoading] = useState<string>("notStart");

  return (
    <>
      {/* Start Input File */}
      <div className="border-2 border-dashed mt-5 border-black bg-blue-100 cursor-pointer relative w-[300px] max-w-full hover:bg-primary hover:text-white transition duration-300">
        <Input
          ref={inputFileRef}
          name="file"
          accept="video/*"
          className="absolute inset-0 w-full hidden  max-w-full max-h-full h-full z-10  cursor-pointer"
          type="file"
          id="file"
          onChange={(e) => {
            if (e.target.files) {
              setVideo(e.target.files[0]);
            }
          }}
        />
        <label htmlFor="file" className="flex justify-center items-center flex-col p-5  cursor-pointer">
          {video ? (
            <h3 className="font-bold">
              <span className="block text-center">{video.name}</span>
              <span className="block mt-5 text-center">
                حجم الفيديو :
                <br />
                {(video.size / 1024 / 1024).toFixed(2)}MB
              </span>
              <span className="block bg-gray-300 p-2 rounded-xl text-black mx-auto text-center mt-5 font-bold">انقر لاختيار فيديو اخر</span>
            </h3>
          ) : (
            <>
              <BsUpload className="text-5xl" />
              <h3 className="text-lg font-bold mt-3">اختيار فيديو من الجهاز</h3>
            </>
          )}
        </label>
      </div>
      {/* End Input File */}

      {/* Start Upload Button */}
      <div>
        <Button
          isDisabled={!video}
          isLoading={startLoading == "start"}
          color="primary"
          variant="shadow"
          className="mt-5 flex justify-center items-center w-[300px] max-w-full h-fit p-3 text-xl font-bold"
          onClick={async () => {
            if (inputFileRef.current) {
              setStartLoading("start");
              const inputEle = inputFileRef.current as HTMLInputElement;

              if (inputEle.files) {
                // Check Video State
                if (video) {
                  const formData = new FormData();
                  formData.append("file", video);

                  try {
                    const message: any = await axios.post(
                      `/api/video?courseId=${courseId}&sectionId=${sectionId}&partOfSectionId=${partOfSectionId}&mediaSectionId=${mediaSectionId}&videoId=${testId}`,
                      formData,
                      {
                        onUploadProgress: (progressEvent: any) => {
                          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                          setValueOfLoader(percentCompleted);
                        },
                      }
                    );

                    if (message.request.status === 200) {
                      setReload(!reload);
                      Toast.fire({
                        title: message.data.message,
                        icon: "success",
                      });
                    } else {
                      Toast.fire({
                        title: message.response.data.message,
                        icon: "error",
                      });
                    }
                  } catch (error: any) {
                    console.log(error);
                    Toast.fire({
                      title: error.response.data.message,
                      icon: "error",
                    });
                  }
                }
              }
            }
            setStartLoading("finish");
          }}
        >
          تحميل
        </Button>
      </div>
      {/* End Upload Button */}

      {/* Start Progress Bar */}
      {startLoading == "start" && (
        <div className="w-full grid gap-5">
          <Progress
            size="lg"
            radius="sm"
            showValueLabel={true}
            color="success"
            label="يتم التحميل ..."
            aria-label="Loading..."
            value={valueOfLoader}
            className="w-full"
          />
          <h3 className="text-xl font-bold text-red-600 my-5 text-center">يرجى عدم مغادرة الصفحة حتى انتهاء التحميل</h3>
        </div>
      )}
      {/* End Progress Bar */}
    </>
  );
};

export default UploadVideo;
