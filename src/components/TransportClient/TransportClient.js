import React, { useEffect, useState } from "react";
import { Input, Button } from "antd";
import { IoMdAdd } from "react-icons/io";
import { FaClock } from "react-icons/fa";
import toast from "react-hot-toast";
import Loader from "../Loader/Loader";

const TransportClient = () => {
  const url = process.env.REACT_APP_API_URL;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${url}/TransportRelation`);
      if (!res.ok) throw new Error(res.statusText);
      setData(await res.json());
    } catch (err) {
      toast.error("Failed to fetch transport relations.");
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
      [d.time, d.company, d.arrivalTime]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
    return topMatch || nestedMatch;
  });

  const splitTime = (timeString) => {
    const times = timeString.split(/\s*-\s*/);
    return {
      startTime: times[0],
      endTime: times[1] || null,
    };
  };

  return (
    <div className="min-h-screen p-6">
      <header className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">
          Linja Autobusi
        </h1>
        <div className="flex gap-4 w-full sm:w-auto">
          <Input
            placeholder="Kërko linja Autobusi..."
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            className="rounded-md shadow-sm w-fit"
          />
        </div>
      </header>

      {loading && (
        <div className="text-center flex items-center justify-center m-auto text-gray-500 py-10">
          <Loader />
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="text-center text-gray-500 py-10">
          Nuk u gjet asnjë linjë autobusi.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 border-t pt-8">
        {filtered.map((relation) => {
          return (
            <div key={relation.id} className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-medium text-gray-700 mb-4">
                {relation.relation}
              </h2>
              <div className="space-y-4">
                {relation.transportRelationDetails.map((detail) => {
                  const { startTime, endTime } = splitTime(detail.time);
                  return (
                    <div
                      key={detail.id}
                      className="p-4 border-b rounded-lg border-gray-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center">
                          <FaClock className="text-blue-500 mb-1" />
                          <span className="text-sm text-gray-600">Nisja</span>
                          <span className="font-semibold text-gray-800">
                            {startTime}
                          </span>
                        </div>
                        <div className="text-center text-gray-700 font-medium">
                          {detail.company}
                        </div>
                        <div className="flex flex-col items-center">
                          <FaClock className="text-blue-500 mb-1" />
                          <span className="text-sm text-gray-600">
                            Mbërritja
                          </span>
                          <span className="font-semibold text-gray-800">
                            {endTime || detail.arrivalTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TransportClient;
