import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/Navbar/lirimilogo.png";
import { IoIosStarOutline } from "react-icons/io";
import { GrCart } from "react-icons/gr";
import { CiSearch } from "react-icons/ci";
import { FaUserCircle, FaUser, FaSignOutAlt } from "react-icons/fa";
import toast from "react-hot-toast";

const Navbar = () => {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [producer, setProducer] = useState(0);

  const profileRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const latestSearchRef = useRef("");
  const user = localStorage.getItem("user");
  const subjectData = user ? JSON.parse(user) : null;
  const defaultSubject = subjectData?.ID || 706;

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubject(true);
      try {
        const res = await fetch(`${url}/Subjects/search`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setSubjects(data);
      } catch (err) {
        toast.error("Failed to load subjects.");
        console.error(err);
      } finally {
        setLoadingSubject(false);
      }
    };
    fetchSubjects();
  }, [url]);

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
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchSearchItems = async (value) => {
    if (!value.trim()) {
      setSearchItems([]);
      setIsSearchDropdownOpen(false);
      return;
    }
    try {
      const apiEndpoint = `${url}/Item/client/search?value=${encodeURIComponent(
        value
      )}&producer=${producer}&subject=${defaultSubject}`;
      const response = await fetch(apiEndpoint);
      if (!response.ok) throw new Error("Failed to fetch items");
      const data = await response.json();

      const searchLower = value.toLowerCase().trim();

      const filteredItems = data.filter((item) => {
        const barkodi = item.Barkodi?.toLowerCase() || "";
        const shifra = item.Shifra?.toLowerCase() || "";
        const emertimi = item.Emertimi?.toLowerCase() || "";
        const prodhuesi = item.Prodhuesi?.toLowerCase() || "";
        const extras = item.Extras?.toLowerCase() || "";

        const extrasCodes = extras
          .split(",")
          .map((code) => code.replace(/\s+/g, "").trim());

        const matchesExtras = extrasCodes.some((code) =>
          code.includes(searchLower)
        );

        return (
          barkodi.includes(searchLower) ||
          shifra.includes(searchLower) ||
          emertimi.includes(searchLower) ||
          prodhuesi.includes(searchLower) ||
          matchesExtras
        );
      });

      if (value === latestSearchRef.current) {
        setSearchItems(filteredItems);
        setIsSearchDropdownOpen(filteredItems.length > 0);
      }
    } catch (error) {
      toast.error("Failed to fetch search results.");
      console.error(error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    latestSearchRef.current = value;
    fetchSearchItems(value);
  };

  const handleItemSelect = (itemId) => {
    setSearchValue("");
    setSearchItems([]);
    setIsSearchDropdownOpen(false);
    navigate(`/itemsdetail/${itemId}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === "Enter" && searchValue.trim()) {
      setSearchItems([]);
      setIsSearchDropdownOpen(false);
      navigate(`/items1?search=${encodeURIComponent(searchValue)}`);
    }
  };

  return (
    <nav className="fixed w-full flex items-center justify-between z-[100] bg-[--secondary-color] px-[max(25px,2vw)] shadow-md">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-10">
          <Link to="/" className="p-[max(6px,.5vw)] pr-10 cursor-pointer">
            <img src={logo} className="w-full h-16" alt="Logo" />
          </Link>
          <div className="flex justify-between">
            <div className="flex justify-start items-start w-[500px] p-[max(6px,.5vw)] relative">
              <div className="flex items-center relative w-full">
                <input
                  type="text"
                  placeholder="Kodi OE / Pjesa nr. ose emrin / Barkodin"
                  value={searchValue}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchSubmit}
                  className="w-full pl-5 pr-4 py-2 border rounded-lg shadow-sm outline-none"
                />
                <button className="absolute right-0 top-0 h-full px-4 rounded-r-lg flex items-center justify-center">
                  <CiSearch className="text-[max(13px,1vw)] transition-transform duration-200 ease-in-out hover:scale-110" />
                </button>
              </div>
              {isSearchDropdownOpen && searchItems.length > 0 && (
                <div
                  ref={searchDropdownRef}
                  className="absolute top-full left-0 mt-2 w-full bg-white rounded-md shadow-lg py-1 z-10 max-h-60 overflow-y-auto"
                >
                  {searchItems.map((item) => (
                    <div
                      key={item.ID}
                      onClick={() => handleItemSelect(item.ID)}
                      className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    >
                      <div>{item.Emertimi}</div>
                      <div className="text-xs text-gray-500">
                        {item.Shifra} | {item.Barkodi} | {item.Prodhuesi}
                        {item.Extras && ` | ${item.Extras}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
          <Link to={"/cart"}>
            <GrCart className="text-white text-[max(13px,1vw)]" />
          </Link>
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
