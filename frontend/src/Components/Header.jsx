// Import necessary libraries and styles
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaSearch, FaUserCircle } from "react-icons/fa";
import "../index.css"; // Ensure Tailwind CSS is correctly imported

const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to toggle mobile drawer
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false); // State to manage admin login status
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to toggle admin popup
  const [searchQuery, setSearchQuery] = useState(""); // State to manage search input
  const navigate = useNavigate();
  const location = useLocation(); // Get current location to trigger scroll on navigation

  // Effect to scroll to the top of the page whenever location changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on page change
  }, [location]); // Listen for location changes

  // Effect to check if admin is logged in by looking for a token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    setIsAdminLoggedIn(!!token);

    const handleStorageChange = () => {
      const token = localStorage.getItem("adminToken");
      setIsAdminLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Function to toggle mobile drawer
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  // Function to handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
    }
    toggleDrawer();
  };

  // Function to navigate to admin login page
  const handleLogin = () => {
    navigate("/admin/login");
  };

  // Function to toggle the admin popup
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  // Function to navigate to admin dashboard
  const handleAdminDashboard = () => {
    navigate("/admin/dashboard");
  };

  // Function to handle admin logout and clear token from localStorage
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminLoggedIn(false);
    navigate("/");
  };

  return (
    <header className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black shadow-md py-4 w-full left-0 right-0 z-50 md:fixed">
      <nav className="container mx-auto flex justify-between items-center px-4 md:px-6">
        {/* Mobile Drawer Button */}
        <div className="md:hidden">
          <FaBars className="text-2xl cursor-pointer" onClick={toggleDrawer} />
        </div>

        {/* Logo */}
        <div className="text-3xl font-extrabold mx-auto md:mx-0">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/duvlkyzij/image/upload/v1725890201/Copy_of_chef__3_-removebg-preview_cgzkd9.png"
              alt="Logo"
              className="h-16 w-auto"
            />
          </Link>
        </div>

        {/* Desktop Search Bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:flex flex-1 max-w-md ml-4"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="flex-grow p-2 border border-gray-300 rounded-l-lg"
            required
          />
          <button
            type="submit"
            className="bg-yellow-700 p-2 rounded-r-lg hover:bg-yellow-800 transition-colors duration-300"
          >
            Search
          </button>
        </form>

        {/* Desktop Navigation Links */}
        <ul className="hidden md:flex space-x-6 text-lg pr-6">
          <li>
            <Link to="/" className="hover:text-gray-800 transition">
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu" className="hover:text-gray-800 transition">
              Menu
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-700">
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/blogs" className="hover:text-gray-800 transition">
              Blogs
            </Link>
          </li>
        </ul>

        {/* User Login/Account Icons */}
        <div className="flex items-center space-x-4">
          {!isAdminLoggedIn ? (
            <button
              onClick={handleLogin}
              className="bg-black text-white px-6 py-2 rounded-full shadow-md hover:bg-gray-800 focus:outline-none transition md:mr-4"
            >
              Login
            </button>
          ) : (
            <FaUserCircle
              className="text-3xl cursor-pointer hover:text-gray-800 transition"
              onClick={togglePopup}
            />
          )}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-yellow-500 shadow-lg transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 md:hidden`}
      >
        <button className="text-2xl p-4" onClick={toggleDrawer}>
          ✕
        </button>
        {/* Mobile Search Bar */}
        <div className="flex items-center p-4 border-b border-gray-300">
          <input
            type="text"
            placeholder="Search blogs or menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-2 border-gray-300 rounded-md p-2 w-full"
          />
          <FaSearch
            className="text-2xl cursor-pointer ml-2"
            onClick={handleSearch}
          />
        </div>
        <ul className="flex flex-col items-start p-4 space-y-4 text-lg">
          <li>
            <Link to="/" className="hover:text-gray-700" onClick={toggleDrawer}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/menu" className="hover:text-gray-700" onClick={toggleDrawer}>
              Menu
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-700" onClick={toggleDrawer}>
              Contact Us
            </Link>
          </li>
          <li>
            <Link to="/blogs" className="hover:text-gray-700" onClick={toggleDrawer}>
              Blogs
            </Link>
          </li>

          {/* Admin Links */}
          {isAdminLoggedIn && (
            <>
              <li>
                <Link
                  to="/admin/dashboard"
                  className="hover:text-gray-700"
                  onClick={toggleDrawer}
                >
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Admin Popup */}
      {isPopupOpen && isAdminLoggedIn && (
        <div className="fixed top-14 right-4 bg-white border border-gray-300 shadow-lg rounded-lg p-4 z-50">
          <h2 className="text-xl font-bold mb-2">Admin Options</h2>
          <ul>
            <li>
              <button
                onClick={handleAdminDashboard}
                className="block w-full bg-yellow-300 p-2 rounded-md hover:bg-yellow-400 transition mb-2"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="block w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
