import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

import { otel } from "@api/modules";
import { db } from "./lib/db";
import { chat } from "./modules/chat";

export const app = new Elysia()
  .use(swagger())
  .use(otel)
  .use(chat)
  .use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  )
  .get("/", () => "Hello Elysia")
  .post("sign-up", async () => {
    const total = await db.post.count();
    await db.post.create({
      data: {
        message: `Hi - Post ID: ${total}`,
      },
    });
  })
  .listen(Bun.env.PORT ?? 3000);

export type app = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
