import pool from "../database/database.js";
import {
  getAllTrainingSessions,
  getTrainingSession,
  createTrainingSession,
} from "../database/trainingSessionDatabase.js";

jest.mock("../database/database.js", () => ({
  query: jest.fn(),
}));

describe("Unit Test: Training Session Database Functions", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("getAllTrainingSessions - should return all training sessions", async () => {
    const mockTrainingSessions = [
      {
        session_id: 1,
        status: "Completed",
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        employee_id: 1,
        employee_name: "John Doe",
        designation: "Engineer",
        training_title: "Safety Training",
        training_id: 1,
      },
      {
        session_id: 1,
        status: "Completed",
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        employee_id: 2,
        employee_name: "Jane Smith",
        designation: "Manager",
        training_title: "Safety Training",
        training_id: 1,
      },
    ];
    pool.query.mockResolvedValueOnce([mockTrainingSessions]);

    const result = await getAllTrainingSessions();
    expect(result).toEqual({
      1: {
        session_id: 1,
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        training_title: "Safety Training",
        training_id: 1,
        employees: [
          {
            employee_id: 1,
            employee_name: "John Doe",
            designation: "Engineer",
            status: "Completed",
          },
          {
            employee_id: 2,
            employee_name: "Jane Smith",
            designation: "Manager",
            status: "Completed",
          },
        ],
      },
    });
  });

  test("getTrainingSession - should return a specific training session", async () => {
    const mockTrainingSession = [
      {
        session_id: 1,
        status: "Completed",
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        employee_id: 1,
        employee_name: "John Doe",
        designation: "Engineer",
        training_title: "Safety Training",
        training_id: 1,
      },
    ];
    pool.query.mockResolvedValueOnce([mockTrainingSession]);

    const result = await getTrainingSession(1);
    expect(result).toEqual({
      1: {
        session_id: 1,
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        training_title: "Safety Training",
        training_id: 1,
        employees: [
          {
            employee_id: 1,
            employee_name: "John Doe",
            designation: "Engineer",
            status: "Completed",
          },
        ],
      },
    });
  });

  test("createTrainingSession - should insert new training sessions and return formatted result", async () => {
    const mockMaxSessionId = [{ maxSessionId: 0 }];
    const mockValidityPeriod = [{ validity_period: 12 }];
    const mockInsertResult = { affectedRows: 2 };
    const mockCreatedSession = [
      {
        session_id: 1,
        status: "Scheduled",
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        employee_id: 1,
        employee_name: "John Doe",
        designation: "Engineer",
        training_title: "Safety Training",
        training_id: 1,
      },
      {
        session_id: 1,
        status: "Scheduled",
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        employee_id: 2,
        employee_name: "Jane Smith",
        designation: "Manager",
        training_title: "Safety Training",
        training_id: 1,
      },
    ];

    pool.query
      .mockResolvedValueOnce([mockMaxSessionId])
      .mockResolvedValueOnce([mockValidityPeriod])
      .mockResolvedValueOnce(mockInsertResult)
      .mockResolvedValueOnce(mockInsertResult)
      .mockResolvedValueOnce([mockCreatedSession]);

    const result = await createTrainingSession(
      [1, 2],
      1,
      "Scheduled",
      "2024-07-01",
      "2024-07-07"
    );
    expect(result).toEqual({
      1: {
        session_id: 1,
        start_date: "2024-07-01",
        end_date: "2024-07-07",
        expiry_date: "2025-07-07",
        training_title: "Safety Training",
        training_id: 1,
        employees: [
          {
            employee_id: 1,
            employee_name: "John Doe",
            designation: "Engineer",
            status: "Scheduled",
          },
          {
            employee_id: 2,
            employee_name: "Jane Smith",
            designation: "Manager",
            status: "Scheduled",
          },
        ],
      },
    });
  });
});
