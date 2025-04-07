import React from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import "chart.js/auto";
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

const barData = {
  labels: [
    "Janar",
    "Shkurt",
    "Mars",
    "Prill",
    "Maj",
    "Qershor",
    "Korrik",
    "Gusht",
    "Shtator",
    "Tetor",
    "Nëntor",
    "Dhjetor",
  ],
  datasets: [
    {
      label: "Shitjet",
      data: [
        12000, 15000, 10000, 18000, 20000, 22000, 25000, 23000, 21000, 19000,
        17000, 16000,
      ],
      backgroundColor: "rgba(75, 192, 192, 0.6)",
    },
  ],
};

const pieData = {
  labels: [
    "Pjesë Motori",
    "Pjesë Frenimi",
    "Pjesë Suspensioni",
    "Pjesë Eurotrike",
    "Të Tjera",
  ],
  datasets: [
    {
      label: "Shitjet sipas Kategorisë",
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
        "rgba(153, 102, 255, 0.6)",
      ],
    },
  ],
};

const lineData = {
  labels: ["01/01", "01/02", "01/03", "01/04", "01/05", "01/06"],
  datasets: [
    {
      label: "Niveli i Inventarit - Filtri i Ajrit",
      data: [100, 90, 80, 85, 70, 75],
      borderColor: "rgba(75, 192, 192, 1)",
      fill: false,
    },
  ],
};

const breadcrumbItems = [
  { title: <Link to="/">Faqja Kryesore</Link> },
  { title: "Artikujt" },
];

const AdminDashboard = () => {
  return (
    <div className=" px-2 py-6">
      <header className="mb-6 border-b pb-3 flex justify-between items-center">
        <div>
          <Breadcrumb
            className="text-sm text-gray-600 mb-2"
            items={breadcrumbItems}
          />
          <h1 className="font-bold text-2xl">Paneli</h1>
          <span className="font-normal">Menaxhoni Panelin</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Shitjet Totale
          </h2>
          <p className="text-2xl font-bold text-teal-600">100,000 Euro</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Porositë Totale
          </h2>
          <p className="text-2xl font-bold text-teal-600">500</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-lg font-semibold text-gray-700">
            Vlera Mesatare e Porosisë
          </h2>
          <p className="text-2xl font-bold text-teal-600">200 Euro</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Shitjet Mujore
          </h2>
          <Bar data={barData} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Kategoritë më të Shitura
          </h2>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Niveli i Inventarit - Filtri i Ajrit
        </h2>
        <Line data={lineData} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Pjesët më të Shitura
        </h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-600">Emri</th>
              <th className="py-2 text-gray-600 text-right">Sasia e Shitjes</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2">Filtri i Ajrit</td>
              <td className="py-2 text-right">150</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2">Padsat e Frenave</td>
              <td className="py-2 text-right">120</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2">Amortizatorët</td>
              <td className="py-2 text-right">100</td>
            </tr>
            <tr className="border-b hover:bg-gray-50">
              <td className="py-2">Bateri</td>
              <td className="py-2 text-right">80</td>
            </tr>
            <tr className="hover:bg-gray-50">
              <td className="py-2">Goma</td>
              <td className="py-2 text-right">70</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
