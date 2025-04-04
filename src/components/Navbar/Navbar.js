import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Navbar/lirimilogo.png";
import { IoIosStarOutline } from "react-icons/io";
import { GrCart } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const profileRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed w-full flex items-center justify-between z-[100] bg-[--secondary-color] px-[max (max(25px,2vw)] shadow-md">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-[max(22px,1.5vw)] p-[max(6px,.5vw)] pr-10 cursor-pointer"
          >
            <img src={logo} className="w-full h-16" alt="Logo" />
          </Link>
          <div className="flex justify-between ml-10">
            <div className="flex justify-start items-start w-[400px] p-[max(6px,.5vw)]">
              <div className="flex items-center relative w-full">
                <input
                  type="text"
                  placeholder="Kodi OE / Pjesa nr. ose emrin / Barkodin"
                  className="w-full pl-5 pr-4 py-2 border rounded-lg shadow-sm outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 rounded-r-lg flex items-center justify-center">
                  <CiSearch className="text-[max(13px,1vw)] transition-transform duration-200 ease-in-out hover:scale-110" />
                </button>
              </div>
            </div>
            <div className="flex justify-start items-start w-[300px] p-[max(6px,.5vw)]">
              <div className="flex items-center relative w-full">
                <input
                  type="text"
                  placeholder="Kërko me VIN"
                  className="w-full pl-5 pr-4 py-2 border rounded-lg shadow-sm outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 rounded-r-lg flex items-center justify-center">
                  <CiSearch className="text-[max(13px,1vw)] transition-transform duration-200 ease-in-out hover:scale-110" />
                </button>
              </div>
            </div>
            <div className="flex justify-start items-start w-[300px] p-[max(6px,.5vw)]">
              <div className="flex items-center relative w-full">
                <input
                  type="text"
                  placeholder="Zgjidhni Automjetin"
                  className="w-full pl-5 pr-4 py-2 border rounded-lg shadow-sm outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 rounded-r-lg flex items-center justify-center">
                  <CiSearch className="text-[max(13px,1vw)] transition-transform duration-200 ease-in-out hover:scale-110" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5 mr-7">
          <IoIosStarOutline className="text-white text-[max(13px,1.2vw)]" />
          <GrCart className="text-white text-[max(13px,1vw)]" />
          <div className="relative">
            <div
              ref={profileRef}
              className="cursor-pointer"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <FaUserCircle className="text-white text-[max(13px,1.2vw)] hover:scale-110 transition-transform duration-200" />
            </div>
            <div
              ref={dropdownRef}
              className={`absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 transition-all duration-200 ease-in-out origin-top ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2 pointer-events-none"
              }`}
            >
              <Link
                to="/profile"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <FaUser className="mr-2" />
                Profili
              </Link>
              <hr className="my-1 border-gray-200" />
              <div
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                <FaSignOutAlt className="mr-2" />
                Log Out
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
