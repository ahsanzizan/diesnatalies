"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function CreateKasir() {
  const [data, setData] = useState({
    username: "",
    email: "",
    noHp: "",
    password: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formData = new FormData();

    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("noHp", data.noHp);
    formData.append("password", data.password);

    try {
      setLoading(true);

      const sendData = await fetch("/api/user", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (sendData.message == "success") {
        setLoading(false);
        toast.success("Data sent successfully", { id: toastId });
        setSuccess(true);
      } else if (sendData.message == "email already in use") {
        toast.error("Email already in use", { id: toastId });
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (success) {
    return redirect("/admin/kasir");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="username"
              required
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="email"
              name="email"
              required
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Phone Number
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="noHp"
              required
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="password"
              name="password"
              required
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-sm transition duration-300"
        >
          Add
        </button>
      </form>
    </>
  );
}
