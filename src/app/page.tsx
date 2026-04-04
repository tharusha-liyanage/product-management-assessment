"use client";

import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import AddProduct from "@/components/AddProduct";
import ProductTable from "@/components/ProductTable";
import { Input } from "@/components/ui/input"; 
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { toast } from "sonner"; 
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ImageOff, TrendingUp } from "lucide-react";

export default function Home() {
  const { products, addProduct, deleteProduct, updateProduct, isLoaded } = useProducts();
  
  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortBy, setSortBy] = useState("newest"); 
  const [currentPage, setCurrentPage] = useState(1); 

  const ITEMS_PER_PAGE = 5; 

  if (!isLoaded) return null; 

  // --- ANALYTICS MATH ---
  const totalProducts = products.length;
  const missingImagesCount = products.filter((product) => !product.imageUrl).length;
  const highestPrice = products.length > 0 
    ? Math.max(...products.map(product => product.price)) 
    : 0;

  // --- DATA PIPELINE ---
  let processedProducts = [...products];

  if (searchQuery) {
    processedProducts = processedProducts.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (sortBy === "price-asc") processedProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "price-desc") processedProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "name-asc") processedProducts.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortBy === "name-desc") processedProducts.sort((a, b) => b.name.localeCompare(a.name));
  else processedProducts.reverse(); 

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE);
  const safePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = processedProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleDelete = (id: string) => {
    deleteProduct(id);
    toast.error("Product deleted from inventory.");
  };

  const handleBulkDelete = (ids: string[]) => {
    ids.forEach((id) => deleteProduct(id));
    toast.error(`${ids.length} products deleted from inventory.`);
  };

  return (
    // 1. Base Layer: Custom dark hex code and overflow hidden for the glowing orbs
    <div className="relative min-h-screen bg-[#f8fafc] dark:bg-[#09090b] pb-12 transition-colors duration-300 overflow-hidden">
      
      {/* 2. Ambient Background Glows: Using arbitrary values (blur-[120px]) so no config is needed! */}
      <div className="pointer-events-none fixed inset-0 z-0 flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-violet-500/20 dark:bg-violet-600/10 blur-[120px]" />
        <div className="absolute top-[20%] right-[-5%] w-[400px] h-[400px] rounded-full bg-blue-500/20 dark:bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 dark:bg-emerald-600/10 blur-[120px]" />
      </div>

      {/* 3. Main Content Wrapper: Slides up and fades in on load */}
      <main className="relative z-10 container mx-auto p-4 sm:p-8 max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        
        {/* 4. Sticky Glassmorphism Header: Custom blur and opacity */}
        <div className="sticky top-0 z-20 flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 mb-8 dark:bg-[#09090b]/70 backdrop-blur-xl border-b border-transparent dark:border-white/5 transition-all">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Product Management</h1>
            <p className="text-slate-500 mt-1 dark:text-slate-400">Manage your inventory and pricing.</p>
          </div>
          
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <ThemeToggle />
            <AddProduct onAdd={addProduct} />
          </div>
        </div>

        {/* 5. Analytics Cards with Premium Custom Drop Shadows */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="bg-white/80 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-800 backdrop-blur-sm dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Products</CardTitle>
              <Package className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-slate-100 tracking-tight">{totalProducts}</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-800 backdrop-blur-sm dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Missing Images</CardTitle>
              <ImageOff className="h-4 w-4 text-rose-500 dark:text-rose-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-slate-100 tracking-tight">{missingImagesCount}</div>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Products needing updates</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 hover:bg-white/20 dark:bg-slate-900/50 dark:hover:bg-slate-800 backdrop-blur-sm dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Highest Price</CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold dark:text-slate-100 tracking-tight">Rs.{highestPrice.toFixed(2)}</div>
              <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">Premium catalog item</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Input 
            placeholder="Search by name or description..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); 
            }}
            className="h-10 w-full sm:max-w-sm bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm dark:border-white/10"
          />

          <select 
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1); 
            }}
            className="h-10 w-full sm:w-auto px-3 py-2 rounded-md border border-slate-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-200 backdrop-blur-sm shadow-sm cursor-pointer"
          >
            <option value="newest">Sort by: Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
          </select>
        </div>

        {/* The Table Wrapper also gets the soft shadow */}
        <div className="shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none rounded-md">
          <ProductTable 
            products={paginatedProducts} 
            onDelete={handleDelete} 
            onUpdate={updateProduct} 
            onBulkDelete={handleBulkDelete}
          />
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4 bg-white/50 dark:bg-slate-900/30 p-4 rounded-xl backdrop-blur-sm border border-transparent dark:border-white/5">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              Showing <span className="text-slate-900 dark:text-white">{startIndex + 1}</span> to <span className="text-slate-900 dark:text-white">{Math.min(startIndex + ITEMS_PER_PAGE, processedProducts.length)}</span> of <span className="text-slate-900 dark:text-white">{processedProducts.length}</span> entries
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={safePage === 1} 
                className="bg-white/80 dark:bg-slate-800/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={safePage === totalPages} 
                className="bg-white/80 dark:bg-slate-800/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}