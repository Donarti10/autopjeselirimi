import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { KeyIcon, UserIcon, AlertCircleIcon } from "lucide-react";
import { getFingerprint } from "@thumbmarkjs/thumbmarkjs";

export function LoginPage() {
  const url = process.env.REACT_APP_API_URL;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [key, setKey] = useState(null);
  const [obfuscatedKey, setObfuscatedKey] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sendKeyLoading, setSendKeyLoading] = useState(false);
  const [sendKeyMessage, setSendKeyMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const generateFingerprint = async () => {
    try {
      if (key) return key;

      const fingerprint = await getFingerprint();

      const encoded = btoa(fingerprint).split("").reverse().join("");
      setObfuscatedKey(encoded);
      setKey(fingerprint);
      return fingerprint;
    } catch (err) {
      setErrorMessage("Failed to generate fingerprint");
      return null;
    }
  };

  const getLocation = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve({ latitude: null, longitude: null });
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLatitude(position.coords.latitude);
            setLongitude(position.coords.longitude);
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            resolve({ latitude: null, longitude: null });
          }
        );
      }
    });
  };

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    if (loggedUser) {
      navigate("/home");
      return;
    }

    Promise.all([generateFingerprint(), getLocation()]).catch((error) => {
      console.error("Initialization error:", error);
    });
  }, [navigate]);

  const validateForm = () => {
    let newErrors = {};
    if (!username.trim()) newErrors.username = "Username is required";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 5)
      newErrors.password = "Password must be at least 6 characters long";
    if (!key) newErrors.key = "Device fingerprint is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendKey = async () => {
    if (!key) {
      setErrorMessage("No key generated to send");
      return;
    }

    setSendKeyLoading(true);
    setSendKeyMessage("");

    try {
      const payload = {
        id: 0,
        key: key,
        latitude,
        longitude,
      };

      const response = await fetch(`${url}/User/send-key`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to send key");
      }

      setSendKeyMessage("Çelësi u dërgua me sukses!");
      setTimeout(() => setSendKeyMessage(""), 3000);
    } catch (error) {
      console.error("Error sending key:", error);
      setSendKeyMessage("Failed to send key");
    } finally {
      setSendKeyLoading(false);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setErrorMessage("");
    if (!validateForm()) {
      setLoading(false);
      return;
    }
    setLoading(true);

    try {
      const response = await fetch(`${url}/User/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, key, password }),
      });

      const data = await response.json();

      if (!data.isAuthenticated) {
        setErrorMessage(data?.message || "Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.localUser?.subject));
      localStorage.setItem("access_token", data.authToken);
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMessage(
        error.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : "An error occurred during login"
      );
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

          {sendKeyMessage && (
            <div
              className={`border px-4 py-3 rounded-lg flex items-center mb-6 ${
                sendKeyMessage.includes("sukses")
                  ? "bg-green-50 border-green-300 text-green-700"
                  : "bg-red-50 border-red-300 text-red-700"
              }`}
            >
              <AlertCircleIcon size={20} className="mr-2" />
              <span>{sendKeyMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogIn} noValidate>
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

            <div className="mb-6">
              <button
                type="button"
                onClick={handleSendKey}
                disabled={sendKeyLoading || !key}
                className="w-full flex justify-center py-3 px-4 border border-[#1D4260] rounded-lg text-sm font-medium text-[#1D4260] bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1D4260] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendKeyLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#1D4260]"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  "Dërgo kodin"
                )}
              </button>
            </div>

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
