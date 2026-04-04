"use client";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import EditProduct from "./EditProduct"; 
import { Image as ImageIcon } from "lucide-react"; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onUpdate: (product: Product) => void; 
}

export default function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 border border-dashed dark:border-slate-800 rounded-lg">
        <p className="text-lg font-medium text-slate-900 dark:text-slate-200">No products found</p>
        <p className="text-sm">Click "Add New Product" to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {/* --- DESKTOP VIEW (TABLE) --- */}
      {/* hidden on small screens, shown as block on md (medium) screens and up */}
      <div className="hidden md:block border dark:border-slate-800 rounded-md bg-white dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-slate-800">
              <TableHead className="w-[80px] dark:text-slate-300">Image</TableHead>
              <TableHead className="dark:text-slate-300">Product Name</TableHead>
              <TableHead className="dark:text-slate-300">Price</TableHead>
              <TableHead className="dark:text-slate-300">Description</TableHead>
              <TableHead className="text-right dark:text-slate-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={`desktop-${product.id}`} className="dark:border-slate-800">
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
                <TableCell className="font-medium dark:text-slate-200">{product.name}</TableCell>
                <TableCell className="dark:text-slate-300">${product.price.toFixed(2)}</TableCell>
                <TableCell className="max-w-[200px] truncate dark:text-slate-300">{product.description}</TableCell>
                <TableCell className="text-right space-x-2">
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      {/* shown on small screens, hidden on md (medium) screens and up */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {products.map((product) => (
          <div 
            key={`mobile-${product.id}`} 
            className="flex flex-col p-4 border dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 shadow-sm"
          >
            {/* Top Row: Image & Title/Price */}
            <div className="flex gap-4 items-center">
              {product.imageUrl ? (
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-16 h-16 rounded-md object-cover border dark:border-slate-800"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center border dark:border-slate-800 text-slate-400 shrink-0">
                  <ImageIcon size={24} />
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-semibold text-lg dark:text-slate-200">{product.name}</span>
                <span className="text-slate-600 dark:text-slate-400 font-medium">${product.price.toFixed(2)}</span>
              </div>
            </div>

            {/* Middle Row: Description */}
            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {product.description}
            </p>

            {/* Bottom Row: Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t dark:border-slate-800 justify-end">
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
  );
}