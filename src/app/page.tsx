"use client";

import { useProducts } from "@/hooks/useProducts";
import AddProduct from "@/components/AddProduct";
import ProductTable from "@/components/ProductTable";

export default function Home() {
  // <-- 1. Grab 'updateProduct' from the hook!
  const { products, addProduct, deleteProduct, updateProduct, isLoaded } = useProducts();

  if (!isLoaded) return null; 

  return (
    <main className="container mx-auto p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-1">Manage your inventory and pricing.</p>
        </div>
        
        <AddProduct onAdd={addProduct} />
      </div>

      <ProductTable 
        products={products} 
        onDelete={deleteProduct} 
        onUpdate={updateProduct} // <-- 2. Pass it into the Table!
      />
      
    </main>
  );
}