import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, Input, Select, Modal, Tooltip, Spin } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

const { Option } = Select;

const Items = () => {
  const url = process.env.REACT_APP_API_URL;
  const [items, setItems] = useState([]);
  const [barcodeItems, setBarcodeItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [producers, setProducers] = useState([]);
  const [producerID, setProducerID] = useState(null);
  const [loadingProducer, setLoadingProducer] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const debouncedOpenModal = debounce((photo) => {
    setSelectedPhoto(`data:image/jpeg;base64,${photo}`);
    setModalVisible(true);
  }, 300);

  const debouncedCloseModal = debounce(() => {
    setModalVisible(false);
    setSelectedPhoto(null);
  }, 300);

  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingProducer(true);
      try {
        const response = await fetch(`${url}/Producer/search`);
        if (!response.ok) throw new Error(`Error: ${response.status}`);
        const data = await response.json();
        setProducers(data);
      } catch (error) {
        toast.error("Failed to fetch producers.");
        console.error("Error fetching producers:", error);
      } finally {
        setLoadingProducer(false);
      }
    };
    fetchRoles();
  }, [url]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}/Item/admin/search?value=${value || " "}&producer=${
          producerID || 0
        }`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setItems(data);

      if (data.length === 1 && data[0].Barkodi) {
        fetchItemsByBarcode(data[0].Barkodi);
      } else {
        setBarcodeItems([]);
      }
    } catch (error) {
      toast.error("Failed to fetch items.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByBarcode = async (barcode) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}/Item/admin/search?value=${barcode}&producer=${producerID || 0}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setBarcodeItems(data);
    } catch (error) {
      toast.error("Failed to fetch barcode items.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [value, producerID]);

  const filteredItems = items.filter((item) => {
    const search = value ? value.toLowerCase() : "";
    const emertimi = item.Emertimi ? item.Emertimi.toLowerCase() : "";
    const extras = item.Extras ? item.Extras.toLowerCase() : "";
    return emertimi.includes(search) || extras.includes(search);
  });

  const breadcrumbItems = [
    { title: <Link to="/">Faqja Kryesore</Link> },
    { title: "Artikujt" },
  ];

  const highlightMatch = (text, search) => {
    if (!search || !text) return text;
    const regex = new RegExp(`(${search})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === search.toLowerCase() ? (
        <span
          key={index}
          className="bg-yellow-100 text-yellow-800 px-1 rounded hover:bg-yellow-200 cursor-pointer"
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const columns = [
    {
      title: "Foto",
      dataIndex: "Photo",
      key: "Photo",
      render: (photo) => (
        <div className="flex items-center w-full justify-center rounded-full">
          {photo && (
            <Tooltip
              color="white"
              title={
                <img
                  src={`data:image/jpeg;base64,${photo}`}
                  alt="Preview"
                  style={{ width: "400px", height: "400px" }}
                />
              }
              placement="right"
            >
              <img
                src={`data:image/jpeg;base64,${photo}`}
                alt="Product"
                style={{
                  maxWidth: "40px",
                  maxHeight: "40px",
                  borderRadius: "100%",
                  cursor: "pointer",
                }}
                onClick={() => debouncedOpenModal(photo)}
              />
            </Tooltip>
          )}
        </div>
      ),
    },
    { title: "Shifra", dataIndex: "Shifra", key: "Shifra" },
    { title: "Barkodi", dataIndex: "Barkodi", key: "Barkodi" },
    {
      title: "Emertimi",
      render: (record) => (
        <div>
          <p>{record?.Emertimi}</p>
          <p className="text-gray-400 text-xs">
            {record?.Extras
              ? record.Extras.split(",").map((extra, index) => (
                  <span key={index}>
                    {highlightMatch(extra.trim(), value)}
                    {index < record.Extras.split(",").length - 1 && ", "}
                  </span>
                ))
              : ""}
          </p>
        </div>
      ),
    },
    { title: "Prodhuesi", dataIndex: "Prodhuesi", key: "Prodhuesi" },
    {
      title: "Cmimi 1",
      dataIndex: "Cmimi1",
      key: "Cmimi1",
      render: (value) => (
        <div className="text-center">
          {value !== undefined && value !== null ? `${value} €` : "-"}
        </div>
      ),
    },
    {
      title: "Cmimi 2",
      dataIndex: "Cmimi2",
      key: "Cmimi2",
      render: (value) => (
        <div className="text-center">
          {value !== undefined && value !== null ? `${value} €` : "-"}
        </div>
      ),
    },
    {
      title: "Cmimi 3",
      dataIndex: "Cmimi3",
      key: "Cmimi3",
      render: (value) => (
        <div className="text-center">
          {value !== undefined && value !== null ? `${value} €` : "-"}
        </div>
      ),
    },
    {
      title: "Stoku",
      dataIndex: "Stoku",
      key: "Stoku",
      render: (value) => (
        <span
          style={{
            backgroundColor:
              value < 1 ? "#FEE2E2" : value > 0 ? "#D1FAE5" : "#FEE2E2",
            color: "#111",
            padding: "2px 4px",
            borderRadius: "4px",
            display: "inline-block",
            minWidth: "30px",
            textAlign: "center",
          }}
        >
          {value}
        </span>
      ),
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
          <h1 className="font-bold text-2xl">Artikujt</h1>
          <span className="font-normal">Menaxhoni Artikujt</span>
        </div>
      </header>

      <Input
        size="small"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Artikulli"
        className="border p-2 rounded mb-4 w-fit mr-5"
        style={{ width: 350 }}
      />

      <Select
        showSearch
        allowClear
        size="large"
        options={producers?.map((org) => ({
          label: org.Shifra,
          value: org["$ID"],
        }))}
        value={producerID}
        placeholder="Zgjedh Prodhuesin"
        onChange={(value) => setProducerID(value)}
        style={{ width: 350 }}
      />

      <div className="">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={filteredItems}
            columns={columns}
            rowKey="id"
            size="small"
          />
        )}
      </div>

      <div>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin />
          </div>
        ) : (
          barcodeItems.length > 0 && (
            <div>
              <p className="font-semibold text-lg mt-10 mb-4">
                Artikujt me të njejtin Barkod
              </p>
              <Table
                dataSource={barcodeItems}
                columns={columns}
                rowKey="id"
                size="small"
              />
            </div>
          )
        )}
      </div>

      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => debouncedCloseModal()}
        centered
        bodyStyle={{ padding: 0 }}
        width={600}
      >
        {selectedPhoto && (
          <img
            src={selectedPhoto}
            alt="Product Preview"
            style={{ width: "100%", height: "auto" }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Items;
