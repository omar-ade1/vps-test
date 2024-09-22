
import React from "react";
import LoginPage from "./LoginPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const LoginContainer = () => {
  const token = cookies().get("jwtToken")?.value as string;

  if (token) {
    redirect("/")
  }

  return (
    <div>
      <LoginPage />
    </div>
  );
};

export default LoginContainer;
