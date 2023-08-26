import { PrismaClient } from "@prisma/client";

const getAdmins = async () =>{
  const prisma = new PrismaClient();
  const admins = await prisma.admin.findMany();
  console.log(admins);
  return admins;
}

export default async function Home() {
  const admins = await getAdmins();

  return (
    <main>
      
    </main>
  );
}
