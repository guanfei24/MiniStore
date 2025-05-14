import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
    enabled: !!id, // only fetch if id is available
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  if (!product) return <p>Product Not Found</p>;

  return (
    <div style={{ padding: "2rem", maxWidth: 800, margin: "auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "1rem" }}>
        ← Back
      </button>
      <h2>{product.title}</h2>
      <img
        src={product.images?.[0]}
        alt={product.title}
        style={{ width: "100%", maxHeight: 300, objectFit: "contain" }}
      />
      <p>{product.description}</p>
      <p>Price: ${product.price}</p>
      <p>categories: {product.category?.name}</p>
    </div>
  );
}
