import { useSession } from "next-auth/react";

export default function KasirPage() {
  const { data: session, status } = useSession();

  return <>{session?.user?.name}</>;
}
