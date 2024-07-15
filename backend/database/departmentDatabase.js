import pool from "./database.js";

// Check if a department ID exists
export async function departmentIdExists(id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM departments WHERE id = ?",
    [id]
  );
  return rows[0].count > 0;
}

// Get all departments
export async function getDepartments() {
  const [rows] = await pool.query("SELECT * FROM departments");
  return rows;
}

// Get a department by ID
export async function getDepartmentByID(id) {
  const [rows] = await pool.query("SELECT * FROM departments WHERE id = ?", [
    id,
  ]);
  return rows[0];
}

// Create a new department
export async function createDepartment(name) {
  const [result] = await pool.query();
  return getDepartmentByID(result.insertId);
}

// Delete a department
export async function deleteDepartment(id) {
  const [result] = await pool.query("DELETE FROM departments WHERE id = ?", [
    id,
  ]);
  return result.affectedRows > 0 ? "Delete Successful" : "Department not found";
}

// Update an existing department
export async function updateDepartment(id, name) {
  // Check if the department ID exists before updating
  if (!(await departmentIdExists(id))) {
    throw new Error(`Department with id ${id} does not exist`);
  }

  const [result] = await pool.query(
    "UPDATE departments SET name = ? WHERE id = ?",
    [name, id]
  );
  return result.affectedRows > 0 ? getDepartmentByID(id) : null;
}
