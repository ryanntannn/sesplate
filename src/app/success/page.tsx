import { store } from "@/lib/store";
import { sgidClient } from "@/lib/sgidClient";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/jwt";
import ClientPage from "./ClientPage";

const getAndStoreUserInfo = async (code: string, sessionId: string) => {
  const session = store.get(sessionId);

  if (!session) {
    throw new Error("Session not found");
  }

  const { nonce, codeVerifier } = session;

  if (!codeVerifier) {
    throw new Error("Code verifier not found");
  }

  // Exchange auth code for access token
  const { sub } = await sgidClient.callback({
    code,
    nonce,
    codeVerifier,
  });

  const token = await generateToken(sub);

  return {
    ...session,
    sub,
    token,
  };
};

export default async function Redirect({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  // Auth code is retrieved from the URL search params
  const code = searchParams?.code;
  const sessionId = cookies().get("sessionId")?.value;
  if (!code) {
    throw new Error(
      "Authorization code is not present in the url search params"
    );
  } else if (!sessionId) {
    throw new Error("Session ID not found in browser's cookies");
  }
  const { state, sub, token } = await getAndStoreUserInfo(code, sessionId);
  // HTML page is generated in the server
  return <ClientPage state={state} token={token} sub={sub} />;
}
