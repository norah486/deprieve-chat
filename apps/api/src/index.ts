import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { cors } from "@elysiajs/cors";

import { otel } from "@api/modules";

export const app = new Elysia()
  .use(swagger())
  .use(otel)
  .use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  )
  .get("/", () => "Hello Elysia")
  .listen(Bun.env.PORT ?? 3000);

export type app = typeof app;

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
