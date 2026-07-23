import { Issue } from "#/data/tables.ts";
import { routes } from "#/routes.ts";
import { addEventListeners, clientEntry, Handle, link, on } from "remix/ui";

export let IssueCard = clientEntry(
    import.meta.url,
    function IssueCard(handle: Handle<{ issue: Issue; selectedIssue: number }>) {
        let selectedIssue = handle.props.selectedIssue;
        let commentCount = handle.props.issue.comments;
        let pending = false;

        if (typeof window !== "undefined") {
            addEventListeners(window, handle.signal, {
                // highlight this card the moment its issue's detail is on screen —
                // the comments island announces it as the title renders, so we no
                // longer wait for the navigation (and its comments) to fully settle
                issueshown(event) {
                    // any arriving issue settles (or supersedes) the pending navigation
                    pending = false;
                    selectedIssue = event.issueId;
                    handle.update();
                },
                // the comments timeline broadcasts its live count on `window`;
                // adopt it when it's for this card's issue (optimistic + settled)
                commentcount(event) {
                    if (event.issueId === handle.props.issue.id) {
                        commentCount = event.count;
                        handle.update();
                    }
                },
            });
        }

        return () => (
            <a
                mix={[
                    link(routes.issues.show.href({ id: handle.props.issue.id }), {
                        target: "detail",
                        resetScroll: false,
                    }),
                    // dim this card while its navigation is in flight —
                    // `issueshown` clears it once the new detail is on screen
                    on("click", () => {
                        pending = true;
                        handle.update();
                    }),
                ]}
            >
                <article
                    class={
                        selectedIssue === handle.props.issue.id ? "issue-card active" : "issue-card"
                    }
                    style={{ opacity: pending ? 0.5 : 1 }}
                >
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
                        <span>{commentCount} comments</span>
                        <span>{handle.props.issue.reactions} reactions</span>
                    </div>
                </article>
            </a>
        );
    },
);
