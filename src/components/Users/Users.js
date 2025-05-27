// src/components/Users/Users.jsx
import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaLock, FaUnlock } from "react-icons/fa";
import AddUserDrawer from "./components/AddUser";
import toast from "react-hot-toast";

const Users = () => {
  const url = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/User`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      setUsers(await response.json());
    } catch (error) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id) => {
    navigate(`/edituser/${id}`);
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const breadcrumbItems = [
    { title: <Link to="/">Faqja Kryesore</Link> },
    { title: "Klientat" },
  ];

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
      render: (text, record) => (
        <div
          onClick={() => handleEdit(record.id)}
          className="cursor-pointer text-blue-700"
        >
          {text || "-"}
        </div>
      ),
    },
    {
      title: "Çelësi",
      dataIndex: "key",
      key: "key",
      render: (key) => key || "-",
    },
    {
      title: "Roli",
      dataIndex: ["role", "role"],
      key: "role",
      render: (r) => r || "-",
    },
    {
      title: "Emri",
      dataIndex: "firstName",
      key: "firstName",
      render: (n) => n || "-",
    },
    {
      title: "Mbiemri",
      dataIndex: "lastName",
      key: "lastName",
      render: (n) => n || "-",
    },
    {
      title: "Përdoruesi",
      dataIndex: "username",
      key: "username",
      render: (u) => u || "-",
    },
    {
      title: "Krijuar",
      dataIndex: "created",
      key: "created",
      render: (c) => (c ? c.slice(0, 10) : "-"),
    },
    {
      title: "Aktiv",
      dataIndex: "active",
      key: "active",
      width: "2%",
      render: (active) => (
        <div className="flex items-center justify-center">
          <span
            className={`badge flex items-center px-1 py-1 rounded-sm ${
              active
                ? "bg-emerald-100 text-emerald-300 dark:bg-emerald-500/50 dark:text-emerald-100"
                : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100"
            }`}
          >
            {active ? <FaUnlock size={13} /> : <FaLock size={13} />}
          </span>
        </div>
      ),
    },
  ];

  return (
    <div>
      <header className="mb-6 border-b pb-3 flex justify-between items-center">
        <div>
          <Breadcrumb
            className="text-sm text-gray-600 mb-2"
            items={breadcrumbItems}
          />
          <h1 className="font-bold text-2xl">Klientat</h1>
          <span className="font-normal">Menaxhoni Klientat</span>
        </div>
        <button
          onClick={() => setDrawerVisible(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded hover:bg-gray-50"
        >
          <IoMdAdd size={20} />
          Shto të ri
        </button>
      </header>
      <Input
        size="small"
        placeholder="Kërko Klientat..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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
