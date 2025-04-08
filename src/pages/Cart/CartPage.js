import React from "react";
import { Cart } from "../../components/Cart/Cart";
import Navbar from "../../components/Navbar/Navbar";
import CartList from "../../components/Cart/CartList";

const CartPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 pt-28 px-4">
        <CartList />
      </main>
    </div>
  );
};

export default CartPage;
