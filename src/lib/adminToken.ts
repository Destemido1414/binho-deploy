import { SignJWT, jwtVerify } from "jose";

export type AdminTokenPayload = {
  sub: string;
  email: string;
};

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("Missing AUTH_SECRET");
  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminTokenPayload) {
  return await new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: ["HS256"],
  });

  if (typeof payload.sub !== "string" || typeof payload.email !== "string") {
    throw new Error("Invalid token payload");
  }

  return { sub: payload.sub, email: payload.email } satisfies AdminTokenPayload;
}

