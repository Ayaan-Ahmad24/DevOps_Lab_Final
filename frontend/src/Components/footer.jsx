import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaWhatsapp,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa";
import "../index.css";

const Footer = () => {
  // Updated coordinates
  const latitude = 31.517353;
  const longitude = 74.316587;

  const openGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${latitude},${longitude}`,
      "_blank"
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    const encodedName = encodeURIComponent(name);
    const encodedEmail = encodeURIComponent(email);
    const encodedMessage = encodeURIComponent(message);

    const whatsappMessage = `Name: ${encodedName}\nEmail: ${encodedEmail}\nMessage: ${encodedMessage}`;
    const whatsappUrl = `https://wa.me/923097011748?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <footer className="bg-yellow-500 text-black py-8 mt-10 relative">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-start space-y-12 lg:space-y-0 px-8 lg:px-16">
        {/* Quick Links */}
        <div className="w-full lg:w-1/4 lg:pr-12 lg:mr-12 bg-black p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-8 text-white">Quick Links</h3>
          <ul className="space-y-4">
            <li>
              <a
                href="https://chat.whatsapp.com/Et14mrO6ysA0zlP8G4qpsK"
                className="hover:text-gray-300 transition-colors duration-300 text-white text-lg"
              >
                Community
              </a>
            </li>
            <li>
              <a
                href="/menu"
                className="hover:text-gray-300 transition-colors duration-300 text-white text-lg"
              >
                Menu
              </a>
            </li>
            <li>
              <a
                href="/blogs"
                className="hover:text-gray-300 transition-colors duration-300 text-white text-lg"
              >
                Blogs
              </a>
            </li>
          </ul>
        </div>

        {/* Footer Form */}
        <div className="w-full lg:w-2/5 lg:pl-12 lg:ml-12 mb-16">
          <div className="bg-black p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full p-4 mb-4 border border-gray-300 rounded-full shadow-md"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full p-4 mb-4 border border-gray-300 rounded-full shadow-md"
                required
              />
              <textarea
                name="message"
                placeholder="Your Message"
                className="w-full p-4 mb-4 border border-gray-300 rounded-full shadow-md"
                required
              ></textarea>
              <button
                type="submit"
                className="w-full bg-yellow-600 text-black py-2 rounded-lg hover:bg-yellow-700 transition-colors duration-300"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Leaflet Map */}
      <div className="bg-yellow-500 pt-8 pb-8 mx-0">
        <div className="container mx-auto px-0">
          <div className="h-64 w-full overflow-hidden">
            <MapContainer
              center={[latitude, longitude]}
              zoom={13}
              className="h-full w-full"
              scrollWheelZoom={false} // Disable scroll zoom
              touchZoom="center" // Require two fingers for zoom on mobile
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[latitude, longitude]}
                eventHandlers={{
                  click: () => openGoogleMaps(), // Open Google Maps on marker click
                }}
              >
                <Popup>
                  Here we are <br /> Irtazafoods.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="bg-yellow-500 text-black py-4 text-center">
        <div className="flex flex-col lg:flex-row justify-center items-center space-y-4 lg:space-y-0 lg:space-x-4 mb-4">
          <a
            href="https://www.facebook.com/irtazafoods"
            className="hover:text-gray-800 transition-colors duration-300 hover:animate-pulse"
          >
            <FaFacebookF size={24} />
          </a>
          <a
            href="https://www.instagram.com/irtazafoods"
            className="hover:text-gray-800 transition-colors duration-300 hover:animate-pulse"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://chat.whatsapp.com/Et14mrO6ysA0zlP8G4qpsK"
            className="hover:text-gray-800 transition-colors duration-300 hover:animate-pulse"
          >
            <FaWhatsapp size={24} />
          </a>
          <a
            href="https://www.youtube.com/@irtazafoodss"
            className="hover:text-gray-800 transition-colors duration-300 hover:animate-pulse"
          >
            <FaYoutube size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@irtazafoods"
            className="hover:text-gray-800 transition-colors duration-300 hover:animate-pulse"
          >
            <FaTiktok size={24} />
          </a>
        </div>
        <p className="text-sm text-black">
          &copy; 2024 Irtazafoods. All rights reserved.
        </p>
        <p className="text-sm text-black mt-2">Designed by Ayaan Ahmad</p>
      </div>
    </footer>
  );
};

export default Footer;
