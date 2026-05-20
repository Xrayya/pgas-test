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
