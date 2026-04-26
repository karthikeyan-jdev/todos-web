// import { Link } from "react-router-dom";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/todos";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (email.trim() === "" || password.trim() === "") {
      setError("All fields are required");
      setTimeout(() => setError(""), 3000);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      setSuccess("Login successful!");
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setTimeout(() => {
        navigate("/");
      }, 1500);
      setEmail("");
      setPassword("");
    } catch (error: any) {
      console.error("Error during signup:", error);
      setError(error.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-200 h-screen">
      <h1 className="text-3xl font-bold text-center pt-12 pb-4">Login</h1>
      <div className="flex justify-center items-center h-12">
        {error && (
          <p className="max-w-sm mx-auto p-6 rounded-lg text-red-500 ">
            {error}
          </p>
        )}{" "}
        {success && (
          <p className="max-w-sm mx-auto p-6 rounded-lg text-green-500 ">
            {success}
          </p>
        )}{" "}
      </div>
      <div className="max-w-sm mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Login..." : "login"}
            </button>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                className="underline text-blue-800 hover:opacity-70"
                to="/signup"
              >
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

// localStorage.removeItem("token");
// navigate("/login");
