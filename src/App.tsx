// src/App.tsx
import { useIsFetching, useQuery } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import api from "./api/axios";

function App() {
  const isFetching = useIsFetching();

  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ["auth"],
    queryFn: () => api.get("/auth/profile").then((res) => res.data),
  });

  return (
    <>
      {
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            height: "40px",
            width: "100%",
            background: "linear-gradient(90deg, #3498db, #2980b9)",
            animation: "progressAnim 1.2s linear infinite",
            zIndex: 9999,
          }}
        >
          {isUserLoading ? (
            <p>加载用户信息中...</p>
          ) : user ? (
            <div style={{ marginBottom: "1rem" }}>欢迎，{user.name} </div>
          ) : null}
        </div>
      }
      <AppRoutes />
    </>
  );
}

export default App;
