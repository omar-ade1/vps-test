// src/app/components/ServerTokenCheck.tsx
import { cookies } from "next/headers";
import { tokenInfo } from "@/app/utils/tokenVerify";
import { jwtPayLoad } from "@/app/utils/interfaces/jwtPayload";

export async function ServerTokenCheck() {
  const token = cookies().get("jwtToken")?.value;
  if (!token) {
    return null;
  }

  const verfiyToken = tokenInfo() as jwtPayLoad;
  return verfiyToken;
}
