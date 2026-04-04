"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types";

interface EditProductProps {
  product: Product;
  onUpdate: (product: Product) => void;
}

export default function EditProduct({ product, onUpdate }: EditProductProps) {
  const [open, setOpen] = useState(false);
  
  // We initialize the state with the product's existing data!
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send the updated data back to our custom hook
    onUpdate({
      ...product, // We keep the original ID
      name,
      price: parseFloat(price),
      description,
      imageUrl,
    });
    
    setOpen(false); // Close the modal
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input 
            placeholder="Product Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          <Input 
            type="number" 
            placeholder="Price ($)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            required 
            min="0" 
            step="0.01" 
          />
          <Textarea 
            placeholder="Product Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
          <Input 
            placeholder="Image URL (Optional)" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
          />
          <Button type="submit" className="w-full mt-2">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}