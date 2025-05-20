import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CartPage from "../pages/CartPage";

export default function NavigateBar() {
  const { data: user } = useQuery({
    queryKey: ["auth"],
    queryFn: () => api.get("/auth/profile").then((res) => res.data),
  });

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isCartShowing, setIsCartShowing] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    queryClient.removeQueries({ queryKey: ["auth"] });
    navigate("/login");
  };

  const toggleCart = () => {
    setIsCartShowing((prev) => !prev);
  };

  if (!user) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        background: "linear-gradient(90deg, #3498db, #2980b9)",
        zIndex: 9999,
        padding: "0.5rem 1rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          position: "relative",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <img
          src={user.avatar}
          alt="avatar"
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            marginRight: 8,
          }}
        />
        <span style={{ color: "#fff" }}>Welcome, {user.name}!</span>

        <div style={{ marginLeft: "auto", position: "relative" }}>
          <button
            onClick={toggleCart}
            style={{
              marginRight: 10,
              padding: "0.5rem 0.75rem",
              backgroundColor: "#ecf0f1",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            🛒 My Shopping Cart
          </button>

          {isCartShowing && <CartPage />}
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "0.5rem 0.75rem",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
