import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";

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

//Mock Data
// import { data } from './makeData2';

// export type Employee = {
//     firstName: string;
//     lastName: string;
//     email: string;
//     jobTitle: string;
//     startDate: string;
//     relevantCourses: string[];
//     coursesTaken: string[];
//   };

// Define the Employee interface
interface Employee {
  id: string;
  name: string;
  department: string;
  designation: string;
  trainings: string[];
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
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        id: 'employee', // id used to define `group` column
        header: 'Employee',
        columns: [
          {
            accessorKey: 'name', // Directly use the name from the Employee interface
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
            accessorKey: 'department', // Use the department field
            header: 'Department',
            size: 150,
          },
          {
            accessorKey: 'designation', // Use the designation field
            header: 'Designation',
            size: 150,
          },
        ],
      },
      {
        id: 'courses',
        header: 'Courses',
        columns: [
          {
            accessorKey: 'trainings', // Use the trainings array
            header: 'Trainings',
            size: 200,
            filterFn: 'contains',
            Cell: ({ cell }) => cell.getValue<string[]>().map((course, index) => <div key={index}>{course}</div>),
          },
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

  return <MaterialReactTable table={table} />;
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

// const Example = () => {
// const columns = useMemo<MRT_ColumnDef<Employee>[]>(
//     () => [
//         {
//             id: 'employee', //id used to define `group` column
//             header: 'Employee',
//             columns: [
//                 {
//                     accessorFn: (row) => `${row.firstName} ${row.lastName}`, //accessorFn used to join multiple data into a single cell
//                     id: 'name', //id is still required when using accessorFn instead of accessorKey
//                     header: 'Name',
//                     size: 150,
//                     Cell: ({ renderedCellValue, row }) => (
//                         <Box
//                             sx={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '1rem',
//                             }}
//                         >
//                             {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
//                             <span>{renderedCellValue}</span>
//                         </Box>
//                     ),
//                 },              
//             ],
//         },
        
//         {
//             id: 'courses',
//             header: 'Courses',
//             columns: [
//                 {
//                     accessorKey: 'relevantCourses', //hey a simple column for once
//                     header: 'Relevant Courses',
//                     size: 200,
//                     filterFn: 'contains',
//                     Cell: ({ cell }) => cell.getValue<string[]>().map(course => <div>{course}</div>),
//                 },
//                 {
//                     accessorKey: 'coursesTaken', //hey a simple column for once
//                     header: 'Courses Taken',
//                     size: 200,
//                     filterFn: 'contains',
//                     Cell: ({ cell }) => cell.getValue<string[]>().map(course => <div>{course}</div>),
//                 },
//             ],
//         },
//     ],
//     [],
// );

//   const table = useMaterialReactTable({
//     columns,
//     data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
//     enableColumnFilterModes: true,
//     enableColumnOrdering: true,
//     enableGrouping: true,
//     enableColumnPinning: true,
//     enableFacetedValues: true,
//     enableRowActions: false,
//     enableRowSelection: true,
//     initialState: {
//       showColumnFilters: true,
//       showGlobalFilter: false,
//       columnPinning: {
//         left: ['mrt-row-select'],
//         right: ['mrt-row-actions'],
//       },
//     },
//     paginationDisplayMode: 'pages',
//     positionToolbarAlertBanner: 'top',
//     // muiSearchTextFieldProps: {
//     //   size: 'small',
//     //   variant: 'outlined',
//     // },
//     muiPaginationProps: {
//       color: 'secondary',
//       rowsPerPageOptions: [15, 30, 50],
//       shape: 'rounded',
//       variant: 'outlined',
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };

// //Date Picker Imports - these should just be in your Context Provider
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// const ExampleWithLocalizationProvider = () => (
//   //App.tsx or AppProviders file
//   <LocalizationProvider dateAdapter={AdapterDayjs}>
//     <Example />
//   </LocalizationProvider>
// );

// export default ExampleWithLocalizationProvider;

// const Dashboard = () => {
//   return (
//     <div className="flex">
//       <Sidebar activeItem="Dashboard"/>
//       <div className="flex-1">
//         <h2>Dashboard Page</h2>
//         {/* Add your dashboard components here */}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
