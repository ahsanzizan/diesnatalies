import { authOptions } from "@/lib/auth";
import { getAllStands } from "@/lib/queries/standQueries";
import { getAllTransaksi } from "@/lib/queries/transaksiQueries";
import { getAllUsers } from "@/lib/queries/userQueries";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function KasirPage() {
  const session = await getServerSession(authOptions);
  const transaksis = await getAllTransaksi();
  const filteredTransaksi = transaksis.filter(
    (transaksi) => transaksi.idUser == Number(session?.user?.id)
  );
  const transaksisCount = filteredTransaksi.length;

  return (
    <>
      <h1 className="font-bold text-xl md:text-3xl mb-10">Dashboard Kasir</h1>
      <div className="flex justify-between flex-wrap gap-10 md:gap-0">
        <Link
          href="/kasir/transaksi"
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
