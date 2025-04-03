import React, { useState } from "react";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { IoDocumentTextOutline, IoGiftOutline } from "react-icons/io5";
import { LiaOilCanSolid } from "react-icons/lia";
import { GiMechanicGarage } from "react-icons/gi";
import { MdOutlineMessage } from "react-icons/md";
import {
  LiaAngleDoubleLeftSolid,
  LiaAngleDoubleRightSolid,
} from "react-icons/lia";
import distributor from "../../assets/Brand/elita2.jpg";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
    onToggle(!isCollapsed);
  };

  const toggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const sidebarItems = [
    {
      name: "Orders",
      icon: <HiOutlineClipboardDocumentList />,
    },
    {
      name: "Office Supplies",
      icon: <IoDocumentTextOutline />,
      dropdownItems: ["Item 1", "Item 2", "Item 3"],
    },
    {
      name: "Wear Parts",
      icon: <LiaOilCanSolid />,
    },
    {
      name: "Workshop Equipment",
      icon: <GiMechanicGarage />,
    },
    {
      name: "Offers",
      icon: <IoGiftOutline />,
    },
    {
      name: "Messages",
      icon: <MdOutlineMessage />,
    },
  ];

  return (
    <div
      className={`h-screen sticky top-0 bg-gray-50 border-r overflow-x-hidden border-gray-200 shadow-md transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-86"
      } flex-shrink-0`}
    >
      <ul className="pt-20">
        {sidebarItems.map((item, index) => (
          <li key={index}>
            <div
              className={`flex items-center gap-2 w-full cursor-pointer h-12 pl-4 py-8 border-b border-gray-300
              transition-colors duration-300 hover:bg-[var(--secondary-color)] group`}
              onClick={() => item.dropdownItems && toggleDropdown(index)}
            >
              <span className="text-[max(13px,1.1vw)] group-hover:text-[var(--primary-color)] transition-colors duration-300">
                {item.icon}
              </span>
              <span
                className={`text-[max(13px,.9vw)] group-hover:text-[var(--text-color)] ${
                  isCollapsed ? "opacity-0" : "opacity-100 whitespace-nowrap"
                }`}
              >
                {item.name}
              </span>
            </div>
            {item.dropdownItems && openDropdownIndex === index && (
              <div className="transition-all duration-300 max-h-40 opacity-100 overflow-hidden">
                <ul className="space-y-2">
                  {item.dropdownItems.map((dropdownItem, i) => (
                    <li
                      key={i}
                      className="w-full h-10 pl-5 flex items-center cursor-pointer bg-[--light-color]"
                    >
                      {dropdownItem}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>

      <div
        onClick={toggleSidebar}
        className="p-4 gap-2 flex items-center justify-end cursor-pointer hover:bg-[var(--secondary-color)] group transition-colors duration-300"
      >
        {isCollapsed ? (
          <LiaAngleDoubleRightSolid className="group-hover:text-[var(--primary-color)] transition-colors duration-300" />
        ) : (
          <>
            <LiaAngleDoubleLeftSolid className="group-hover:text-[var(--primary-color)] transition-colors duration-300" />
            <span className="group-hover:text-[var(--text-color)] whitespace-nowrap">
              Hide menu
            </span>
          </>
        )}
      </div>

      <div className="mt-auto p-4 flex flex-col  border-t border-gray-300">
        <span
          className={`text-[max(13px,1.4vw)] mb-5 ${
            isCollapsed ? "hidden" : "block"
          } text-gray-700`}
        >
          Our Distributor
        </span>
        <img src={distributor} alt="Distributor Logo" className="" />
      </div>
    </div>
  );
};

export default Sidebar;
