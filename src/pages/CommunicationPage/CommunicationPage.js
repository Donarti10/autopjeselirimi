import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Communication from "../../components/Communication/Communication";

const CommunicationPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <Communication />
      </main>
    </div>
  );
};

export default CommunicationPage;
