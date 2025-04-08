import React, { useState } from "react";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import noPhoto from "./assets/no-image-icon-6.png";

export const CartItem = ({ item }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const imageSource =
    item.image && item.image.trim() !== "" ? item.image : noPhoto;

  return (
    <div className="py-6 flex flex-col sm:flex-row">
      <div className="flex-shrink-0 w-full sm:w-32 h-32 mb-4 sm:mb-0">
        <img
          src={imageSource}
          alt={item.name || "No photo available"}
          className="w-full h-full object-cover rounded-md"
          onError={(e) => {
            e.target.src = noPhoto;
            console.log("Image failed to load, using fallback:", item.image);
          }}
        />
      </div>
      <div className="flex-1 sm:ml-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {item.name || "Unnamed Item"}
            </h3>
            <p className="text-lg font-medium text-gray-900">
              {item.price ? `${(item.price * quantity).toFixed(2)}€` : "N/A"}
            </p>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            NR #: {item.partNumber || "N/A"}
          </p>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center border border-gray-300 rounded-md">
            <button
              onClick={handleDecrement}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              disabled={quantity <= 1}
            >
              <MinusIcon size={16} />
            </button>
            <span className="px-4 py-1">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="px-2 py-1 text-gray-600 hover:bg-gray-100"
            >
              <PlusIcon size={16} />
            </button>
          </div>
          <button className="text-red-500 hover:text-red-700 flex items-center">
            <TrashIcon size={18} />
            <span className="ml-1 text-sm">Largo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
