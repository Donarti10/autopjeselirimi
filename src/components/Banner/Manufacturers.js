import React from "react";
import logo from "../../assets/Manufactures/logo1.png";
import logo1 from "../../assets/Manufactures/logo2.png";
import logo2 from "../../assets/Manufactures/logo3.svg";
import logo3 from "../../assets/Manufactures/logo4.png";
import logo4 from "../../assets/Manufactures/logo5.png";
import logo5 from "../../assets/Manufactures/logo6.png";
import logo6 from "../../assets/Manufactures/logo7.png";
import logo7 from "../../assets/Manufactures/logo8.png";
import logo8 from "../../assets/Manufactures/logo9.png";
import logo9 from "../../assets/Manufactures/logo10.png";
import logo10 from "../../assets/Manufactures/logo11.png";
import logo11 from "../../assets/Manufactures/logo12.png";
import logo12 from "../../assets/Manufactures/logo13.png";
import logo13 from "../../assets/Manufactures/icon14.png";
import logo14 from "../../assets/Manufactures/logo15.png";
import logo15 from "../../assets/Manufactures/logo16.png";
import logo16 from "../../assets/Manufactures/logo17.png";
import logo17 from "../../assets/Manufactures/logo18.svg";
import logo18 from "../../assets/Manufactures/logo19.png";
import logo19 from "../../assets/Manufactures/logo20.png";

const Manufacturers = () => {
  const manufa = [
    { icon: logo },
    { icon: logo1 },
    { icon: logo2 },
    { icon: logo3 },
    { icon: logo4 },
    { icon: logo5 },
    { icon: logo6 },
    { icon: logo7 },
    { icon: logo8 },
    { icon: logo9 },
    { icon: logo10 },
    { icon: logo11 },
    { icon: logo12 },
    { icon: logo13 },
    { icon: logo14 },
    { icon: logo15 },
    { icon: logo16 },
    { icon: logo17 },
    { icon: logo18 },
    { icon: logo19 },
  ];

  return (
    <div className="mt-20 w-full mb-10">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 px-6 text-xl font-bold">
        Popular Brands
      </div>
      <div className="grid m-auto grid-cols-5 gap-4 mt-6 p-4">
        {manufa.map((brand, index) => (
          <img
            key={index}
            src={brand.icon}
            alt="Brand"
            className="h-24 w-24 object-contain m-auto"
          />
        ))}
      </div>
    </div>
  );
};

export default Manufacturers;
