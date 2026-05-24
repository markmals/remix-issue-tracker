import { get, post, resources, route } from "remix/routes";

export let routes = route({
    assets: get("/assets/*path"),
    index: get("/"),
    issues: resources("/issues", { only: ["show"] }),
    comments: { create: post("/comments/:issueId") },
});
