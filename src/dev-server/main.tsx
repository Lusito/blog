// eslint-disable-next-line import/no-unresolved
import "scss-modules/preset";
import fastify from "fastify";
import fastifyStatic from "@fastify/static";
import { join } from "path";

// The stuff below is purely for the dev-server
const app = fastify();
const port = 3000;

// SSE hot reload:
const startupTime = Date.now();
app.get("/hot-sse", (req, reply) => {
    reply.status(200);
    reply.raw.setHeader("connection", "keep-alive");
    reply.raw.setHeader("content-type", "text/event-stream");
    reply.raw.write(`data: ${startupTime}\n\n`);
});

app.register(fastifyStatic, {
    root: join(process.cwd(), "dist"),
    prefix: "/",
});

app.setNotFoundHandler((req, reply) => {
    reply.status(404);
    reply.sendFile("404.html");
});

const start = async () => {
    try {
        await app.listen({ port: 3000 });
        console.log(`Example app listening on port ${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};
start();
