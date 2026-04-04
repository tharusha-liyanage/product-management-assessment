"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  const [imageUrl, setImageUrl] = useState(""); // This will now hold our Base64 string
  
  // We use this to reset the file input after saving
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- THE NEW MAGIC FUNCTION ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is too big (e.g., > 1MB) because Local Storage has a 5MB limit!
      if (file.size > 1024 * 1024) {
        toast.error("Image is too large. Please choose an image under 1MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        // This converts the image file into a text string we can save
        setImageUrl(reader.result as string); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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

    onAdd({
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      imageUrl: imageUrl, // Saves the Base64 string
    });
    
    toast.success("Product added successfully!");
    
    // Clear everything
    setName("");
    setPrice("");
    setDescription("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = ""; // Clear file input
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a New Product</DialogTitle>
          <DialogDescription>
            Fill out the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <Input 
            placeholder="Product Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
          />
          <Input 
            type="number" 
            placeholder="Price ($)" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)} 
            min="0" 
            step="0.01" 
          />
          <Textarea 
            placeholder="Product Description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
          />
          
          {/* --- THE NEW FILE INPUT --- */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Product Image
            </label>
            <Input 
              type="file" 
              accept="image/*" // Only allow image files
              onChange={handleImageChange}
              ref={fileInputRef}
              className="cursor-pointer"
            />
            {/* Show a tiny preview if they selected an image! */}
            {imageUrl && (
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="h-24 w-24 object-cover rounded-md border mt-2" 
              />
            )}
          </div>

          <Button type="submit" className="w-full mt-2">Save Product</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}