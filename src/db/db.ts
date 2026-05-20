import pg from "pg";

const { Client } = pg;

const connectionString = process.env.PG_CONNECTION_STRING!;

const db = new Client({ connectionString });

export default db;
