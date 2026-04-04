"use client";
import { toast } from "sonner";
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
    
    // --- 1. FORM VALIDATION ---
    if (!name.trim()) {
      toast.error("Product name cannot be empty.");
      return; 
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      toast.error("Please enter a valid price greater than $0.");
      return;
    }

    if (!description.trim()) {
      toast.error("Product description cannot be empty.");
      return;
    }

    // --- 2. SEND THE UPDATED DATA ---
    onUpdate({
      ...product, // This is crucial: It keeps the original ID attached!
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      imageUrl: imageUrl.trim(),
    });
    
    // --- 3. SUCCESS NOTIFICATION ---
    toast.success("Product updated successfully!");
    
    // --- 4. CLOSE MODAL ---
    setOpen(false); 
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