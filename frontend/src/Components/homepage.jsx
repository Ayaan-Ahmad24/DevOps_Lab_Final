import React, { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../index.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom"; // Updated import

const HomePage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [isLoadingMenu, setIsLoadingMenu] = useState(true);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);
  const [showAllProducts] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // For loading bar
  const navigate = useNavigate(); // Updated hook

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });

    const fetchMenuItems = async () => {
      setLoadingProgress(20); // Start loading progress
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
        setLoadingProgress(100); // End loading progress
      } catch (error) {
        console.error("Error fetching menu items:", error);
        setMenuItems([]);
        setLoadingProgress(100); // End loading progress in case of error
      } finally {
        setIsLoadingMenu(false); // Stop loading when fetch completes
      }
    };

    const fetchBlogs = async () => {
      setLoadingProgress(40); // Start loading progress for blogs
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/blog/get-blog`
        );
        if (Array.isArray(response.data)) {
          setBlogs(response.data);
          console.log("Blogs fetched successfully");
        } else {
          console.error("Unexpected data format for blogs:", response.data);
          setBlogs([]);
        }
        setLoadingProgress(100); // End loading progress for blogs
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
        setLoadingProgress(100); // End loading progress in case of error
      } finally {
        setIsLoadingBlogs(false); // Stop loading when fetch completes
      }
    };

    fetchMenuItems();
    fetchBlogs();
  }, []);

  const scrollToTop = () => {
    document.getElementById("header").scrollIntoView({ behavior: "smooth" });
  };

  const getQuantityText = (quantity, name) => {
    if (quantity === 12) return "Per Dozen";
    if (quantity === 1 && name.toLowerCase().includes("sharbat"))
      return "1 Bottle";
    if (quantity === 1) return "1 Kg";
    if (quantity === 0.5) return "Half Kg";
    return `${quantity} Kg`;
  };

  const getRandomProducts = (items, count) => {
    const shuffledItems = [...items].sort(() => 0.5 - Math.random());
    return shuffledItems.slice(0, count);
  };

  return (
    <div className="bg-white text-black font-sans pt-[calc(var(--header-height, 0px) + 1rem)] pb-10 mt-32 mb-6">
      {/* Loading Bar */}
      {loadingProgress > 0 && loadingProgress < 100 && (
        <div className="fixed top-0 left-0 w-full h-1 bg-yellow-500" style={{ width: `${loadingProgress}%` }}></div>
      )}

      {/* Hero Section */}
      <section className="hero mt-0" id="header">
        <Carousel
          showThumbs={false}
          autoPlay={true}
          infiniteLoop={true}
          transitionTime={500}
          interval={3000}
        >
          <div className="relative">
            <img
              src="https://res.cloudinary.com/duvlkyzij/image/upload/v1725889400/Frozen_food_1_evkgqs.png"
              alt="Hero Image 1"
              className="h-[19vh] md:h-[30vh] lg:h-[80vh] w-full object-cover"
            />
          </div>
          <div className="relative">
            <img
              src="https://res.cloudinary.com/duvlkyzij/image/upload/v1725889409/Frozen_food_3_xm4ebl.png"
              alt="Hero Image 2"
              className="h-[19vh] md:h-[30vh] lg:h-[80vh] w-full object-cover"
            />
          </div>
          <div className="relative">
            <img
              src="https://res.cloudinary.com/duvlkyzij/image/upload/v1725889405/Frozen_food_2_m24qgd.png"
              alt="Hero Image 3"
              className="h-[19vh] md:h-[30vh] lg:h-[80vh] w-full object-cover"
            />
          </div>
        </Carousel>
      </section>

      {/* About Us Section */}
      <section
        className="container mx-auto py-16 px-4 bg-yellow-50 rounded-lg shadow-2xl"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold mb-6 text-yellow-600 text-center">
          About Us
        </h2>
        <p className="text-lg leading-relaxed text-gray-800 mx-auto max-w-3xl text-center">
          At Irtazafoods, we are passionate about providing high-quality frozen
          foods that are both convenient and delicious. Our mission is to ensure
          that every meal you prepare is a delightful experience, combining
          convenience with the taste of home-cooked goodness.
          <br />
          <br />
          We take pride in sourcing the finest ingredients and using advanced
          techniques to preserve the natural flavors and nutrients of our
          products. Our team of dedicated professionals works tirelessly to
          ensure that each product meets our stringent quality standards before
          it reaches your table.
          <br />
          <br />
          Our commitment extends beyond just the quality of our products. We
          strive to make a positive impact on our community and the environment.
          By choosing Irtazafoods, you are not only enjoying great food but also
          supporting sustainable practices and responsible sourcing.
          <br />
          <br />
          Whether you're preparing a quick weeknight dinner or hosting a special
          occasion, Irtazafoods is here to make your life easier and more
          enjoyable. Explore our range of products and discover the convenience
          and quality that sets us apart.
        </p>
      </section>

      {/* Featured Products Section */}
      <section className="container mx-auto py-10 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
          Featured Products
        </h2>
        {isLoadingMenu ? (
          <div className="text-center text-yellow-600">Loading products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(showAllProducts
              ? menuItems
              : getRandomProducts(menuItems, 3)
            ).map((item) => (
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
                    className="w-full h-[300px] object-cover mb-4"
                  />{" "}
                  {/* Increased height */}
                </div>
                <h3 className="text-xl font-bold text-yellow-600">
                  {item.name}
                </h3>
                <p className="text-lg text-yellow-500 font-semibold">
                  {item.price} /-
                </p>
                <p className="text-sm text-gray-700">
                  {getQuantityText(item.quantity, item.name)}
                </p>
              </div>
            ))}
          </div>
        )}
        {!showAllProducts && !isLoadingMenu && (
          <div className="text-center mt-6">
            <button
              className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
              onClick={() => {
                navigate("/menu");
                scrollToTop();
              }}
            >
              Show All Products
            </button>
          </div>
        )}
      </section>

      {/* Latest Blogs Section */}
      <section className="container mx-auto py-10 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
          Latest Blogs
        </h2>
        {isLoadingBlogs ? (
          <div className="text-center text-yellow-600">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.slice(0, 3).map((blog) => (
              <div
                key={blog._id}
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
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-[300px] object-cover mb-4"
                  />
                </div>
                <h3 className="text-xl font-bold text-yellow-600">
                  {blog.title}
                </h3>
                <p className="text-sm text-gray-700">{blog.author}</p>
              </div>
            ))}
          </div>
        )}
        <div className="text-center mt-6">
          <button
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
            onClick={() => {
              navigate("/blogs");
              scrollToTop();
            }}
          >
            Show All Blogs
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
