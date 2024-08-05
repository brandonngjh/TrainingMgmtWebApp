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
  end_date,
  session_id = null
) {
  let newMaxSessionId;

  if (session_id) {
    newMaxSessionId = session_id;
  } else {
    const [maxSessionIdResult] = await pool.query(
      "SELECT MAX(session_id) AS maxSessionId FROM employees_trainings"
    );
    newMaxSessionId = maxSessionIdResult[0].maxSessionId + 1;
  }

  const [trainingValidityPeriod] = await pool.query(
    "SELECT validity_period FROM trainings WHERE id = ?",
    [training_id]
  );
  const validityPeriod = trainingValidityPeriod[0].validity_period;

  for (const employee_id of employee_ids) {
    // Write sql to check if this training id has been defined for this employee id in the relevant_trainings table. If not, add it.
    const [relevantTrainingExistsResult] = await pool.query(
      "SELECT COUNT(*) as count FROM relevant_trainings WHERE employee_id = ? AND training_id = ?",
      [employee_id, training_id]
    );
    // console.log(relevantTrainingExists);
    if (relevantTrainingExistsResult[0].count === 0) {
      await pool.query(
        "INSERT INTO relevant_trainings (employee_id, training_id) VALUES (?, ?)",
        [employee_id, training_id]
      );
    }

    await pool.query(
      "INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, DATE_ADD(?, INTERVAL ? MONTH))",
      [newMaxSessionId, employee_id, training_id, status, start_date, end_date, end_date, validityPeriod]
    );
  }

  const trainingSession = await getTrainingSession(newMaxSessionId);
  return trainingSession;
  // return { insertId: result.insertId, affectedRows: result.affectedRows }; // Return basic result info
}

export async function updateTrainingSession(
  session_id,
  employee_ids,
  training_id,
  status,
  start_date,
  end_date
) {
  await deleteTrainingSession(session_id);
  const trainingSession = await createTrainingSession(employee_ids, training_id, status, start_date, end_date, session_id);
  return trainingSession;
}

export async function deleteTrainingSession(session_id) {
    const [result] = await pool.query(
        "DELETE FROM employees_trainings WHERE session_id = ?",
        [session_id]
    );
    return { affectedRows: result.affectedRows }; // Return basic result info
}

export async function markAttendance(session_id, employee_ids) {

  var [trainingIdRow] = await pool.query(
    "SELECT training_id FROM employees_trainings WHERE session_id = ?",
    [session_id]
  );

  var [sessionIdRow] = await pool.query(
    "SELECT validity_period FROM trainings WHERE id = ?",
    [trainingIdRow[0].training_id]
  );
  const validityPeriod = sessionIdRow[0].validity_period;

  for (const employee_id of employee_ids) {
    const [result] = await pool.query(
      `UPDATE employees_trainings et 
        SET status = 'completed',
        expiry_date = DATE_ADD(et.end_date, INTERVAL ? MONTH)
        WHERE session_id = ? AND employee_id = ?`,
      [validityPeriod, session_id, employee_id]
    );

    await pool.query(
      `UPDATE relevant_trainings rt
        SET validity = 'Valid'
        WHERE rt.employee_id = ? AND rt.training_id = ?`,
      [employee_id, trainingIdRow[0].training_id]
    )
  }
  return getTrainingSession(session_id); // Return basic result info
}