import type { Issue } from "#/data/tables.ts";
import { getContext } from "remix/middleware/async-context";
import { Handle } from "remix/ui";
import { Comments } from "#/assets/comments.tsx";

type DetailPanelProps = {
    issue: Issue;
};

export function DetailPanel(handle: Handle<DetailPanelProps>) {
    let { url } = getContext();

    return () => (
        <section aria-label="Selected issue details" class="detail-panel">
            <IssueHeader issue={handle.props.issue} />
            <IssueSummary issue={handle.props.issue} />
            <Comments issueId={handle.props.issue.id} src={url.toString()} />
        </section>
    );
}

function IssueHeader(handle: Handle<{ issue: Issue }>) {
    return () => (
        <header class="detail-header">
            <div>
                <p class="eyebrow">Selected Issue</p>
                <h2>{handle.props.issue.title}</h2>
            </div>
            <span class="pill">{handle.props.issue.status}</span>
        </header>
    );
}

function IssueSummary(handle: Handle<{ issue: Issue }>) {
    return () => (
        <div class="summary-card">
            <div class="summary-grid">
                <div>
                    <span>Assignee</span>
                    <strong>{handle.props.issue.assignee}</strong>
                </div>
                <div>
                    <span>Milestone</span>
                    <strong>{handle.props.issue.milestone}</strong>
                </div>
                <div>
                    <span>Priority</span>
                    <strong>{handle.props.issue.priority}</strong>
                </div>
            </div>
            <p>{handle.props.issue.description}</p>
        </div>
    );
}
