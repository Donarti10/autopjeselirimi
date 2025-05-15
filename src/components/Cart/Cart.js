import React, { useEffect, useState } from "react";
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
        const user = JSON.parse(localStorage.getItem("user"));
        const subjectID = parseInt(user);
        const response = await fetch(`${url}/Cart/subject?id=${subjectID}`);
        const data = await response.json();
        // Assuming the API returns an array; take the first cart or adjust as needed
        setCartData(data[0] || { details: [], totals: {} });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setLoading(false);
      }
    };

    fetchCartData();
  }, [url]);

  if (loading) {
    return <div>Duke ngarkuar...</div>;
  }

  if (!cartData) {
    return <div>Error loading cart data</div>;
  }

  const cartItems = cartData.details.map((item) => ({
    id: item.itemIdentify,
    name: item.name || "Unknown Item",
    partNumber: item.number || "N/A",
    price: item.price || 0,
    quantity: item.quantity || 1,
    image: item.photo
      ? `data:image/jpeg;base64,${item.photo}`
      : "https://via.placeholder.com/200",
  }));

  const subtotal = cartData.totals.totalWithoutDiscount || 0;
  const shipping = cartData.totals.totalDiscount || 0;
  const tax = cartData.totals.totalItems || 0;
  const total = cartData.totals.totalWithDiscount || 0;

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

export default Cart;
