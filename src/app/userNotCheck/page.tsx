"use client";

import { Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";
import { SEND_NEW_REQUEST } from "../fetchApi/requestCourse/addNewRequest";
import Swal from "sweetalert2";

const UserNotCheck = () => {
  const statusOfUser = useSearchParams().get("status");
  const courseId = useSearchParams().get("courseId");
  const [status, setStatus] = useState<string>(statusOfUser || "");
  const [isLoading, setIsLoading] = useState(false);
  const sendRequest = async () => {
    setIsLoading(true);
    if (courseId && statusOfUser) {
      const message: any = await SEND_NEW_REQUEST(courseId);
      if (message.request.status === 200) {
        Swal.fire({
          title: message.data.message,
          icon: "success",
        });
        setStatus("Pending");
      } else {
        Swal.fire({
          title: message.response.data.message,
          icon: "error",
        });
      }
    } else {
      Swal.fire({
        title: "خطأ",
        text: "عذرا، لم يتم العثور على الدورة أو على حالة التسجيل",
        icon: "error",
      });
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-[calc(100vh-64px)] py-[50px] relative">
      <div className="container">
        <h2 className="text-xl font-bold text-center">انت غير مسجل في هذه الدورة</h2>
        <div>
          <Button
            onClick={sendRequest}
            isLoading={isLoading}
            isDisabled={status === "Pending"}
            size="lg"
            color="primary"
            className="text-lg font-bold p-5 h-fit block mx-auto mt-5"
          >
            {status === "Pending" ? "لقد ارسلت طلبا بالفعل في انتظار الموافقة عليه" : "ارسال طلب انضمام"}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default UserNotCheck;
