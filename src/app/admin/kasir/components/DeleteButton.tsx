"use client";

import { redirect } from "next/navigation";
import toast from "react-hot-toast";

type DeleteButtonProps = {
  id: number;
};

export default function DeleteButton({ id }: DeleteButtonProps) {
  async function handleDelete(e: React.FormEvent) {
    const toastId = toast.loading("Loading...");

    try {
      const deleteData = await fetch(`/api/user?id=${id}`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (deleteData.status != 200) {
        toast.error("Something wrong", { id: toastId });
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
      <button
        onClick={handleDelete}
        className="bg-red-500 hover:bg-red-600 py-2 px-4 rounded-md font-bold"
      >
        Delete
      </button>
    </>
  );
}
