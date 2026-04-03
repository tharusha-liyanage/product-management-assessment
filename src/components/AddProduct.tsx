"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Product } from "@/types";

interface AddProductProps {
  onAdd: (product: Omit<Product, "id">) => void;
}

export default function AddProduct({ onAdd }: AddProductProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send the data back to our custom hook
    onAdd({
      name,
      price: parseFloat(price),
      description,
      imageUrl,
    });
    
    // Clear the form and close the modal
    setName("");
    setPrice("");
    setDescription("");
    setImageUrl("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Product</DialogTitle>
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
          <Button type="submit" className="w-full mt-2">Save Product</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}