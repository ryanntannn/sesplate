"use client";

import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientPage({
  token,
  state,
}: {
  token: string;
  sub: string;
  state?: string;
}) {
  console.log(token);
  setCookie("token", token);
  const router = useRouter();

  useEffect(() => {
    if (!state || !router) return;
    try {
      const redirectUrl = JSON.parse(state || "{}").redirectUrl || "/";
      router.replace(redirectUrl);
    } catch (e) {
      router.replace("/");
    }
  }, [router, state]);

  return <div>redirecting...</div>;
}
