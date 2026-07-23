import { Timeline } from "#/assets/comments.tsx";
import { DetailPanel } from "#/components/detail-panel.tsx";
import { getComments, getIssue, getIssues } from "#/data/issues.ts";
import { Document } from "#/layouts/document.tsx";
import { frameResponseInit } from "#/middleware.ts";
import { routes } from "#/routes.ts";
import * as s from "remix/data-schema";
import * as coerce from "remix/data-schema/coerce";
import { createController } from "remix/fetch-router";

export default createController(routes.issues, {
    actions: {
        async show({ headers, params, render }) {
            let target = headers.get("X-Remix-Target");
            let id = s.parse(coerce.number(), params.id);

            let issue = await getIssue(id);

            if (!issue) {
                return render(<div>Not Found</div>, { status: 404 });
            }

            if (target === "detail") {
                return render(<DetailPanel issue={issue} />, frameResponseInit());
            }

            if (target === "comments") {
                let comments = await getComments(id);

                return render(
                    <div style={{ opacity: 1 }}>
                        <Timeline comments={comments} issueId={id} />
                    </div>,
                    frameResponseInit(),
                );
            }

            let issues = await getIssues();
            return render(<Document issues={issues} selectedIssue={id} />);
        },
    },
});
