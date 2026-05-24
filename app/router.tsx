import commentsController from "#/actions/comments.ts";
import issuesController from "#/actions/issues.tsx";
import rootController from "#/actions/root.ts";
import { routes } from "#/routes.ts";
import { asyncContext } from "remix/middleware/async-context";
import { formData } from "remix/middleware/form-data";
import { staticFiles } from "remix/middleware/static";
import { createRouter, MiddlewareContext } from "remix/router";
import { render } from "./middleware.ts";

let middleware = [staticFiles("./public"), formData(), asyncContext(), render()] as const;

type AppContext = MiddlewareContext<typeof middleware>;

declare module "remix/router" {
    interface RouterTypes {
        context: AppContext;
    }
}

export let router = createRouter({ middleware });

router.map(routes, rootController);
router.map(routes.issues, issuesController);
router.map(routes.comments, commentsController);

export default router;
