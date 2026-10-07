import { routes } from "#/routes.ts";
import { createAssetServer } from "remix/assets";
import { createController } from "remix/router";
import { redirect } from "remix/response/redirect";

export let assets = createAssetServer({
    basePath: "/assets",
    rootDir: process.cwd(),
    // content hashes: fingerprints stay stable across restarts on their own,
    // so there is no build id to thread through the environment anymore
    fingerprint: true,
    allowFiles: ["app/assets/**/*", "app/routes.ts", "app/data/schemas.ts"],
    allowPackages: ["remix"],
    denyFiles: ["app/**/*.server.*", "server.ts"],
    minify: true,
    watch: false,
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
