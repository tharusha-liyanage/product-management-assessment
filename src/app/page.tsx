"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import AddProduct from "@/components/AddProduct";
import ProductTable from "@/components/ProductTable";
import { Input } from "@/components/ui/input"; 
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { toast } from "sonner"; 
import { Button } from "@/components/ui/button"; // <-- Import Button for pagination

export default function Home() {
  const { products, addProduct, deleteProduct, updateProduct, isLoaded } = useProducts();
  
  // --- STATES ---
  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortBy, setSortBy] = useState("newest"); // Holds the active sort option
  const [currentPage, setCurrentPage] = useState(1); // Holds the active page

  // I set this to 5 so you can test it easily without having to make 10 dummy products!
  const ITEMS_PER_PAGE = 5; 

  if (!isLoaded) return null; 

  // --- THE DATA PIPELINE ---
  // 1. Copy the array so we don't mutate the original Local Storage data
  let processedProducts = [...products];

  // 2. Search Filter
  if (searchQuery) {
    processedProducts = processedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 3. Sort Logic
  if (sortBy === "price-asc") processedProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") processedProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "name-asc") processedProducts.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "name-desc") processedProducts.sort((a, b) => b.name.localeCompare(a.name));
  else processedProducts.reverse(); // 'newest' - just reverses the default appended order

  // 4. Pagination Math
  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  // Safety: If filtering reduces total pages below our current page, snap to page 1
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  // We grab only the specific 5 items for the current page
  const paginatedProducts = processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.error("Product deleted from inventory.");
  };

  return (
    <main className="container mx-auto p-8 max-w-5xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">Manage your inventory and pricing.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AddProduct onAdd={addProduct} />
        </div>
      </div>

      {/* --- SEARCH & SORT CONTROLS --- */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search by name or description..." 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to page 1 when searching!
          }}
          className="max-w-sm"
        />

        {/* The Sort Dropdown */}
        <select 
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1); // Reset to page 1 when sorting changes!
          }}
          className="h-10 px-3 py-2 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:focus:ring-slate-300 cursor-pointer"
        >
          <option value="newest">Sort by: Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
          <option value="name-desc">Name: Z to A</option>
        </select>
      </div>

      {/* Notice we pass paginatedProducts now! */}
      <ProductTable 
        products={paginatedProducts} 
        onDelete={handleDelete} 
        onUpdate={updateProduct} 
      />

      {/* --- PAGINATION CONTROLS (Only shows if we have more than 1 page!) --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, processedProducts.length)} of {processedProducts.length} entries
          </p>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={safePage === 1} // Disables the button on page 1
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={safePage === totalPages} // Disables the button on the last page
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
    </main>
  );
}