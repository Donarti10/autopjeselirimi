import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import Items from "../../components/Items/Items";

const ItemsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <Items />
      </main>
    </div>
  );
};

export default ItemsPage;
