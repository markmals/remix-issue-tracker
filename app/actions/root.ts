import { routes } from "#/routes.ts";
import { createAssetServer } from "remix/assets";
import { createController } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";

export let assets = createAssetServer({
    basePath: "/assets",
    rootDir: process.cwd(),
    fileMap: {
        "app/*path": "app/*path",
        "node_modules/*path": "node_modules/*path",
    },
    allow: ["app/assets/**/*", "app/routes.ts", "app/data/schemas.ts", "node_modules/**"],
    deny: ["app/**/*.server.*", "server.ts"],
    sourceMaps: process.env.NODE_ENV === "development" ? "external" : undefined,
    scripts: {
        define: {
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV ?? "development"),
        },
    },
});

export default createController(routes, {
    actions: {
        async index() {
            return redirect(routes.issues.show.href({ id: 42 }));
        },
        async assets({ request }) {
            return (await assets.fetch(request)) ?? new Response("Not Found", { status: 404 });
        },
    },
});
