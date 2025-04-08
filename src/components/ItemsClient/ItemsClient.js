import React, { useEffect, useState } from "react";
import { Breadcrumb, Input, Select, Modal, Tooltip, Spin } from "antd";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import debounce from "lodash/debounce";
import {
  FaStar,
  FaBalanceScale,
  FaMinus,
  FaPlus,
  FaShoppingCart,
} from "react-icons/fa";

const { Option } = Select;

const ItemsClient = () => {
  const url = process.env.REACT_APP_API_URL;
  const [items, setItems] = useState([]);
  const [barcodeItems, setBarcodeItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("");
  const [producers, setProducers] = useState([]);
  const [producerID, setProducerID] = useState(null);
  const [loadingProducer, setLoadingProducer] = useState(false);

  const [subjects, setSubjects] = useState([]);
  const [subjectID, setSubjectID] = useState(null);
  const [loadingSubject, setLoadingSubject] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const user = localStorage.getItem("user");
  const subject = JSON.parse(user);

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
        setProducers(await res.json());
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

  const fetchItems = async () => {
    setLoading(true);
    try {
      const q = value.trim() || " ";
      const prod = producerID || 0;
      const subj = subject || 0;
      const res = await fetch(
        `${url}/Item/client/search?value=${q}&producer=${prod}&subject=${subj}`
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setItems(data);
      if (data.length === 1 && data[0].Barkodi) {
        fetchItemsByBarcode(data[0].Barkodi);
      } else {
        setBarcodeItems([]);
      }
    } catch (err) {
      toast.error("Failed to load items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchItemsByBarcode = async (barcode) => {
    setLoading(true);
    try {
      const prod = producerID || 0;
      const subj = subjectID || 0;
      const res = await fetch(
        `${url}/Item/admin/search?value=${barcode}&producer=${prod}&subject=${subj}`
      );
      if (!res.ok) throw new Error(res.statusText);
      setBarcodeItems(await res.json());
    } catch (err) {
      toast.error("Failed to load barcode items.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [value, producerID, subjectID]);

  const filteredItems = items.filter((it) => {
    const s = value.toLowerCase();
    return (
      it.Emertimi?.toLowerCase().includes(s) ||
      it.Extras?.toLowerCase().includes(s)
    );
  });

  const breadcrumbItems = [
    { title: <Link to="/">Faqja Kryesore</Link> },
    { title: "Artikujt" },
  ];

  return (
    <div>
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

      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          size="middle"
          placeholder="Kerko Artikull"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-64"
        />

        <Select
          showSearch
          allowClear
          placeholder="Zgjedh Prodhuesin"
          loading={loadingProducer}
          options={producers.map((p) => ({
            label: p.Shifra,
            value: p["$ID"],
          }))}
          value={producerID}
          onChange={setProducerID}
          className="w-48"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.ID}
                  className="border border-gray-200 rounded-lg overflow-hidden flex bg-white"
                >
                  <div className="w-1/4 h-40 bg-gray-100 flex-shrink-0 relative m-auto">
                    {item.Photo ? (
                      <img
                        src={`data:image/jpeg;base64,${item.Photo}`}
                        alt={item.Emertimi}
                        className="object-cover w-full h-full cursor-pointer"
                        onClick={() => debouncedOpenModal(item.Photo)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        Nuk ka Imazh
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Link
                        to={`/itemsdetail/${item.ID}`}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        {item.Shifra}
                      </Link>
                    </div>
                    <h2 className="font-semibold text-lg leading-snug">
                      {item.Emertimi}
                    </h2>
                    {item.Extras && (
                      <p className="text-gray-500 text-sm mt-1 break-words w-full">
                        {item.Extras}
                      </p>
                    )}
                    <p className="text-gray-600 text-sm mt-2">
                      Kodi: <span className="font-medium">{item.Shifra}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Prodhuesi:{" "}
                      <span className="font-medium">{item.Prodhuesi}</span>
                    </p>
                    <div className="mt-4 text-sm text-blue-600 flex justify-between space-x-4">
                      <Link
                        to={`/items/${item.ID}/replacements`}
                        className="hover:underline whitespace-nowrap"
                      >
                        ZËVENDËSIMET &rsaquo;
                      </Link>
                      <Link
                        to={`/items/${item.ID}/tecdoc`}
                        className="hover:underline whitespace-nowrap"
                      >
                        ZËVENDËSIMET TECDOC &rsaquo;
                      </Link>
                      <Link
                        to={`/items/${item.ID}/more`}
                        className="hover:underline whitespace-nowrap"
                      >
                        MË SHUMË INFORMACION &rsaquo;
                      </Link>
                    </div>
                  </div>

                  <div className="w-1/4 p-4 flex flex-col justify-between">
                    <div className="flex items-center space-x-2 mb-4">
                      <button className="border rounded p-1">
                        <FaMinus />
                      </button>
                      <span className="font-medium">1</span>
                      <button className="border rounded p-1">
                        <FaPlus />
                      </button>
                      <button className="flex items-center w-full justify-center bg-red-500 hover:bg-red-600 text-white py-2 rounded">
                        <FaShoppingCart className="mr-2" />
                        Porosit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">
              Nuk u gjet asnjë artikull.
            </p>
          )}
        </>
      )}

      <Modal
        visible={modalVisible}
        footer={null}
        onCancel={() => debouncedCloseModal()}
        centered
        bodyStyle={{ padding: 0 }}
        width={600}
      >
        {selectedPhoto && (
          <img src={selectedPhoto} alt="Preview" className="w-full h-auto" />
        )}
      </Modal>
    </div>
  );
};

export default ItemsClient;
