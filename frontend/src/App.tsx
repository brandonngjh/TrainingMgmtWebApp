import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CreateEmployee from "./pages/CreateEmployee.tsx";
import ShowEmployee from "./pages/ShowEmployee.tsx";
import EditEmployee from "./pages/EditEmployee.tsx";
import DeleteEmployee from "./pages/DeleteEmployee.tsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/employees/create" element={<CreateEmployee />} />
      <Route path="/employees/details/:id" element={<ShowEmployee />} />
      <Route path="/employees/edit/:id" element={<EditEmployee />} />
      <Route path="/employees/delete/:id" element={<DeleteEmployee />} />
    </Routes>
  );
};

export default App;
