import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductListPage() {
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");

  const queryClient = useQueryClient();
  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get("/categories").then((res) => res.data),
    staleTime: 1000 * 60 * 60 * 24, // Cache for 24 hours
  });

  // Cache product details when mouse enter
  const handleMouseEnter = (id: number) => {
    queryClient.prefetchQuery({
      queryKey: ["product", id],
      queryFn: () => api.get(`/products/${id}`).then((res) => res.data),
    });
  };

  // Fetch products with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["products", debouncedSearch, selectedCategory],
    queryFn: ({ pageParam = 0 }) =>
      api
        .get("/products", {
          params: {
            offset: pageParam,
            limit: 10,
            ...(debouncedSearch ? { title: debouncedSearch } : {}),
            ...(selectedCategory ? { categorySlug: selectedCategory } : {}),
          },
        })
        .then((res) => res.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === 10 ? allPages.length * 10 : undefined,
  });

  // Debounce the search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(handler);
  }, [search]);

  const addToCart = (product) => {
    queryClient.setQueryData(["cart"], (old: any[] = []) => {
      const exists = old.find((item) => item.product.id === product.id);
      if (exists) {
        return old.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...old, { product, quantity: 1 }];
    });

    alert("Added 🎉");
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Products List</h2>
      <div>
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ marginLeft: "1rem" }}
        >
          <option key="" value="">
            All Category
          </option>
          {categories?.map((cat: string) => (
            <option key={cat.slug} value={cat.slug}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          marginTop: "1rem",
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
            >
              <img
                src={product.images?.[0]}
                alt={product.title}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                onClick={() => window.open(`/products/${product.id}`, "_blank")}
              />
              <h4
                onClick={() => window.open(`/products/${product.id}`, "_blank")}
              >
                {product.title}
              </h4>
              <p>${product.price}</p>
              <button
                onClick={() => addToCart(product)}
                style={{
                  marginTop: "1rem",
                  padding: "0.5rem 1rem",
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Add to Cart
              </button>
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
