import { axiosClient, setAxiosAuthHeader } from "@/lib/httpClient";
import type { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import { toast } from "sonner";

export function useSignup() {
  const signup = useCallback(
    async (email: string, username: string, password: string) => {
      const response = (await axiosClient
        .post("/auth/signup", {
          email,
          username,
          password,
        })
        .catch((error: AxiosError) => {
          const errorResponseData = error.response?.data as
            | {
                error?: string;
                message?: string;
                statusCode?: number;
              }
            | undefined;
          const errorMessage =
            errorResponseData?.message ||
            "Something went wrong! Please try again.";

          toast.error(errorMessage);
        })) as AxiosResponse;
      console.log(response);
      if (response.status === 201) {
        toast.success(
          "Signup successful! 🎉 You can now log in and start exploring."
        );

        return true;
      }
    },
    []
  );
  //   Todo: make changes (just for test as of now)
  const login = useCallback(async (email: string, password: string) => {
    const response = (await axiosClient
      .post("/auth/login", {
        email,
        password,
      })
      .catch((error: AxiosError) => {
        const errorResponseData = error.response?.data as
          | {
              error?: string;
              message?: string;
              statusCode?: number;
            }
          | undefined;
        const errorMessage =
          errorResponseData?.message ||
          "Something went wrong! Please try again.";

        toast.error(errorMessage);
      })) as AxiosResponse;
    console.log(response);
    if (response.status === 201) {
      console.log(response.data);
    }
    toast.success("Login successful! 🎉 ");
    setAxiosAuthHeader(response.data.accessToken);
  }, []);
  return { signup, login };
}
