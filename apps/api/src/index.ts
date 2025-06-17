import { Elysia, t } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

import { otel } from "@api/modules";
import { db } from "./lib/db";
import { chat } from "./modules/chat";
import { auth } from "./lib/auth";

export const app = new Elysia()
  .mount(auth.handler)
  .use(swagger())
  .use(otel)
  .use(chat)
  .use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  )
  .get("/", () => "Hello Elysia")
  .listen(Bun.env.PORT ?? 3000);

export type app = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
