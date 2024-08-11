import request from "supertest";
import express from "express";
import dashboardRoutes from "../routes/dashboardRoutes";

jest.mock("../models/dashboardModel.js", () => ({
  getEmployeeDetails: jest.fn(),
  getRelevantCourses: jest.fn(),
  getTrainingDates: jest.fn(),
}));

import {
  getEmployeeDetails,
  getRelevantCourses,
  getTrainingDates,
} from "../models/dashboardModel.js";

jest.mock("../middleware/middleware.js", () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/dashboard", dashboardRoutes);

describe("Integration Test: Dashboard Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /dashboard - should fetch all combined employee details", async () => {
    const mockEmployeeDetails = [
      { employee_id: 1, employee_name: "John Doe", designation: "Engineer" },
    ];
    const mockRelevantCourses = [
      { employee_id: 1, training_id: 1, validity: "Valid", title: "Safety Training" },
    ];
    const mockTrainingDates = [
      {
        employee_id: 1,
        training_id: 1,
        title: "Safety Training",
        latest_end_date: "2023-07-01",
        expiry_date: "2023-12-31",
        scheduled_date: null,
      },
    ];

    getEmployeeDetails.mockResolvedValue(mockEmployeeDetails);
    getRelevantCourses.mockResolvedValue(mockRelevantCourses);
    getTrainingDates.mockResolvedValue(mockTrainingDates);

    const res = await request(app).get("/dashboard");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      {
        employee_id: 1,
        employee_name: "John Doe",
        designation: "Engineer",
        relevantTrainings: [
          {
            validity: "Valid",
            title: "Safety Training",
            latest_end_date: "2023-07-01",
            expiry_date: "2023-12-31",
            scheduled_date: null,
          },
        ],
      },
    ]);
  });

  test("GET /dashboard/percentage - should fetch percentage of employees with all valid trainings", async () => {
    const mockEmployeeDetails = [
      { employee_id: 1, employee_name: "John Doe", designation: "Engineer" },
    ];
    const mockRelevantCourses = [
      { employee_id: 1, training_id: 1, validity: "Valid", title: "Safety Training" },
    ];

    getEmployeeDetails.mockResolvedValue(mockEmployeeDetails);
    getRelevantCourses.mockResolvedValue(mockRelevantCourses);

    const res = await request(app).get("/dashboard/percentage");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      percentageValidEmployees: "100.00",
    });
  });

  test("GET /dashboard/numbers - should fetch number of employees with valid trainings", async () => {
    const mockRelevantCourses = [
      { employee_id: 1, training_id: 1, validity: "Valid", title: "Safety Training" },
      { employee_id: 2, training_id: 1, validity: "Expired", title: "Safety Training" },
    ];

    getRelevantCourses.mockResolvedValue(mockRelevantCourses);

    const res = await request(app).get("/dashboard/numbers");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      "Safety Training": {
        numberOfEmployeesWithValid: "1",
        numberOfEmployeesWithTraining: "2",
      },
    });
  });

  test("GET /dashboard/employeeDetails - should fetch all employee details", async () => {
    const mockEmployeeDetails = [
      { employee_id: 1, employee_name: "John Doe", designation: "Engineer" },
    ];

    getEmployeeDetails.mockResolvedValue(mockEmployeeDetails);

    const res = await request(app).get("/dashboard/employeeDetails");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEmployeeDetails);
  });

  test("GET /dashboard/relevantTrainings - should fetch all relevant trainings", async () => {
    const mockRelevantCourses = [
      { employee_id: 1, training_id: 1, validity: "Valid", title: "Safety Training" },
    ];

    getRelevantCourses.mockResolvedValue(mockRelevantCourses);

    const res = await request(app).get("/dashboard/relevantTrainings");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockRelevantCourses);
  });

  test("GET /dashboard/trainingDates - should fetch all training dates", async () => {
    const mockTrainingDates = [
      {
        employee_id: 1,
        training_id: 1,
        title: "Safety Training",
        latest_end_date: "2023-07-01",
        expiry_date: "2023-12-31",
        scheduled_date: null,
      },
    ];

    getTrainingDates.mockResolvedValue(mockTrainingDates);

    const res = await request(app).get("/dashboard/trainingDates");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTrainingDates);
  });
});
