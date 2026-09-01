import { routes } from "#/routes.ts";
import { createController } from "remix/router";
import { redirect } from "remix/response/redirect";
import * as s from "remix/data-schema";
import { AddCommentSchema, IssueIdSchema } from "#/data/schemas.ts";
import { addComment } from "#/data/issues.ts";

export default createController(routes.comments, {
    actions: {
        async create({ params, formData }) {
            let { issueId } = s.parse(IssueIdSchema, params);
            let { comment } = s.parse(AddCommentSchema, formData);
            await addComment(issueId, comment);

            return redirect(routes.issues.show.href({ id: issueId }));
        },
    },
});
