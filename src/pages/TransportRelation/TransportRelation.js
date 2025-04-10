import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Navbar/Sidebar";
import Transport from "../../components/Transport/Transport";

const TransportRelation = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex flex-col min-h-screen ">
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
          className={`transition-all duration-300 overflow-y-auto pt-28 px-4 ${
            isSidebarCollapsed ? "w-[calc(100%-4rem)]" : "w-[calc(100%-20%)]"
          }`}
        >
          <Transport />
        </main>
      </div>
    </div>
  );
};

export default TransportRelation;
