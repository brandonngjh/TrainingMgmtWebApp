import { expect } from 'chai';
import { getSkillsReport, getFilteredSkillsReport } from '../database/skillsReportDatabase.js';

describe('Database Integration Tests', function() {

  describe('getSkillsReport', () => {
    it('should return all skills report', async () => {
      const result = await getSkillsReport();
      
      const skill = result[0];

      expect(skill).to.have.property('employee_id');
      expect(skill).to.have.property('employee_name');
      expect(skill).to.have.property('department_name');
      expect(skill).to.have.property('job_name');
      expect(skill).to.have.property('training_course');
      expect(skill).to.have.property('validity');
    });
  });

  describe('getFilteredSkillsReport', () => {
    it('should return filtered skills report by job', async () => {
      const result = await getFilteredSkillsReport({ job: 'Production' });
      
      const skill = result[0];

      expect(skill).to.have.property('job_name', 'Production');
      // Add more properties and values based on the expected filtered result
    });

    it('should return filtered skills report by training', async () => {
      const result = await getFilteredSkillsReport({ training: 'SAFETY AWARENESS (PPE)' });
      
      const skill = result[0];

      expect(skill).to.have.property('training_course', 'SAFETY AWARENESS (PPE)');
      // Add more properties and values based on the expected filtered result
    });

    it('should return filtered skills report by validity', async () => {
      const result = await getFilteredSkillsReport({ validity: 'Valid' });
      
      const skill = result[0];

      expect(skill).to.have.property('validity', 'Valid');
      // Add more properties and values based on the expected filtered result
    });

    it('should return filtered skills report by job and training', async () => {
      const result = await getFilteredSkillsReport({ job: 'Production', training: 'SAFETY AWARENESS (PPE)' });
      
      const skill = result[0];

      expect(skill).to.have.property('job_name', 'Production');
      expect(skill).to.have.property('training_course', 'SAFETY AWARENESS (PPE)');
      // Add more properties and values based on the expected filtered result
    });

    it('should return filtered skills report by job, training, and validity', async () => {
      const result = await getFilteredSkillsReport({ job: 'Production', training: 'SAFETY AWARENESS (PPE)', validity: 'Valid' });
      
      const skill = result[0];

      expect(skill).to.have.property('job_name', 'Production');
      expect(skill).to.have.property('training_course', 'SAFETY AWARENESS (PPE)');
      expect(skill).to.have.property('validity', 'Valid');
      // Add more properties and values based on the expected filtered result
    });
  });

});