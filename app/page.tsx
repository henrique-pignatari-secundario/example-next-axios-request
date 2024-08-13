"use client";

import { JWT_STORAGE_KEY } from "@/constants/keys";
import { api } from "@/lib/axios";
import { AxiosResponse } from "axios";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export default function Home() {
  const [formData, setFormData] = useState({ email: "", password: "" } as LoginFormData);
  const [message, setMessage] = useState("No message");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name: key, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePublicRequest = async () => {
    try {
      const { data } = await api.get("test/public");

      setMessage(data);
    } catch (e) {
      setMessage("Request failed");
    }
  };

  const handleProtectedRequest = async () => {
    try {
      const { data } = await api.get("test/protected");

      setMessage(data);
    } catch (e: any) {
      console.log(e.response.status === 403);
      if (e.response.status === 401 || e.response.status === 403) {
        setMessage("não autorizado");
      } else {
        setMessage("Request failed");
      }
    }
  };

  const handlePrivateRequest = async () => {
    try {
      const { data } = await api.get("test/private");
      setMessage(data);
    } catch (e: any) {
      if (e.response.status === 401 || e.response.status === 403) {
        setMessage("não autorizado");
      } else {
        setMessage("Request failed");
      }
    }
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const { email, password } = formData;

    try {
      const response = api.post("auth/login", {
        email,
        password,
      });

      toast.promise(response, {
        loading: "Fazendo login",
        success: "Login confirmado",
        error: "Falha no login",
      });

      const {
        data: { accessToken },
      } = (await response) as AxiosResponse<LoginResponse>;

      if (accessToken) {
        window.localStorage.setItem(JWT_STORAGE_KEY, accessToken);
      }
    } catch (e) {
      alert("login Failed");
    } finally {
      setFormData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <div className="flex flex-row items-center justify-center w-screen h-screen gap-4">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-2xl font-bold">Message: {message}</h1>
        <div className="flex flex-row gap-3">
          <button
            onClick={handlePublicRequest}
            className="w-36 h-10 rounded-lg fotn-white bg-green-400"
          >
            PUBLICA
          </button>
          <button
            onClick={handleProtectedRequest}
            className="w-36 h-10 rounded-lg fotn-white bg-blue-400"
          >
            PROTEGIDA
          </button>
          <button
            onClick={handlePrivateRequest}
            className="w-36 h-10 rounded-lg fotn-white bg-red-400"
          >
            PRIVADA
          </button>
        </div>
      </div>
      <form className="flex flex-col border py-4 px-4 rounded-md gap-4" onSubmit={handleLogin}>
        <p className="text-xl font-bold self-center">LOGIN</p>
        <div className="flex flex-col items-baseline">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="example@email.com"
            className="border rounded-md h-8 pl-2"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex flex-col items-baseline">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            placeholder="*******"
            className="border rounded-md h-8 pl-2"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="self-center w-36 h-10 rounded-lg fotn-white bg-orange-400">
          LOGAR
        </button>
      </form>
    </div>
  );
}
