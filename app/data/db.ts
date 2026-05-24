// import { Env } from "#/data/schemas.ts";
// import { parseEnv } from "#/utils/parse-env.ts";
// import { DatabaseSync } from "node:sqlite";
// import { createDatabase } from "remix/data-table";
// import { createSqliteDatabaseAdapter } from "remix/data-table/sqlite";
//
// const { DATABASE_URL } = parseEnv(Env);
//
// export let sqlite = new DatabaseSync(DATABASE_URL);
// sqlite.prepare("PRAGMA foreign_keys = ON").run();
//
// export let adapter = createSqliteDatabaseAdapter(sqlite);
// export let db = createDatabase(adapter);
