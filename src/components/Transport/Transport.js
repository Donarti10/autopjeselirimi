import React, { useEffect, useState } from "react";
import { Table, Input, Button } from "antd";
import { IoMdAdd } from "react-icons/io";
import { FaLock, FaUnlock } from "react-icons/fa";
import { BsPlusCircle } from "react-icons/bs";
import toast from "react-hot-toast";
import AddTransportDetail from "./components/AddTransportDetail";
import AddTransport from "./components/AddTransport";

const Transport = () => {
  const url = process.env.REACT_APP_API_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [selectedRelationId, setSelectedRelationId] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}/TransportRelation`);
      if (!res.ok) throw new Error(res.statusText);
      setData(await res.json());
    } catch (err) {
      toast.error("Marrja e linjave të transportit dështoi.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter((rel) => {
    const topMatch = rel.relation
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const nestedMatch = rel.transportRelationDetails.some((d) =>
      [d.time, d.company]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    return topMatch || nestedMatch;
  });

  const columns = [
    { title: "Lidhjet", dataIndex: "relation", key: "relation" },
    {
      title: "Krijuar",
      dataIndex: "created",
      key: "created",
      render: (ts) => ts?.slice(0, 10) || "—",
    },
    {
      title: "Aktiv",
      dataIndex: "active",
      key: "active",
      width: "3%",
      render: (active, record) => (
        <div className="flex items-center gap-3">
          {active ? (
            <FaUnlock size={13} color="green" />
          ) : (
            <FaLock size={13} color="red" />
          )}
          <BsPlusCircle
            size={13}
            variant="twoTone"
            color="blue-300"
            className="cursor-pointer text-blue-500"
            onClick={() => {
              setSelectedRelationId(record.id);
              setDetailDrawerVisible(true);
            }}
            title="Shto Detaj"
          />
        </div>
      ),
    },
  ];

  const detailColumns = [
    { title: "Koha", dataIndex: "time", key: "time" },
    { title: "Kompania", dataIndex: "company", key: "company" },
  ];

  return (
    <div>
      <header className="mb-6 mt-5 border-b py-2 flex justify-between items-center">
        <Input
          size="small"
          placeholder="Kërko Linja Transporti..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded w-fit"
        />
        <Button
          onClick={() => setDrawerVisible(true)}
          size="large"
          type="primary"
          icon={<IoMdAdd size={20} />}
        >
          Shto të ri
        </Button>
      </header>

      <Table
        dataSource={filtered}
        columns={columns}
        loading={loading}
        rowKey="id"
        size="small"
        expandable={{
          rowExpandable: (record) =>
            Array.isArray(record.transportRelationDetails) &&
            record.transportRelationDetails.length > 0,
          expandedRowRender: (record) => (
            <Table
              columns={detailColumns}
              dataSource={record.transportRelationDetails}
              pagination={false}
              rowKey="id"
              size="small"
            />
          ),
        }}
      />

      <AddTransport
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        refreshTransport={fetchData}
      />

      <AddTransportDetail
        visible={detailDrawerVisible}
        onClose={() => {
          setDetailDrawerVisible(false);
          setSelectedRelationId(null);
        }}
        transportRelationId={selectedRelationId}
        refreshTransport={fetchData}
      />
    </div>
  );
};

export default Transport;
