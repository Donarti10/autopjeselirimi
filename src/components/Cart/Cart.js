import React, { useState, useEffect } from "react";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { Button } from "antd";
import { ArrowLeftIcon } from "lucide-react";

export const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await fetch(`${url}/Cart/id?id=1`);
        const data = await response.json();
        setCartData(data.cart);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  if (loading) {
    return <div>Duke ngarkuar...</div>;
  }

  if (!cartData) {
    return <div>Error loading cart data</div>;
  }

  const cartItems = cartData.details.map((item) => ({
    id: item.id,
    name: item.name,
    partNumber: item.number,
    price: item.price,
    quantity: item.quantity,
    image: "https://via.placeholder.com/200",
  }));

  const subtotal = cartData.totals.totalWithoutDiscount;
  const shipping = cartData.totals.totalDiscount;
  const tax = cartData.totals.totalItems;
  const total = cartData.totals.totalWithDiscount;

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-2xl text-gray-500 font-bold">Shporta juaj</p>
          <p className="text-md text-gray-600 ">
            Këtu mund të menaxhoni artikujt në shportën tuaj.
          </p>
        </div>
        <div className="text-sm text-gray-600">{cartItems.length} artikuj</div>
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg border p-6">
            {cartItems.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Shporta juaj është e zbrazët.</p>
              </div>
            )}
          </div>
          <div className="mt-6">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeftIcon size={16} />
              Continue Shopping
            </Button>
          </div>
        </div>
        <div className="lg:w-1/3">
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </div>
  );
};
