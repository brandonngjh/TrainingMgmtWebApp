import {
  sendExpiringTrainingEmail,
  sendUpcomingTrainingsEmail,
} from "../scheduler/emailScheduler.js";
import pool from "../database/database.js";

async function backupData() {
  const [backupEmployees] = await pool.query("SELECT * FROM employees");
  const [backupTrainings] = await pool.query("SELECT * FROM trainings");
  const [backupTrainingSessions] = await pool.query(
    "SELECT * FROM employees_trainings"
  );
  return { backupEmployees, backupTrainings, backupTrainingSessions };
}

async function restoreData(originalData) {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("TRUNCATE TABLE employees");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  for (const row of originalData.backupEmployees) {
    await pool.query(
      "INSERT INTO employees (id, name, email, hire_date, designation) VALUES (?, ?, ?, ?, ?)",
      [row.id, row.name, row.email, row.hire_date, row.designation]
    );
  }

  for (const row of originalData.backupTrainings) {
    await pool.query(
      "INSERT INTO trainings (id, title, description, validity_period, training_provider) VALUES (?, ?, ?, ?, ?)",
      [
        row.id,
        row.title,
        row.description,
        row.validity_period,
        row.training_provider,
      ]
    );
  }

  for (const row of originalData.backupTrainingSessions) {
    await pool.query(
      "INSERT INTO employees_trainings (id, session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        row.id,
        row.session_id,
        row.employee_id,
        row.training_id,
        row.status,
        row.start_date,
        row.end_date,
        row.expiry_date,
      ]
    );
  }
}

async function setup() {
  await pool.query("SET FOREIGN_KEY_CHECKS = 0");
  await pool.query("TRUNCATE TABLE employees_trainings");
  await pool.query("TRUNCATE TABLE trainings");
  await pool.query("TRUNCATE TABLE employees");
  await pool.query("SET FOREIGN_KEY_CHECKS = 1");

  // Insert some employees with expiring training this month and some employees with upcoming training in 3 days based on relevant trainings
  await pool.query(
    `INSERT INTO employees (id, name, email, hire_date, designation) VALUES 
    (1, 'John Doe', 'john@example.com', '2023-07-28', 'Engineer'), 
    (2, 'Jane Smith', 'jane@example.com', '2023-07-28', 'Manager');`
  );

  await pool.query(
    `INSERT INTO trainings (id, title, description, validity_period, training_provider) VALUES (1, "Safety Training", "Safety procedures", 12, "Provider A")`
  );

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const expiryDate1 = new Date(year, month, Math.min(now.getDate() + 1, new Date(year, month , )))
  await pool.query(
    `INSERT INTO employees_trainings (session_id, employee_id, training_id, status, start_date, end_date, expiry_date) VALUES
    ()
    ()`
  )
}

describe("Integration Test: Email Scheduler", () => {
  let originalData;

  beforeAll(async () => {});

  afterAll(async () => {});
  beforeEach(async () => {});

  test("sendExpiringTrainingEmail - should send expiring trainings email", async () => {});

  test("sendExpiringTrainingEmail - should send no expiring trainings email if no expiring trainings this month", async () => {});

  test("sendUpcomingTrainingEmail - should send upcoming trainings email", async () => {});

  test("sendUpcomingTrainingsEmail - should not send email if no upcoming trainings in 3 days", async () => {});
});
