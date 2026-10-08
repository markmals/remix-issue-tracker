import { Env } from "#/data/schemas.ts";
import { parseEnv } from "#/utils/parse-env.ts";
import { createSqliteDatabase } from "remix/data-table/sqlite";

const { DATABASE_URL } = parseEnv(Env);

export let db = createSqliteDatabase({ filename: DATABASE_URL, foreignKeys: true });
