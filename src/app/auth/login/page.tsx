"use client";

import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useState } from "react";
import type { ChangeEvent } from "react";

export default function Login() {
  const { data: session, status } = useSession();
  const [formValues, setFormValues] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  if (status == "authenticated" && session.user?.role == "ADMIN")
    return redirect("/admin");

  if (status == "authenticated" && session.user?.role == "KASIR")
    return redirect("/kasir");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    try {
      setLoading(true);
      const res = await signIn("credentials", {
        redirect: false,
        username: formValues.username,
        password: formValues.password,
        callbackUrl: "/",
      });

      if (res?.error) {
        setLoading(false);
        toast.error(
          res.error == "CredentialsSignin"
            ? "Username/Password Salah"
            : "Internal server error",
          {
            id: toastId,
          }
        );
      } else {
        setLoading(false);
        toast.success("Login sukses", {
          id: toastId,
        });
      }
    } catch (error: any) {
      toast.error("Terjadi kesalahan", {
        id: toastId,
      });
    }
  };

  return (
    <section className="flex justify-center items-center h-screen bg-gray-100">
      <div className="max-w-md w-full md:bg-white rounded p-6 space-y-4">
        <form
          action="/api/auth/callback/credentials"
          method="POST"
          onSubmit={onSubmit}
          className="space-y-4"
        >
          <div>
            <input
              className="w-full p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="text"
              name="username"
              placeholder="username"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              className="w-full p-3 text-sm bg-gray-50 focus:outline-none border border-gray-200 rounded text-gray-600"
              type="password"
              name="password"
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="disabled:text-gray-200 disabled:bg-red-500 w-full py-2 bg-red-600 hover:bg-red-700 rounded text-sm font-bold text-gray-50 transition duration-200"
              disabled={loading}
            >
              <div>
                Masuk
                <div
                  className={`${
                    loading ? "inline-block" : "hidden"
                  } snap-center h-4 w-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]`}
                  role="status"
                >
                  <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                  </span>
                </div>
              </div>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
