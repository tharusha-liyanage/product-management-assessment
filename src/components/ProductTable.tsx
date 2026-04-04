"use client";

import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import EditProduct from "./EditProduct"; // <-- 1. Import the new component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductTableProps {
  products: Product[];
  onDelete: (id: string) => void;
  onUpdate: (product: Product) => void; // <-- 2. Ask for the update function
}

export default function ProductTable({ products, onDelete, onUpdate }: ProductTableProps) {
  
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-50 border border-dashed rounded-lg">
        <p className="text-lg font-medium">No products found</p>
        <p className="text-sm">Click "Add New Product" to get started.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-md bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell className="max-w-[200px] truncate">{product.description}</TableCell>
              <TableCell className="text-right space-x-2">
                
                {/* 3. We replaced the old Button with your new Edit Component! */}
                <EditProduct product={product} onUpdate={onUpdate} />
                
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => onDelete(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}