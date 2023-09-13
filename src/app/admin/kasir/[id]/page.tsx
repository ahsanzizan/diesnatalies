import { getAllStands } from "@/lib/queries/standQueries";
import { getAllUsers } from "@/lib/queries/userQueries";
import { DateTime } from "luxon";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ViewKasir({ params }: any) {
  const id = Number(params.id);
  const getUsers = await getAllUsers();
  const getStands = await getAllStands();
  const user = getUsers.find((user) => user.id == id);
  const getTotal = user?.transaksis
    .map((transaksi) => transaksi.totalPesanan)
    .reduce((partialSum, a) => partialSum + a, 0);

  if (!user || user.role == "ADMIN") {
    return redirect("/admin/kasir");
  }

  return (
    <>
      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
            Username
          </label>
          <p className="appearance-none block w-full text-gray-700 rounded py-3 mb-3 leading-tight focus:outline-none focus:bg-white">
            {user?.username}
          </p>
        </div>
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
            Email
          </label>
          <p className="appearance-none block w-full text-gray-700 rounded py-3 mb-3 leading-tight focus:outline-none focus:bg-white">
            {user?.email}
          </p>
        </div>
        <div className="w-full px-3 mb-6 md:mb-0">
          <label className="block uppercase tracking-wide text-gray-700 text-sm font-bold mb-2">
            Phone Number
          </label>
          <p className="appearance-none block w-full text-gray-700 rounded py-3 mb-3 leading-tight focus:outline-none focus:bg-white">
            {user?.noHp}
          </p>
        </div>
      </div>
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
                      Stand
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {user?.transaksis?.map((transaksi, i) => {
                    const findStand = getStands.find(
                      (stand) => stand.id == transaksi.idStand
                    );

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
                            href={`/admin/stand/${transaksi.idStand}`}
                            className="text-blue-500 hover:underline hover:text-blue-700"
                          >
                            Stand {findStand?.nomorStand}
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
        Total Transaksi : <span className="font-bold">{getTotal}</span>
      </p>
    </>
  );
}
