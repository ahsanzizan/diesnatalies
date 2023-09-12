import Link from "next/link";
import DeleteButton from "./components/DeleteButton";
import { getAllStand } from "@/lib/queries/standQueries";

export default async function AllKasir() {
  const stands = await getAllStand();

  return (
    <>
      <div className="flex flex-col overflow-x-auto h-full">
        <div className="sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-x-auto">
              <Link
                href={"/admin/stand/new"}
                className="inline-flex items-center gap-2 py-2 px-4 bg-gray-300 hover:bg-gray-400 transition-all font-semibold rounded-md"
              >
                Add Stand
              </Link>
              <table className="min-w-full text-left text-sm">
                <thead className="border-b font-medium dark:border-neutral-500">
                  <tr>
                    <th scope="col" className="px-6 py-4">
                      Nomor Stand
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Pemilik
                    </th>
                    <th scope="col" className="px-6 py-4">
                      HP
                    </th>
                    <th scope="col" className="px-6 py-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stands?.map((stand, i) => {
                    return (
                      <tr className="border-b dark:border-neutral-500" key={i}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {stand.nomorStand}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {stand.pemilik}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {stand.noHp}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 flex gap-1">
                          <Link
                            href={`/admin/stand/edit/${stand.id}`}
                            className="bg-sky-500 hover:bg-sky-600 py-2 px-4 rounded-md font-bold"
                          >
                            Edit
                          </Link>
                          <DeleteButton id={stand.id} />
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
