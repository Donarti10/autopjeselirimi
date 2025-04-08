import React from "react";
import { Cart } from "../../components/Cart/Cart";
import Navbar from "../../components/Navbar/Navbar";

const CartDetailsPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <Cart />
      </main>
    </div>
  );
};

export default CartDetailsPage;
