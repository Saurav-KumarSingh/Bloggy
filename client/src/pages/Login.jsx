import { useState } from "react";
import InputField from "../component/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate =useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, formData);

      if (result.data?.token) {
        localStorage.setItem("token", result.data.token);
        localStorage.setItem("email", result.data.email);
        localStorage.setItem("username", result.data.username);
        navigate("/home");
      } else {
        console.error("Login failed: No token received");
      }


    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
          Welcome Back 👋
        </h2>

        <p className="text-gray-500 text-center mb-8 text-sm">
          Please login to your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md 
                       transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-blue-400"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don’t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
