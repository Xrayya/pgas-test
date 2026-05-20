import db from "#/db/db";

async function queryTasksAnswer() {
  console.log("Task 1: Menampilkan seluruh data pada masing-masing tabel.");

  const res1 = (await db.query(`SELECT * FROM departments`)).rows;
  const res2 = (await db.query(`SELECT * FROM employees`)).rows;
  const res3 = (await db.query(`SELECT * FROM spendings`)).rows;

  console.log(`[departments] Table:`);
  console.log(res1);
  console.log(`[employees] Table:`);
  console.log(res2);
  console.log(`[spendings] Table:`);
  console.log(res3);

  console.log(
    "Task 2: Menampilkan gabungan (JOIN) antara tabel employees, departments, dan spendings dengan hasil kolom: Employee Name, Department Name, Spending Date, Spending Value.",
  );

  const res4 = (
    await db.query(
      `SELECT e.employee_name AS "Employee Name", d.department_name AS "Department Name", s.spending_date AS "Spending Date", s.value AS "Spending Value"
      FROM employees e
      LEFT JOIN departments d
        ON e.department_id = d.department_id
      LEFT JOIN spendings s
        ON s.employee_id = e.employee_id`,
    )
  ).rows;

  console.log(res4);

  console.log(
    "Task 3: Tampilkan data tersebut dengan pengurutan berdasarkan Spending Value dari yang terkecil ke terbesar.",
  );

  const res5 = (
    await db.query(
      `SELECT e.employee_name AS "Employee Name", d.department_name AS "Department Name", s.spending_date AS "Spending Date", s.value AS "Spending Value"
      FROM employees e
      LEFT JOIN departments d
        ON e.department_id = d.department_id
      LEFT JOIN spendings s
        ON s.employee_id = e.employee_id
      ORDER BY s.value`,
    )
  ).rows;

  console.log(res5);

  console.log(
    "Task 4: Tampilkan laporan spending untuk tahun 2020 hingga tahun terbaru (2025), hanya untuk bulan Januari sampai Desember, dengan filter berdasarkan rentang value (gunakan klausa WHERE).",
  );

  const res6 = (
    await db.query(
      `SELECT *
      FROM spendings s
      WHERE s.spending_date >= '2020-01-01' AND s.spending_date <= '2025-12-31'`,
    )
  ).rows;

  console.log(res6);
}

queryTasksAnswer();
