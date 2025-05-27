import React, { useEffect, useState } from "react";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { Button } from "antd";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const url = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const user = localStorage.getItem("user");
        if (!user) {
          throw new Error("No user found. Please log in.");
        }
        const subjectID = parseInt(user);
        if (isNaN(subjectID)) {
          throw new Error("Invalid user ID.");
        }
        const response = await fetch(
          `${url}/Cart/current/subject?id=${subjectID}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch cart data");
        }
        const data = await response.json();
        setCartData(data || { details: [], totals: {} });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchCartData();
  }, [url]);

  const cartItems =
    cartData?.details?.map((item) => ({
      id: item.itemIdentify,
      name: item.name,
      partNumber: item.number,
      price: item.price,
      quantity: item.quantity,
      image: item.photo
        ? `data:image/jpeg;base64,${item.photo}`
        : "https://via.placeholder.com/200",
    })) || [];

  const subtotal = cartData?.totals?.totalWithoutDiscount || 0;
  const shipping = cartData?.totals?.totalDiscount || 0;
  const tax = cartData?.totals?.totalItems || 0;
  const total = cartData?.totals?.totalWithDiscount || 0;

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="w-full p-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-2xl text-gray-500 font-bold">Shporta juaj</p>
          <p className="text-md text-gray-600">
            Këtu mund të menaxhoni artikujt në shportën tuaj.
          </p>
        </div>
        {/* <div className="text-sm text-gray-600">{cartItems.length} artikuj</div> */}
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg border p-6">
            {error ? (
              <div className="text-center py-8 text-red-500">{error}</div>
            ) : cartItems.length > 0 ? (
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
            <Link
              to="/items1"
              variant="outline"
              className="flex border w-fit p-3 rounded-md items-center gap-2"
            >
              <ArrowLeftIcon size={16} />
              Vazhdo blerjet
            </Link>
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
