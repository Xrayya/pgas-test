-- DDL
CREATE TABLE departments (
	department_id SERIAL PRIMARY KEY,
	department_name VARCHAR(100)
)

CREATE TABLE employeees (
	employee_id SERIAL PRIMARY KEY,
	employee_name VARCHAR(100),
	department_id INT REFERENCES departments(department_id)
)

CREATE TABLE spendings (
	spending_id SERIAL PRIMARY KEY,
	employee_nane VARCHAR(100),
	department_id SERIAL REFERENCES departments(department_id)
)

-- Menampilkan seluruh data pada masing-masing tabel

SELECT * FROM departments
SELECT * FROM employees
SELECT * FROM spendings

-- Menampilkan gabungan (JOIN) antara tabel employees, departments, dan spendings dengan hasil kolom: Employee Name, Department Name, Spending Date, Spending Value.

SELECT e.employee_name AS "Employee Name", d.department_name AS "Department Name", s.spending_date AS "Spending Date", s.value AS "Spending Value"
FROM employees e
LEFT JOIN departments d
	ON e.department_id = d.department_id
LEFT JOIN spendings s
	ON s.employee_id = e.employee_id

-- Tampilkan data tersebut dengan pengurutan berdasarkan Spending Value dari yang terkecil ke terbesar.

SELECT e.employee_name AS "Employee Name", d.department_name AS "Department Name", s.spending_date AS "Spending Date", s.value AS "Spending Value"
FROM employees e
LEFT JOIN departments d
	ON e.department_id = d.department_id
LEFT JOIN spendings s
	ON s.employee_id = e.employee_id
ORDER BY s.value

-- Tampilkan laporan spending untuk tahun 2020 hingga tahun terbaru (2025), hanya untuk bulan Januari sampai Desember, dengan filter berdasarkan rentang value (gunakan klausa WHERE).

SELECT *
FROM spendings s
WHERE s.spending_date >= '2020-01-01' AND s.spending_date <= '2025-12-31'
