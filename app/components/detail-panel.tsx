import { commentsByIssueId, Issue, Comment } from "#/data/data.ts";
import { Handle } from "remix/ui";

export function DetailPanel(handle: Handle<{ issue: Issue }>) {
    return () => (
        <section aria-label="Selected issue details" class="detail-panel">
            <IssueHeader issue={handle.props.issue} />
            <IssueSummary issue={handle.props.issue} />
            <div style={{ opacity: 1 }}>
                <Timeline
                    comments={commentsByIssueId[handle.props.issue.id] ?? []}
                    issue={handle.props.issue}
                />
            </div>
            <CommentComposer />
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

function Timeline(handle: Handle<{ issue: Issue; comments: readonly Comment[] }>) {
    return () => (
        <section aria-labelledby="timeline-heading" class="timeline">
            <div class="section-heading">
                <h3 id="timeline-heading">Timeline</h3>
                <span>{handle.props.comments.length} updates</span>
            </div>
            {handle.props.comments.map(comment => (
                <CommentCard comment={comment} />
            ))}
        </section>
    );
}

function CommentCard(handle: Handle<{ comment: Comment }>) {
    return () => (
        <article class="comment-card">
            <div aria-hidden="true" class="avatar">
                {handle.props.comment.author.charAt(0)}
            </div>
            <div>
                <div class="comment-heading">
                    <strong>{handle.props.comment.author}</strong>
                    <span>{handle.props.comment.time}</span>
                </div>
                <p>{handle.props.comment.body}</p>
            </div>
        </article>
    );
}

function CommentComposer() {
    return () => (
        <form class="composer">
            <label for="comment">Add a comment</label>
            <textarea id="comment" placeholder="Leave a project update..." rows={4} />
            <div class="composer-actions">
                <button type="submit">Comment</button>
            </div>
        </form>
    );
}
