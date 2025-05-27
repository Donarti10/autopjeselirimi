import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import DetailProduct from "./pages/DetailProduct/DetailProduct";
import LoginPage from "./pages/Auth/Login";
import ProtectedRoutes from "./ProtectedRoutes";
import UsersPage from "./pages/UsersPage/UsersPage";
import SubjectPage from "./pages/SubjectPage/SubjectPage";
import { Toaster } from "react-hot-toast";
import Dashboard from "./pages/Dashboard/Dashboard";
import ItemsPage from "./pages/ItemsPage/ItemsPage";
import CommunicationPage from "./pages/CommunicationPage/CommunicationPage";
import EditUser from "./components/Users/components/EditUser";
import TransportRelation from "./pages/TransportRelation/TransportRelation";
import CartPage from "./pages/Cart/CartPage";
import CartDetailsPage from "./pages/Cart/CartDetailsPage";
import ItemsPageClient from "./pages/ItemsPageClient/ItemsPageClient";
import ItemsClientDetails from "./components/ItemsClient/components/ItemsClientDetails";
import Navbar from "./components/Navbar/Navbar";
import TransportPage from "./pages/TransportPage/TransportPage";
import { CartProvider } from "./components/Context/Context";

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" />
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoutes />}>
              <Route element={<Navbar />} />
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/detail" element={<DetailProduct />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/edituser/:id" element={<EditUser />} />
              <Route path="/subject" element={<SubjectPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/items" element={<ItemsPage />} />
              <Route path="/items1" element={<ItemsPageClient />} />
              <Route path="/itemsdetail/:id" element={<ItemsClientDetails />} />
              <Route path="/communication" element={<CommunicationPage />} />
              <Route path="/transport" element={<TransportRelation />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/cartdetails/:id" element={<CartDetailsPage />} />
              <Route path="/transportclient" element={<TransportPage />} />
            </Route>
          </Routes>
        </Router>
      </CartProvider>
    </div>
  );
}

export default App;
