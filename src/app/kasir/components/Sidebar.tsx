import Link from "next/link";

type SidebarOptions = {
  nav: boolean;
};

export default function Sidebar({ nav }: SidebarOptions) {
  return (
    <aside
      id="sidebar"
      className={`fixed ${
        nav ? "w-64" : "w-0 opacity-0"
      } z-20 h-full top-0 left-0 pt-16 lg:w-64 lg:opacity-100 flex flex-shrink-0 flex-col transition-all duration-300`}
      aria-label="Sidebar"
    >
      <div className="relative flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white pt-0">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex-1 px-3 bg-white divide-y space-y-1">
            <ul className="space-y-2 pb-2">
              <li>
                <Link
                  href="/kasir"
                  className="text-base text-gray-900 font-normal rounded-lg flex items-center p-2 hover:bg-gray-100 group"
                >
                  <svg
                    className="w-6 h-6 text-gray-500 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                  </svg>
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/kasir/transaksi"
                  className="text-base text-gray-900 font-normal rounded-lg hover:bg-gray-100 flex items-center p-2 group "
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    className="w-6 h-6 text-gray-500 flex-shrink-0 group-hover:text-gray-900 transition duration-75"
                    fill="currentColor"
                    stroke="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 8.50494H22"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 16.5049H8"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 16.5049H14.5"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.44 3.50494H17.55C21.11 3.50494 22 4.38494 22 7.89494V16.1049C22 19.6149 21.11 20.4949 17.56 20.4949H6.44C2.89 20.5049 2 19.6249 2 16.1149V7.89494C2 4.38494 2.89 3.50494 6.44 3.50494Z"
                      strokeWidth="1.5"
                      strokeMiterlimit="round"
                      strokeLinecap="round"
                    />
                  </svg>
                  
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    Transaksi Saya
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
