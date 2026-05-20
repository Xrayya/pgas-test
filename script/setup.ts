import db from "#/db/db";

async function setupDB() {
  await db.connect();

  const connStatus = await db.query("SELECT VERSION()");

  console.log(`Connection found: ${connStatus.rows[0].version}`);

  const depTblStatus = await db.query(
    `CREATE TABLE departments (
        department_id SERIAL PRIMARY KEY,
        department_name VARCHAR(100)
    )`,
  );

  console.log(depTblStatus && "[departements] table created");

  const empTblStatus = await db.query(
    `CREATE TABLE employees (
        employee_id SERIAL PRIMARY KEY,
        employee_name VARCHAR(100),
        department_id INT REFERENCES departments(department_id)
    )`,
  );

  console.log(empTblStatus && "[employeees] table created");

  const spenTblStatus = await db.query(
    `CREATE TABLE spendings (
        spending_id SERIAL PRIMARY KEY,
        employee_id INT REFERENCES employees(employee_id),
        spending_date DATE,
        value DECIMAL(12, 2)
    )`,
  );

  console.log(spenTblStatus && "[spendings] table created");

  const userTblStatus = await db.query(
    `CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(10) NOT NULL CHECK (role IN ('admin', 'user')),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  );

  console.log(userTblStatus && "[users] table created");

  const sessionTblStatus = await db.query(
    `CREATE TABLE sessions (
          session_id UUID PRIMARY KEY,
          user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          expires_at TIMESTAMPTZ NOT NULL,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`,
  );

  console.log(sessionTblStatus && "[sessions] table created");

  await db.end();
}

setupDB();
