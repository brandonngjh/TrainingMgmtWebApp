import { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveEmployee = () => {
    const data = {
      name,
      email,
      designation,
    };
    setLoading(true);
    axios
      .post(`http://localhost:3000/api/employees`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee Created successfully", {
          variant: "success",
        });
        navigate("/employees");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-6">
      <BackButton destination="/employees" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Employee</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveEmployee}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;
