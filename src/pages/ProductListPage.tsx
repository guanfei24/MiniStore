import { useInfiniteQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export default function ProductListPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam }) =>
      api.get(`/products?offset=${pageParam}&limit=10`).then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // If the last page has less than 10 items, it means there are no more pages
      return lastPage.length === 10 ? allPages.length * 10 : undefined;
    },
  });

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // cache product details when mouse enter
  const handleMouseEnter = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["product", id],
      queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Porducts List</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {data?.pages.flatMap((page, pageIndex) =>
          page.map((product: any, idx: number) => (
            <div
              key={`${pageIndex}-${product.id}`}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                borderRadius: "8px",
                cursor: "pointer",
              }}
              onMouseEnter={() => handleMouseEnter(product.id)}
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <img
                src={product.images?.[0]}
                alt={product.title}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
              />
              <h4>{product.title}</h4>
              <p>${product.price}</p>
            </div>
          ))
        )}
      </div>

      {hasNextPage && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            style={{ padding: "0.75rem 1.5rem" }}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}
