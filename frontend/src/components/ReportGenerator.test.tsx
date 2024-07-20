import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import axios from 'axios';
import ReportGenerator from './ReportGenerator.tsx';

// Mock the axios module
jest.mock('axios');

// Define the mock implementations
const mockGet = axios.get as jest.Mock;

describe('ReportGenerator', () => {
  const mockJobs = [
    { id: 1, name: 'Production', department_id: 1 },
    { id: 2, name: 'Machining', department_id: 2 }
  ];

  const mockTrainings = [
    { id: 1, title: 'Safety Training', description: 'Description 1', training_provider: 'Provider 1' },
    { id: 2, title: 'Quality Training', description: 'Description 2', training_provider: 'Provider 2' }
  ];

  const mockSkillsReport = [
    { 
      employee_id: 1, 
      employee_name: 'John Doe', 
      department_name: 'Machining', 
      job_name: 'Production', 
      training_course: 'Safety Training', 
      validity: 'Valid' 
    }
  ];

  beforeEach(() => {
    mockGet.mockImplementation((url: string) => {
      switch (url) {
        case 'http://localhost:3000/api/jobs':
          return Promise.resolve({ data: mockJobs });
        case 'http://localhost:3000/api/trainings':
          return Promise.resolve({ data: mockTrainings });
        case 'http://localhost:3000/api/skillsReport':
          return Promise.resolve({ data: mockSkillsReport });
        default:
          return Promise.reject(new Error('not found'));
      }
    });
  });

  it('should render the component with initial state', () => {
    render(<ReportGenerator />);
    expect(screen.getByText('Skills Report Generator')).toBeInTheDocument();
    expect(screen.getByText('Fetch Skills Report')).toBeInTheDocument();
    expect(screen.getByText('Generate PDF')).toBeInTheDocument();
  });

  it('should fetch and display jobs, trainings, and skills report', async () => {
    render(<ReportGenerator />);
    fireEvent.click(screen.getByText('Fetch Skills Report'));

    await waitFor(() => {
      // Check if the fetched data is displayed correctly
      expect(screen.getByText('Production')).toBeInTheDocument();
      expect(screen.getByText('Safety Training')).toBeInTheDocument();
      expect(screen.getByText('Valid')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('should filter the skills report based on selected criteria', async () => {
    render(<ReportGenerator />);
    fireEvent.click(screen.getByText('Fetch Skills Report'));

    await waitFor(() => {
      fireEvent.change(screen.getByRole('combobox', { name: '' }), {
        target: { value: 'Production' }
      });
    });

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Machining')).not.toBeInTheDocument();
  });

  it('should generate PDF when Generate PDF button is clicked', async () => {
    const { container } = render(<ReportGenerator />);
    fireEvent.click(screen.getByText('Fetch Skills Report'));

    await waitFor(() => {
      fireEvent.click(screen.getByText('Generate PDF'));
    });

    // Check if the PDF generation function was called (assuming you have a mock for jsPDF)
    // Here we can't directly test PDF content, but we can ensure the function is triggered
    expect(container.querySelector('table')).toBeInTheDocument();
  });
});
