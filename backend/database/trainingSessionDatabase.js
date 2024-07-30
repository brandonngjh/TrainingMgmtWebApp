import { get } from "http";
import pool from "./database.js";

// function to format the data obtained from the database
function formatSession (rows) {
  const trainingSessionsDict = {};
  rows.forEach(row => {
    // if trianingSessionsDict does not have the session id, create populate the trainingsessiondict with the details of the session
    if (!trainingSessionsDict[row.session_id]) {
      trainingSessionsDict[row.session_id] = {
        session_id: row.session_id,
        start_date: row.start_date,
        end_date: row.end_date,
        expiry_date: row.expiry_date,
        training_title: row.training_title,
        training_id: row.training_id,
        employees: [
          {
            employee_id: row.employee_id,
            employee_name: row.employee_name,
            designation: row.designation,
            status: row.status,
          }
        ]
      };
    }
    // just add the employee details to the employees attribute of the session
    else {
      trainingSessionsDict[row.session_id].employees.push({
        employee_id: row.employee_id,
        employee_name: row.employee_name,
        designation: row.designation,
        status: row.status,
      });
    }
  });
  return trainingSessionsDict;
}

export async function getAllTrainingSessions() {
    const [rows] = await pool.query(`
        SELECT
            ts.session_id AS session_id,
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
    return formatSession(rows);
}

export async function getTrainingSession(session_id) {
    const [rows] = await pool.query(
        `
        SELECT
            ts.session_id AS session_id,
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
        JOIN trainings t ON ts.training_id = t.id
        WHERE ts.session_id = ?;
        `,
        [session_id]
    );
    return formatSession(rows);
}

export async function createTrainingSession(
    employee_ids,
    training_id,
    status,
    start_date,
    end_date
  ) {

    const [maxSessionIdResult] = await pool.query(
      "SELECT MAX(session_id) AS maxSessionId FROM employees_trainings"
    );
    const newMaxSessionId = maxSessionIdResult[0].maxSessionId + 1;

    const [trainingValidityPeriod] = await pool.query(
      "SELECT validity_period FROM trainings WHERE id = ?",
      [training_id]
    );
    const validityPeriod = trainingValidityPeriod[0].validity_period;

    for (const employee_id of employee_ids) {
      await pool.query(
        "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(?, INTERVAL ? MONTH))",
        [newMaxSessionId, employee_id, training_id, status, start_date, end_date, end_date, validityPeriod]
      );
    }

    const trainingSession = await getTrainingSession(newMaxSessionId);
    return trainingSession;
    // return { insertId: result.insertId, affectedRows: result.affectedRows }; // Return basic result info
  }

export async function deleteTrainingSession(session_id) {
    const [result] = await pool.query(
        "DELETE FROM employees_trainings WHERE session_id = ?",
        [session_id]
    );
    return { affectedRows: result.affectedRows }; // Return basic result info
}