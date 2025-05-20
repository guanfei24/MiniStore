import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("john@mail.com");
  const [password, setPassword] = useState("changeme");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log("token", token);

    if (token) {
      navigate("/products");
    }
  }, [navigate]);

  const loginMutation = useMutation({
    mutationFn: () =>
      api.post("/auth/login", {
        email,
        password,
      }),
    onSuccess: (res) => {
      console.log("login res", res);
      const token = res.data.access_token;
      localStorage.setItem("accessToken", token);
      console.log("loginMutation", loginMutation);
      navigate("/products");
    },
    onError: (error: any) => {
      alert("login failed, please check your email and password");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: "2rem" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />
        </div>
        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={{ width: "100%", padding: "0.5rem" }}
        >
          {loginMutation.isPending ? "Login..." : "Login"}
        </button>
      </form>
    </div>
  );
}
