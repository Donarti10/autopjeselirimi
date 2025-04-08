import React, { useEffect, useState } from "react";
import { Breadcrumb, Table, Input, Select, Modal, Tooltip, Spin } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";

const { Option } = Select;

const CartList = () => {
  const url = process.env.REACT_APP_API_URL;
  const [carts, setCarts] = useState([]);
  const [barcodeCarts, setBarcodeCarts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(null);
  const [producers, setProducers] = useState([]);
  const [producerID, setProducerID] = useState(null);
  const [loadingProducer, setLoadingProducer] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const subjectID = parseInt(user);

  const debouncedOpenModal = debounce((photo) => {
    setSelectedPhoto(`data:image/jpeg;base64,${photo}`);
    setModalVisible(true);
  }, 300);

  const debouncedCloseModal = debounce(() => {
    setModalVisible(false);
    setSelectedPhoto(null);
  }, 300);

  useEffect(() => {
    const fetchProducers = async () => {
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
    fetchProducers();
  }, [url]);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/Cart/subject?id=${subjectID}`);
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const transformedData = data.map((item) => ({
        ...item,
        key: item.id, // Add key for Table
        Photo: null, // Add if you have photo data available
        Shifra: item.number, // Map number to Shifra
        Barkodi: item.number, // Using number as barcode (adjust if you have actual barcode)
        Emertimi: item.subjectName,
        Extras: item.note,
        Prodhuesi: `${item.createdBy?.firstName} ${item.createdBy?.lastName}`,
        Cmimi1: item.totals?.totalWithoutDiscount,
        Cmimi2: item.totals?.totalWithDiscount,
        Cmimi3: item.totals?.totalDiscount,
        Stoku: item.totals?.totalItems,
      }));
      setCarts(transformedData);

      if (transformedData.length === 1 && transformedData[0].Barkodi) {
        fetchCartsByBarcode(transformedData[0].Barkodi);
      } else {
        setBarcodeCarts([]);
      }
    } catch (error) {
      toast.error("Failed to fetch carts.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCartsByBarcode = async (barcode) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${url}/Cart/subject?id=${subjectID}&value=${barcode}`
      );
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      const transformedData = data.map((item) => ({
        ...item,
        key: item.id,
        Photo: null,
        Shifra: item.number,
        Emertimi: item.subjectName,
        Extras: item.note,
        Prodhuesi: `${item.createdBy?.firstName} ${item.createdBy?.lastName}`,
        Cmimi1: item.totals?.totalWithoutDiscount,
        Cmimi2: item.totals?.totalWithDiscount,
        Cmimi3: item.totals?.totalDiscount,
        Stoku: item.totals?.totalItems,
      }));
      setBarcodeCarts(transformedData);
    } catch (error) {
      toast.error("Failed to fetch barcode carts.");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, [value, producerID, subjectID]);

  const filteredCarts = carts.filter((cart) => {
    const search = value ? value.toLowerCase() : "";
    const emertimi = cart.Emertimi ? cart.Emertimi.toLowerCase() : "";
    const extras = cart.Extras ? cart.Extras.toLowerCase() : "";
    return emertimi.includes(search) || extras.includes(search);
  });

  const breadcrumbItems = [
    { title: <Link to="/">Faqja Kryesore</Link> },
    { title: "Shporta" },
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
      title: "Numri",
      dataIndex: "Shifra",
      key: "Shifra",
      width: "15%",
    },
    {
      title: "Subjekti",
      render: (record) => (
        <div>
          <Tooltip title={`Shiko detajet ${record?.Shifra || "këtë shportë"}`}>
            <Link className="text-blue-400" to={`/cartdetails/${record.id}`}>
              <p>{record?.Emertimi}</p>
            </Link>
          </Tooltip>
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
      width: "25%",
    },
    {
      title: "Total Pa Zbritje",
      dataIndex: "Cmimi1",
      key: "Cmimi1",
      render: (value) => (
        <div className="text-center">
          {value !== undefined && value !== null ? `${value} €` : "-"}
        </div>
      ),
      width: "10%",
    },
    {
      title: "Total Me Zbritje",
      dataIndex: "Cmimi2",
      key: "Cmimi2",
      render: (value) => (
        <div className="text-center">
          {value !== undefined && value !== null ? `${value} €` : "-"}
        </div>
      ),
      width: "10%",
    },
    {
      title: "Zbritja",
      dataIndex: "Cmimi3",
      key: "Cmimi3",
      render: (value) => (
        <div className="text-center">
          {value !== undefined && value !== null ? `${value} €` : "-"}
        </div>
      ),
      width: "8%",
    },
    {
      title: "Sasia",
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
      width: "7%",
    },
    {
      title: "Krijuar Nga",
      dataIndex: "Prodhuesi",
      key: "Prodhuesi",
      width: "10%",
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
          <h1 className="font-bold text-2xl">Shporta</h1>
          <span className="font-normal">Menaxhoni Shportat</span>
        </div>
      </header>

      <div className="">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin />
          </div>
        ) : (
          <Table
            dataSource={filteredCarts}
            columns={columns}
            rowKey="key"
            size="small"
          />
        )}
      </div>
    </div>
  );
};

export default CartList;
