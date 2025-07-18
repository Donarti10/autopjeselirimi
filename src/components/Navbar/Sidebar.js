import React, { useState } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { IoIosStats } from "react-icons/io";
import { FiUsers } from "react-icons/fi";
import { RiListCheck3 } from "react-icons/ri";
import { TbTruckDelivery } from "react-icons/tb";
import {
  LiaAngleDoubleLeftSolid,
  LiaAngleDoubleRightSolid,
} from "react-icons/lia";

import distributor from "../../assets/Brand/elita2.jpg";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const token = localStorage.getItem("access_token");
  let roleID = null;
  try {
    const decoded = jwtDecode(token);
    roleID = decoded.RoleID;
  } catch (e) {
    console.warn("No valid token found", e);
  }

  const isSuperAdmin = roleID === "1";

  const adminItems = [
    {
      name: "Paneli",
      to: "/dashboard",
      icon: <IoIosStats />,
    },
    {
      name: "Klientat",
      to: "/users",
      icon: <FiUsers />,
    },
    {
      name: "Artikujt Admin",
      to: "/items",
      icon: <RiListCheck3 />,
    },
    {
      name: "Orari i Busëve Admin",
      to: "/transport",
      icon: <TbTruckDelivery />,
    },
  ];

  const commonItems = [
    {
      name: "Artikujt ",
      to: "/items1",
      icon: <RiListCheck3 />,
    },
    {
      name: "Orari i Busëve ",
      to: "/transportclient",
      icon: <TbTruckDelivery />,
    },
  ];

  const sidebarItems = isSuperAdmin
    ? [...adminItems, ...commonItems]
    : [...commonItems];

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    onToggle(!isCollapsed);
  };

  return (
    <div
      className={`h-screen sticky top-0 border-r overflow-x-hidden
        transition-all duration-300 flex flex-col justify-between
        ${isCollapsed ? "w-16" : "w-60"} flex-shrink-0`}
    >
      <div>
        <ul className="pt-20">
          {sidebarItems.map(({ name, to, icon }, idx) => (
            <li key={idx}>
              <Link
                to={to}
                className={`flex items-center gap-2 h-12 pl-4 border-b hover:bg-gray-100
                  transition-colors duration-200`}
              >
                <span className="text-lg">{icon}</span>
                <span
                  className={`ml-2 transition-opacity duration-200 ${
                    isCollapsed ? "opacity-0" : "opacity-100 whitespace-nowrap"
                  }`}
                >
                  {name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div
          onClick={toggleSidebar}
          className="p-4 flex items-center justify-end cursor-pointer hover:bg-gray-100"
        >
          {isCollapsed ? (
            <LiaAngleDoubleRightSolid />
          ) : (
            <>
              <LiaAngleDoubleLeftSolid />
              <span className="ml-2">Mbyll</span>
            </>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        {!isCollapsed && (
          <span className="block mb-2 text-gray-700">Distributori ynë</span>
        )}
        <img src={distributor} alt="Distributor Logo" className="w-full" />
      </div>
    </div>
  );
};

export default Sidebar;
