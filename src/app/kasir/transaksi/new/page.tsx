"use client";
import { redirect } from "next/navigation";
import { useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function CreateTransaksi() {
  const [data, setData] = useState({
    nomorPesanan: "",
    totalPesanan: "",
    nomorStand: "0",
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

    formData.append("nomorPesanan", data.nomorPesanan);
    formData.append("totalPesanan", data.totalPesanan);
    formData.append("nomorStand", data.nomorStand);

    try {
      setLoading(true);

      const sendData = await fetch("/api/transaksi", {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (sendData.message == "success") {
        toast.success("Data sent successfully", { id: toastId });
        setSuccess(true);
      } else if (sendData.message == "nomorPesanan already exist") {
        toast.error("Nomor Pesanan already existed", { id: toastId });
      } else if (sendData.message == "stand doesn't exist") {
        toast.error("Stand doesn't exist", { id: toastId });
      } else {
        console.log(sendData);
        toast.error("Something went wrong", { id: toastId });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (success) {
    return redirect("/kasir/transaksi");
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Nomor Pesanan
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="nomorPesanan"
              required
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Total Pesanan
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="totalPesanan"
              required
              step={100}
              onChange={handleChange}
            />
          </div>
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
