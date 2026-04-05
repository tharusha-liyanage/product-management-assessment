"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import EditProduct from "./EditProduct"; 
import { Image as ImageIcon, PackageOpen, Eye } from "lucide-react"; 
import { Checkbox } from "@/components/ui/checkbox"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onUpdate: (product: Product) => void; 
  onBulkDelete: (ids: string[]) => void; 
}

export default function ProductTable({ products, onDelete, onUpdate, onBulkDelete }: ProductTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const confirmBulkDelete = () => {
    onBulkDelete(selectedIds);
    setSelectedIds([]); 
  };

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950/50 animate-in fade-in-50 duration-500 shadow-sm">
        <div className="h-20 w-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
          <PackageOpen className="h-10 w-10 text-indigo-500 dark:text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No products in inventory</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          You haven't added any products yet. Start building your catalog by adding your first item.
        </p>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div>
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && (
          <div className="flex items-center justify-between p-3 mb-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-md transition-all animate-in fade-in slide-in-from-top-4 shadow-sm">
            <span className="text-sm font-medium text-indigo-800 dark:text-indigo-300">
              {selectedIds.length} item(s) selected
            </span>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="shadow-sm">Delete Selected</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Multiple Items?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete {selectedIds.length} products from your inventory. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmBulkDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {/* --- DESKTOP VIEW (TABLE) --- */}
        <div className="hidden md:block border dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
              <TableRow className="dark:border-slate-800">
                <TableHead className="w-[40px]">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block p-1">
                        <Checkbox 
                          checked={products.length > 0 && selectedIds.length === products.length}
                          onCheckedChange={handleSelectAll}
                          aria-label="Select all"
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs">
                      <p>Select all on page</p>
                    </TooltipContent>
                  </Tooltip>
                </TableHead>
                <TableHead className="w-[80px] dark:text-slate-300 font-semibold">Image</TableHead>
                <TableHead className="dark:text-slate-300 font-semibold">Product Name</TableHead>
                <TableHead className="dark:text-slate-300 font-semibold">Price</TableHead>
                <TableHead className="dark:text-slate-300 font-semibold">Description</TableHead>
                <TableHead className="text-right dark:text-slate-300 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow 
                  key={`desktop-${product.id}`} 
                  className="dark:border-slate-800 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
                >
                  <TableCell>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-block p-1">
                          <Checkbox 
                            checked={selectedIds.includes(product.id)}
                            onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                            aria-label="Select product"
                          />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs">
                        <p>Select multiple to delete</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    {product.imageUrl ? (
                      <img 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-12 h-12 rounded-md object-cover border dark:border-slate-800"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800 text-slate-400">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium text-slate-900 dark:text-slate-200">{product.name}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      Rs.{product.price.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-slate-500 dark:text-slate-400">{product.description}</TableCell>
                  <TableCell className="text-right space-x-2">
                    
                    {/* --- NEW: VIEW DETAILS DIALOG --- */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="opacity-90 group-hover:opacity-100 transition-opacity">
                          <Eye className="h-4 w-4 mr-1 sm:hidden lg:block" /> View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Product Details</DialogTitle>
                          <DialogDescription>Full information for this item.</DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 flex flex-col gap-6">
                          {/* Large Image Preview (Desktop Fix) */}
                          {product.imageUrl ? (
                            <div className="w-full h-64 bg-slate-50 dark:bg-slate-900/50 rounded-lg border dark:border-slate-800 flex items-center justify-center overflow-hidden p-2">
                              <img 
                                src={product.imageUrl} 
                                alt={product.name} 
                                className="max-w-full max-h-full object-contain drop-shadow-sm rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="w-full h-64 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800 text-slate-400">
                              <ImageIcon size={48} />
                            </div>
                          )}
                          <div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h2>
                            <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                              Rs.{product.price.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-2">Description</h4>
                            {/* Un-truncated text with relaxed line height */}
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <EditProduct product={product} onUpdate={onUpdate} />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="opacity-90 group-hover:opacity-100 transition-opacity">Delete</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{product.name}" from your inventory.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onDelete(product.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* --- MOBILE VIEW (CARDS) --- */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {products.map((product) => (
            <div 
              key={`mobile-${product.id}`} 
              className={`flex flex-col p-4 border dark:border-slate-800 rounded-xl shadow-sm transition-all ${
                selectedIds.includes(product.id) ? "bg-indigo-50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 ring-1 ring-indigo-500/20" : "bg-white dark:bg-slate-950"
              }`}
            >
              <div className="flex gap-4 items-center relative">
                <div className="flex flex-col justify-center">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-block p-1">
                        <Checkbox 
                          checked={selectedIds.includes(product.id)}
                          onCheckedChange={(checked) => handleSelectOne(product.id, !!checked)}
                          aria-label="Select product"
                        />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs">
                      <p>Select multiple to delete</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-16 h-16 rounded-md object-cover border dark:border-slate-800 shadow-sm"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800 text-slate-400 shrink-0 shadow-sm">
                    <ImageIcon size={24} />
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <span className="font-semibold text-lg text-slate-900 dark:text-slate-100 leading-none">{product.name}</span>
                  <div className="self-start">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                      Rs.{product.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {product.description}
              </p>

              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 justify-end">
                
                {/* --- NEW: VIEW DETAILS DIALOG (MOBILE) --- */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-1" /> View
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-[90vw] rounded-xl">
                    <DialogHeader>
                      <DialogTitle>Product Details</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 flex flex-col gap-4">
                      {/* Large Image Preview (Mobile Fix) */}
                      {product.imageUrl ? (
                        <div className="w-full h-48 bg-slate-50 dark:bg-slate-900/50 rounded-lg border dark:border-slate-800 flex items-center justify-center overflow-hidden p-2">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="max-w-full max-h-full object-contain drop-shadow-sm rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="w-full h-48 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800 text-slate-400">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{product.name}</h2>
                        <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          Rs.{product.price.toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-200 mb-1">Description</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <EditProduct product={product} onUpdate={onUpdate} />
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{product.name}" from your inventory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onDelete(product.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}