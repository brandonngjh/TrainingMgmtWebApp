import request from 'supertest';
import express from 'express';
import trainingSessionRoutes from '../routes/trainingSessionRoutes';

jest.mock('../database/trainingSessionDatabase', () => ({
  getTrainingSessions: jest.fn(),
  createTrainingSession: jest.fn(),
}));

import {
  getTrainingSessions,
  createTrainingSession,
} from '../database/trainingSessionDatabase';

jest.mock('../middleware/middleware.js', () => ({
  protect: (req, res, next) => next(),
}));

const app = express();
app.use(express.json());
app.use('/training-sessions', trainingSessionRoutes);

describe('Integration Test: Training Sessions Routes', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /training-sessions - should fetch all training sessions', async () => {
    const mockTrainingSessions = [{ id: 1, status: 'Completed' }];
    getTrainingSessions.mockResolvedValue(mockTrainingSessions);
    const res = await request(app).get('/training-sessions');
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTrainingSessions);
  });

  test('POST /training-sessions - should create new training sessions', async () => {
    const mockTrainingSession = { insertId: 1, affectedRows: 1 };
    createTrainingSession.mockResolvedValue(mockTrainingSession);
    const res = await request(app).post('/training-sessions').send({
      employee_ids: [1, 2],
      training_id: 1,
      status: 'Pending',
      start_date: '2024-07-01',
      end_date: '2024-07-07',
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual([mockTrainingSession, mockTrainingSession]);
  });
});
