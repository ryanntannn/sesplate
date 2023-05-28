import { retrieveAndVerifyIdentity } from "@/lib/jwt";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const identity = retrieveAndVerifyIdentity();
  return (
    <>
      <Link prefetch={false} href={`/login?state=any`}>
        {!identity && <button>Login with Singpass app</button>}
        {identity && (
          <div>
            Logged in as {identity.callsign}, sgid: {identity.sgid}
          </div>
        )}
      </Link>
    </>
  );
}
