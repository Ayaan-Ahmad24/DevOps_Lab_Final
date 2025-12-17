import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import SidePanel from "./Sidepanel";

const EditMenuItemPage = () => {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/menu/get/${id}`
        );
        if (response.data) {
          setMenuItem(response.data);
          setName(response.data.name || "");
          setQuantity(response.data.quantity || "");
          setPrice(response.data.price || "");
          setImage(response.data.image || "");
        }
        setLoading(false);
      } catch (err) {
        setError("Error fetching menu item");
        setLoading(false);
        console.error("Error fetching menu item:", err);
      }
    };
    fetchMenuItem();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/menu/${id}`, {
        name,
        quantity,
        price,
        image,
      });
      navigate(`/admin/dashboard`);
    } catch (err) {
      setError("Error updating menu item");
      console.error("Error updating menu item:", err);
    }
  };

  if (loading)
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 text-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 text-center text-red-500">
        {error}
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <SidePanel />
      <div className="bg-gray-100 min-h-screen py-12 px-4 mt-32 w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">
            Edit Menu Item
          </h2>
          {menuItem ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="text-center">Menu item not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditMenuItemPage;
