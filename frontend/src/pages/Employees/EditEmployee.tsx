import { useState, useEffect } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";

const EditEmployee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3000/api/employees/${id}`)
      .then((response) => {
        setEmail(response.data.email);
        setDesignation(response.data.designation);
        setName(response.data.name);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        alert("An error happened. Please Check Console");
        console.log(error);
      });
  }, []);
  const handleEditEmployee = () => {
    const data = {
      name,
      email,
      designation,
    };
    setLoading(true);
    axios
      .put(`http://localhost:3000/api/employees/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Employee Edited succesfully", { variant: "success" });
        navigate("/");
      })
      .catch((error) => {
        setLoading(false);
        // alert("An error happened. Please Check Console");
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Edit Employee</h1>
      {loading ? <Spinner /> : ""}
      <div className="flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Designation</label>
          <input
            type="text"
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full"
          />
        </div>
        <div>
          <button className="p-2 bg-sky-300 m-8" onClick={handleEditEmployee}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
