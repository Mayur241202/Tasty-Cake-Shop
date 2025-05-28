import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cakeImage from "../assets/logo.png"; // Assuming this is the image for the cake shop

const Login = () => {
  const navigate = useNavigate();
  const [stakeholder, setStakeholder] = useState("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role: stakeholder }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        toast.success("Login successful!");
        // Redirect based on stakeholder
        if (stakeholder === "admin") navigate("/admin");
        else if (stakeholder === "branchmanager") navigate("/branchmanager");
        else navigate("/customer");
      } else {
        toast.error(data.msg || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <section className="bg-pink-100 min-h-screen flex items-center justify-center px-4 py-10">
        <div className="bg-[#dfa674] rounded-2xl flex flex-col md:flex-row max-w-4xl w-full p-6 md:p-10 items-center shadow-xl">
          <div className="w-full md:w-1/2 px-2 md:px-8">
            <h2 className="text-4xl font-bold text-[#002D74]">Login</h2>
            <p className="text-sm mt-2 text-[#002D74]">Already a member? Log in below.</p>
            <form className="flex flex-col gap-4 mt-6" onSubmit={handleLogin}>
              <select
                className="p-3 rounded-xl border"
                value={stakeholder}
                onChange={(e) => setStakeholder(e.target.value)}
                required
              >
                <option value="admin">Admin</option>
                <option value="branchmanager">Branch Manager</option>
                <option value="customer">Customer</option>
              </select>
              <input
                className="p-3 rounded-xl border"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="p-3 rounded-xl border"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="submit"
                className="bg-[#002D74] text-white py-2 rounded-xl hover:scale-105 transition duration-300"
              >
                Login
              </button>
            </form>
            <div className="mt-6 flex items-center gap-4">
              <hr className="flex-1 border-gray-300" />
              <span className="text-sm text-gray-700">OR</span>
              <hr className="flex-1 border-gray-300" />
            </div>
            <div className="mt-6 text-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[#002D74]">Don’t have an account?</p>
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#002D74] text-white px-5 py-2 rounded-xl hover:scale-110 transition duration-300"
              >
                Register
              </button>
            </div>
          </div>
          <div className="hidden md:block w-full md:w-1/2">
            <img
              src={cakeImage}
              alt="Login Illustration"
              className="rounded-2xl w-full h-full object-cover max-h-[600px]"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
