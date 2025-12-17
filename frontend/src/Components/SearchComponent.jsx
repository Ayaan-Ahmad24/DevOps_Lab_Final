import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getApiUrl } from "../utils/api";

const SearchComponent = () => {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittedQuery, setSubmittedQuery] = useState("");

  const location = useLocation();
  const urlQuery = new URLSearchParams(location.search).get("query") || "";

  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      setSubmittedQuery(urlQuery);
    }
  }, [urlQuery]);

  useEffect(() => {
    const fetchResults = async () => {
      if (submittedQuery) {
        setLoading(true);
        setError(null);

        try {
          const response = await fetch(
            `${getApiUrl('/api/search')}?query=${submittedQuery}`
          );

          if (response.ok) {
            const data = await response.json();
            setResults(data);
          } else {
            throw new Error("Network response was not ok");
          }
        } catch (err) {
          setError("Failed to fetch search results");
          console.error("Search error:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [submittedQuery]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedQuery(query);
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-32">
      <div className="bg-white shadow-md rounded-lg p-8 mb-8">
        {/* Search form */}
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="border p-2 rounded-lg"
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-yellow-500 text-white rounded-lg"
          >
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center text-lg font-semibold">Loading...</p>
        )}

        {error && (
          <div className="text-center text-red-500">
            <p className="text-lg font-semibold">Error: {error}</p>
          </div>
        )}

        {results.length === 0 && submittedQuery && !loading && !error && (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold">Nothing found</p>
            <p className="text-sm text-gray-700 mt-2">
              No matching results. Try searching for something else.
            </p>
          </div>
        )}

        {/* Display results */}
        {results.length > 0 && !loading && !error && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
              {results.map((result) => (
                <div
                  key={result._id}
                  className="bg-white shadow-md rounded-lg p-4 border border-gray-300"
                >
                  {result.name ? (
                    <div>
                      <img
                        src={result.image || "default-image-url"}
                        alt={result.name}
                        className="w-full h-48 object-cover rounded-lg mb-2"
                      />
                      <h3 className="text-lg font-semibold">{result.name}</h3>
                      <p className="text-lg text-yellow-500 font-semibold">
                        {result.price} /-
                      </p>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold">{result.title}</h3>
                      <p>{result.content.substring(0, 100)}...</p>
                      <a
                        href={`/blog/${result._id}`}
                        className="text-yellow-500 hover:underline mt-4 block"
                      >
                        Read More
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              {results.some((result) => result.name) && (
                <a
                  href="/menu"
                  className="p-2 bg-yellow-500 text-white rounded-lg"
                >
                  Show All Products
                </a>
              )}
              {results.some((result) => !result.name) && (
                <a
                  href="/blogs"
                  className="p-2 bg-yellow-500 text-white rounded-lg ml-4"
                >
                  Show All Blogs
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
