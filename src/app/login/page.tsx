import { redirect } from "next/navigation";
import { sgidClient } from "@/lib/sgidClient";
import { cookies } from "next/headers";
import { store } from "@/lib/store";
import { generatePkcePair } from "@opengovsg/sgid-client";

const handleLogin = async (state: string) => {
  const sessionId = cookies().get("sessionId")?.value || "";

  if (!sessionId) {
    throw new Error("Session ID not found in browser's cookies");
  }

  // Generate PKCE pair
  const { codeChallenge, codeVerifier } = generatePkcePair();

  // Generate authorization url
  const { url, nonce } = sgidClient.authorizationUrl({
    state,
    codeChallenge,
    scope: "openid",
  });

  // Store code verifier, state, and nonce in memory
  store.set(sessionId, { state, codeVerifier, nonce });

  redirect(url);
};

export default async function Login({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  await handleLogin(searchParams?.state || "");
  return <></>;
}
