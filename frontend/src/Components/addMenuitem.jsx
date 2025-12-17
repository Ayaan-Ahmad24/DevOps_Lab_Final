import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import SidePanel from "./Sidepanel"; // Import the SidePanel

const AddMenuItemPage = () => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/menu/add`,
        {
          name,
          quantity,
          price,
          image,
        }
      );

      alert("Menu item added successfully");
      // Removed automatic redirect to /menulist after adding item
    } catch (error) {
      console.error("Error adding menu item:", error);

      if (error.response && error.response.status === 400) {
        alert("Menu item already exists");
      } else {
        alert("Failed to add menu item");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Side panel */}
      <SidePanel />

      {/* Main content */}
      <div className="flex-1 bg-gray-100 py-12 px-4 mt-32">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold text-yellow-600 mb-6">
            Add Menu Item
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-lg font-medium text-gray-700"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quantity"
                className="block text-lg font-medium text-gray-700"
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="price"
                className="block text-lg font-medium text-gray-700"
              >
                Price (₨)
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="image"
                className="block text-lg font-medium text-gray-700"
              >
                Image URL
              </label>
              <input
                type="text"
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
            >
              {loading ? "Adding..." : "Add Menu Item"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMenuItemPage;
