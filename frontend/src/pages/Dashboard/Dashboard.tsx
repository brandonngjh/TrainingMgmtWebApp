import React from "react";
import Sidebar from "../../components/Sidebar";
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file

const Dashboard = () => {
  return (
    <div className="flex">
      <Sidebar activeItem="Dashboard"/>
      <div className="flex-1">
        <h2>Dashboard Page</h2>
          <div className="generate-button-container">
            <Link to="/report">
              <button className="generate-button">Generate PDF Report</button>
            </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
