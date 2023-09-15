import { getAllStands } from "@/lib/queries/standQueries";
import { getAllTransaksi } from "@/lib/queries/transaksiQueries";
import { getAllUsers } from "@/lib/queries/userQueries";
import Link from "next/link";

export default async function AdminPage() {
  const users = await getAllUsers();
  const stands = await getAllStands();
  const standsCount = stands.length;
  const kasirsCount = users.filter((user) => user.role == "KASIR").length;
  const transaksis = await getAllTransaksi();
  const transaksisCount = transaksis.length;

  return (
    <>
      <h1 className="font-bold text-xl md:text-3xl mb-10">Dashboard Admin</h1>
      <div className="flex justify-between flex-wrap gap-10 md:gap-0">
        <Link
          href="/admin/kasir"
          className="transition duration-300 w-full md:w-[32%] py-10 border border-red-500 text-white bg-red-500 rounded-md text-center hover:bg-white hover:text-red-500"
        >
          <h1 className="font-bold text-lg md:text-2xl mb-1">{kasirsCount}</h1>
          <p>Kasir</p>
        </Link>
        <Link
          href="/admin/stand"
          className="transition duration-300 w-full md:w-[32%] py-10 border border-red-500 text-white bg-red-500 rounded-md text-center hover:bg-white hover:text-red-500"
        >
          <h1 className="font-bold text-lg md:text-2xl mb-1">{standsCount}</h1>
          <p>Stand</p>
        </Link>
        <Link
          href="/admin/transaksi"
          className="transition duration-300 w-full md:w-[32%] py-10 border border-red-500 text-white bg-red-500 rounded-md text-center hover:bg-white hover:text-red-500"
        >
          <h1 className="font-bold text-lg md:text-2xl mb-1">
            {transaksisCount}
          </h1>
          <p>Jumlah Transaksi</p>
        </Link>
      </div>
    </>
  );
}
