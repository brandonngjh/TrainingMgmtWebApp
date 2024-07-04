import pool from "./database.js";

export async function getEmployees() {
  const [rows] = await pool.query("SELECT * FROM Employees");
  return rows;
}

export async function getEmployee(id) {
  const [rows] = await pool.query("SELECT * FROM Employees WHERE id = ?", [id]);
  return rows[0];
}

export async function createEmployee(name, email, department) {
  const [result] = await pool.query(
    "INSERT INTO Employees (name, email, department) VALUES (?, ?, ?)",
    [name, email, department]
  );
  return getEmployee(result.insertId);
}

export async function deleteEmployee(id) {
  const [result] = await pool.query("DELETE FROM Employees WHERE id = ?", [id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Employee not found";
}

export async function updateEmployee(id, name, email, department) {
  const [result] = await pool.query(
    "UPDATE Employees SET name = ?, email = ?, department = ? WHERE id = ?",
    [name, email, department, id]
  );
  return result.affectedRows > 0 ? getEmployee(id) : null;
}