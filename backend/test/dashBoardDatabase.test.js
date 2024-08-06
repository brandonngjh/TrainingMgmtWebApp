import pool from "../database/database.js";
import {
    getEmployeeDetails,
    getRelevantCourses,
    getTrainingDates,
} from "../database/dashboardDatabase.js";

jest.mock('../database/database.js', () => ({
    query: jest.fn()
}))

describe('Unit Test: Dashboard Database Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    const mockEmployeeDetailsData = [
        { employee_id: 1, employee_name: 'John Doe', designation: 'Engineer' },
        { employee_id: 2, employee_name: 'Jane Smith', designation: 'Manager' }
    ];

    const mockRelevantCoursesData = [
        { employee_id: 1, training_id: 101, validity: 'Valid', title: 'Safety Training' },
        { employee_id: 2, training_id: 102, validity: 'Expired', title: 'Quality Training' }
    ];

    const mockTrainingDatesData = [
        { employee_id: 1, training_id: 101, title: 'Safety Training', latest_end_date: '2023-07-10', expiry_date: '2023-08-10', scheduled_date: null },
        { employee_id: 2, training_id: 102, title: 'Quality Training', latest_end_date: '2023-06-15', expiry_date: '2023-07-15', scheduled_date: '2023-09-01' }
    ];

    test('getEmployeeDetails - should fetch all employee details', async () => {
        pool.query.mockResolvedValueOnce([mockEmployeeDetailsData]);

        const result = await getEmployeeDetails();
        expect(result).toEqual(mockEmployeeDetailsData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    test('getRelevantCourses - should fetch all relevant courses', async () => {
        pool.query.mockResolvedValueOnce([mockRelevantCoursesData]);

        const result = await getRelevantCourses();
        expect(result).toEqual(mockRelevantCoursesData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });

    test('getTrainingDates - should fetch all training dates', async () => {
        pool.query.mockResolvedValueOnce([mockTrainingDatesData]);

        const result = await getTrainingDates();
        expect(result).toEqual(mockTrainingDatesData);
        expect(pool.query).toHaveBeenCalledWith(expect.any(String));
    });
});
