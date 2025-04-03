import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import icon1 from "../../assets/Banner/icon1.png";
import icon2 from "../../assets/Banner/icon2.png";
import icon3 from "../../assets/Banner/icon3.png";
import icon4 from "../../assets/Banner/icon4.jpg";
import icon5 from "../../assets/Banner/icon5.png";
import { Link } from "react-router-dom";

const Products = () => {
  const products = [
    {
      title: "Sprej Pastrues Njollash Dhe Materiale",
      netPrice: "5.91 EUR",
      grossPrice: "7.27 EUR",
      image: icon1,
    },
    {
      title: "Sprej Pastrues Njollash Dhe Materiale",
      netPrice: "5.02 EUR",
      grossPrice: "6.18 EUR",
      image: icon2,
    },
    {
      title: "Sprej Pastrues Njollash Dhe Materiale",
      netPrice: "6.21 EUR",
      grossPrice: "7.64 EUR",
      image: icon3,
    },
    {
      title: "Sprej Pastrues Njollash Dhe Materiale",
      netPrice: "5.24 EUR",
      grossPrice: "6.44 EUR",
      image: icon4,
    },
    {
      title: "Sprej Pastrues Njollash Dhe Materiale",
      netPrice: "65.60 EUR",
      grossPrice: "80.68 EUR",
      image: icon5,
    },
  ];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="mt-20 w-full mb-10">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 px-6 text-xl font-bold">
        RECOMMENDED PRODUCTS
      </div>

      <div className="mt-10 px-6">
        <Carousel
          responsive={responsive}
          autoPlay
          autoPlaySpeed={2000}
          infinite
          arrows={false}
          keyBoardControl
          swipeable
          draggable
          itemClass="px-4"
        >
          {products.map((product, index) => (
            <Link
              to="/detail"
              key={index}
              className="block bg-white border h-full rounded-lg shadow-md p-4 text-center"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-32 object-contain mb-4"
              />

              <h3 className="font-bold text-sm mb-5">{product.title}</h3>
              <div className="flex justify-between">
                <div className="flex flex-col">
                  <p className="text-gray-600 text-xs">Net price:</p>
                  <p className="text-red-500 font-bold">{product.netPrice}</p>
                </div>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-xs">Gross price:</p>
                  <p className="font-bold text-gray-800">
                    {product.grossPrice}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Products;
