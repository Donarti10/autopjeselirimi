import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Navbar/Sidebar";
import Users from "../../components/Users/Users";
import Footer from "../../components/Footer/Footer";

const UsersPage = () => {
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

        <div
          className={`flex flex-col transition-all duration-300 pt-28 px-4 ${
            isSidebarCollapsed ? "w-[calc(100%-4rem)]" : "w-[calc(100%-20%)]"
          }`}
        >
          <div className="flex-1 overflow-y-auto">
            <Users />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
