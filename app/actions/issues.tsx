import { DetailPanel } from "#/components/detail-panel.tsx";
import { issues } from "#/data/data.ts";
import { Document } from "#/layouts/document.tsx";
import { routes } from "#/routes.ts";
import { frameResponseInit } from "#/middleware.ts";

import * as s from "remix/data-schema";
import * as coerce from "remix/data-schema/coerce";
import { createController } from "remix/fetch-router";

export default createController(routes.issues, {
    actions: {
        async show({ headers, params, render }) {
            if (headers.get("X-Remix-Target") === "detail") {
                let id = s.parse(coerce.number(), params.id);
                let issue = issues.find(issue => issue.id === id);
                if (!issue) return new Response("Not Found", { status: 404 });
                return render(<DetailPanel issue={issue} />, frameResponseInit());
            }

            return render(<Document />);
        },
    },
});
