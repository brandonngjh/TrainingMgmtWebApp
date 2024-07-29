import pool from "../database/database.js";
import { getTrainingSessions, createTrainingSession } from "../database/trainingSessionDatabase.js";

jest.mock('../database/database.js', () => ({
  query: jest.fn(),
}));

describe('Unit Test: Training Session Database Functions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getTrainingSessions - should return all training sessions', async () => {
    const mockTrainingSessions = [
      {
        session_id: 1,
        status: 'Completed',
        start_date: '2024-07-01',
        end_date: '2024-07-07',
        expiry_date: '2025-07-07',
        employee_id: 1,
        employee_name: 'John Doe',
        designation: 'Engineer',
        training_title: 'Safety Training',
        training_id: 1,
      },
      {
        session_id: 2,
        status: 'Scheduled',
        start_date: '2024-08-01',
        end_date: '2024-08-07',
        expiry_date: '2025-08-07',
        employee_id: 2,
        employee_name: 'Jane Smith',
        designation: 'Manager',
        training_title: 'Leadership Training',
        training_id: 2,
      },
    ];
    pool.query.mockResolvedValueOnce([mockTrainingSessions]);

    const result = await getTrainingSessions();
    expect(result).toEqual(mockTrainingSessions);
  });

  test('createTrainingSession - should insert a new training session and return result info', async () => {
    const mockResult = { insertId: 1, affectedRows: 1 };
    pool.query.mockResolvedValueOnce([mockResult]);

    const result = await createTrainingSession(1, 1, 'Scheduled', '2024-07-01', '2024-07-07');
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO employees_trainings (employee_id, training_id, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)",
      [1, 1, 'Scheduled', '2024-07-01', '2024-07-07']
    );
    expect(result).toEqual(mockResult);
  });
});
