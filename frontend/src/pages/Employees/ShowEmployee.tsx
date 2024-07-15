import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import BackButton from "../../components/BackButton";
import Spinner from "../../components/Spinner";

interface Employee {
  id: string;
  name: string;
  email: string;
  designation: string;
}

const ShowEmployee = () => {
  const [employee, setEmployee] = useState<Employee>({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    if (id) {
      setLoading(true);
      axios
        .get(`http://localhost:3000/api/employees/${id}`)
        .then((response) => {
          setEmployee(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <div className="p-4">
      <BackButton />
      <h1 className="text-3xl my-4">Show Employee</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className="flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4">
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Id</span>
            <span>{employee.id}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Name</span>
            <span>{employee.name}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Email</span>
            <span>{employee.email}</span>
          </div>
          <div className="my-4">
            <span className="text-xl mr-4 text-gray-500">Designation</span>
            <span>{employee.designation}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEmployee;
