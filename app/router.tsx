import commentsController from "#/actions/comments.ts";
import issuesController from "#/actions/issues.tsx";
import rootController, { assets } from "#/actions/root.ts";
import { routes } from "#/routes.ts";
import { asyncContext } from "remix/middleware/async-context";
import { formData } from "remix/middleware/form-data";
import { render } from "remix/middleware/render";
import { staticFiles } from "remix/middleware/static";
import { createRouter, MiddlewareContext } from "remix/router";

let middleware = [
    staticFiles("./public"),
    formData(),
    asyncContext(),
    render({
        assets,
        onError(error) {
            console.error(error);
        },
    }),
] as const;

type AppContext = MiddlewareContext<typeof middleware>;

declare module "remix" {
    interface RouterTypes {
        context: AppContext;
    }
}

export let router = createRouter({ middleware });

router.map(routes, rootController);
router.map(routes.issues, issuesController);
router.map(routes.comments, commentsController);

export default router;
