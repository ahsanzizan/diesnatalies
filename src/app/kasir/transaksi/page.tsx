import Link from "next/link";
import DeleteButton from "./components/DeleteButton";
import { getAllTransaksi } from "@/lib/queries/transaksiQueries";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DateTime } from "luxon";

export default async function AllTransaksi() {
  const session = await getServerSession(authOptions);
  const getAll = await getAllTransaksi();
  const filtered = getAll?.filter(
    (transaksi) => transaksi.idUser == Number(session?.user?.id)
  );

  return (
    <>
      <div className="flex flex-col overflow-x-auto h-full">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              <Link
                href={"/kasir/transaksi/new"}
                className="inline-flex items-center gap-2 py-2 px-4 bg-gray-300 hover:bg-gray-400 transition-all font-semibold rounded-md"
              >
                Add Transaksi
              </Link>
              <table className="min-w-full text-left text-sm">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Nomor Pesanan
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Total Pesanan
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Stand
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Time
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered?.map((transaksi, i) => {
                    const timestamp = DateTime.fromISO(
                      transaksi.timestamp.toISOString()
                    );

                    const convertedToWIB = timestamp.setZone("Asia/Jakarta");

                    return (
                      <tr className="border-b dark:border-neutral-500" key={i}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {transaksi.nomorPesanan}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {transaksi.totalPesanan}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          Stand {transaksi.stand.nomorStand}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {convertedToWIB.toFormat("yyyy-MM-dd HH:mm:ss a")}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 flex gap-1">
                          <Link
                            href={`/kasir/transaksi/edit/${transaksi.id}`}
                            className="bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded-md font-bold"
                          >
                            Edit
                          </Link>
                          <DeleteButton id={transaksi.id} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const revalidate = 0;
