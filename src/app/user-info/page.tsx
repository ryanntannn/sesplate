import { store } from "@/lib/store";
import { cookies } from "next/headers";

const getUserInfo = async (sessionId: string) => {
  // Retrieve session from memory
  const session = store.get(sessionId);
  if (!session) {
    throw new Error("No session found");
  }
  return session;
};

export default async function LoggedIn() {
  const sessionId = cookies().get("sessionId")?.value;

  if (!sessionId) {
    throw new Error("Session ID not found in browser's cookies");
  }

  const { sub, userInfo } = await getUserInfo(sessionId);

  if (!sub || !userInfo) {
    throw new Error("User has not authenticated");
  }

  return (
    <div>
      <div>User Info</div>

      {sub ? <div>{`sgID: ${sub}`}</div> : null}
      {Object.entries(userInfo ?? {}).map(([field, value]) => (
        <div key={value}>{`${field}: ${value}`}</div>
      ))}
    </div>
  );
}
