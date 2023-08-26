import { unsealData } from "iron-session";


export async function getRequestCookie(cookies: any): Promise<any> {
  const cookieName = process.env.COOKIE_NAME;
  const found = cookies.get(cookieName);

  if (!found) return null;
  const { state } = await unsealData(found.value, {
    password: process.env.COOKIE_PASSWORD as string,
  });
  return state;
}
