import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Transport from "../../components/Transport/Transport";

const TransportRelation = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <Transport />
      </main>
    </div>
  );
};

export default TransportRelation;
