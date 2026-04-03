"use client";

import { useProducts } from "@/hooks/useProducts";
import AddProduct from "@/components/AddProduct";

export default function Home() {
  const { products, addProduct, isLoaded } = useProducts();

  // Prevents the page from flashing before Local Storage loads
  if (!isLoaded) return null; 

  return (
    <main className="container mx-auto p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        
        {/* Our new Add Product component! */}
        <AddProduct onAdd={addProduct} />
      </div>

      {/* We will add the table here next! */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center text-slate-500">
        You have {products.length} products saved.
      </div>
      
    </main>
  );
}