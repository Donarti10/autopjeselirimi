import React from "react";
import { LuPhone } from "react-icons/lu";
import { MdOutlineEmail } from "react-icons/md";
import { CiLocationOn } from "react-icons/ci";
import { FaFacebookF } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[--secondary-color] text-white p-8 md:p-12 lg:p-16">
      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div>
          <h3 className="text-[max(16px,1.4vw)] font-semibold">
            Auto Parts Lirimi 2
          </h3>
          <p className="mt-2 text-[max(12px,.9vw)]">
            Lider që nga viti 1998 në pjesë dhe aksesorë për automjete nga
            brendet më të njohura ndërkombëtare.
          </p>
        </div>

        <div>
          <h3 className="text-[max(16px,1.4vw)] font-semibold">
            Na Kontaktoni
          </h3>
          <ul className="mt-3 space-y-3 text-[max(12px,.9vw)]">
            <li className="flex items-center gap-2">
              <LuPhone className="text-lg" />
              +383 44 685 666
            </li>
            <li className="flex items-center gap-2">
              <MdOutlineEmail className="text-lg" />
              info@autolirimi.com
            </li>
            <li className="flex items-center gap-2">
              <CiLocationOn className="text-lg" />
              Magjistralja Ferizaj - Prishtinë.
            </li>
          </ul>
        </div>

        <div className="flex flex-col">
          <div className="mb-5">
            <h3 className="text-[max(16px,1.4vw)] font-semibold">Na Ndiqni</h3>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.facebook.com/autopartslirimi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 text-2xl hover:scale-110 transition-transform"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/autolirimi2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-600 text-2xl hover:scale-110 transition-transform"
              >
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
