import React, { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export default function CartPage() {
  const queryClient = useQueryClient();
  const [cartItems, setCartItems] = useState<any[]>([]);

  useEffect(() => {
    const initialCart = queryClient.getQueryData<any[]>(["cart"]) ?? [];
    setCartItems(initialCart);
  }, [queryClient]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = queryClient.getQueryData<any[]>(["cart"]) ?? [];
      setCartItems(current);
    }, 300);
    return () => clearInterval(interval);
  }, [queryClient]);

  const updateCart = (updater: (old: any[]) => any[]) => {
    const old = queryClient.getQueryData<any[]>(["cart"]) ?? [];
    const updated = updater(old);
    queryClient.setQueryData(["cart"], updated);
    setCartItems(updated);
  };

  const increaseQuantity = (productId: number) => {
    updateCart((old) =>
      old.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId: number) => {
    updateCart((old) =>
      old
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: number) => {
    updateCart((old) => old.filter((item) => item.product.id !== productId));
  };

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: "110%",
        width: 320,
        background: "#fff",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: 8,
        padding: "1rem",
        zIndex: 10000,
      }}
    >
      {cartItems.length === 0 ? (
        <p style={{ textAlign: "center" }}>Empty</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cartItems.map((item) => (
              <li
                key={item.product.id}
                style={{
                  marginBottom: 12,
                  borderBottom: "1px solid #eee",
                  paddingBottom: 8,
                }}
              >
                <strong>{item.product.title}</strong>
                <br />${item.product.price} ×{" "}
                <button onClick={() => decreaseQuantity(item.product.id)}>
                  −
                </button>
                {item.quantity}
                <button onClick={() => increaseQuantity(item.product.id)}>
                  ＋
                </button>
                <br />
                Summary: ${(item.product.price * item.quantity).toFixed(2)}
                <br />
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  style={{
                    marginTop: 4,
                    background: "none",
                    color: "#e74c3c",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ❌ Delete
                </button>
              </li>
            ))}
          </ul>
          <hr />
          <p style={{ textAlign: "right", fontWeight: "bold" }}>
            Total: ${totalPrice.toFixed(2)}
          </p>
        </>
      )}
    </div>
  );
}
