"use client";
import { User } from "@prisma/client";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function EditKasir() {
  const pathname = usePathname().split("/");
  const id = Number(pathname[pathname.length - 1]);

  const [data, setData] = useState<{
    username: string | undefined;
    email: string | undefined;
    noHp: string | undefined;
    password: string | undefined;
    role: string | undefined;
  }>({
    username: "",
    email: "",
    noHp: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getAllKasirs() {
      try {
        const fetchData = await fetch(`/api/user`).then((res) => res.json());
        console.log(fetchData.status);

        const getUsers: User[] = fetchData.users;
        const getKasirs = getUsers.filter((user) => user.role == "KASIR");
        getKasirs.every((kasir) => {
          if (kasir.id == id) {
            setData({
              username: kasir.username,
              email: kasir.email,
              noHp: kasir.noHp,
              password: kasir.password,
              role: kasir.role,
            });

            return false;
          }

          return true;
        });
      } catch (error) {
        console.log(error);
      }
    }

    getAllKasirs();
  }, [id]);

  if (data.role == "ADMIN") {
    return redirect("/admin");
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formData = new FormData();

    formData.append("username", data.username as string);
    formData.append("email", data.email as string);
    formData.append("noHp", data.noHp as string);
    formData.append("password", data.password as string);

    try {
      setLoading(true);

      const sendData = await fetch(`/api/user?id=${id}`, {
        method: "PUT",
        body: formData,
      }).then((res) => res.json());

      if (sendData.message != "success") {
        setLoading(false);
        toast.error("Something wrong", { id: toastId });
        console.log(sendData);
      } else {
        toast.success("Data sent successfully", { id: toastId });
        return redirect("/admin/kasir");
      }
    } catch (error) {
      console.log(error);
    }
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
              defaultValue={data.username}
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
              defaultValue={data.email}
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
              defaultValue={data.noHp}
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Password (New Password)
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="password"
              name="password"
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-sm transition duration-300"
        >
          Save
        </button>
      </form>
    </>
  );
}
