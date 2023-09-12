"use client";
import { Stand } from "@prisma/client";
import { redirect, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import toast from "react-hot-toast";

export default function EditKasir() {
  const pathname = usePathname().split("/");
  const id = Number(pathname[pathname.length - 1]);

  const [data, setData] = useState<{
    nomorStand: string | undefined;
    pemilik: string | undefined;
    noHp: string | undefined;
  }>({
    nomorStand: "",
    pemilik: "",
    noHp: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getStand() {
      try {
        const fetchData = await fetch(`/api/stand`).then((res) => res.json());

        const getStands: Stand[] = fetchData.stands;
        getStands.every((stand) => {
          if (stand.id == id) {
            setData({
              nomorStand: stand.nomorStand.toString(),
              pemilik: stand.pemilik,
              noHp: stand.noHp,
            });

            return false;
          }

          return true;
        });
      } catch (error) {
        console.log(error);
      }
    }

    getStand();
  }, [id]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const toastId = toast.loading("Loading...");
    const formData = new FormData();

    formData.append("nomorStand", data.nomorStand as string);
    formData.append("pemilik", data.pemilik as string);
    formData.append("noHp", data.noHp as string);

    try {
      setLoading(true);

      const sendData = await fetch(`/api/stand?id=${id}`, {
        method: "PUT",
        body: formData,
      }).then((res) => res.json());

      if (sendData.message != "success") {
        setLoading(false);
        toast.error("Something went wrong", { id: toastId });
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
              Nomor Stand
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              type="number"
              name="nomorStand"
              required
              defaultValue={data.nomorStand}
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
              defaultValue={data.pemilik}
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
              defaultValue={data.noHp}
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
