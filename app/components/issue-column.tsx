import type { Issue } from "#/data/data.ts";

import { Handle } from "remix/ui";

type IssueColumnProps = {
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
                    <IssueCard issue={issue} />
                ))}
            </div>
        </section>
    );
}

function IssueCard(handle: Handle<{ issue: Issue }>) {
    return () => (
        <a>
            <article class={"issue-card"} style={{ opacity: 1 }}>
                <div class="issue-card-header">
                    <span aria-hidden="true" class="status-dot" />
                    <span class="issue-number">#{handle.props.issue.id}</span>
                    <span class="issue-status">{handle.props.issue.status}</span>
                </div>
                <h3>{handle.props.issue.title}</h3>
                <div class="issue-meta">
                    <span>{handle.props.issue.area}</span>
                    <span>{handle.props.issue.author}</span>
                    <span>{handle.props.issue.updated}</span>
                </div>
                <div aria-label="Issue activity" class="issue-stats">
                    <span>{handle.props.issue.comments} comments</span>
                    <span>{handle.props.issue.reactions} reactions</span>
                </div>
            </article>
        </a>
    );
}
