"use client";
import { Stand } from "@prisma/client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function CreateTransaksi() {
  const { data: session, status } = useSession();
  const [data, setData] = useState({
    nomorPesanan: "",
    totalPesanan: "",
    nomorStand: "",
  });
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [stands, setStands] = useState<Stand[] | null>();
  const [nomorPesanan, setNomorPesanan] = useState<string>("");
  const [trannsaksisCount, setTrannsaksisCount] = useState<number>(0);

  useEffect(() => {
    async function getStands() {
      try {
        const getAll = await fetch("/api/stand").then((res) => res.json());
        setStands(getAll?.stands);
      } catch (error: any) {
        toast.error(error);
      }
    }

    async function getUser() {
      try {
        const getUser = await fetch(`/api/user?id=${session?.user?.id}`).then(
          (res) => res.json()
        );

        if (getUser.transaksis[getUser.transaksis.length - 1]) {
          setTrannsaksisCount(Number(getUser.transaksis[getUser.transaksis.length - 1].nomorPesanan.split("-")[1]));
        }
      } catch (error: any) {
        toast.error(error);
      }
    }

    getStands();
    if (data.nomorStand != "") {
      setNomorPesanan(`${data.nomorStand}-${trannsaksisCount + 1}`);
    }
  }, [data.nomorStand, session?.user?.id, trannsaksisCount]); 

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formData = new FormData();

    formData.append("nomorPesanan", nomorPesanan);
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
              type="text"
              name="nomorPesanan"
              required
              disabled
              value={nomorPesanan}
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
              onChange={handleChange}
            />
          </div>
          <div className="w-full px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
              Nomor Stand
            </label>
            <select
              name="nomorStand"
              required
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              onChange={(e) => setData({ ...data, nomorStand: e.target.value })}
            >
              <option value="" disabled selected>
                Pilih Nomor Stand
              </option>
              {stands?.map((stand, i) => (
                <option value={stand.nomorStand} key={i}>
                  {stand.nomorStand}
                </option>
              ))}
            </select>
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
