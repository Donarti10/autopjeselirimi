import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Navbar/Sidebar";
import AdminDashboard from "../../components/Banner/AdminDashboard";

const Dashboard = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex flex-1">
        <div
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? "w-[4rem]" : "w-[20%]"
          }`}
        >
          <Sidebar onToggle={handleSidebarToggle} />
        </div>

        <main
          className={`transition-all duration-300 pt-28 px-4 overflow-y-auto ${
            isSidebarCollapsed ? "w-[calc(100%-4rem)]" : "w-[calc(100%-20%)]"
          }`}
        >
          <AdminDashboard />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
