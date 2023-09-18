"use client";
import { Stand, Transaksi } from "@prisma/client";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function EditTransaksi() {
  const pathname = usePathname().split("/");
  const id = Number(pathname[pathname.length - 1]);
  const [success, setSuccess] = useState<boolean>(false);

  const [data, setData] = useState<{
    totalPesanan: string | undefined;
  }>({
    totalPesanan: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getTransaksi() {
      try {
        const fetchData = await fetch(`/api/transaksi`).then((res) =>
          res.json()
        );

        const getTransaksis: Transaksi[] = fetchData.transaksis;
        getTransaksis.every((transaksi) => {
          if (transaksi.id == id) {
            console.log(transaksi);
            setData({
              totalPesanan: transaksi.totalPesanan.toString(),
            });

            return false;
          }

          return true;
        });
      } catch (error) {
        console.log(error);
      }
    }

    getTransaksi();
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formData = new FormData();

    formData.append("totalPesanan", data.totalPesanan as string);

    try {
      setLoading(true);

      const sendData = await fetch(`/api/transaksi?id=${id}`, {
        method: "PUT",
        body: formData,
      }).then((res) => res.json());

      if (sendData.message == "success") {
        toast.success("Data sent successfully", { id: toastId });
        setSuccess(true);
      } else if (sendData.message == "username already in use") {
        toast.error("username already in use", { id: toastId });
      } else {
        setLoading(false);
        toast.error("Something wrong", { id: toastId });
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
              Total Pesanan
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="totalPesanan"
              defaultValue={data.totalPesanan}
              required
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
