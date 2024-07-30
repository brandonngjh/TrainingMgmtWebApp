import request from 'supertest';
import express from 'express';
import dashboardRoutes from '../routes/dashboardRoutes.js';
import * as dashboardDatabase from '../database/dashboardDatabase.js';

jest.mock('../database/dashboardDatabase.js');
jest.mock('../middleware/middleware.js', () => ({
  protect: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/dashboard', dashboardRoutes);

describe('Test: Dashboard Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /dashboard should return combined employee training details', async () => {
    const mockCombinedEmployeeTrainingDetails = [
      {
        employee_id: 1,
        employee_name: 'John Doe',
        designation: 'Material Planner',
        relevantTrainings: [
          {
            validity: 'Valid',
            title: 'COUNTERFEIT',
            latest_end_date: '2024-07-01',
            expiry_date: '2025-07-01',
            scheduled_date: null
          }
        ]
      },
      {
        employee_id: 2,
        employee_name: 'Jane Smith',
        designation: 'Production Machining HOD',
        relevantTrainings: [
          {
            validity: 'NA',
            title: 'FOD',
            latest_end_date: null,
            expiry_date: null,
            scheduled_date: '2024-10-15'
          }
        ]
      }
    ];

    dashboardDatabase.getCombinedEmployeeTrainingDetails.mockResolvedValue(mockCombinedEmployeeTrainingDetails);

    const response = await request(app).get('/dashboard');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCombinedEmployeeTrainingDetails);
  });

  test('GET /dashboard/percentage should return percentage of valid employees', async () => {
    dashboardDatabase.getPercentageValidEmployees.mockResolvedValue('50.00');

    const response = await request(app).get('/dashboard/percentage');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ percentageValidEmployees: '50.00' });
  });

  test('GET /dashboard/numbers should return training stats', async () => {
    const mockTrainingStats = {
        'COUNTERFEIT': {
            numberOfEmployeesWithValid: '1',
            numberOfEmployeesWithTraining: '1'
        },
        'FOD': {
            numberOfEmployeesWithValid: '1',
            numberOfEmployeesWithTraining: '2'
        }
    };

    dashboardDatabase.getTrainingStats.mockResolvedValue(mockTrainingStats);

    const response = await request(app).get('/dashboard/numbers');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTrainingStats);
  });

  test('GET /dashboard/employeeDetails should return employee details', async () => {
    const mockEmployeeDetails = [
      { employee_id: 1, employee_name: 'John Doe', designation: 'Material Planner' },
      { employee_id: 2, employee_name: 'Jane Smith', designation: 'Production Machining HOD' }
    ];

    dashboardDatabase.getEmployeeDetails.mockResolvedValue(mockEmployeeDetails);

    const response = await request(app).get('/dashboard/employeeDetails');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockEmployeeDetails);
  });

  test('GET /dashboard/relevantTrainings should return relevant trainings', async () => {
    const mockRelevantTrainings = [
        { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
        { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' }
    ];

    dashboardDatabase.getRelevantCourses.mockResolvedValue(mockRelevantTrainings);

    const response = await request(app).get('/dashboard/relevantTrainings');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockRelevantTrainings);
  });

  test('GET /dashboard/trainingDates should return training dates', async () => {
    const mockTrainingDates = [
        { employee_id: 1, training_id: 2, title: 'COUNTERFEIT', latest_end_date: '2024-07-01', expiry_date: '2025-07-01', scheduled_date: null },
        { employee_id: 2, training_id: 3, title: 'FOD', latest_end_date: null, expiry_date: null, scheduled_date: '2024-10-15' }
    ];

    dashboardDatabase.getTrainingDates.mockResolvedValue(mockTrainingDates);

    const response = await request(app).get('/dashboard/trainingDates');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockTrainingDates);
  });
});
