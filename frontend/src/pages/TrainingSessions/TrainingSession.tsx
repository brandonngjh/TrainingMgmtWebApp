import React from "react";
import axiosInstance from "../../authentication/axiosInstance.tsx";
import { useEffect, useState, useMemo } from "react";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
// import "./Dashboard.css"; // Import the CSS file

//MRT Imports
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";

//Material UI Imports
import { Box } from "@mui/material";

// Define the Employee and Training interfaces
// interface Training {
//   validity: string;
//   title: string;
//   latest_end_date: string;
//   expiry_date: string | null;
//   scheduled_date: string | null;
// }

// interface Employee {
//   employee_id: string;
//   employee_name: string;
//   designation: string;
//   // department_name: string;
//   // job_name: string;
//   relevantTrainings: Training[];
// }

interface TrainingSession {
    session_id : number;
    training_title : string;
    training_id : number;
    status : string;
    start_date : string;
    end_date : string;
    expiry_date : string;
    employee_id : number,
    employee_name : string,
    designation : string
}

const Example: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axiosInstance.get<TrainingSession[]>("/sessions");
        setSessions(response.data);
      } catch (error) {
        console.error("Error fetching training sessions: ", error);
      }
    };

    fetchEmployees();
  }, []);

  // Define columns
  const columns = useMemo<MRT_ColumnDef<TrainingSession>[]>(
    () => [
    {
        // id: "session_id",
        accessorKey: "session_id",
        header: "Session ID"
    },
      {
        id: "employee", // id used to define `group` column
        header: "Employee Details",
        columns: [
          {
            accessorKey: "employee_id",
            header: "Employee ID",
            // size: 1,
          },
          {
            accessorKey: "employee_name", // Directly use the employee_name from the Employee interface
            header: "Employee Name",
            size: 200,
            // Cell: ({ renderedCellValue }) => (
            //   <Box
            //     sx={{
            //       display: "flex",
            //       alignItems: "center",
            //       gap: "1rem",
            //     }}
            //   >
            //     <span>{renderedCellValue}</span>
            //   </Box>
            // ),
          },
        ],
      },
      {
        id: "session_details",
        header: "Session Details",
        columns : [
            {
                accessorKey: "training_title",
                header: "Training"
            },
            {
            accessorKey: "status",
            header: "Status"
            },
            {
            // accessorKey: "start_date",
            accessorFn: (session) =>
                session.start_date ? new Date(session.start_date).toLocaleDateString() : "",
            header: "Start Date"
            },
            {
            // accessorKey: "end_date",
            accessorFn: (session) =>
                session.end_date ? new Date(session.end_date).toLocaleDateString() : "",
            header: "End Date"
            },
            {
            // accessorKey: "expiry_date",
            accessorFn: (session) =>
                session.expiry_date ? new Date(session.expiry_date).toLocaleDateString() : "",
            header: "Expiry Date"
            }
        ]
      }
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: sessions, // data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
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
        left: ["mrt-row-select"],
        right: ["mrt-row-actions"],
      },
      pagination: {
        pageIndex: 0,
        pageSize: 15, // Set initial rows per page value to 15
      },
    },
    paginationDisplayMode: "pages",
    positionToolbarAlertBanner: "top",
    muiPaginationProps: {
      color: "secondary",
      rowsPerPageOptions: [15],
      shape: "rounded",
      variant: "outlined",
    },
  });

  return (
    <div className="dashboard-container">
      <Sidebar activeItem="Training Sessions" />
      <div className="dashboard-content">
        <h2 className="text-3xl my-8">Training Sessions Page</h2>
        <Link to={`/sessions/create`} className="mt-4">
            <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
              Create Training Session
            </button>
          </Link>
        <div id="dashboard-table">
          <MaterialReactTable table={table} />
        </div>
      </div>
    </div>
  );
};

// Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

const ExampleWithLocalizationProvider = () => (
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Example />
  </LocalizationProvider>
);

export default ExampleWithLocalizationProvider;
