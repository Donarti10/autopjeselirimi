// Users.js
import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, message, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaLock, FaUnlock } from "react-icons/fa";
import toast from "react-hot-toast";
import AddCommunication from "./components/AddCommunication";

const Communication = () => {
  const url = process.env.REACT_APP_API_URL;
  const [communication, setCommunication] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);

  const fetchCommunication = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}/LocalUserSettingCommunication/user?id=1`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setCommunication(data);
    } catch (error) {
      toast.error("Failed to fetch users.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunication();
  }, []);

  const filteredCommunication = communication.filter((communication) =>
    Object.values(communication).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Lloji i Komunikimit",
      dataIndex: ["comunicationType", "type"],
      key: "comunicationType",
    },
    {
      title: "Vlera",
      dataIndex: "value",
      key: "value",
    },
    {
      title: "Përdoruesi",
      dataIndex: "username",
      key: "username",
      render: (username) => username || "—",
    },
    {
      title: "Fjalëkalimi",
      dataIndex: "password",
      key: "password",
      render: (password) => password || "—",
    },
    {
      title: "Krijuar",
      dataIndex: "created",
      key: "created",
      render: (created) => created?.slice(0, 10) || "—",
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
                ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
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
    <div className="">
      <header className="mb-6 mt-5 border-b py-2 flex justify-between items-center">
        <Input
          size="small"
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Kërko Komunikime..."
          className="border p-2 rounded w-fit"
        />
        <div className="flex items-center justify-end flex-wrap gap-2">
          <Button
            onClick={() => setDrawerVisible(true)}
            size="large"
            type="primary"
          >
            <IoMdAdd size={20} />
            Shto të ri
          </Button>
        </div>
      </header>
      <Table
        dataSource={filteredCommunication}
        columns={columns}
        loading={loading}
        rowKey="id"
        size="small"
      />
      <AddCommunication
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        refreshUsers={fetchCommunication}
      />
    </div>
  );
};

export default Communication;
