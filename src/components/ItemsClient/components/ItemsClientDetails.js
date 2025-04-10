import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom"; // Added useLocation
import toast from "react-hot-toast";
import { Spin } from "antd";
import { MdFavoriteBorder } from "react-icons/md";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import Navbar from "../../Navbar/Navbar";
import Sidebar from "../../Navbar/Sidebar";

const ItemsClientDetailsPage = () => {
  const url = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const location = useLocation(); // To read query parameters
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [barcodeItems, setBarcodeItems] = useState([]);
  const [barcodeLoading, setBarcodeLoading] = useState(false);
  const [selectedTabIndex, setSelectedTabIndex] = useState(0); // To control active tab

  const user = localStorage.getItem("user");
  const subject = user ? JSON.parse(user) : null;

  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Set the active tab based on the query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get("tab");
    if (tab === "pershkrim") setSelectedTabIndex(0);
    else if (tab === "detaje") setSelectedTabIndex(1);
    else if (tab === "zevendesimet") setSelectedTabIndex(2);
    else setSelectedTabIndex(0); // Default to "Përshkrim" if no tab is specified
  }, [location.search]);

  useEffect(() => {
    const fetchItemById = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${url}/Item/client/id?id=${id}&subject=${subject}`
        );
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        const data = await response.json();
        setItem(data);
      } catch (error) {
        toast.error("Failed to load item details.");
        console.error("Error fetching item details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id && subject) {
      fetchItemById();
    }
  }, [id, subject, url]);

  useEffect(() => {
    const fetchReplacementItems = async () => {
      if (!item || !subject) return;

      setBarcodeLoading(true);
      try {
        const response = await fetch(
          `${url}/Item/client/search?value=${encodeURIComponent(
            item.Barkodi
          )}&producer=0&subject=${subject}`
        );

        if (!response.ok) {
          throw new Error(`Search failed with status: ${response.status}`);
        }

        const data = await response.json();
        const replacementItems = data.filter((i) => i.ID !== item.ID);

        setBarcodeItems(replacementItems);

        if (replacementItems.length === 0) {
          toast.error("No suitable replacements found for this item.");
        }
      } catch (error) {
        toast.error("Failed to fetch replacement items.");
        console.error("Error fetching replacement items:", error);
      } finally {
        setBarcodeLoading(false);
      }
    };

    if (item) {
      fetchReplacementItems();
    }
  }, [item, url, subject]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  if (!item) {
    return (
      <p className="text-center text-gray-500">Asnjë artikull nuk u gjet.</p>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <div
          className={`transition-all duration-300 ${
            isSidebarCollapsed ? "w-16" : "w-64"
          }`}
        >
          <Sidebar onToggle={handleSidebarToggle} />
        </div>
        <main
          className={`transition-all duration-300 overflow-y-auto pt-28 px-4 ${
            isSidebarCollapsed ? "w-[calc(100%-4rem)]" : "w-[calc(100%-16rem)]"
          }`}
        >
          <div className="p-20 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <div className="relative w-72 h-96">
                  <div className="absolute bottom-[-20px] left-[10%] w-[80%] h-6 bg-gray-300 rounded-full blur-md opacity-50"></div>
                  {item.Photo ? (
                    <img
                      className="relative w-full h-full object-contain z-10"
                      src={`data:image/jpeg;base64,${item.Photo}`}
                      alt={item.Emertimi}
                    />
                  ) : (
                    <div className="relative w-full h-full bg-gray-100 text-gray-400 flex items-center justify-center z-10">
                      Nuk ka Imazh
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-4">{item.Emertimi}</h1>
                <p className="text-gray-500 mb-2 text-sm">
                  Shifra: {item.Shifra}
                </p>
                <div className="flex items-center py-7 space-x-3 mb-4">
                  <span className="text-3xl font-semibold text-black">
                    ${item.Cmimi}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Net: ${item["Cmimi pa tvsh"].toFixed(2)}
                  </span>
                  <span
                    className={`text-sm px-2 rounded-full ${
                      item.SasiaStoku > 0
                        ? "text-green-500 bg-green-100"
                        : "text-red-500 bg-red-100"
                    }`}
                  >
                    {item.SasiaStoku > 0 ? "Në Magazinë" : "Jashtë Magazinës"}
                  </span>
                  {item.NewProduct && (
                    <span className="text-sm px-2 rounded-full text-blue-500 bg-blue-100">
                      Produkt i Ri
                    </span>
                  )}
                </div>
                <div className="flex items-center mb-6">
                  <div className="flex items-center">
                    <button className="w-10 h-10 border border-gray-300 rounded-l flex justify-center items-center text-xl">
                      -
                    </button>
                    <input
                      type="text"
                      className="w-16 h-10 text-center border-t border-b border-gray-300"
                      value="1"
                      readOnly
                    />
                    <button className="w-10 h-10 border border-gray-300 rounded-r flex justify-center items-center text-xl">
                      +
                    </button>
                  </div>
                  <button className="ml-4 w-[50%] bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors">
                    Shto në Shportë
                  </button>
                </div>
                <div>
                  <Tabs
                    selectedIndex={selectedTabIndex}
                    onSelect={(index) => setSelectedTabIndex(index)}
                    className="mt-16"
                  >
                    <TabList className="flex border-b border-gray-300">
                      <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Përshkrim
                      </Tab>
                      <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Detaje
                      </Tab>
                      <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent hover:text-blue-600 focus:outline-none">
                        Zëvendësimet
                      </Tab>
                    </TabList>
                    <TabPanel className="mt-4">
                      <h2 className="text-lg font-bold mb-2">Përshkrim</h2>
                      <ul className="list-disc list-inside mt-2 text-gray-600">
                        <li>Emërtimi: {item.Emertimi}</li>
                        <li>Prodhuesi: {item.Prodhuesi}</li>
                        <li>Çmimi me TVSH: ${item.Cmimi}</li>
                        <li>
                          Disponueshmëria:{" "}
                          {item.SasiaStoku > 0 ? "Në stok" : "Pa stok"}
                        </li>
                        {item.NewProduct && <li>Statusi: Produkt i Ri</li>}
                        {item.Extras && <li>Extras: {item.Extras}</li>}
                      </ul>
                    </TabPanel>
                    <TabPanel className="mt-4">
                      <h2 className="text-lg font-bold mb-2">Detaje</h2>
                      <table className="w-full border border-gray-300 text-sm text-left">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">ID</td>
                            <td className="py-2 px-4">{item.ID}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Shifra</td>
                            <td className="py-2 px-4">{item.Shifra}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Barkodi</td>
                            <td className="py-2 px-4">{item.Barkodi}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">
                              Prodhuesi
                            </td>
                            <td className="py-2 px-4">{item.Prodhuesi}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">
                              Çmimi me TVSH
                            </td>
                            <td className="py-2 px-4">${item.Cmimi}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">
                              Çmimi pa TVSH
                            </td>
                            <td className="py-2 px-4">
                              ${item["Cmimi pa tvsh"].toFixed(2)}
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">Stoku</td>
                            <td className="py-2 px-4">{item.Stoku}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">
                              Sasia në Stok
                            </td>
                            <td className="py-2 px-4">{item.SasiaStoku}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 px-4 font-semibold">
                              TVSH (%)
                            </td>
                            <td className="py-2 px-4">{item.VatP}%</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-4 font-semibold">
                              Njësia Matëse
                            </td>
                            <td className="py-2 px-4">{item.MeasureUnitId}</td>
                          </tr>
                        </tbody>
                      </table>
                    </TabPanel>
                    <TabPanel className="mt-4">
                      <h2 className="text-lg font-bold mb-4">Zëvendësimet</h2>
                      {barcodeLoading ? (
                        <div className="flex justify-center items-center h-32">
                          <Spin />
                        </div>
                      ) : barcodeItems.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                          {barcodeItems.map((replacement) => (
                            <div
                              key={replacement.ID}
                              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start space-x-4">
                                <div className="w-24 h-24 flex-shrink-0">
                                  {replacement.Photo ? (
                                    <img
                                      src={`data:image/jpeg;base64,${replacement.Photo}`}
                                      alt={replacement.Emertimi}
                                      className="w-full h-full object-contain rounded"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-center text-gray-400 text-sm rounded">
                                      Nuk ka Imazh
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-gray-800">
                                    {replacement.Emertimi}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    Shifra: {replacement.Shifra}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Barkodi: {replacement.Barkodi}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Prodhuesi: {replacement.Prodhuesi}
                                  </p>
                                  <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-lg font-semibold text-black">
                                      ${replacement.Cmimi}
                                    </span>
                                    <span
                                      className={`text-xs px-2 py-1 rounded-full ${
                                        replacement.SasiaStoku > 0
                                          ? "text-green-600 bg-green-100"
                                          : "text-red-600 bg-red-100"
                                      }`}
                                    >
                                      {replacement.SasiaStoku > 0
                                        ? `Në Stok (${replacement.SasiaStoku})`
                                        : "Jashtë Stokut"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700">
                          Nuk u gjetën zëvendësime për këtë artikull. Provoni të
                          kërkoni manualisht ose kontaktoni suportin.
                        </p>
                      )}
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ItemsClientDetailsPage;
