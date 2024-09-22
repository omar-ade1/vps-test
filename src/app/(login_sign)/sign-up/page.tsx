
import React from "react";
import SignUpPage from "./SignPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SignUpContainer = () => {
  
  const token = cookies().get("jwtToken")?.value as string;

  if (token) {
    redirect("/");
  }

  return (
    <div>
      <SignUpPage />
    </div>
  );
};

export default SignUpContainer;
