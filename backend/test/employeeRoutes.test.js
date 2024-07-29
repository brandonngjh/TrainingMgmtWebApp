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

jest.mock("../middleware/middleware.js", () => ({
    protect: (req, res, next) => next(),
}))

const app = express();
app.use(express.json());
app.use("/employees", employeeRoutes);

describe("Integration Test: Employee Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /employees - should fetch all employees', async () => {
    const mockEmployees = [{ id: 1, name: 'John Doe' }];
    getEmployees.mockResolvedValue(mockEmployees);
    const res = await request(app).get('/employees');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEmployees);
  });

  test('GET /employees/:id - should fetch an employee by ID', async () => {
    const mockEmployee = { id: 1, name: 'John Doe' };
    getEmployeeByID.mockResolvedValue(mockEmployee);
    const res = await request(app).get('/employees/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEmployee);
  });

  test('POST /employees - should create a new employee', async () => {
    const mockEmployee = { id: 1, name: 'John Doe' };
    createEmployee.mockResolvedValue(mockEmployee);
    const res = await request(app).post('/employees').send({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      hire_date: '2023-07-28',
      designation: 'Engineer',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockEmployee);
  });

  test('DELETE /employees/:id - should delete an employee', async () => {
    deleteEmployee.mockResolvedValue('Delete Successful');
    const res = await request(app).delete('/employees/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Delete Successful' });
  });

  test('PUT /employees/:id - should update an employee', async () => {
    const mockEmployee = { id: 1, name: 'John Doe' };
    updateEmployee.mockResolvedValue(mockEmployee);
    const res = await request(app).put('/employees/1').send({
      name: 'John Doe',
      email: 'john@example.com',
      hire_date: '2023-07-28',
      designation: 'Engineer',
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockEmployee);
  });

});
