import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-4 lg:px-0">
        <div>
          <h3 className="text-lg text-gray-800 mb-4">Newslatter</h3>
          <p className="text-grayy-500 mb-4">
            Be the first to know about new products, sales and more.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off your first order.
          </p>

          {/* newslatter form */}
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email "
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none 
                 focus:ring-2 focus:ring-gray-500 transition-all "
              required
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 test-sm rounded-r-md hover:bg-gray-800 
             transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* shop links */}
        <div>
          <h3 className="test-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Men's Top Wear
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Women's Top Wear
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Men's Bottom Wear
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Women's Bottom Wear
              </Link>
            </li>
          </ul>
        </div>

        {/* Support links */}
        <div>
          <h3 className="test-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Contact Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Abot Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                FAQs
              </Link>
            </li>
            <li>
              <Link className="hover:text-gray-600 transition-colors" to="#">
                Features
              </Link>
            </li>
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="test-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 md-5">
            <a
              href="https://www.facbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.facbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.facbook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-500"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <p className="text-gray-500">Call Us</p>
          <FiPhoneCall className="inline-block mr-2 " />
          +91- 887537****
        </div>
      </div>
      {/* footer bottom */}
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500 text-center">
            &copy; 2025 <span className="font-semibold">Ecommerce</span> - All Rights Reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
