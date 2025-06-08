import { axiosClient, setAxiosAuthHeader } from "@/lib/httpClient";
import { authAtom } from "@/state/authAtom";
import type { AxiosError, AxiosResponse } from "axios";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { toast } from "sonner";

export function useSignup() {
  const navigate = useNavigate();
  const setUser = useSetRecoilState(authAtom);
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
    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      if (response.status === 201) {
        const { accessToken, username, userEmail } = response.data;

        setAxiosAuthHeader(accessToken);

        setUser({
          accessToken,
          username,
          email: userEmail,
        });

        localStorage.setItem(
          "accountState",
          JSON.stringify({
            accessToken,
            username,
            email: userEmail,
          })
        );

        toast.success("Login successful! 🎉 ");
        navigate("/");
      }
    } catch (error) {
      const axiosError = error as AxiosError;

      const errorResponseData = axiosError.response?.data as
        | {
            error?: string;
            message?: string;
            statusCode?: number;
          }
        | undefined;

      const errorMessage =
        errorResponseData?.message || "Something went wrong! Please try again.";

      toast.error(errorMessage);
    }
  }, []);
  return { signup, login };
}
