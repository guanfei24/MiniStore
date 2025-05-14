import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import ProductListPage from "../pages/ProductListPage";
import ProductDetailPage from "../pages/ProductDetailPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/products" element={<ProductListPage />} />
      <Route path="*" element={<div>404 - Not Found</div>} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
    </Routes>
  );
}
