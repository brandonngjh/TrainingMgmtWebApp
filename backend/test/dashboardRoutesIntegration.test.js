import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../routes/dashboardRoutes.js';
import pool from '../database/database.js';

jest.mock('../middleware/middleware.js', () => ({
    protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/dashboard', dashboardRoutes);

describe('Integration Test: Dashboard Routes', () => {
    const mockEmployees = [
        { id: 2000, name: 'John Doe', designation: 'Manager' },
        { id: 2001, name: 'Jane Smith', designation: 'Developer' },
    ];

    const mockTrainings = [
        { id: 2000, title: 'Safety Training' },
        { id: 2001, title: 'Quality Training' },
    ];

    const mockRelevantTrainings = [
        { employee_id: 2000, training_id: 2000, validity: 'Valid' },
        { employee_id: 2001, training_id: 2001, validity: 'Expired' },
    ];

    const mockEmployeeTrainings = [
        { employee_id: 2000, training_id: 2000, status: 'Completed', end_date: '2023-07-01', expiry_date: '2024-07-01', start_date: '2023-06-01' },
        { employee_id: 2001, training_id: 2001, status: 'Completed', end_date: '2023-06-01', expiry_date: '2024-06-01', start_date: '2023-05-01' },
    ];

    beforeEach(async () => {
        console.log('Inserting mock data...')
        await pool.query("INSERT INTO employees (id, name, designation) VALUES ?", [mockEmployees.map(e => [e.id, e.name, e.designation])]);
        await pool.query("INSERT INTO trainings (id, title) VALUES ?", [mockTrainings.map(t => [t.id, t.title])]);
        await pool.query("INSERT INTO relevant_trainings (employee_id, training_id, validity) VALUES ?", [mockRelevantTrainings.map(rt => [rt.employee_id, rt.training_id, rt.validity])]);
        await pool.query("INSERT INTO employees_trainings (employee_id, training_id, status, end_date, expiry_date, start_date) VALUES ?", [mockEmployeeTrainings.map(et => [et.employee_id, et.training_id, et.status, et.end_date, et.expiry_date, et.start_date])]);
    });

    afterEach(async () => {
        console.log('Deleting mock data...')
        await pool.query("DELETE FROM relevant_trainings WHERE employee_id IN (?, ?)", [2000, 2001]);
        await pool.query("DELETE FROM employees_trainings WHERE employee_id IN (?, ?)", [2000, 2001]);
        await pool.query("DELETE FROM trainings WHERE id IN (?, ?)", [2000, 2001]);
        await pool.query("DELETE FROM employees WHERE id IN (?, ?)", [2000, 2001]);
    });

    afterAll(async () => {
        await pool.end();
    });

    test('GET /dashboard - should fetch all employee details with relevant trainings and dates', async () => {
        const expectedData = [
            {
                employee_id: 2000,
                name: 'John Doe',
                designation: 'Manager',
                relevantTrainings: [
                    {
                        validity: 'Valid',
                        title: 'Safety Training',
                        latest_end_date: '2023-07-01',
                        expiry_date: '2024-07-01',
                        scheduled_date: '2023-06-01',
                    },
                ],
            },
            {
                employee_id: 2001,
                name: 'Jane Smith',
                designation: 'Developer',
                relevantTrainings: [
                    {
                        validity: 'Expired',
                        title: 'Quality Training',
                        latest_end_date: '2023-06-01',
                        expiry_date: '2024-06-01',
                        scheduled_date: '2023-05-01',
                    },
                ],
            },
        ];

        const response = await request(app).get('/dashboard');
        expect(response.status).toBe(200);
    });

    test('GET /dashboard/percentage - should fetch percentage of employees with valid trainings', async () => {
        const response = await request(app).get('/dashboard/percentage');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            percentageValidEmployees: '6.00',
        });
    });

    test('GET /dashboard/numbers - should fetch number of employees with valid and total trainings', async () => {
        const response = await request(app).get('/dashboard/numbers');
        expect(response.status).toBe(200);
    });

    test('GET /dashboard/employeeDetails - should fetch all employee details', async () => {
        const response = await request(app).get('/dashboard/employeeDetails');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            { employee_id: 2000, employee_name: 'John Doe', designation: 'Manager' },
            { employee_id: 2001, employee_name: 'Jane Smith', designation: 'Developer' },
        ]));
    });

    test('GET /dashboard/relevantTrainings - should fetch all relevant trainings', async () => {
        const response = await request(app).get('/dashboard/relevantTrainings');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.arrayContaining([
            { employee_id: 2000, training_id: 2000, validity: 'Valid', title: 'Safety Training' },
            { employee_id: 2001, training_id: 2001, validity: 'Expired', title: 'Quality Training' },
        ]));
    });

    test('GET /dashboard/trainingDates - should fetch all training dates', async () => {
        const expectedData = [
            { employee_id: 2000, training_id: 2000, title: 'Safety Training', latest_end_date: '2023-07-01', expiry_date: '2024-07-01', scheduled_date: '2023-06-01' },
            { employee_id: 2001, training_id: 2001, title: 'Quality Training', latest_end_date: '2023-06-01', expiry_date: '2024-06-01', scheduled_date: '2023-05-01' },
        ];

        const response = await request(app).get('/dashboard/trainingDates');
        expect(response.status).toBe(200);
    });
});
