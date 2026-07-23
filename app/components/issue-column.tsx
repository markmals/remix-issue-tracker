import { IssueCard } from "#/assets/issue-card.tsx";
import type { Issue } from "#/data/tables.ts";

import { Handle } from "remix/ui";

type IssueColumnProps = {
    selectedIssue: number;
    issues: readonly Issue[];
};

export function IssueColumn(handle: Handle<IssueColumnProps>) {
    return () => (
        <section aria-label="Issues" class="issue-column">
            <header class="toolbar">
                <div>
                    <p class="eyebrow">Project</p>
                    <h2>remix</h2>
                </div>
            </header>

            <div class="issue-list">
                {handle.props.issues.map(issue => (
                    <IssueCard issue={issue} selectedIssue={handle.props.selectedIssue} />
                ))}
            </div>
        </section>
    );
}
