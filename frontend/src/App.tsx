import {Routes, Route} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Home from "./pages/Employees/Employees.tsx";
import Employees from "./pages/Employees/Employees.tsx";
import CreateEmployee from "./pages/Employees/CreateEmployee.tsx";
import ShowEmployee from "./pages/Employees/ShowEmployee.tsx";
import EditEmployee from "./pages/Employees/EditEmployee.tsx";
import DeleteEmployee from "./pages/Employees/DeleteEmployee.tsx";
import Login from "./pages/Login/Login.tsx";
import Trainings from "./pages/Trainings/Trainings.tsx";
import CreateTraining from "./pages/Trainings/CreateTraining.tsx";
import ShowTraining from "./pages/Trainings/ShowTraining.tsx";
import EditTraining from "./pages/Trainings/EditTraining.tsx";
import ReportGenerator from "./components/ReportGenerator";
import DeleteTraining from "./pages/Trainings/DeleteTraining.tsx";
import Dashboard from "./pages/Dashboard/Dashboard.tsx"; 
import { AuthProvider } from "./authentication/authContext.tsx";
import ProtectedRoute from './components/ProtectedRoute.tsx' 
import CreateEmployeesTrainings from "./pages/EmployeesTrainings/CreateEmployeesTrainings.tsx";
import DeleteEmployeesTrainings from "./pages/EmployeesTrainings/DeleteEmployeesTrainings.tsx";
import EditEmployeesTrainings from "./pages/EmployeesTrainings/EditEmployeesTrainings.tsx";

const App: React.FC = () => {
  return (
  <AuthProvider>
    
    <Routes>
      <Route path="/" element={<ProtectedRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/employees" element={<Employees />} />
      {/* <Route path="/" element={<Home />} /> */}
      <Route path="/employees/create" element={<CreateEmployee />} />
      <Route path="/employees/details/:id" element={<ShowEmployee />} />
      <Route path="/employees/edit/:id" element={<EditEmployee />} />
      <Route path="/employees/delete/:id" element={<DeleteEmployee />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/trainings" element={<Trainings />} />
      <Route path="/trainings/create" element={<CreateTraining />} />
      <Route path="/trainings/details/:id" element={<ShowTraining />} />
      <Route path="/trainings/edit/:id" element={<EditTraining />} />
      <Route path="/trainings/delete/:id" element={<DeleteTraining />} /> 
      <Route path="/employeestrainings/create" element={<CreateEmployeesTrainings />} />
      <Route path="/employeestrainings/delete/:id" element={<DeleteEmployeesTrainings />} />
      <Route path="/employeestrainings/edit/:id" element={<EditEmployeesTrainings />} />
      <Route path="/report" element={<ReportGenerator />} /> 
      </Route>    
    </Routes>
    
  </AuthProvider>
  );
};

export default App;
