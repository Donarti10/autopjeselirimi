import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Outlet, useNavigate } from "react-router-dom";

const isValidJWT = (token) => {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
};

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token || !isValidJWT(token)) {
      toast.error("Invalid or missing token. Redirecting to login.");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);

      if (decodedToken.exp < now) {
        toast.error("Token expired. Redirecting to login.");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      if (!["1", "2", "3"].includes(decodedToken.RoleID)) {
        toast.error("Unauthorized role. Redirecting to login.");
        localStorage.clear();
        sessionStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      setIsAuthenticated(true);
    } catch (error) {
      console.error("JWT error:", error);
      toast.error("Invalid token. Redirecting to login.");
      localStorage.clear();
      sessionStorage.clear();
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  if (isAuthenticated === null) return null;

  return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoutes;
