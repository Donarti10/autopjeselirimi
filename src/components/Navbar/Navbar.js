import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Navbar/lirimilogo.png";
import { IoIosStarOutline } from "react-icons/io";
import { GrCart } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";

const Navbar = () => {
  return (
    <nav className="fixed w-full flex items-center justify-between z-[100] bg-[--secondary-color]  px-[max(25px,2vw)] shadow-md">
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
                  placeholder="OE code / Part no. or name / Barcode"
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
                  placeholder="Sarch by VIN"
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
                  placeholder="Select Vehicle"
                  className="w-full pl-5 pr-4 py-2 border rounded-lg shadow-sm outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 rounded-r-lg flex items-center justify-center">
                  <CiSearch className="text-[max(13px,1vw)] transition-transform duration-200 ease-in-out hover:scale-110" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-5">
          <IoIosStarOutline className="text-white text-[max(13px,1.2vw)]" />
          <GrCart className="text-white text-[max(13px,1vw)]" />
          <Link to={"/login"} className="text-white text-[max(13px,1vw)]">
            Kyçu
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
