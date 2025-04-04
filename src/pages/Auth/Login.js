import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyIcon, UserIcon, AlertCircleIcon } from "lucide-react";
import { getFingerprint, getFingerprintData } from "@thumbmarkjs/thumbmarkjs";

export function LoginPage() {
  const url = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState("");

  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const generateFingerprint = async () => {
    try {
      const fingerprint = await getFingerprint();
      setKey(fingerprint);
      return fingerprint;
    } catch (error) {
      console.error("Error generating fingerprint:", error);
      setErrorMessage("Failed to generate device fingerprint");
      return null;
    }
  };
  console.log(key);
  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      navigate("/home");
    }
    generateFingerprint();
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    if (!key) newErrors.key = "Device fingerprint is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await fetch(`${url}/User/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, key, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }
      const data = await response.json();
      localStorage.setItem("user", JSON.stringify(data.localUser?.subject));
      localStorage.setItem("access_token", data.authToken);
      navigate("/home");
    } catch (error) {
      setErrorMessage(
        error.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[#1D4260] mb-2">
              AUTO PJESE LIRIMI
            </h1>
            <p className="text-gray-600">Login to access your account</p>
          </div>
          {errorMessage && (
            <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg flex items-center mb-6">
              <AlertCircleIcon size={20} className="mr-2" />
              <span>{errorMessage}</span>
            </div>
          )}
          <form onSubmit={handleLogIn}>
            <div className="mb-6">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={18} className="text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4260] focus:border-transparent"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <KeyIcon size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1D4260] focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            {/* {key && (
              <div className="mb-6 text-sm text-gray-600">
                Device Fingerprint: {key.substring(0, 10)}...
              </div>
            )} */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#1D4260] focus:ring-[#1D4260] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#1D4260] hover:text-[#2A5A80]"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading || !key}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#1D4260] hover:bg-[#2A5A80] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4260] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
      <div
        className="hidden lg:block lg:w-1/2 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80')",
        }}
      >
        <div className="h-full w-full bg-[#1D4260] bg-opacity-75 flex items-center justify-center">
          <div className="text-center px-8">
            <h2 className="text-4xl font-bold text-white mb-3">
              Premium Auto Parts
            </h2>
            <p className="text-xl text-gray-100">
              For professionals who demand the best
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
