import { Pool } from "pg";

const connectionString = process.env.PG_CONNECTION_STRING!;

const db = new Pool({ connectionString });

export default db;
