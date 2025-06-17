import { Elysia, t } from "elysia";
import { db } from "@api/lib/db";
import { app } from "@api";

export const chat = new Elysia()
  .ws("/chat", {
    async open(ws) {
      ws.subscribe("global");
    },
    async close(ws) {
      ws.unsubscribe("global");
    },
    response: t.Object({
      id: t.Number(),
      message: t.String(),
      createdAt: t.Date(),
    }),
  })
  .get(
    "/chat",
    async ({ query }) => {
      const before = query.before || Date.now();
      const limit = query.limit || 50;

      const validDate =
        Object.prototype.toString.call(new Date(Number(before))) ===
        "[object Date]";

      if (limit < 1 || !validDate) throw new Error();

      const posts = await db.post.findMany({
        where: {
          createdAt: {
            lt: new Date(Number(before)),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: Number(limit) || 50,
      });

      return posts;
    },
    {
      query: t.Object({
        before: t.Optional(t.Date()),
        limit: t.Optional(t.Number()),
      }),
    }
  )
  .post(
    "/chat",
    async ({ body }) => {
      await db.post
        .create({
          data: {
            message: body.message,
          },
        })
        .then((msg) => {
          app.server?.publish("global", JSON.stringify(msg));
        });
    },
    {
      body: t.Object({
        message: t.String(),
      }),
    }
  );
