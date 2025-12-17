import { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import AOS from "aos";
import "aos/dist/aos.css";

const BlogListPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
    });

    const fetchBlogs = async () => {
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
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setBlogs([]);
      }
      setIsLoading(false);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="bg-white text-black font-sans pt-[calc(var(--header-height, 0px) + 1rem)] pb-10 mt-32">
      <section className="container mx-auto py-10 px-4" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-yellow-600 text-center">
          Blog List
        </h2>
        {isLoading ? (
          <div className="text-center">Loading blogs...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.length ? (
              blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-yellow-100 shadow-2xl rounded-lg p-6 transition-transform transform hover:rotate-1 hover:shadow-3xl hover:scale-105"
                  style={{
                    height: "300px",
                    padding: "20px",
                    margin: "10px",
                    border: "2px solid #f1c40f",
                    borderRadius: "15px",
                  }}
                  data-aos="fade-up"
                >
                  <h3 className="text-xl font-bold text-yellow-600">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-700 mt-2">
                    {blog.content.substring(0, 100)}...
                  </p>
                  <a
                    href={`/blog/${blog._id}`}
                    className="text-yellow-500 hover:underline mt-4 block"
                  >
                    Read More
                  </a>
                </div>
              ))
            ) : (
              <div className="text-center"></div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default BlogListPage;
