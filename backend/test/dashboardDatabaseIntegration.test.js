import pool from '../database/database.js';
import {
  getEmployeeDetails,
  getRelevantCourses,
  getTrainingDates,
} from '../database/dashboardDatabase.js';

describe('Integration Test: Dashboard Functions', () => {
  const mockEmployees = [
    { id: 2000, name: 'John Doe', designation: 'Manager' },
    { id: 2001, name: 'Jane Smith', designation: 'Developer' },
  ];

  const mockTrainings = [
    { id: 2000, title: 'Safety Training' },
    { id: 2001, title: 'Quality Training' },
  ];

  const mockRelevantTrainings = [
    { employee_id: 2000, training_id: 2000, validity: 'Valid' },
    { employee_id: 2001, training_id: 2001, validity: 'Expired' },
  ];

  const mockEmployeeTrainings = [
    { employee_id: 2000, training_id: 2000, status: 'Completed', end_date: '2023-07-01', expiry_date: '2024-07-01', start_date: '2023-06-01' },
    { employee_id: 2001, training_id: 2001, status: 'Completed', end_date: '2023-06-01', expiry_date: '2024-06-01', start_date: '2023-05-01' },
  ];

  beforeAll(async () => {
    // Insert mock data before all tests
    await pool.query("INSERT INTO employees (id, name, designation) VALUES ?", [mockEmployees.map(e => [e.id, e.name, e.designation])]);
    await pool.query("INSERT INTO trainings (id, title) VALUES ?", [mockTrainings.map(t => [t.id, t.title])]);
    await pool.query("INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES ?", [mockRelevantTrainings.map(rt => [rt.employee_id, rt.training_id, rt.validity])]);
    await pool.query("INSERT INTO employees_trainings (employee_id, training_id, status, end_date, expiry_date, start_date) VALUES ?", [mockEmployeeTrainings.map(et => [et.employee_id, et.training_id, et.status, et.end_date, et.expiry_date, et.start_date])]);
  });

  afterAll(async () => {
    // Clear the mock data after all tests
    await pool.query("DELETE FROM relevant_trainings WHERE employee_id IN (?, ?)", [2000, 2001]);
    await pool.query("DELETE FROM employees_trainings WHERE employee_id IN (?, ?)", [2000, 2001]);
    await pool.query("DELETE FROM trainings WHERE id IN (?, ?)", [2000, 2001]);
    await pool.query("DELETE FROM employees WHERE id IN (?, ?)", [2000, 2001]);

    // Close the database connection after all tests
    await pool.end();
  });

  test('getEmployeeDetails - should fetch all employee details', async () => {
    const result = await getEmployeeDetails();
    const expectedData = [
      { employee_id: 2000, employee_name: 'John Doe', designation: 'Manager' },
      { employee_id: 2001, employee_name: 'Jane Smith', designation: 'Developer' },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedData));
  });

  test('getRelevantCourses - should fetch all relevant courses', async () => {
    const result = await getRelevantCourses();
    const expectedData = [
      { employee_id: 2000, training_id: 2000, validity: 'Valid', title: 'Safety Training' },
      { employee_id: 2001, training_id: 2001, validity: 'Expired', title: 'Quality Training' },
    ];
    expect(result).toEqual(expect.arrayContaining(expectedData));
  });
  
  // TODO: Find bug causing failed test case
  // test('getTrainingDates - should fetch all training dates', async () => {
  //   const result = await getTrainingDates();
  //   const expectedData = [
  //     { employee_id: 2000, training_id: 2000, title: 'Safety Assurance Training', latest_end_date: '2023-07-01', expiry_date: '2024-07-01', scheduled_date: '2023-06-01' },
  //     { employee_id: 2001, training_id: 2001, title: 'Quality Testing Training', latest_end_date: '2023-06-01', expiry_date: '2024-06-01', scheduled_date: '2023-05-01' },
  //   ];
  //   expect(result).toEqual(expect.arrayContaining(expectedData));
  // }); 
});
