import pool from "./database.js";

// Check if a job ID exists
export async function jobIdExists(id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM jobs WHERE id = ?",
    [id]
  );
  return rows[0].count > 0;
}

// Get all jobs
export async function getJobs() {
  const [rows] = await pool.query("SELECT * FROM jobs");
  return rows;
}

// Get a job by ID
export async function getJobByID(id) {
  const [rows] = await pool.query("SELECT * FROM jobs WHERE id = ?", [id]);
  return rows[0];
}

// Create a new job
export async function createJob(name, department_id) {
  const [result] = await pool.query(
    "INSERT INTO jobs (name, department_id) VALUES (?, ?)",
    [name, department_id]
  );
  return getJobByID(result.insertId);
}

// Delete a job
export async function deleteJob(id) {
  const [result] = await pool.query("DELETE FROM jobs WHERE id = ?", [id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Job not found";
}

// Update an existing job
export async function updateJob(id, name, department_id) {
  // Check if the job ID exists before updating
  if (!(await jobIdExists(id))) {
    throw new Error(`Job with id ${id} does not exist`);
  }

  const [result] = await pool.query(
    "UPDATE jobs SET name = ?, department_id = ? WHERE id = ?",
    [name, department_id, id]
  );
  return result.affectedRows > 0 ? getJobByID(id) : null;
}
