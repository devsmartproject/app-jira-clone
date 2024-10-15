import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { setCookie } from "hono/cookie";
import { loginSchema, registerSchema } from "../shemas";
import { createAdminCliente } from "@/lib/appwrite";
import { ID } from "node-appwrite";
import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = await c.req.valid("json");

    const { account } = await createAdminCliente();
    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { name, email, password } = await c.req.valid("json");

    const { account } = await createAdminCliente();
    await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, session.secret, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  });
export default app;
