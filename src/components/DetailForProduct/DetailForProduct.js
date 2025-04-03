import React from "react";
import img1 from "../../assets/Banner/icon1.png";
import { MdFavoriteBorder } from "react-icons/md";
import { Tabs, TabList, Tab, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

const DetailForProduct = () => {
  return (
    <div className="p-20 pt-36">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center">
          <div className="relative w-72 h-96">
            <div className="absolute bottom-[-20px] left-[10%] w-[80%] h-6 bg-gray-300 rounded-full blur-md opacity-150"></div>
            <img
              className="relative w-full h-full object-contain z-10"
              src={img1}
              alt="Main Product"
            />
          </div>
        </div>

        <div>
          <h1 className="text-2xl font-bold mb-4">
            Sprej Pastrues Njollash Dhe Materiale
          </h1>
          <p className="text-gray-500 mb-2 text-sm">
            Product Code: BOS0189911030
          </p>

          <div className="flex items-center py-7 space-x-3 mb-4">
            <span className="text-3xl font-semibold text-black">$80.73</span>
            <span className="text-gray-400 text-sm">Net: $65.63</span>
            <span className="text-green-500 text-sm bg-green-100 px-2 rounded-full">
              In Stock
            </span>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              <button className="w-10 h-10 border border-gray-300 rounded-l flex justify-center items-center">
                -
              </button>
              <input
                type="text"
                className="w-16 h-10 text-center border-t border-b border-gray-300"
                value="1"
                readOnly
              />
              <button className="w-10 h-10 border border-gray-300 rounded-r flex justify-center items-center">
                +
              </button>
            </div>
            <button className="ml-4 w-[50%] bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-500">
              Add to Cart
            </button>
            <button className="ml-4 w-10 h-10 border border-gray-300 flex items-center justify-center rounded-md">
              <MdFavoriteBorder className="text-[max(13px,1vw)]" />
            </button>
          </div>

          <div>
            <Tabs className="mt-16">
              <TabList className="flex border-b border-gray-300">
                <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent">
                  Overview
                </Tab>
                <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent">
                  Specifications
                </Tab>
                <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent">
                  Compatibility
                </Tab>
                <Tab className="px-6 py-2 text-gray-600 cursor-pointer border-b-2 border-transparent">
                  Reviews
                </Tab>
              </TabList>
              <TabPanel className="mt-4">
                <h2 className="text-lg font-bold mb-2">Overview</h2>
                <p className="text-gray-700">
                  Sprej Pastrues Njollash Dhe Materiale is a high-quality
                  cleaning spray designed to effectively remove stains and
                  maintain the condition of your car's interior and exterior
                  surfaces. It is safe to use on a wide range of materials,
                  including leather, plastic, and metal, providing an all-in-one
                  solution for car maintenance.
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Removes stubborn stains effortlessly.</li>
                  <li>Safe for use on delicate surfaces.</li>
                  <li>Eco-friendly and non-toxic formula.</li>
                </ul>
              </TabPanel>

              <TabPanel className="mt-4">
                <h2 className="text-lg font-bold mb-2">Specifications</h2>
                <table className="w-full border border-gray-300 text-sm text-left">
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold">Product Code</td>
                      <td className="py-2 px-4">BOS0189911030</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold">Volume</td>
                      <td className="py-2 px-4">500ml</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold">
                        Material Compatibility
                      </td>
                      <td className="py-2 px-4">Plastic, Leather, Metal</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4 font-semibold">Weight</td>
                      <td className="py-2 px-4">600g</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-semibold">Made In</td>
                      <td className="py-2 px-4">Germany</td>
                    </tr>
                  </tbody>
                </table>
              </TabPanel>

              <TabPanel className="mt-4">
                <h2 className="text-lg font-bold mb-2">Compatibility</h2>
                <p className="text-gray-700">
                  This cleaning spray is compatible with a variety of surfaces
                  found in cars, including:
                </p>
                <ul className="list-disc list-inside mt-2 text-gray-600">
                  <li>Dashboard and interior trims.</li>
                  <li>
                    Car seats made of leather, fabric, or synthetic materials.
                  </li>
                  <li>
                    Exterior surfaces like painted panels and metallic trims.
                  </li>
                  <li>Safe for use on wheels and chrome parts.</li>
                </ul>
                <p className="mt-2 text-gray-700">
                  Note: Always test the spray on a small inconspicuous area
                  before applying it to larger surfaces.
                </p>
              </TabPanel>

              <TabPanel className="mt-4">
                <h2 className="text-lg font-bold mb-2">Reviews</h2>
                <div className="space-y-4">
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-semibold">John Doe</h3>
                    <p className="text-sm text-gray-500">
                      5/5 - Excellent Product!
                    </p>
                    <p className="mt-2 text-gray-700">
                      This cleaning spray works wonders! It removed even the
                      toughest stains on my car seats. Highly recommended.
                    </p>
                  </div>
                  <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="font-semibold">Jane Smith</h3>
                    <p className="text-sm text-gray-500">
                      4/5 - Great but pricey
                    </p>
                    <p className="mt-2 text-gray-700">
                      The product works great, but I find it a bit expensive
                      compared to similar options. Still, the results are worth
                      it.
                    </p>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailForProduct;
