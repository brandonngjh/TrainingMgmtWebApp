import pool from "../database/database.js";

// Get all trainings expiring this month
export async function getExpiringTrainings() {
  const [rows] = await pool.query(
    "SELECT * FROM employees_trainings WHERE expiry_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') AND expiry_date < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')"
  );
  return rows;
}

// Get all upcoming training sessions in exactly 3 days
export async function getUpcomingTrainings() {
  const [rows] = await pool.query(
    "SELECT * FROM employees_trainings WHERE start_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY)"
  );
  return rows;
}

// TODO: Get all training sessions to be updated
