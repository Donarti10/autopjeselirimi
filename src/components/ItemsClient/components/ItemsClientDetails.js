import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Spin } from "antd";

const ItemsClientDetails = () => {
  const url = process.env.REACT_APP_API_URL;
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = localStorage.getItem("user");
  const subject = user ? JSON.parse(user) : null;

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
    <div className="p-4">
      <div className="border-b pb-3 mb-4">
        <h2 className="text-2xl font-bold">{item.Emertimi}</h2>
        <p className="text-gray-600">Shifra: {item.Shifra}</p>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mr-4 mb-4 md:mb-0">
          {item.Photo ? (
            <img
              src={`data:image/jpeg;base64,${item.Photo}`}
              alt={item.Emertimi}
              className="w-full object-cover"
            />
          ) : (
            <div className="bg-gray-100 text-gray-400 h-64 flex items-center justify-center">
              Nuk ka Imazh
            </div>
          )}
        </div>
        <div className="flex-1">
          <p className="text-gray-800 mb-2">
            <strong>Prodhuesi:</strong> {item.Prodhuesi}
          </p>
          <p className="text-gray-800 mb-2">
            <strong>Çmimi:</strong> {item.Cmimi} (me TVSH)
          </p>
          <p className="text-gray-800 mb-2">
            <strong>Stoku:</strong> {item.Stoku}
          </p>
          {item.Extras && (
            <p className="text-gray-800 mb-2">
              <strong>Extras:</strong> {item.Extras}
            </p>
          )}

          <div className="mt-4 space-x-4">
            <a
              href={`/items/${item.ID}/replacements`}
              className="text-blue-600 hover:underline"
            >
              ZËVENDËSIMET &rsaquo;
            </a>
            <a
              href={`/items/${item.ID}/tecdoc`}
              className="text-blue-600 hover:underline"
            >
              ZËVENDËSIMET TECDOC &rsaquo;
            </a>
            <a
              href={`/items/${item.ID}/more`}
              className="text-blue-600 hover:underline"
            >
              MË SHUMË INFORMACION &rsaquo;
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsClientDetails;
