import pool from "./database.js";

// Check if a relevant training entry exists
export async function relevantTrainingExists(employee_id, training_id) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM relevant_trainings WHERE employee_id = ? AND training_id = ?",
    [employee_id, training_id]
  );
  return rows[0].count > 0;
}

// Get all relevant trainings
export async function getRelevantTrainings() {
  const [rows] = await pool.query("SELECT * FROM relevant_trainings");
  return rows;
}

// Get relevant trainings by id
export async function getRelevantTrainingsById(id){
    const [row] = await pool.query("SELECT * FROM relevant_trainings WHERE id = ?", [id]);
    return row[0];
  }


// Get relevant trainings by training_id
export async function getRelevantTrainingsByTrainingId(training_id) {
  const [rows] = await pool.query("SELECT * FROM relevant_trainings WHERE training_id = ?", [training_id]);
  return rows;
}

// Get relevant trainings by employee_id
export async function getRelevantTrainingsByEmployeeId(employee_id) {
  const [rows] = await pool.query(`
    SELECT
      rt.training_id as training_id,
      t.title,
      rt.validity as validity,
      t.validity_period as validity_period
    FROM
      relevant_trainings rt
    JOIN
      trainings t ON rt.training_id = t.id
    WHERE
      rt.employee_id = ?;
  `, [employee_id]);
    return rows;
  }

// Create a new relevant training entry
export async function createRelevantTraining(
    employee_id, 
    training_id, 
    validity
) {

  // Check if the relevant training entry already exists
  if (await relevantTrainingExists(employee_id, training_id)) {
    throw new Error(`Relevant training for employee_id ${employee_id} and training_id ${training_id} already exists`);
  }

  const [result] = await pool.query(
    "INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES (?, ?, ?)",
    [employee_id, training_id, validity]
  );
  return getRelevantTrainingsByEmployeeId(employee_id);
}

// Delete a relevant training entry
export async function deleteRelevantTraining(employee_id, training_id) {
  const [result] = await pool.query("DELETE FROM relevant_trainings WHERE employee_id = ? AND training_id = ?", [employee_id, training_id]);
  return result.affectedRows > 0 ? "Delete Successful" : "Relevant training not found";
}

// Update an existing relevant training entry
export async function updateRelevantTraining(employee_id, training_id, validity) {
  // Check if the relevant training entry exists before updating
  if (!(await relevantTrainingExists(employee_id, training_id))) {
    throw new Error(`Relevant training for employee_id ${employee_id} and training_id ${training_id} does not exist`);
  }

  const [result] = await pool.query(
    "UPDATE relevant_trainings SET validity = ? WHERE employee_id = ? AND training_id = ?",
    [validity, employee_id, training_id]
  );
  return result.affectedRows > 0 ? getRelevantTrainingsByEmployeeId(employee_id) : null;
}
