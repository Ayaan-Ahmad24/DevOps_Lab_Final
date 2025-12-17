import React, { useEffect, useState } from "react";
import axios from "axios";
import "../index.css"; // Ensure this file contains your Tailwind and other styles

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/menu/get`
        );
        if (Array.isArray(response.data)) {
          setMenuItems(response.data);
          console.log("Menu items fetched successfully");
        } else {
          console.error(
            "Unexpected data format for menu items:",
            response.data
          );
          setMenuItems([]);
        }
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
      }
    };

    fetchMenuItems();
    setIsLoading(false);
  }, []);

  const getQuantityText = (quantity, name) => {
    if (quantity === 12) return "Per Dozen";
    if (quantity === 1 && name.toLowerCase().includes("sharbat"))
      return "1 Bottle";
    if (quantity === 1) return "1 Kg";
    if (quantity === 0.5) return "Half Kg";
    return `${quantity} Kg`;
  };

  const handlePurchaseClick = (itemName, itemId) => {
    const productLink = `${import.meta.env.VITE_API_URL}/product/${itemId}`; // Adjust based on your product page URL
    const message = `Hey, I want to order this ${itemName}. You can check it out here: ${productLink}`;
    const encodedMessage = encodeURIComponent(message); // Ensure message is properly encoded
    const whatsappUrl = `https://wa.me/923097011748?text=${encodedMessage}`; // Replace with admin/owner's WhatsApp number
    console.log(encodedMessage);

    // Open WhatsApp chat with the encoded message
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="bg-white text-black font-sans pt-[calc(var(--header-height, 0px) + 1rem)] pb-10 mt-32">
      {/* Menu Items Section */}
      <section className="container mx-auto py-10 px-4">
        <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
          Menu Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="text-center">Loading menu items...</div>
          ) : (
            menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-yellow-100 shadow-2xl rounded-lg p-6 text-center transition-transform transform hover:rotate-1 hover:shadow-3xl hover:scale-105"
                style={{
                  height: "450px",
                  padding: "20px",
                  margin: "10px",
                  border: "2px solid #f1c40f",
                  borderRadius: "15px",
                }}
              >
                <div className="overflow-hidden rounded-lg h-2/3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[250px] object-cover mb-4 transition-transform transform hover:scale-110"
                  />
                </div>
                <h3 className="text-xl font-bold text-yellow-600 transition-transform transform hover:scale-105">
                  {item.name}
                </h3>
                <p className="text-lg text-yellow-500 font-semibold">
                  {item.price} /-
                </p>
                <p className="text-sm text-gray-700">
                  {getQuantityText(item.quantity, item.name)}
                </p>
                <button
                  className="bg-yellow-500 text-black px-4 py-2 mt-4 rounded hover:bg-yellow-600 transition-all"
                  onClick={() => handlePurchaseClick(item.name, item._id)}
                >
                  Purchase
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default MenuPage;
