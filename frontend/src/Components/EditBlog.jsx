import { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import SidePanel from "./Sidepanel";

// Define Quill editor modules and formats
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    ["link", "image"],
    [{ align: [] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "list",
  "bullet",
  "bold",
  "italic",
  "underline",
  "link",
  "image",
  "align",
];

const fetchBlog = async (id) => {
  const response = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/blog/get/${id}`
  );
  return response.data;
};

const updateBlog = async ({ id, updatedBlog }) => {
  await axios.put(
    `${import.meta.env.VITE_API_URL}/api/blog/update/${id}`,
    updatedBlog
  );
};

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [image, setImage] = useState("");

  const {
    data: blog,
    isLoading,
    error,
  } = useQuery(["blog", id], () => fetchBlog(id), {
    onSuccess: (data) => {
      setTitle(data.title);
      setContent(data.content);
      setAuthor(data.author);
      setTags(data.tags.join(", "));
      setImage(data.image);
    },
  });

  const mutation = useMutation({
    mutationFn: ({ id, updatedBlog }) => updateBlog({ id, updatedBlog }),
    onSuccess: () => {
      queryClient.invalidateQueries(["blog", id]);
      navigate("/admin/dashboard");
    },
    onError: (error) => {
      console.error("Error updating blog:", error);
      alert("Failed to update blog post");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedBlog = {
      title,
      content,
      author,
      tags: tags.split(",").map((tag) => tag.trim()),
      image,
    };
    mutation.mutate({ id, updatedBlog });
  };

  if (isLoading)
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 text-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="bg-gray-100 min-h-screen py-12 px-4 text-center">
        Error loading blog: {error.message}
      </div>
    );

  return (
    <div className="flex min-h-screen">
      <SidePanel />
      <div className="bg-gray-100 min-h-screen py-12 px-4 mt-32 flex-1">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-yellow-600">
            Edit Blog Post
          </h2>
          {blog ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Content</label>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={modules}
                  formats={formats}
                  className="mt-1 border border-gray-300 rounded-md w-full"
                  style={{ minHeight: '600px', maxHeight: '800px', overflowY: 'auto' }}
                  placeholder="Write your blog content here..."
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
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
              <div className="mb-4">
                <label className="block text-gray-700">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
              </div>
              <button
                type="submit"
                disabled={mutation.isLoading}
                className="bg-yellow-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
              >
                {mutation.isLoading ? "Updating..." : "Update Blog Post"}
              </button>
            </form>
          ) : (
            <div className="text-center">Blog not found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditBlogPage;
