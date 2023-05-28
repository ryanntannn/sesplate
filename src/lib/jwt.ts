import { cookies } from "next/headers";
import prisma from "./prisma";
import jwt from "jsonwebtoken";

export type DecodedToken = jwt.JwtPayload & {
  sgid: string;
  callsign: string | null;
};

/**
 * @description Generates a JWT for the user with the given sub, creating a new user if necessary.
 */
export async function generateToken(openid: string) {
  const registeredUser = await prisma.user.findFirst({
    where: {
      sgid: openid,
    },
  });

  const user =
    registeredUser ||
    (await prisma.user.create({
      data: {
        sgid: openid,
      },
    }));

  //Sign a jwt containing the user's sgid and set it as a cookie
  return jwt.sign(
    { sgid: openid, callsign: user.callsign },
    process.env.JWT_SECRET || "",
    {
      expiresIn: "1h",
    }
  );
}

/**
 * @description Returns the user's identity if they have a valid JWT, otherwise null.
 */
export function retrieveAndVerifyIdentity() {
  const token = cookies().get("token")?.value;
  if (!token) return null;
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
  if (typeof decoded === "string") {
    return null;
  }
  return decoded as DecodedToken;
}
