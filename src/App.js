import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import DetailProduct from "./pages/DetailProduct/DetailProduct";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import UsersPage from "./pages/UsersPage/UsersPage";
import SubjectPage from "./pages/SubjectPage/SubjectPage";

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
          <Route path="/users" element={<UsersPage />} />
          <Route path="/subject" element={<SubjectPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
