import { Inputs_Sign } from "@/app/utils/interfaces/inputsSign";
import axios from "axios";

export const SIGN_UP = async (inputsValues:Inputs_Sign) => {
  try {
    const res = await axios.post(`/api/sign-up`, {
      userName: inputsValues.userName,
      email: inputsValues.email,
      tel: inputsValues.tel,
      password: inputsValues.password,
    });

    return res;

    // While Error
  } catch (error) {
    return error;
  }
};
