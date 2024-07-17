import pool from "./database.js";

export async function getEmployeeDetails() {
    const [rows] = await pool.query(`
        SELECT
            e.id AS employee_id,
            e.name AS employee_name,
            d.name AS department_name,
            j.name AS job_name
        FROM employees e
        JOIN departments d ON e.department_id = d.id
        JOIN jobs j ON e.job_id = j.id;
    `);
    return rows;
}

export async function getRelevantCourses() {
    const [rows] = await pool.query(`
        SELECT
            rt.id,
            rt.employee_id,
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
            MAX(et.end_date) AS latest_end_date,
            CASE
                WHEN et.status = 'Completed' THEN MAX(et.expiry_date)
                ELSE NULL
            END AS expiry_date
        FROM employees_trainings et
        JOIN trainings t ON et.training_id = t.id
        GROUP BY et.employee_id, et.training_id, t.title, et.status
        HAVING et.status = 'Completed' OR et.status <> 'Completed'
        ORDER BY et.employee_id, et.training_id;
    `);
    return rows;
}