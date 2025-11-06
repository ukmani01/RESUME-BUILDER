import React, { useState, useEffect } from "react";
import axios from "axios";
import ResumeForm from "./assets/Components/ResumeForm";
import Preview from "./assets/Components/Preview";
const API = import.meta.env.VITE_API || "http://localhost:7000/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [resume, setResume] = useState(null);
  const [showIntro, setShowIntro] = useState(true); // 👈 Added intro section state

  useEffect(() => {
    if (token) fetchResume();

    // ⏱️ Auto logout after 10 minutes
    const timer = setTimeout(() => {
      localStorage.removeItem("token");
      setToken("");
      setResume(null);
      setShowIntro(true);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearTimeout(timer);
  }, [token]);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${API}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResume(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
    setResume(null);
    setShowIntro(true);
  };

  // 🌟 New Intro Section (only shown before main page)   


                                                              //active page
  if (showIntro)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 text-center p-6">
        <div className="max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-4">
            Create Your Resume
          </h1>
          <p className="text-gray-700 mb-6">
            Any topic user read and interested and create resume style
          </p>

          {/* 👇 Resume image with hover animation */}
          <div className="relative group mb-6">
            <img
              src="https://i.pinimg.com/736x/3c/cf/34/3ccf34134b34128bfeed0dfc0293016f.jpg"
              alt="Resume"
              className="w-40 h-40 mx-auto transform group-hover:scale-110 transition-all duration-500 drop-shadow-lg"
            />
            <div className="absolute inset-0 bg-indigo-200/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition duration-500"></div>
          </div>

          <button
            onClick={() => setShowIntro(false)}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all duration-300"
          >
            Start Now
          </button>
        </div>
      </div>
    );

  if (!token) return <AuthForm setToken={setToken} />;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-indigo-600">Resume Maker</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Main */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto flex-1">
        <div className="lg:w-1/2 bg-white p-6 rounded-2xl shadow-xl overflow-y-auto">
          <ResumeForm resume={resume} setResume={setResume} />
        </div>
        <div className="lg:w-1/2 bg-white p-6 rounded-2xl shadow-xl overflow-y-auto">
          <Preview resume={resume || {}} token={token} />
        </div>
      </div>
    </div>
  );
}

// -------------------- AuthForm --------------------
function AuthForm({ setToken }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      const endpoint = mode === "login" ? "/Auth/Login" : "/Auth/Register";
      const payload =
        mode === "login" ? { email, password } : { name, email, password };
      const res = await axios.post(`${API}${endpoint}`, payload);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        alert(`${mode === "login" ? "Login" : "Registration"} successful!`);
      } else {
        alert("⚠️ Token missing. Please check backend response!");
      }
    } catch (err) {
      console.error(err);
      alert(`❌ ${mode} failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-96">
        <h1 className="text-3xl font-extrabold text-center mb-2 text-indigo-600">
          Resume Builder
        </h1>
        <p className="text-center text-gray-600 mb-6">
          {mode === "login"
            ? "Welcome back! Log in to continue"
            : "Create your free account to get started"}
        </p>

        {mode === "register" && (
          <input
            type="text"
            placeholder="Full Name"
            className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 w-full p-2 mb-3 rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 w-full p-2 mb-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 focus:ring-2 focus:ring-indigo-400 w-full p-2 mb-4 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="bg-indigo-500 hover:bg-indigo-600 text-white w-full py-2 rounded-lg font-semibold"
        >
          {mode === "login" ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          {mode === "login" ? (
            <>
              Don’t have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
