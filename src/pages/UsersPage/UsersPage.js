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
            isSidebarCollapsed ? "w-[4rem]" : "w-[14%]"
          }`}
        >
          <Sidebar onToggle={handleSidebarToggle} />
        </div>

        <main className="flex-1 transition-all duration-300 overflow-y-auto pt-28 pr-4">
          <div className="flex-1 overflow-y-auto">
            <Users />
          </div>
        </main>
      </div>
    </div>
  );
};

export default UsersPage;
