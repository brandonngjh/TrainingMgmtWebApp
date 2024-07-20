import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file
import { useMemo } from 'react';

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
  MRT_GlobalFilterTextField,
  MRT_ToggleFiltersButton,
} from 'material-react-table';

//Material UI Imports
import {
  Box,
  Button,
  ListItemIcon,
  MenuItem,
  Typography,
  lighten,
} from '@mui/material';

//Icons Imports
import { AccountCircle, Send, Clear, Edit} from '@mui/icons-material';

// Define the Employee and Training interfaces
interface Training {
  validity: string;
  title: string;
  latest_end_date: string;
  expiry_date: string | null;
  scheduled_date: string | null;
}

interface Employee {
  employee_id: string;
  employee_name: string;
  department_name: string;
  job_name: string;
  relevantTrainings: Training[];
}

const Example: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get<Employee[]>('http://localhost:3000/api/dashboard');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Define columns
  const columns = useMemo<MRT_ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: 'employee_id',
        header: 'ID',
        size: 10,
      },
      {
        id: 'employee', // id used to define `group` column
        header: 'Employee',
        columns: [
          {
            accessorKey: 'employee_name', // Directly use the employee_name from the Employee interface
            header: 'Name',
            size: 150,
            Cell: ({ renderedCellValue }) => (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <span>{renderedCellValue}</span>
              </Box>
            ),
          },
          {
            accessorKey: 'department_name', // Use the department_name field
            header: 'Department',
            size: 150,
          },
          {
            accessorKey: 'job_name', // Use the job_name field
            header: 'Designation',
            size: 150,
          },
        ],
      },
      {
        id: 'trainings',
        header: 'Trainings',
        columns: [
          {
            accessorFn: (row) => row.relevantTrainings.map(training => training.title).join(', '),
            id: 'trainingTitles',
            header: 'Relevant Trainings',
            size: 200,
            Cell: ({ row }) => (
              <Box>
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        training.validity === 'valid'
                          ? 'rgba(0, 128, 0, 0.8)' // green with 80% opacity
                          : training.validity === 'expired'
                          ? 'rgba(255, 165, 0, 0.8)' // orange with 80% opacity
                          : 'rgba(255, 0, 0, 0.8)', // red with 80% opacity
                      color: 'white',
                      padding: '4px',
                      margin: '2px 0',
                    }}
                  >
                    {training.title}
                  </div>
                ))}
              </Box>
            ),
          },
          {
            accessorFn: (row) => row.relevantTrainings.map(training => training.latest_end_date).join(', '),
            id: 'trainingLatestEndDates',
            header: 'Last Completed Date',
            size: 200,
            Cell: ({ row }) => (
              <Box>
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        training.validity === 'valid'
                          ? 'green'
                          : training.validity === 'expired'
                          ? 'orange'
                          : 'red',
                      color: 'white',
                      padding: '4px',
                      margin: '2px 0',
                    }}
                  >
                    {training.expiry_date ? new Date(training.latest_end_date).toLocaleDateString() : 'N/A'}
                  </div>
                ))}
              </Box>
            ),
          },
          {
            accessorFn: (row) => row.relevantTrainings.map(training => training.expiry_date).join(', '),
            id: 'trainingExpiryDates',
            header: 'Certification End Date',
            size: 250,
            Cell: ({ row }) => (
              <Box>
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        training.validity === 'valid'
                          ? 'green'
                          : training.validity === 'expired'
                          ? 'orange'
                          : 'red',
                      color: 'white',
                      padding: '4px',
                      margin: '2px 0',
                    }}
                  >
                    {training.expiry_date ? new Date(training.expiry_date).toLocaleDateString() : 'N/A'}
                  </div>
                ))}
              </Box>
            ),
          },
          {
            accessorFn: (row) => row.relevantTrainings.map(training => training.scheduled_date).join(', '),
            id: 'scheduledTrainingDate',
            header: 'Next Scheduled Date',
            size: 200,
            Cell: ({ row }) => (
              <Box>
                {row.original.relevantTrainings.map((training, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor:
                        training.validity === 'valid'
                          ? 'green'
                          : training.validity === 'expired'
                          ? 'orange'
                          : 'red',
                      color: 'white',
                      padding: '4px',
                      margin: '2px 0',
                    }}
                  >
                    {training.scheduled_date ? new Date(training.scheduled_date).toLocaleDateString() : 'N/A'}
                  </div>
                ))}
              </Box>
            ),
          }
        ],
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: employees, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableColumnFilterModes: true,
    enableColumnOrdering: true,
    enableGrouping: true,
    enableColumnPinning: true,
    enableFacetedValues: true,
    enableRowActions: false,
    enableRowSelection: true,
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: false,
      columnPinning: {
        left: ['mrt-row-select'],
        right: ['mrt-row-actions'],
      },
    },
    paginationDisplayMode: 'pages',
    positionToolbarAlertBanner: 'top',
    muiPaginationProps: {
      color: 'secondary',
      rowsPerPageOptions: [15, 30, 50],
      shape: 'rounded',
      variant: 'outlined',
    },
  });

  return (<div className="flex">
    <Sidebar activeItem="Dashboard" />
    <MaterialReactTable table={table} />
  </div>
  );
};

// Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const ExampleWithLocalizationProvider = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;