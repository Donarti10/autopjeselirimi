import React, { useState } from "react";
import Sidebar from "../Navbar/Sidebar";
import Catalogue from "./Catalogue";
import Products from "./Products";
import Brand from "./Brand";
import Manufacturers from "./Manufacturers";
import DetailForProduct from "../DetailForProduct/DetailForProduct";
import Footer from "../Footer/Footer";

const Banner = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`transition-all duration-300 ${
          isSidebarCollapsed ? "w-[4rem]" : "w-[20%]"
        }`}
      >
        <Sidebar onToggle={handleSidebarToggle} />
      </div>

      <div
        className={`transition-all duration-300 overflow-y-auto ${
          isSidebarCollapsed ? "w-[calc(100%-4rem)]" : "w-[100%]"
        }`}
      >
        <Catalogue isSidebarCollapsed={isSidebarCollapsed} />
        <Products isSidebarCollapsed={isSidebarCollapsed} />
        <Brand isSidebarCollapsed={isSidebarCollapsed} />
        <Manufacturers isSidebarCollapsed={isSidebarCollapsed} />
        <Footer isSidebarCollapsed={isSidebarCollapsed} />
      </div>
    </div>
  );
};

export default Banner;
