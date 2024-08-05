import pool from "../database/database.js";

// Get all trainings expiring this month
export async function getExpiringTrainings() {
  const [rows] = await pool.query(
    `SELECT et.*, e.name AS employee_name, t.title AS training_title 
     FROM employees_trainings et
     JOIN employees e ON et.employee_id = e.id
     JOIN trainings t ON et.training_id = t.id
     WHERE et.expiry_date >= DATE_FORMAT(CURDATE(), '%Y-%m-01') 
     AND et.expiry_date < DATE_FORMAT(DATE_ADD(CURDATE(), INTERVAL 1 MONTH), '%Y-%m-01')`
  );
  return rows;
}

// Get all upcoming training sessions in exactly 3 days
export async function getUpcomingTrainings() {
  const [rows] = await pool.query(
    `SELECT et.*, e.name AS employee_name, e.email AS employee_email, t.title AS training_title
     FROM employees_trainings et
     JOIN employees e ON et.employee_id = e.id
     JOIN trainings t ON et.training_id = t.id
     WHERE et.start_date = DATE_ADD(CURDATE(), INTERVAL 3 DAY)`
  );
  return rows;
}