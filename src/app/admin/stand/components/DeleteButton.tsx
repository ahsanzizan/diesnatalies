"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

type DeleteButtonProps = {
  id: number;
};

export default function DeleteButton({ id }: DeleteButtonProps) {
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();

  async function handleDelete(e: React.FormEvent) {
    const toastId = toast.loading("Loading...");

    try {
      const deleteData = await fetch(`/api/stand?id=${id}`, {
        method: "DELETE",
      }).then((res) => res.json());

      if (deleteData.message != "success") {
        toast.error("Something wrong", { id: toastId });
      } else {
        setSuccess(true);
        toast.success("Data sent successfully", { id: toastId });
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (success) {
    router.refresh();
    setSuccess(false);
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
