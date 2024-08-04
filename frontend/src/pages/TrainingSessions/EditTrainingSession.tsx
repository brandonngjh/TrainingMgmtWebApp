import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import axiosInstance from "../../authentication/axiosInstance";
import { useSnackbar } from "notistack";
import Select from 'react-select';
import { number } from "yup";
import { Link } from "react-router-dom";
import { GiConsoleController } from "react-icons/gi";


export const SessionSelector: React.FC = () => {
  
  const [sessionID, setSessionID] = useState<string>("");

  return (
    <div className="p-6">
      <BackButton destination={`/sessions`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Training Session</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Session ID</label>
          <input
            type="string"
            value={sessionID}
            onChange={(e) => setSessionID(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <Link to={`/sessions/${sessionID}`} className="mt-4">
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700">
                Edit Session
              </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

interface Employee {
  id: string;
  name: string;
  designation: string;
  status: string;
}

interface TrainingSession {
  session_id : number;
  start_date : string;
  end_date : string;
  expiry_date : string;
  training_title : string;
  training_id : number;
  employees : Employee[];
}

export const EditTrainingSession : React.FC = () => {

  const [session, setSession] = useState<TrainingSession>();
  const { id } = useParams();
  const [employeeIds, setEmployeeIds] = useState<string[]>([]);
  const [trainingId, setTrainingId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // const location = useLocation();
  const token = localStorage.getItem('token');

  useEffect(() => {
    setLoading(true);
    const fetchSession = async () => {
      try {
        const response = await axiosInstance.get<{[key: string]: TrainingSession}>(`/sessions/${id}`);
        const data = response.data;
        // console.log(data)
        const sessionsArray: TrainingSession[] = Object.values(data);
        setSession(sessionsArray[0])
        console.log(session)
      } catch (error) {
        console.error("Error fetching training sessions: ", error);
      }
    };
    fetchSession();
    setLoading(false);
  }, []);

  // useEffect(() => {
  //   axiosInstance.get(`http://localhost:3000/api/sessions/${id}`)
  //   .then((response) => {
  //     const trainingSession : TrainingSession = {
  //       session_id : response.data.session_id,
  //       start_date : response.data.start_date,
  //       end_date : response.data.end_date,
  //       expiry_date : response.data.expiry_date,
  //       training_title : response.data.training_title,
  //       training_id : response.data.training_id,
  //       employees : response.data.employees
  //     }
  //     console.log(trainingSession);
  //     setSession(trainingSession);
  //     console.log(session);
  //     setLoading(false);
  //   })
  //   .catch((error) => {
  //     setLoading(false);
  //     enqueueSnackbar("An error occurred. Please check the console.", {
  //       variant: "error",
  //     });
  //     console.log(error);
  //   });
  // }, []);

  const handleSaveTrainingSessions = () => {
    const data = {
        employee_ids: employeeIds,
        training_id: trainingId,
        status,
        start_date: startDate,
        end_date: endDate,
      };
    // console.log(data); // Log the data being sent

    // Validate fields
    if (!employeeIds || !trainingId || !status || !startDate || !endDate) {
      enqueueSnackbar("Please fill out all fields", { variant: "warning" });
      return;
    }

    setLoading(true);

    axios
    .put(`http://localhost:3000/api/sessions/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':`Bearer ` + token
      },
    })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Training Session Updated", {
          variant: "success",
        });
        navigate(`/sessions`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error creating training session", { variant: "error" });
        console.log(error.response.data);  // Log the server response
      });
  };

  return (
    <div className="p-6">
      <BackButton destination={`/sessions`} />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Edit Training Session</h1>

      {loading ? <Spinner /> : null}

      {session && (
        <>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Employee</label>
          <Select
              isMulti
              onChange={(newValue: any) => {
                  if (newValue !== null) {
                      setEmployeeIds(newValue.map((employee: any) => employee.value)); // Set to empty string or any default value as need
                  }
              }}
              options={session.employees.map((employee : Employee) => ({
                  value: employee.id,
                  label: employee.name,
              }))}
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Training</label>
          <select
            value={trainingId}
            onChange={(e) => setTrainingId(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md">
          </select>
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          >
            <option value="">Select a status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveTrainingSessions}
          >
            Save
          </button>
        </div>
      </>
      )}

    </div>
  );

};

// export default CreateTrainingSession;
