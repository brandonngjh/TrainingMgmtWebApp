import pool from "../database/database.js";
import {
  jobIdExists,
  getJobs,
  getJobByID,
  createJob,
  deleteJob,
  updateJob,
} from "../database/jobDatabase.js";

jest.mock('../database/database.js', () => ({
    query: jest.fn()
}))

describe('Unit Test: Job Database Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    const mockJobs = [
        { id: 1, name: 'Job 1', department_id: 1 },
        { id: 2, name: 'Job 2', department_id: 2 },
    ];

    test("jobIdExists - return true if job ID exists", async() => {
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
        const result = await jobIdExists(1);
        console.log("jobIdExists result: " + result)
        expect(result).toBe(true);
    });

    test("jobIdExists - return false if job ID does not exist", async() => {
        pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
        const result = await jobIdExists(1);
        console.log("jobIdExists result: " + result)
        expect(result).toBe(false);
    });

    test('getJobs - should return all jobs', async () => {
        pool.query.mockResolvedValueOnce([mockJobs]);
        const result = await getJobs();
        expect(result).toEqual(mockJobs);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM jobs");
    });

    test('getJobByID - should return a job by ID', async () => {
        const mockJob = { id: 1, name: 'Job 1', department_id: 1 };
        pool.query.mockResolvedValueOnce([[mockJob]]);
        const result = await getJobByID(1);
        expect(result).toEqual(mockJob);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM jobs WHERE id = ?", [1]);
    });

    test('createJob - should create a new job', async () => {
        const mockResult = { insertId: 3 };
        const mockJob = { id: 3, name: 'Job 3', department_id: 3 };
        pool.query.mockResolvedValueOnce([mockResult]);
        pool.query.mockResolvedValueOnce([[mockJob]]);
        const result = await createJob('Job 3', 3);
        expect(result).toEqual(mockJob);
        expect(pool.query).toHaveBeenCalledWith("INSERT INTO jobs (name, department_id) VALUES (?, ?)", ['Job 3', 3]);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM jobs WHERE id = ?", [3]);
    });

    test('deleteJob - should delete a job and return success message', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
        const result = await deleteJob(1);
        expect(result).toBe('Delete Successful');
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM jobs WHERE id = ?", [1]);
    });

    test('deleteJob - should return not found message if job does not exist', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
        const result = await deleteJob(1);
        expect(result).toBe('Job not found');
        expect(pool.query).toHaveBeenCalledWith("DELETE FROM jobs WHERE id = ?", [1]);
    });

    test('updateJob - should throw an error if job ID does not exist', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
        await expect(updateJob(1, 'Job 1', 1))
          .rejects
          .toThrow('Job with id 1 does not exist');
        expect(pool.query).toHaveBeenCalledWith("SELECT COUNT(*) as count FROM jobs WHERE id = ?", [1]);
    });

    test('updateJob - should update an existing job', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
        const mockJob = { id: 1, name: 'Job 1 Updated', department_id: 1 };
        pool.query.mockResolvedValueOnce([[mockJob]]);
        const result = await updateJob(1, 'Job 1 Updated', 1);
        expect(result).toEqual(mockJob);
        expect(pool.query).toHaveBeenCalledWith("UPDATE jobs SET name = ?, department_id = ? WHERE id = ?", ['Job 1 Updated', 1, 1]);
        expect(pool.query).toHaveBeenCalledWith("SELECT * FROM jobs WHERE id = ?", [1]);
    });
});
