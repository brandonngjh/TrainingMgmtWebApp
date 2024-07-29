import request from "supertest";
import express from "express";
import employeeRoutes from "../routes/employeeRoutes";

jest.mock("../database/employeeDatabase", () => ({
  getEmployees: jest.fn(),
  getEmployeeByID: jest.fn(),
  createEmployee: jest.fn(),
  deleteEmployee: jest.fn(),
  updateEmployee: jest.fn(),
}));

import {
  getEmployees,
  getEmployeeByID,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "../database/employeeDatabase";

const app = express();
app.use(express.json());
app.use("/employees", employeeRoutes);

describe("Integration Test: employeeRoutes.js", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("", async () => {
    const mockEmployees = [{id: 1, name: 'John Doe'}]
    getEmployees.mockResolvedValue(mockEmployees);
    const res = await request(app).get('/employees')
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEmployees)
  });
});
