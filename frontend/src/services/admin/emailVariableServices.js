import axiosClient from "../api";

export const emailVariableServices = {
  getAllVariables: async () => {
    const res = await axiosClient.get("admin/email-variables");
    return res.data;
  }
};