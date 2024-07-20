import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import Sidebar from './Sidebar'; // Assuming Sidebar is a separate component
import './ReportGenerator.css';  // Adjust the import based on your directory structure

interface SkillReport {
  employee_id: number;
  employee_name: string;
  department_name: string;
  job_name: string;
  training_course: string;
  validity: string;
}

interface Training {
  id: number;
  title: string;
  description: string;
  training_provider: string;
}

interface Job {
  id: number;
  name: string;
  department_id: number;
}

const ReportGenerator: React.FC = () => {
  const [skillsReport, setSkillsReport] = useState<SkillReport[]>([]);
  const [trainings, setTrainings] = useState<Training[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]); // State for jobs
  const [selectedJob, setSelectedJob] = useState<string>(''); // State for selected job
  const [selectedTraining, setSelectedTraining] = useState<string>(''); // State for selected training
  const [selectedValidity, setSelectedValidity] = useState<string>(''); // State for selected validity
  const [dataFetched, setDataFetched] = useState<boolean>(false); // State to track if data is fetched

  const fetchSkillsReport = async () => {
    try {
      const response = await axios.get<SkillReport[]>('http://localhost:3000/api/skillsReport');
      setSkillsReport(response.data);
      setDataFetched(true); // Update state to indicate data is fetched
    } catch (error) {
      console.error('Error fetching skills report', error);
    }
  };

  const fetchTrainings = async () => {
    try {
      const response = await axios.get<Training[]>('http://localhost:3000/api/trainings');
      setTrainings(response.data);
    } catch (error) {
      console.error('Error fetching trainings', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get<Job[]>('http://localhost:3000/api/jobs');
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs', error);
    }
  };

  const handleJobChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedJob(event.target.value);
  };

  const handleTrainingChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedTraining(event.target.value);
  };

  const handleValidityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedValidity(event.target.value);
  };

  const generatePDF = () => {
    const doc = new jsPDF('landscape');
    const margin = 10;
    const lineHeight = 7; // Reduced line height
    const fontSize = 12; // Reduced font size
    let y = margin;
  
    doc.setFontSize(fontSize);
    doc.text('Skills Report', margin, y);
    y += lineHeight;
  
    // Filter skills report based on selected criteria
    const filteredReports = skillsReport.filter(report => 
      (selectedJob ? report.job_name === selectedJob : true) &&
      (selectedTraining ? report.training_course === selectedTraining : true) &&
      (selectedValidity ? report.validity === selectedValidity : true)
    );
  
    const rows = filteredReports.map(report => [
      report.employee_id,
      report.employee_name,
      report.department_name,
      report.job_name,
      report.training_course,
      report.validity,
    ]);
  
    autoTable(doc, {
      head: [['ID', 'Name', 'Department', 'Job', 'Training', 'Validity']],
      body: rows,
      startY: y,
    });
  
    doc.save('skills_report.pdf');
  };

  useEffect(() => {
    fetchTrainings();
    fetchJobs();
  }, []);

  // Filter skills report based on selected criteria
  const filteredReports = skillsReport.filter(report => 
    (selectedJob ? report.job_name === selectedJob : true) &&
    (selectedTraining ? report.training_course === selectedTraining : true) &&
    (selectedValidity ? report.validity === selectedValidity : true)
  );

  return (
    <div className="flex">
      <Sidebar activeItem="Skills Report Generator" />
      <div className="flex-1">
        <h2>Skills Report Generator</h2>
        <div className="button-container">
          <button onClick={fetchSkillsReport}>Fetch Skills Report</button>

          <div className="select-container">
            <select value={selectedJob} onChange={handleJobChange}>
              <option value="">All Jobs</option>
              {jobs.map((job, index) => (
                <option key={index} value={job.name}>{job.name}</option>
              ))}
            </select>

            <select value={selectedTraining} onChange={handleTrainingChange}>
              <option value="">All Trainings</option>
              {trainings.map((training, index) => (
                <option key={index} value={training.title}>{training.title}</option>
              ))}
            </select>

            <select value={selectedValidity} onChange={handleValidityChange}>
              <option value="">All Validities</option>
              <option value="Valid">Valid</option>
              <option value="Expired">Expired</option>
              <option value="NA">NA</option>
            </select>
          </div>

          <div className="generate-button-container">
            <button onClick={generatePDF}>Generate PDF</button>
          </div>
        </div>

        {dataFetched && (
          <>
            <h3>Preview Skills Report</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Job</th>
                  <th>Training</th>
                  <th>Validity</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report, index) => (
                  <tr key={index}>
                    <td>{report.employee_id}</td>
                    <td>{report.employee_name}</td>
                    <td>{report.department_name}</td>
                    <td>{report.job_name}</td>
                    <td>{report.training_course}</td>
                    <td>{report.validity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default ReportGenerator;