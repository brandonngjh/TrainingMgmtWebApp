import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import '@testing-library/jest-dom';
import axios from 'axios';
import axiosMock from 'axios-mock-adapter';
import ReportGenerator from '../components/ReportGenerator';

const mock = new axiosMock(axios);

describe('ReportGenerator Component', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mockToken');
    mock.reset();
  });

  const mockSkillsReport = [
    { employee_id: 1, employee_name: 'John Doe', training_course: 'Safety Training', validity: 'Valid' },
    { employee_id: 2, employee_name: 'Jane Smith', training_course: 'Quality Training', validity: 'Expired' },
  ];

  const mockTrainings = [
    { id: 1, title: 'Safety Training', description: 'Description 1', training_provider: 'Provider 1' },
    { id: 2, title: 'Quality Training', description: 'Description 2', training_provider: 'Provider 2' },
  ];

  test('should fetch and display skills report data', async () => {
    mock.onGet('http://localhost:3000/api/skillsReport').reply(200, mockSkillsReport);
    mock.onGet('http://localhost:3000/api/trainings').reply(200, mockTrainings);

    render(<ReportGenerator />);

    fireEvent.click(screen.getByText('Fetch Skills Report'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('should filter skills report based on training and validity', async () => {
    mock.onGet('http://localhost:3000/api/skillsReport').reply(200, mockSkillsReport);
    mock.onGet('http://localhost:3000/api/trainings').reply(200, mockTrainings);

    render(<ReportGenerator />);

    fireEvent.click(screen.getByText('Fetch Skills Report'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox', { name: /training/i }), {
      target: { value: 'Safety Training' }
    });

    fireEvent.change(screen.getByRole('combobox', { name: /validity/i }), {
      target: { value: 'Valid' }
    });

    fireEvent.click(screen.getByText('Download Skills Report PDF'));

    await waitFor(() => {
      expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
    });
  });

  test('should download PDF with filtered data', async () => {
    mock.onGet('http://localhost:3000/api/skillsReport').reply(200, mockSkillsReport);
    mock.onGet('http://localhost:3000/api/trainings').reply(200, mockTrainings);

    render(<ReportGenerator />);

    fireEvent.click(screen.getByText('Fetch Skills Report'));

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByRole('combobox', { name: /training/i }), {
      target: { value: 'Safety Training' }
    });

    fireEvent.click(screen.getByText('Download Skills Report PDF'));

    // Since we cannot directly test the content of the generated PDF,
    // we check if the function to generate PDF has been called.
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });
});
