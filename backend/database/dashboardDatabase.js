import pool from "./database.js";

export async function getEmployeeDetails() {
    const [rows] = await pool.query(`
        SELECT
            e.id AS employee_id,
            e.name AS employee_name,
            e.designation as designation
        FROM employees e
    `);
    return rows;
}

export async function getRelevantCourses() {
    const [rows] = await pool.query(`
        SELECT
            rt.employee_id,
            rt.training_id,
            rt.validity,
            t.title
        FROM trainings t
        JOIN relevant_trainings rt ON t.id = rt.training_id
        ORDER BY rt.employee_id;
    `);
    return rows;
}

export async function getTrainingDates() {
    const [rows] = await pool.query(`
        SELECT
            et.employee_id,
            et.training_id,
            t.title,
            MAX(IF(et.status = 'Completed', et.end_date, NULL)) AS latest_end_date,
            MAX(IF(et.status = 'Completed', et.expiry_date, NULL)) AS expiry_date,
            MAX(IF(et.status = 'Scheduled', et.start_date, NULL)) AS scheduled_date
        FROM employees_trainings et
        JOIN trainings t ON et.training_id = t.id
        GROUP BY et.employee_id, et.training_id
        ORDER BY et.employee_id, et.training_id;
    `);
    return rows;
}