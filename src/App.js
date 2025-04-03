import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import DetailProduct from "./pages/DetailProduct/DetailProduct";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";

function App() {
  return (
    <Router>
      <Routes>
        <Route>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/detail" element={<DetailProduct />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
