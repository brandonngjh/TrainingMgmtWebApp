import request from "supertest";
import express from "express";
import jobRoutes from "../routes/jobRoutes.js";

jest.mock("../database/jobDatabase", () => ({
  getJobs: jest.fn(),
  getJobByID: jest.fn(),
  createJob: jest.fn(),
  deleteJob: jest.fn(),
  updateJob: jest.fn(),
}));

import {
  getJobs,
  getJobByID,
  createJob,
  deleteJob,
  updateJob,
} from "../database/jobDatabase.js";

jest.mock("../middleware/middleware.js", () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use("/jobs", jobRoutes);

describe("Unit Test: Job Routes", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /jobs - should fetch all jobs", async () => {
    const mockJobs = [{ id: 1, name: "Job 1", department_id: 1 }];
    getJobs.mockResolvedValue(mockJobs);

    const res = await request(app).get("/jobs");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockJobs);
    expect(getJobs).toHaveBeenCalled();
  });

  test("GET /jobs/:id - should fetch a job by ID", async () => {
    const mockJob = { id: 1, name: "Job 1", department_id: 1 };
    getJobByID.mockResolvedValue(mockJob);

    const res = await request(app).get("/jobs/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockJob);
    expect(getJobByID).toHaveBeenCalledWith("1");
  });

  test("POST /jobs - should create a new job", async () => {
    const mockJob = { id: 1, name: "Job 1", department_id: 1 };
    createJob.mockResolvedValue(mockJob);

    const res = await request(app).post("/jobs").send({
      name: "Job 1",
      department_id: 1,
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(mockJob);
    expect(createJob).toHaveBeenCalledWith("Job 1", 1);
  });

  test("POST /jobs - should return 400 if required fields are missing", async () => {
    const res = await request(app).post("/jobs").send({
      name: "Job 1",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "Send required fields: name, department_id",
    });
    expect(createJob).not.toHaveBeenCalled();
  });

  test("DELETE /jobs/:id - should delete a job", async () => {
    deleteJob.mockResolvedValue("Delete Successful");

    const res = await request(app).delete("/jobs/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Delete Successful" });
    expect(deleteJob).toHaveBeenCalledWith("1");
  });

  test("PUT /jobs/:id - should update a job", async () => {
    const mockJob = { id: 1, name: "Job 1 Updated", department_id: 1 };
    updateJob.mockResolvedValue(mockJob);

    const res = await request(app).put("/jobs/1").send({
      name: "Job 1 Updated",
      department_id: 1,
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockJob);
    expect(updateJob).toHaveBeenCalledWith("1", "Job 1 Updated", 1);
  });

  test("PUT /jobs/:id - should return 400 if required fields are missing", async () => {
    const res = await request(app).put("/jobs/1").send({
      name: "Job 1 Updated",
    });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      message: "Send required fields: name, department_id",
    });
    expect(updateJob).not.toHaveBeenCalled();
  });
});