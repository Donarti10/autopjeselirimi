import React from "react";
import { Button } from "antd";

export const CartSummary = ({ subtotal, shipping, tax, total }) => {
  return (
    <div className="bg-white rounded-lg border p-6">
      <h2 className="text-lg font-medium mb-6">Përmbledhje e porosive</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Nëntotali</span>
          <span>{subtotal.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Zbritja</span>
          <span>{shipping.toFixed(2)} €</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Artikujt</span>
          <span>{tax.toFixed(2)} €</span>
        </div>
        <div className="border-t border-gray-200 pt-4 flex justify-between font-medium">
          <span>Total</span>
          <span>{total.toFixed(2)} €</span>
        </div>
      </div>
      <div className="mt-6">
        <Button variant="primary" className="w-full">
          Vazhdo
        </Button>
      </div>
    </div>
  );
};
