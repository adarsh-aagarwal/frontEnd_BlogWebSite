



import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { createPost } from "../services/postServices";
import { uploadToCloudinary } from "../services/cloudinary";

const AddPostPage = () => {
  const { token } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [contentText, setContentText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !contentText) {
      alert("Please provide an image and post content.");
      return;
    }

    setIsLoading(true);

    try {
      const postImg = await uploadToCloudinary(imageFile, "image");

      const contentBlob = new Blob([contentText], { type: "text/plain" });
      const contentFile = new File([contentBlob], "postContent.txt", {
        type: "text/plain",
      });

      const contentUrl = await uploadToCloudinary(contentFile, "raw");

      const payload = {
        title,
        description,
        postImg,
        contentUrl,
      };

      const response = await createPost(payload, token);
      alert("Post created!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-gray-800">Create New Post</h2>

        <div>
          <label className="block mb-2 font-medium text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Post Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            required
            className="w-full"
          />
        </div>

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Post Content
          </label>
          <textarea
            rows={15}
            value={contentText}
            onChange={(e) => setContentText(e.target.value)}
            placeholder="Write your story here..."
            required
            className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-lg transition"
        >
          {isLoading ? "Uploading..." : "Publish"}
        </button>
      </form>
    </div>
  );
};

export default AddPostPage;

