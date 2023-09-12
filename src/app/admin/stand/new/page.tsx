"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function CreateStand() {
  const [data, setData] = useState({
    nomorStand: "",
    pemilik: "",
    noHp: "",
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

    formData.append("nomorStand", data.nomorStand);
    formData.append("pemilik", data.pemilik);
    formData.append("noHp", data.noHp);

    try {
      setLoading(true);

      const sendData = await fetch("/api/stand", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (sendData.message == "success") {
        toast.success("Data sent successfully", { id: toastId });
        setSuccess(true);
      } else if (sendData.message == "nomorStand already exist") {
        toast.error("Nomor stand already exist", { id: toastId });
      } else {
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error, { id: toastId });
    }
  }

  if (success) {
    setSuccess(false);
    return redirect("/admin/stand");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Nomor Stand
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="nomorStand"
              required
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Pemilik
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="text"
              name="pemilik"
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
