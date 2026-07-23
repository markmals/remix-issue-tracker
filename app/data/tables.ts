import { column as c, table, type TableRow } from "remix/data-table";

export let Issues = table({
    name: "issues",
    columns: {
        id: c.integer().primaryKey(),
        title: c.text().notNull(),
        area: c.text().notNull(),
        status: c.text().notNull(),
        author: c.text().notNull(),
        updated: c.text().notNull(),
        comments: c.integer().notNull().default(0),
        reactions: c.integer().notNull().default(0),
        active: c.boolean().notNull().default(false),
        assignee: c.text(),
        milestone: c.text(),
        priority: c.text(),
        description: c.text().notNull(),
    },
});

export let Comments = table({
    name: "comments",
    columns: {
        id: c.integer().primaryKey(),
        issueId: c.integer().notNull().references("issues", "id"),
        author: c.text().notNull(),
        time: c.text(),
        body: c.text().notNull(),
    },
});

export type Issue = TableRow<typeof Issues>;
export type Comment = TableRow<typeof Comments>;
