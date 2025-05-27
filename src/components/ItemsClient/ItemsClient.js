import React, { useEffect, useState, useRef } from "react";
import { Breadcrumb, Input, Modal, Pagination } from "antd";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import {
  FaShoppingCart,
  FaTag,
  FaTruck,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { HiMinus, HiMiniPlus } from "react-icons/hi2";
import { IoIosArrowForward } from "react-icons/io";
import Loader from "../Loader/Loader";

const ItemsClient = () => {
  const url = process.env.REACT_APP_API_URL;
  const [items, setItems] = useState([]);
  const [recommendedItems, setRecommendedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [value, setValue] = useState("");
  const [producers, setProducers] = useState([]);
  const [displayProducers, setDisplayProducers] = useState([]); // New state for displayed producers
  const [producerID, setProducerID] = useState(null);
  const [loadingProducer, setLoadingProducer] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [subjectID, setSubjectID] = useState(null);
  const [loadingSubject, setLoadingSubject] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const user = localStorage.getItem("user");
  const subject = user ? JSON.parse(user) : null;
  const [quantities, setQuantities] = useState({});
  const [addToCartLoading, setAddToCartLoading] = useState({});
  const latestSearchRef = useRef("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search");
    if (searchQuery) {
      setValue(decodeURIComponent(searchQuery));
    }
  }, [location.search]);

  const handleIncrement = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  };

  const handleDecrement = (itemId) => {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max((prev[itemId] || 1) - 1, 1),
    }));
  };

  const debouncedOpenModal = debounce((photo) => {
    setSelectedPhoto(`data:image/jpeg;base64,${photo}`);
    setModalVisible(true);
  }, 200);
  const debouncedCloseModal = debounce(() => {
    setModalVisible(false);
    setSelectedPhoto(null);
  }, 200);

  useEffect(() => {
    const fetchProducers = async () => {
      setLoadingProducer(true);
      try {
        const res = await fetch(`${url}/Producer/search`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setProducers(data);
        setDisplayProducers(data); // Initially set all producers
      } catch (err) {
        toast.error("Failed to load producers.");
        console.error(err);
      } finally {
        setLoadingProducer(false);
      }
    };
    fetchProducers();
  }, [url]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubject(true);
      try {
        const res = await fetch(`${url}/Subjects/search`);
        if (!res.ok) throw new Error(res.statusText);
        setSubjects(await res.json());
      } catch (err) {
        toast.error("Failed to load subjects.");
        console.error(err);
      } finally {
        setLoadingSubject(false);
      }
    };
    fetchSubjects();
  }, [url]);

  const fetchItems = async (searchValue) => {
    setLoading(true);
    try {
      const q = searchValue.trim();
      const prod = producerID || 0;
      const subj = subject || 0;
      const res = await fetch(
        `${url}/Item/client/search?value=${encodeURIComponent(
          q
        )}&producer=${prod}&subject=${subj}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      if (searchValue === latestSearchRef.current) {
        setItems(data);
        setCurrentPage(1);
        if (data.length === 1 && (data[0].Barkodi || data[0].Shifra)) {
          fetchRecommendedItems(data[0]);
        } else {
          setRecommendedItems([]);
        }
      }
    } catch (err) {
      toast.error("Failed to load items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedItems = async (item) => {
    setLoading(true);
    try {
      const searchValue = item.Barkodi || item.Shifra || "";
      if (!searchValue) {
        setRecommendedItems([]);
        return;
      }
      const prod = producerID || 0;
      const subj = subject || 0;
      const res = await fetch(
        `${url}/Item/client/search?value=${encodeURIComponent(
          searchValue
        )}&producer=${prod}&subject=${subj}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      const filteredData = data.filter((recItem) => recItem.ID !== item.ID);
      setRecommendedItems(filteredData);
    } catch (err) {
      toast.error("Failed to load recommended items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchItems = debounce((searchValue) => {
    latestSearchRef.current = searchValue;
    fetchItems(searchValue);
  }, 300);

  useEffect(() => {
    debouncedFetchItems(value);
    return () => debouncedFetchItems.cancel();
  }, [value, producerID, subjectID]);

  // Filter displayProducers based on search results when producerID is null
  useEffect(() => {
    if (producerID === null) {
      const uniqueProducers = [...new Set(items.map((item) => item.Prodhuesi))];
      const filtered = producers.filter((p) =>
        uniqueProducers.includes(p.Emertimi)
      );
      setDisplayProducers(filtered);
    } else {
      setDisplayProducers(producers); // Show all producers when one is selected
    }
  }, [items, producerID, producers]);

  const filteredItems = items?.filter((it) => {
    const s = value.toLowerCase();
    return (
      it.Emertimi?.toLowerCase().includes(s) ||
      it.Extras?.toLowerCase().includes(s) ||
      it.Barkodi?.toLowerCase().includes(s) ||
      it.Shifra?.toLowerCase().includes(s)
    );
  });

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + pageSize);

  const breadcrumbItems = [
    { title: <Link to="/">Faqja Kryesore</Link> },
    { title: "Artikujt" },
  ];

  const handleAddToCart = async (itemId) => {
    if (!subject) {
      toast.error("Nuk ka përdorues të kyçur.");
      return;
    }

    setAddToCartLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      const quantity = quantities[itemId] || 1;

      const response = await fetch(`${url}/Cart/current/subject?id=${subject}`);
      if (!response.ok) {
        throw new Error("Dështoi marrja e shportës aktuale");
      }
      const cartData = await response.json();

      if (cartData && cartData.status === "Në pritje") {
        const cartDetailBody = {
          id: 0,
          cartID: cartData.id,
          itemIdentify: itemId,
          quantity: quantity,
          createdByID: subject,
        };

        const detailResponse = await fetch(`${url}/CartDetail`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartDetailBody),
        });

        if (!detailResponse.ok) {
          throw new Error("Dështoi shtimi i artikullit në shportë");
        }

        toast.success("Artikulli u shtua në shportë me sukses!");
      } else {
        const cartBody = {
          id: 0,
          subjectIdentify: subject,
          subjectName: "",
          note: "",
          createdByID: subject,
          details: [
            {
              itemIdentify: itemId,
              quantity: quantity,
            },
          ],
        };

        const cartResponse = await fetch(`${url}/Cart`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(cartBody),
        });

        if (!cartResponse.ok) {
          throw new Error("Dështoi krijimi i shportës së re");
        }

        toast.success("Shporta e re u krijua dhe artikulli u shtua me sukses!");
      }
    } catch (error) {
      toast.error(
        error.message || "Ndodhi një gabim gjatë shtimit në shportë."
      );
      console.error("Gabim gjatë shtimit në shportë:", error);
    } finally {
      setAddToCartLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-800">
                Shop
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                Cart
              </Link>
              <Link to="/profile" className="text-gray-600 hover:text-gray-800">
                Profile
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 pt-0">
        <div
          className={`fixed top-16 h-[calc(100vh-4rem)] transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          } z-40 overflow-y-auto`}
        >
          <div className="p-4">
            {loadingProducer ? (
              <div className="text-center text-gray-500 mt-24">Loading...</div>
            ) : (
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setProducerID(null)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      producerID === null
                        ? "bg-blue-500 text-white"
                        : "text-gray-700 hover:bg-blue-100"
                    } ${isSidebarCollapsed ? "text-center" : ""}`}
                  >
                    {isSidebarCollapsed ? "Të Gjithë" : "Të Gjithë Prodhuesit"}
                  </button>
                </li>
                {displayProducers.map((p) => (
                  <li key={p.ID || p["$ID"]}>
                    <button
                      onClick={() => setProducerID(p.ID || p["$ID"])}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        producerID === (p.ID || p["$ID"])
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-blue-100"
                      } ${isSidebarCollapsed ? "text-center" : ""}`}
                      title={isSidebarCollapsed ? p.Emertimi || "N/A" : ""}
                    >
                      {isSidebarCollapsed
                        ? (p.Emertimi || "N/A").charAt(0)
                        : p.Emertimi || "N/A"}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <main
          className={`transition-all duration-300 overflow-y-auto pt-0 px-4 ${
            isSidebarCollapsed
              ? "ml-16 w-[calc(100%-4rem)]"
              : "ml-64 w-[calc(100%-16rem)]"
          }`}
        >
          <header className="mb-6 border-b pb-3 flex justify-between items-center">
            <div>
              <Breadcrumb
                items={breadcrumbItems}
                className="text-sm text-gray-600 mb-2"
              />
              <h1 className="font-bold text-2xl">Artikujt</h1>
              <span className="text-gray-500">Menaxhoni Artikujt</span>
            </div>
          </header>

          <div className="flex flex-wrap gap-6 mb-8">
            <Input
              size="large"
              placeholder="Kërko me: Shifër, Barkod, OEM ose Artikull"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-96 rounded-lg shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              style={{ padding: "8px 16px", fontSize: "16px" }}
            />
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : (
            <>
              {filteredItems.length > 0 ? (
                <div>
                  <div className="grid grid-cols-1 gap-6">
                    {paginatedItems.map((item) => (
                      <div
                        key={item.ID}
                        className="border border-gray-200 rounded-lg overflow-hidden flex bg-white max-w-full shadow-sm hover:shadow-md transition-shadow duration-200"
                      >
                        <div className="w-1/4 h-56 bg-gray-50 flex-shrink-0 relative group">
                          {item.Photo ? (
                            <>
                              <img
                                src={`data:image/jpeg;base64,${item.Photo}`}
                                alt={item.Emertimi}
                                className="object-contain w-full h-full cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                onClick={() => debouncedOpenModal(item.Photo)}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                              <span className="text-sm">Nuk ka Imazh</span>
                            </div>
                          )}
                        </div>

                        <div className="px-6 py-4 flex-1 flex flex-col min-w-0 border-r border-gray-100">
                          <div className="flex items-center space-x-2 mb-1">
                            <Link
                              to={`/itemsdetail/${item.ID}`}
                              className="text-blue-600 font-medium hover:underline truncate text-lg"
                            >
                              {item.Shifra}
                            </Link>
                            {item.NewProduct && (
                              <span
                                className="flex items-center bg-red-50 border border-red-200 text-red-700 text-xs px-2.5 py-1 rounded-full"
                                title="Arritje e Re"
                              >
                                <FaTruck className="mr-1" size={14} />
                              </span>
                            )}
                            {item.APZ && (
                              <span className="flex items-center bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">
                                <FaTag className="mr-1" />
                                Zbritje
                              </span>
                            )}
                          </div>
                          <h2 className="font-semibold text-xl truncate mb-2">
                            {item.Emertimi}
                          </h2>
                          {item.Extras && (
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2 mb-3">
                              {item.Extras}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-y-1 text-sm mt-auto">
                            <p className="text-gray-600">
                              <span className="font-medium">Kodi:</span>{" "}
                              {item.Shifra}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Barkodi:</span>{" "}
                              {item.Barkodi || "-"}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Prodhuesi:</span>{" "}
                              {item.Prodhuesi || "-"}
                            </p>
                            <p className="text-gray-600">
                              <span className="font-medium">Stoku:</span>{" "}
                              {item.SasiaStoku}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-x-10 gap-y-2 text-blue-600">
                            <Link
                              to={`/itemsdetail/${item.ID}?tab=pershkrim`}
                              className="hover:underline whitespace-nowrap flex items-center text-base hover:text-blue-700 transition-colors"
                            >
                              Përshkrimi
                              <IoIosArrowForward className="ml-1" size={14} />
                            </Link>
                            <Link
                              to={`/itemsdetail/${item.ID}?tab=detaje`}
                              className="hover:underline whitespace-nowrap flex items-center text-base hover:text-blue-700 transition-colors"
                            >
                              Detajet
                              <IoIosArrowForward className="ml-1" size={14} />
                            </Link>
                            <Link
                              to={`/itemsdetail/${item.ID}?tab=oem`}
                              className="hover:underline whitespace-nowrap flex items-center text-base hover:text-blue-700 transition-colors"
                            >
                              OEM Code
                              <IoIosArrowForward className="ml-1" size={14} />
                            </Link>
                            <Link
                              to={`/itemsdetail/${item.ID}?tab=zevendesimet`}
                              className="hover:underline whitespace-nowrap flex items-center text-base hover:text-blue-700 transition-colors"
                            >
                              Zëvendësimet
                              <IoIosArrowForward className="ml-1" size={14} />
                            </Link>
                          </div>
                        </div>

                        <div className="w-1/4 p-6 flex flex-col min-w-[250px] bg-gray-50">
                          <div className="mb-6 text-center">
                            <p className="text-2xl font-bold text-gray-800 mb-1">
                              {item.Cmimi} €
                            </p>
                          </div>
                          <div className="flex items-center justify-center space-x-3 mb-6">
                            <button
                              onClick={() => handleDecrement(item.ID)}
                              disabled={(quantities[item.ID] || 1) <= 1}
                              className="border border-gray-300 rounded-full p-2 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                            >
                              <HiMinus className="text-lg font-medium" />
                            </button>
                            <span className="font-medium text-lg w-10 text-center bg-white border border-gray-200 rounded py-1">
                              {quantities[item.ID] || 1}
                            </span>
                            <button
                              onClick={() => handleIncrement(item.ID)}
                              className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
                            >
                              <HiMiniPlus className="text-lg font-medium" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleAddToCart(item.ID)}
                            disabled={addToCartLoading[item.ID]}
                            className={`w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg shadow-sm transition-all ${
                              addToCartLoading[item.ID]
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:shadow-md"
                            }`}
                          >
                            <FaShoppingCart className="mr-2" />
                            {addToCartLoading[item.ID]
                              ? "Duke porositur..."
                              : "Shto në Shportë"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {recommendedItems.length > 0 && (
                    <div className="mt-12">
                      <h2 className="font-semibold text-xl mb-6 pb-2 border-b border-gray-200">
                        Artikuj të Rekomanduar
                      </h2>
                      <div className="grid grid-cols-1 gap-6">
                        {recommendedItems.map((item) => (
                          <div
                            key={item.ID}
                            className="border border-gray-200 rounded-lg overflow-hidden flex bg-white max-w-full shadow-sm hover:shadow-md transition-shadow duration-200"
                          >
                            <div className="w-1/4 h-48 bg-gray-50 flex-shrink-0 relative group">
                              {item.Photo ? (
                                <>
                                  <img
                                    src={`data:image/jpeg;base64,${item.Photo}`}
                                    alt={item.Emertimi}
                                    className="object-contain w-full h-full cursor-pointer transition-transform duration-200 group-hover:scale-105"
                                    onClick={() =>
                                      debouncedOpenModal(item.Photo)
                                    }
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200"></div>
                                </>
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
                                  <span className="text-sm">Nuk ka Imazh</span>
                                </div>
                              )}
                            </div>

                            <div className="px-6 py-4 flex-1 flex flex-col min-w-0 border-r border-gray-100">
                              <div className="flex items-center space-x-2 mb-1">
                                <Link
                                  to={`/itemsdetail/${item.ID}`}
                                  className="text-blue-600 font-medium hover:underline truncate text-lg"
                                >
                                  {item.Shifra}
                                </Link>
                                {item.NewProduct && (
                                  <span
                                    className="flex items-center bg-green-50 border border-green-200 text-green-700 text-xs px-2.5 py-1 rounded-full "
                                    title="Arritje e Re"
                                  >
                                    <FaTruck className="mr-1" size={10} />
                                  </span>
                                )}
                                {item.APZ && (
                                  <span className="flex items-center bg-red-50 text-red-700 text-xs px-2 py-1 rounded-full">
                                    <FaTag className="mr-1" />
                                    Zbritje
                                  </span>
                                )}
                              </div>
                              <h2 className="font-semibold text-xl truncate mb-2">
                                {item.Emertimi}
                              </h2>
                              {item.Extras && (
                                <p className="text-gray-600 text-sm mt-1 line-clamp-2 mb-3">
                                  {item.Extras}
                                </p>
                              )}
                              <div className="grid grid-cols-2 gap-y-1 text-sm mt-auto">
                                <p className="text-gray-600">
                                  <span className="font-medium">Kodi:</span>{" "}
                                  {item.Shifra}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Barkodi:</span>{" "}
                                  {item.Barkodi || "-"}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">
                                    Prodhuesi:
                                  </span>{" "}
                                  {item.Prodhuesi || "-"}
                                </p>
                                <p className="text-gray-600">
                                  <span className="font-medium">Stoku:</span>{" "}
                                  {item.SasiaStoku}
                                </p>
                              </div>
                              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-blue-600">
                                <Link
                                  to={`/itemsdetail/${item.ID}?tab=pershkrim`}
                                  className="hover:underline whitespace-nowrap flex items-center text-sm hover:text-blue-700 transition-colors"
                                >
                                  Përshkrimi
                                  <IoIosArrowForward
                                    className="ml-1"
                                    size={14}
                                  />
                                </Link>
                                <Link
                                  to={`/itemsdetail/${item.ID}?tab=detaje`}
                                  className="hover:underline whitespace-nowrap flex items-center text-sm hover:text-blue-700 transition-colors"
                                >
                                  Detajet
                                  <IoIosArrowForward
                                    className="ml-1"
                                    size={14}
                                  />
                                </Link>
                                <Link
                                  to={`/itemsdetail/${item.ID}?tab=oem`}
                                  className="hover:underline whitespace-nowrap flex items-center text-sm hover:text-blue-700 transition-colors"
                                >
                                  OEM Code
                                  <IoIosArrowForward
                                    className="ml-1"
                                    size={14}
                                  />
                                </Link>
                                <Link
                                  to={`/itemsdetail/${item.ID}?tab=zevendesimet`}
                                  className="hover:underline whitespace-nowrap flex items-center text-sm hover:text-blue-700 transition-colors"
                                >
                                  Zëvendësimet
                                  <IoIosArrowForward
                                    className="ml-1"
                                    size={14}
                                  />
                                </Link>
                              </div>
                            </div>

                            <div className="w-1/4 p-6 flex flex-col min-w-[250px] bg-gray-50">
                              <div className="mb-6 text-center">
                                <p className="text-2xl font-bold text-gray-800 mb-1">
                                  {item.Cmimi} €
                                </p>
                              </div>
                              <div className="flex items-center justify-center space-x-3 mb-6">
                                <button
                                  onClick={() => handleDecrement(item.ID)}
                                  disabled={(quantities[item.ID] || 1) <= 1}
                                  className="border border-gray-300 rounded-full p-2 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                >
                                  <HiMinus className="text-lg font-medium" />
                                </button>
                                <span className="font-medium text-lg w-10 text-center bg-white border border-gray-200 rounded py-1">
                                  {quantities[item.ID] || 1}
                                </span>
                                <button
                                  onClick={() => handleIncrement(item.ID)}
                                  className="border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <HiMiniPlus className="text-lg font-medium" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleAddToCart(item.ID)}
                                disabled={addToCartLoading[item.ID]}
                                className={`w-full flex items-center justify-center bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg shadow-sm transition-all ${
                                  addToCartLoading[item.ID]
                                    ? "opacity-50 cursor-not-allowed"
                                    : "hover:shadow-md"
                                }`}
                              >
                                <FaShoppingCart className="mr-2" />
                                {addToCartLoading[item.ID]
                                  ? "Duke porositur..."
                                  : "Shto në Shportë"}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-8 mb-10 flex justify-center">
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={filteredItems.length}
                      onChange={(page) => setCurrentPage(page)}
                      showSizeChanger={false}
                      className="ant-pagination-item-active:bg-blue-500 ant-pagination-item-active:border-blue-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Nuk u gjet asnjë artikull me këto filtra.
                  </p>
                </div>
              )}
            </>
          )}

          <Modal
            open={modalVisible}
            footer={null}
            onCancel={() => debouncedCloseModal()}
            centered
            bodyStyle={{ padding: 0 }}
            width={600}
            className="image-preview-modal"
          >
            {selectedPhoto && (
              <img
                src={selectedPhoto}
                alt="Preview"
                className="w-full h-auto rounded"
              />
            )}
          </Modal>
        </main>
      </div>
    </div>
  );
};

export default ItemsClient;
