import { useState } from "react";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const CreateTraining = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [validityPeriod, setValidityPeriod] = useState("");
  const [trainingProvider, setTrainingProvider] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveTraining = () => {
    const data = {
      title,
      description,
      validity_period: validityPeriod,
      training_provider: trainingProvider,
    };
    setLoading(true);
    axios
      .post(`http://localhost:3000/api/trainings`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Training Created successfully", {
          variant: "success",
        });
        navigate("/trainings");
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  return (
    <div className="p-6">
      <BackButton destination="/trainings" />
      <h1 className="text-3xl font-bold text-gray-800 my-4">Create Training</h1>
      {loading ? <Spinner /> : null}
      <div className="bg-white shadow-md rounded-lg overflow-hidden w-full p-6 mx-auto max-w-lg">
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">Validity Period</label>
          <input
            type="text"
            value={validityPeriod}
            onChange={(e) => setValidityPeriod(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="my-4">
          <label className="text-xl mr-4 text-gray-500">
            Training Provider
          </label>
          <input
            type="text"
            value={trainingProvider}
            onChange={(e) => setTrainingProvider(e.target.value)}
            className="border-2 border-gray-500 px-4 py-2 w-full rounded-md"
          />
        </div>
        <div className="text-right">
          <button
            className="bg-indigo-600 text-white py-2 px-4 rounded-md cursor-pointer hover:bg-indigo-700"
            onClick={handleSaveTraining}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTraining;
