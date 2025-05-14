// src/App.tsx
import { useIsFetching } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const isFetching = useIsFetching();

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
          {isFetching ? "Loading...." : "Loading Complete"}
        </div>
      }
      <AppRoutes />
    </>
  );
}

export default App;
