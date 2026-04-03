"use client"; // Required for Next.js App Router when using hooks and browser APIs

import { useState, useEffect } from "react";
import { Product } from "../types";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // Helps prevent Next.js hydration errors

  // READ: Load products from Local Storage when the app starts
  useEffect(() => {
    const savedProducts = localStorage.getItem("products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (error) {
        console.error("Failed to parse products from local storage", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // WRITE: Save to Local Storage whenever the 'products' array changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products, isLoaded]);

  // CREATE: Add a new product
  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...productData,
      id: crypto.randomUUID(), // Generates a unique ID automatically
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  // UPDATE: Edit an existing product
  const updateProduct = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  };

  // DELETE: Remove a product
  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    isLoaded,
  };
}