import * as s from "remix/data-schema";
import * as coerce from "remix/data-schema/coerce";
import * as f from "remix/data-schema/form-data";

export let Env = s.object({
    DATABASE_URL: s.defaulted(s.string(), "./db/data.db"),
    PORT: s.defaulted(coerce.number(), 1616),
});

export let IssueIdSchema = s.object({
    issueId: coerce.number(),
});

export let AddCommentSchema = f.object({
    comment: f.field(s.string()),
});
