import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { Select } from "antd";

import image1 from "../../assets/Banner/img1.jpg";
import image2 from "../../assets/Banner/img2.webp";
import image3 from "../../assets/Banner/img3.jpg";
import image4 from "../../assets/Banner/img4.jpg";

const { Option } = Select;

const Catalogue = () => {
  const images = [image1, image2, image3, image4];

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 2,
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
    <div className="mt-20 w-full">
      <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white py-4 px-6 text-xl font-bold">
        KATALOGI I MJETEVE: ZGJIDHNI MJETET TUAJ
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 w-full px-6">
        <Select size="large" className="w-full" placeholder="Zgjidhni Markën">
          <Option value="bmw">BMW</Option>
          <Option value="audi">Audi</Option>
          <Option value="mercedes">Mercedes</Option>
        </Select>

        <Select size="large" className="w-full" placeholder="Zgjidhni Modelin">
          <Option value="x5">X5</Option>
          <Option value="a6">A6</Option>
          <Option value="c-class">C-Class</Option>
        </Select>

        <Select size="large" className="w-full" placeholder="Zgjidhni Llojin">
          <Option value="sedan">Sedan</Option>
          <Option value="suv">SUV</Option>
          <Option value="coupe">Coupe</Option>
        </Select>
      </div>

      <div className="mt-10 px-6">
        <Carousel
          responsive={responsive}
          autoPlay
          autoPlaySpeed={2500}
          infinite
          keyBoardControl
          swipeable
          draggable
          arrows={false}
        >
          {images.map((img, index) => (
            <div key={index} className="px-2">
              <img
                src={img}
                alt={`carousel-img-${index}`}
                className="w-full h-64 object-cover rounded-lg shadow-md"
              />
            </div>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Catalogue;
