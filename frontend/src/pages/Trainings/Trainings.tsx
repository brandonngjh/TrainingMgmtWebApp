import React from "react";
import Sidebar from "../../components/Sidebar";

const Trainings = () => {
  return (
    <div className="flex">
      <Sidebar activeItem="Trainings" />
      <div className="flex-1">
        <h2>Trainings Page</h2>
        {/* Add your trainings list here */}
      </div>
    </div>
  );
};

export default Trainings;
