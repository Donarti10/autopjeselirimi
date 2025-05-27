import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, message, Input } from "antd";
import { Link } from "react-router-dom";
import { GrAddCircle } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";

const Subject = () => {
  const url = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const columns = [
    {
      title: "ID",
      dataIndex: "$ID",
      key: "$ID",
    },
    {
      title: "Shifra",
      dataIndex: "Shifra",
      key: "Shifra",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Emertimi",
      dataIndex: "Emertimi",
      key: "Emertimi",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "NUI",
      dataIndex: "NUI",
      key: "NUI",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Nr. Fiskal",
      dataIndex: "Nr. Fiskal",
      key: "Nr. Fiskal",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Nr. i Biznesit",
      dataIndex: "Nr. i Biznesit",
      key: "Nr. i Biznesit",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Nr. i Tvsh",
      dataIndex: "Nr. i Tvsh",
      key: "Nr. i Tvsh",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Adresa",
      dataIndex: "Adresa",
      key: "Adresa",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Telefoni",
      dataIndex: "Telefoni",
      key: "Telefoni",
      render: (value) => (value ? value : "-"),
    },
    {
      title: "Celulari",
      dataIndex: "Celulari",
      key: "Celulari",
      render: (value) => (value ? value : "-"),
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/Subjects/search`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const breadcrumbItems = [
    {
      title: <Link to="/">Faqja Kryesore</Link>,
    },
    {
      title: "Subjektet",
    },
  ];

  return (
    <div className="">
      <header className="mb-6 border-b pb-3 flex justify-between items-center">
        <div>
          <Breadcrumb
            className="text-sm text-gray-600 mb-2"
            items={breadcrumbItems}
          />
          <h1 className="font-bold text-2xl">Subjektet</h1>
          <span className="font-normal">Menaxhoni Subjektet</span>
        </div>
        <div className="flex items-center justify-end flex-wrap gap-2">
          <button
            icon={<GrAddCircle size={18} />}
            // onClick={() => setOpenAddMain(true)}
            className="relative py-[10px] rounded-md bg-white isolation-auto z-10 border-2 border-[#1D4260] before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-[#1D4260] before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 inline-flex items-center justify-center  py-3 text-sm font-semibold text-black bg-white border border-gray-200 rounded-lg shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
          >
            <IoMdAdd size={20} />
            Shto të ri
          </button>
        </div>
      </header>
      <Input
        size="small"
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Kërko subjektin..."
        className="border p-2 rounded mb-4 w-fit"
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        loading={loading}
        rowKey="id"
        size="small"
      />
    </div>
  );
};

export default Subject;
