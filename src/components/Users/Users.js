import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, message, Input } from "antd";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaLock, FaUnlock } from "react-icons/fa";
import AddUserDrawer from "./components/AddUser";

const Users = () => {
  const url = process.env.REACT_APP_API_URL;
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Subjekti",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Çelësi",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Roli",
      dataIndex: ["role", "role"],
      key: "role",
    },
    {
      title: "Emri",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Mbiemri",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Përdoruesi",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Krijuar",
      dataIndex: "created",
      key: "created",
      render: (created) => created.slice(0, 10),
    },
    {
      title: "Aktiv",
      dataIndex: "active",
      key: "active",
      width: "2%",
      render: (info) => {
        const isActive = info;
        return (
          <div className="flex items-center justify-center space-x-2">
            <span
              className={`badge flex items-center px-1 py-1 rounded-sm ${
                isActive
                  ? "bg-emerald-100 text-emerald-300 dark:bg-emerald-500/50 dark:text-emerald-100 border-0 rounded"
                  : "text-red-600 bg-red-100 dark:text-red-100 dark:bg-red-500/20 border-0"
              }`}
            >
              {isActive ? <FaUnlock size={13} /> : <FaLock size={13} />}
            </span>
          </div>
        );
      },
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/User`);
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
      title: "Subjektet dhe Përdoruesit",
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
          <h1 className="font-bold text-2xl">Subjektet dhe Përdoruesit</h1>
          <span className="font-normal">
            Menaxhoni Subjektet dhe Përdoruesit
          </span>
        </div>
        <div className="flex items-center justify-end flex-wrap gap-2">
          <button
            onClick={() => setDrawerVisible(true)}
            className="relative px-4 py-[10px] rounded-md bg-white isolation-auto z-10 border-2 border-[#1D4260] before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full hover:text-white before:-right-full before:hover:right-0 before:rounded-full before:bg-[#1D4260] before:-z-10 before:aspect-square before:hover:scale-150 overflow-hidden before:hover:duration-700 inline-flex items-center justify-center px-4 py-3 text-sm font-semibold text-black bg-white border border-gray-200 rounded-lg shadow-sm gap-x-2 hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
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
        placeholder="Kërko përdoruesit..."
        className="border p-2 rounded mb-4 w-fit"
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        loading={loading}
        rowKey="id"
        size="small"
      />
      <AddUserDrawer
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        refreshUsers={fetchUsers}
      />
    </div>
  );
};

export default Users;
