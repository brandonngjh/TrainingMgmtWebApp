import request from "supertest";
import express from "express";
import departmentRoutes from "../routes/departmentRoutes";
import {
  getDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../database/departmentDatabase";

jest.mock("../database/departmentDatabase.js", () => ({
  getDepartments: jest.fn(),
  getDepartmentByID: jest.fn(),
  createDepartment: jest.fn(),
  deleteDepartment: jest.fn(),
  updateDepartment: jest.fn(),
}));

jest.mock("../middleware/middleware.js", () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/departments", departmentRoutes);

describe("Integration Test: departmentRoutes.js", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /departments - should fetch all departments", async () => {
    const mockDepartments = [
      { id: 1, name: "HR" },
      { id: 2, name: "Engineering" },
    ];
    getDepartments.mockResolvedValue(mockDepartments);

    const res = await request(app).get("/departments");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDepartments);
  });

  test("GET /departments/:id - should fetch a department by ID", async () => {
    const mockDepartment = { id: 1, name: "HR" };
    getDepartmentByID.mockResolvedValue(mockDepartment);

    const res = await request(app).get("/departments/1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockDepartment);
  });

  test("GET /departments/:id - should return 404 if department not found", async () => {
    getDepartmentByID.mockResolvedValue(null);

    const res = await request(app).get("/departments/99");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Department not found");
  });

  test("POST /departments - should create a new department", async () => {
    const newDepartment = { id: 3, name: "Marketing" };
    createDepartment.mockResolvedValue(newDepartment);

    const res = await request(app).post("/departments").send({
      name: "Marketing",
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual(newDepartment);
  });

  test("POST /departments - should return 400 if name is not provided", async () => {
    const res = await request(app).post("/departments").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Send required field: name");
  });

  test("DELETE /departments/:id - should delete a department", async () => {
    deleteDepartment.mockResolvedValue("Delete Successful");

    const res = await request(app).delete("/departments/1");
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Delete Successful");
  });

  test("PUT /departments/:id - should update a department", async () => {
    const updatedDepartment = { id: 1, name: "HR Updated" };
    updateDepartment.mockResolvedValue(updatedDepartment);

    const res = await request(app).put("/departments/1").send({
      name: "HR Updated",
    });
    expect(res.status).toBe(200);
    expect(res.body).toEqual(updatedDepartment);
  });

  test("PUT /departments/:id - should return 400 if name is not provided", async () => {
    const res = await request(app).put("/departments/1").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Send required field: name");
  });

  test("PUT /departments/:id - should return 404 if department not found", async () => {
    updateDepartment.mockResolvedValue(null);

    const res = await request(app).put("/departments/99").send({
      name: "Non-existent",
    });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Department not found");
  });
});
