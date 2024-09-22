import { DOMAIN_NAME } from "@/app/utils/domainName";
import { Inputs_Sign } from "@/app/utils/interfaces/inputsSign";
import axios from "axios";

export const Login_USER = async (inputsValues: Inputs_Sign) => {
  try {
    const res = await axios.post(`${DOMAIN_NAME}/api/login`, {
      email: inputsValues.email,
      password: inputsValues.password,
    });

    return res;

    // While Error
  } catch (error) {
    return error;
  }
};
