import db from "#/db/db";

async function setupDB() {
  await db.connect();

  const connStatus = await db.query("SELECT VERSION()");

  console.log(`Connection found: ${connStatus.rows[0].version}`);

  const depColStatus = await db.query(
    `CREATE TABLE departments (
        department_id SERIAL PRIMARY KEY,
        department_name VARCHAR(100)
    )`,
  );

  console.log(depColStatus && "[departements] column created");

  const empColStatus = await db.query(
    `CREATE TABLE employeees (
        employee_id SERIAL PRIMARY KEY,
        employee_name VARCHAR(100),
        department_id INT REFERENCES departments(department_id)
    )`,
  );

  console.log(empColStatus && "[employeees] column created");

  const spenColStatus = await db.query(
    `CREATE TABLE spendings (
          spending_id SERIAL PRIMARY KEY,
          employee_nane VARCHAR(100),
          department_id SERIAL REFERENCES departments(department_id)
    )`,
  );

  console.log(spenColStatus && "[spendings] column created");

  await db.end();
}

setupDB();
