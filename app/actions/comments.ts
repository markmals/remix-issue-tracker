import { routes } from "#/routes.ts";
import { createController } from "remix/fetch-router";
import { redirect } from "remix/response/redirect";

export default createController(routes.comments, {
    actions: {
        async create() {
            return redirect(routes.issues.show.href({ id: 42 }));
        },
    },
});
