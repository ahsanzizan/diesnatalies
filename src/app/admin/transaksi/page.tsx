import { convertTZ } from "@/lib/dateUtils";
import { numberWithCommas } from "@/lib/numberUtils";
import { prisma } from "@/lib/prisma";
import { getAllTransaksi } from "@/lib/queries/transaksiQueries";
import { DateTime } from "luxon";
import Link from "next/link";

export default async function AllKasir() {
  const getAll = await getAllTransaksi();
  const getTotal = getAll
    ?.map((transaksi) => transaksi.totalPesanan)
    .reduce((partialSum, a) => partialSum + a, 0);

  return (
    <>
      <div className="flex flex-col overflow-x-auto h-full mb-4">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
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
                      Kasir
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Stand
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getAll?.map((transaksi, i) => {
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
                          <Link
                            href={`/admin/kasir/${transaksi.user.id}`}
                            className="text-blue-500 hover:underline hover:text-blue-700"
                          >
                            {transaksi.user.username}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <Link
                            href={`/admin/stand/${transaksi.stand.id}`}
                            className="text-blue-500 hover:underline hover:text-blue-700"
                          >
                            Stand {transaksi.stand.nomorStand}
                          </Link>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {convertedToWIB.toFormat("yyyy-MM-dd HH:mm:ss a")}
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
      <p>
        Total Transaksi:{" "}
        <span className="font-bold">
          Rp. {numberWithCommas(getTotal as number)}
        </span>
      </p>
    </>
  );
}

export const revalidate = 0;
