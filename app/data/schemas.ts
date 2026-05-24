import * as s from "remix/data-schema";
import * as coerce from "remix/data-schema/coerce";

export let Env = s.object({
    // DATABASE_URL: s.defaulted(s.string(), "./db/data.db"),
    PORT: s.defaulted(coerce.number(), 1616),
});
