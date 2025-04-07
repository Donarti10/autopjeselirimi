import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import AdminDashboard from "../../components/Banner/AdminDashboard";

const Dashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <AdminDashboard />
      </main>
    </div>
  );
};

export default Dashboard;
