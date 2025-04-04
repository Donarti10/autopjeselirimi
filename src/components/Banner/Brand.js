import React from "react";
import { Link } from "react-router-dom";
import logo1 from "../../assets/Brand/brand1.png";
import logo2 from "../../assets/Brand/brand2.webp";
import logo3 from "../../assets/Brand/brand3.png";
import logo4 from "../../assets/Brand/brand4.svg";
import logo5 from "../../assets/Brand/brand5.png";
import logo6 from "../../assets/Brand/brand6.png";
import logo7 from "../../assets/Brand/brand7.png";
import logo8 from "../../assets/Brand/brand8.png";

const Brand = () => {
  const brand = [
    {
      icon: logo1,
      title: "BMW",
    },
    {
      icon: logo2,
      title: "Mercedes-Benz",
    },
    {
      icon: logo3,
      title: "Toyota",
    },
    {
      icon: logo4,
      title: "Volkswagen",
    },
    {
      icon: logo5,
      title: "Audi",
    },
    {
      icon: logo6,
      title: "Porsche",
    },
    {
      icon: logo7,
      title: "Ferrari",
    },
    {
      icon: logo8,
      title: "Honda",
    },
  ];

  return (
    <div className="mt-20 w-full mb-10">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 px-6 text-xl font-bold">
        Markat e Njohura
      </div>
      <div className="grid grid-cols-1 px-10 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-10 mt-4">
        {brand.map((item) => (
          <Link
            key={item.title}
            className="flex flex-col  items-center border border-gray-100 shadow-sm p-4 rounded-md bg-white hover:shadow-lg transition-shadow"
          >
            <img
              src={item.icon}
              alt={item.title}
              className="w-24 h-24 object-contain mb-4"
            />
            <h4 className="text-lg font-medium">{item.title}</h4>
            <span className="text-blue-500 cursor-pointer mt-2">
              Shkoni te të gjitha modelet
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Brand;
