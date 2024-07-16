import React from "react";
import Sidebar from "../../components/Sidebar";

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar activeItem="Dashboard"/>
      <div className="flex-1">
        <h2>Dashboard Page</h2>
        {/* Add your dashboard components here */}
      </div>
    </div>
  );
};

export default Dashboard;
