import React, { useState } from "react";
import axios from "axios";
import { server } from "../constant/config";
import {toast} from 'react-toastify'
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null); 
  const navigate = useNavigate();

  // Handle text inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file input
  const handleFileChange = (e) => {
    console.log("file",e.target.files[0])
    setAvatar(e.target.files[0]);
    setPreview(URL.createObjectURL(e.target.files[0])); // Create preview URL
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object
    const data = new FormData();
    data.append("username", formData.username);
    data.append("password", formData.password);
    data.append("name", formData.name);
    data.append("avatar", avatar);

    try {
      console.log("Submitting form with data:")
      const res = await axios.post(`${server}/api/users/register`, data, {
        headers: { "Content-Type": "multipart/form-data" },
        credentials: true,
      });
      toast.success("Signup successful!");
      Navigate("/login")
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className=" p-8 rounded-2xl flex flex-col justify-center items-center shadow-md w-80 space-y-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

          {/* Profile Avatar */}
        <div className="relative w-28 h-28">
          <label htmlFor="avatarInput">
            <img
              src={
                preview ||
                "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              }
              alt="avatar preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-400 cursor-pointer hover:opacity-80 transition"
            />
          </label>

          <input
            id="avatarInput"
            type="file"
             accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />

    

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
