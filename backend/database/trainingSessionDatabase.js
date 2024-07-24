import pool from "./database.js";

export async function getTrainingSessions() {
    const [rows] = await pool.query(`
        SELECT
            ts.id AS session_id,
            ts.status AS status,
            ts.start_date AS start_date,
            ts.end_date AS end_date,
            ts.expiry_date AS expiry_date,
            e.id AS employee_id,
            e.name AS employee_name,
            e.designation as designation,
            t.title as training_title,
            t.id as training_id
        FROM employees_trainings ts
        JOIN employees e ON ts.employee_id = e.id
        JOIN trainings t ON ts.training_id = t.id;
    `);
    return rows;
}

export async function createTrainingSession(
    employee_id,
    training_id,
    status,
    start_date,
    end_date,
  ) {
    const [result] = await pool.query(
      "INSERT INTO employees_trainings (employee_id, training_id, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
      [employee_id, training_id, status, start_date, end_date]
    );
    return { insertId: result.insertId, affectedRows: result.affectedRows }; // Return basic result info
  }