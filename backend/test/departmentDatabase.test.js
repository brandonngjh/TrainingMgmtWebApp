import pool from "../database/database.js";
import {
  departmentIdExists,
  getDepartments,
  getDepartmentByID,
  createDepartment,
  deleteDepartment,
  updateDepartment,
} from "../database/departmentDatabase.js";

jest.mock('../database/database.js', () => ({
    query: jest.fn()
}))

describe('Unit Test: departmentDatabase.js Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    const mockDepartmentsData = [
        { id: 1, name: 'HR' },
        { id: 2, name: 'Engineering' },
        { id: 3, name: 'Sales' },
    ];

    const countQuery = "SELECT COUNT(*) as count FROM departments WHERE id = ?";
    const getAllQuery = "SELECT * FROM departments";
    const getByIdQuery = "SELECT * FROM departments WHERE id = ?";
    const deleteQuery = "DELETE FROM departments WHERE id = ?";
    const updateQuery = "UPDATE departments SET name = ? WHERE id = ?";

    test('departmentIdExists - should return true if department ID exists', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 1 }]]);
        const result = await departmentIdExists(1);
        expect(result).toBe(true);
        expect(pool.query).toHaveBeenCalledWith(countQuery, [1]);
    });

    test('departmentIdExists - should return false if department ID does not exist', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 0 }]]);
        const result = await departmentIdExists(99);
        expect(result).toBe(false);
        expect(pool.query).toHaveBeenCalledWith(countQuery, [99]);
    });

    test('getDepartments - should fetch all departments', async () => {
        pool.query.mockResolvedValueOnce([mockDepartmentsData]);

        const result = await getDepartments();
        expect(result).toEqual(mockDepartmentsData);
        expect(pool.query).toHaveBeenCalledWith(getAllQuery);
    });

    test('getDepartmentByID - should fetch a department by ID', async () => {
        const expectedDepartment = { id: 1, name: 'HR' };
        pool.query.mockResolvedValueOnce([[expectedDepartment]]);

        const result = await getDepartmentByID(1);
        expect(result).toEqual(expectedDepartment);
        expect(pool.query).toHaveBeenCalledWith(getByIdQuery, [1]);
    });

    test('getDepartmentByID - should return undefined if department does not exist', async () => {
        pool.query.mockResolvedValueOnce([[]]);

        const result = await getDepartmentByID(99);
        expect(result).toBeUndefined();
        expect(pool.query).toHaveBeenCalledWith(getByIdQuery, [99]);
    });

    test('createDepartment - should create a new department', async () => {
        const newDepartment = { id: 4, name: 'Marketing' };
        pool.query
          .mockResolvedValueOnce([{ insertId: newDepartment.id }])
          .mockResolvedValueOnce([[newDepartment]]);

        const result = await createDepartment(newDepartment.name);
        expect(result).toEqual(newDepartment);
        expect(pool.query).toHaveBeenCalledWith(getByIdQuery, [newDepartment.id]);
    });

    test('deleteDepartment - should delete a department', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);

        const result = await deleteDepartment(1);
        expect(result).toBe("Delete Successful");
        expect(pool.query).toHaveBeenCalledWith(deleteQuery, [1]);
    });

    test('deleteDepartment - should return not found message if department does not exist', async () => {
        pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);

        const result = await deleteDepartment(99);
        expect(result).toBe("Department not found");
        expect(pool.query).toHaveBeenCalledWith(deleteQuery, [99]);
    });

    test('updateDepartment - should update an existing department', async () => {
        const updatedDepartment = { id: 1, name: 'HR Updated' };
        pool.query
          .mockResolvedValueOnce([[{ count: 1 }]])
          .mockResolvedValueOnce([{ affectedRows: 1 }])
          .mockResolvedValueOnce([[updatedDepartment]]);

        const result = await updateDepartment(updatedDepartment.id, updatedDepartment.name);
        expect(result).toEqual(updatedDepartment);
        expect(pool.query).toHaveBeenCalledWith(countQuery, [updatedDepartment.id]);
        expect(pool.query).toHaveBeenCalledWith(updateQuery, [updatedDepartment.name, updatedDepartment.id]);
        expect(pool.query).toHaveBeenCalledWith(getByIdQuery, [updatedDepartment.id]);
    });

    test('updateDepartment - should throw error if department does not exist', async () => {
        pool.query.mockResolvedValueOnce([[{ count: 0 }]]);

        await expect(updateDepartment(99, 'Non-existent'))
          .rejects
          .toThrow('Department with id 99 does not exist');
        expect(pool.query).toHaveBeenCalledWith(countQuery, [99]);
    });
});
