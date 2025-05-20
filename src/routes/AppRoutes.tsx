import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
      <Route path="/products/:id" element={<ProductDetailPage />} />
    </Routes>
  );
}
