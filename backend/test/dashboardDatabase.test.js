import pool from "../database/database.js";
import { 
    getEmployeeDetails,
    getRelevantCourses, 
    getTrainingDates, 
    getCombinedEmployeeTrainingDetails,
    getPercentageValidEmployees,
    getTrainingStats
} from "../database/dashboardDatabase.js";

jest.mock('../database/database.js', () => ({
    query: jest.fn()
}));

describe('Test: dashboardDatabase.js Functions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getEmployeeDetails - should return employee details', async () => {
      const mockEmployeeDetails = [
          { employee_id: 1, employee_name: 'John Doe', designation: 'Material Planner' },
          { employee_id: 2, employee_name: 'Jane Smith', designation: 'Production Machining HOD' }
      ];
      
      pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
      
      const result = await getEmployeeDetails();
      
      expect(result).toEqual(mockEmployeeDetails);
  });

    test('getRelevantCourses - should return relevant courses', async () => {
        const mockRelevantCourses = [
            { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
            { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' }
        ];
        
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        
        const result = await getRelevantCourses();
        
        expect(result).toEqual(mockRelevantCourses);
    });

    test('getTrainingDates - should return training dates', async () => {
        const mockTrainingDates = [
            { employee_id: 1, training_id: 2, title: 'COUNTERFEIT', latest_end_date: '2024-07-01', expiry_date: '2025-07-01', scheduled_date: null },
            { employee_id: 2, training_id: 3, title: 'FOD', latest_end_date: null, expiry_date: null, scheduled_date: '2024-10-15' }
        ];
        
        pool.query.mockResolvedValueOnce([mockTrainingDates]);
        
        const result = await getTrainingDates();
        
        expect(result).toEqual(mockTrainingDates);
    });

    test('getCombinedEmployeeTrainingDetails - should return combined employee training details', async () => {
        const mockEmployeeDetails = [
            { employee_id: 1, employee_name: 'John Doe', designation: 'Material Planner' },
            { employee_id: 2, employee_name: 'Jane Smith', designation: 'Production Machining HOD' }
        ];
        const mockRelevantCourses = [
            { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
            { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' }
        ];
        const mockTrainingDates = [
            { employee_id: 1, training_id: 2, title: 'COUNTERFEIT', latest_end_date: '2024-07-01', expiry_date: '2025-07-01', scheduled_date: null },
            { employee_id: 2, training_id: 3, title: 'FOD', latest_end_date: null, expiry_date: null, scheduled_date: '2024-10-15' }
        ];

        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        pool.query.mockResolvedValueOnce([mockTrainingDates]);
        
        const result = await getCombinedEmployeeTrainingDetails();
        
        const expected = [
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

        expect(result).toEqual(expected);
    });

    test('getPercentageValidEmployees - should return percentage of valid employees', async () => {
        const mockEmployeeDetails = [
            { employee_id: 1, employee_name: 'John Doe', designation: 'Material Planner' },
            { employee_id: 2, employee_name: 'Jane Smith', designation: 'Production Machining HOD' }
        ];
        const mockRelevantCourses = [
            { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
            { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' }
        ];

        pool.query.mockResolvedValueOnce([mockEmployeeDetails]);
        pool.query.mockResolvedValueOnce([mockRelevantCourses]);
        
        const result = await getPercentageValidEmployees();
        
        const expectedPercentage = ((1 / 2) * 100).toFixed(2);

        expect(result).toBe(expectedPercentage);
    });

    test('getTrainingStats - should return training stats', async () => {
        const mockRelevantCourses = [
            { employee_id: 1, training_id: 2, validity: 'Valid', title: 'COUNTERFEIT' },
            { employee_id: 2, training_id: 3, validity: 'NA', title: 'FOD' },
            { employee_id: 1, training_id: 3, validity: 'Valid', title: 'FOD' }
        ];

        pool.query.mockResolvedValueOnce([mockRelevantCourses]);

        const result = await getTrainingStats();
        
        const expectedStats = {
            'COUNTERFEIT': {
                numberOfEmployeesWithValid: '1',
                numberOfEmployeesWithTraining: '1'
            },
            'FOD': {
                numberOfEmployeesWithValid: '1',
                numberOfEmployeesWithTraining: '2'
            }
        };

        expect(result).toEqual(expectedStats);
    });
});
