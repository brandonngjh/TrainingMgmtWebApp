import { expect } from 'chai';
import { getEmployeeDetails, getRelevantCourses, getTrainingDates } from '../database/dashboardDatabase.js';

describe('Database Integration Tests', function() {

  describe('getEmployeeDetails', () => {
    it('should return correct employee details', async () => {
      const result = await getEmployeeDetails();
      
      const employee = result[0];

      expect(employee).to.have.property('employee_id', 21);
      expect(employee).to.have.property('employee_name', 'Bob');
      expect(employee).to.have.property('department_name', 'Machining');
      expect(employee).to.have.property('job_name', 'Production');
    });
  });

  describe('getRelevantCourses', () => {
    it('should return correct relevant courses', async () => {
      const result = await getRelevantCourses();
      
      const relevantCourse = result[3];

      expect(relevantCourse).to.have.property('employee_id', 21);
      expect(relevantCourse).to.have.property('training_id', 7);
      expect(relevantCourse).to.have.property('validity', 'NA');
      expect(relevantCourse).to.have.property('title', '5S');
    });
  });

  describe('getTrainingDates of Completed Valid Training', () => {
    it('should return correct training dates', async () => {
      const result = await getTrainingDates();
      
      const trainingDates = result[2];

      expect(trainingDates).to.have.property('employee_id', 21);
      expect(trainingDates).to.have.property('training_id', 6);
      expect(trainingDates).to.have.property('title', 'SAFETY AWARENESS (PPE)');
      expect(trainingDates).to.have.property('latest_end_date');
      expect(new Date(trainingDates.latest_end_date).toISOString()).to.equal('2024-01-30T16:00:00.000Z');
      expect(trainingDates).to.have.property('expiry_date');
      expect(new Date(trainingDates.expiry_date).toISOString()).to.equal('2025-01-30T16:00:00.000Z');
      expect(trainingDates).to.have.property('scheduled_date', null);
    });
  });

  describe('getTrainingDates of Scheduled Training with Past Completed Training', () => {
    it('should return correct training dates', async () => {
      const result = await getTrainingDates();
      
      const trainingDates = result[6];

      expect(trainingDates).to.have.property('employee_id', 22);
      expect(trainingDates).to.have.property('training_id', 4);
      expect(trainingDates).to.have.property('title', 'FOD');
      expect(trainingDates).to.have.property('latest_end_date');
      expect(new Date(trainingDates.latest_end_date).toISOString()).to.equal('2022-10-01T16:00:00.000Z');
      expect(trainingDates).to.have.property('expiry_date');
      expect(new Date(trainingDates.expiry_date).toISOString()).to.equal('2023-11-26T16:00:00.000Z');
      expect(trainingDates).to.have.property('scheduled_date');
      expect(new Date(trainingDates.scheduled_date).toISOString()).to.equal('2024-08-31T16:00:00.000Z');
    });
  });

  describe('getTrainingDates of Scheduled Training without Past Completed Training', () => {
    it('should return correct training dates', async () => {
      const result = await getTrainingDates();
      
      const trainingDates = result[5];

      expect(trainingDates).to.have.property('employee_id', 22);
      expect(trainingDates).to.have.property('training_id', 3);
      expect(trainingDates).to.have.property('title', 'CI & IP AWARENESS');
      expect(trainingDates).to.have.property('latest_end_date', null);
      expect(trainingDates).to.have.property('expiry_date', null);
      expect(trainingDates).to.have.property('scheduled_date');
      expect(new Date(trainingDates.scheduled_date).toISOString()).to.equal('2024-08-31T16:00:00.000Z');
    });
  });
});
