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

interface EditProductProps {
  product: Product;
  onUpdate: (product: Product) => void;
}

export default function EditProduct({ product, onUpdate }: EditProductProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description);
  const [imageUrl, setImageUrl] = useState(product.imageUrl || ""); 

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error("Image is too large. Please choose an image under 1MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
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

    onUpdate({
      ...product,
      name: name.trim(),
      price: parsedPrice,
      description: description.trim(),
      imageUrl: imageUrl, 
    });
    
    toast.success("Product updated successfully!");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="bg-white/80 dark:bg-slate-800/80 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-700">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Product Name</label>
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className="dark:bg-slate-950 dark:border-white/10"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Price ($)</label>
            <Input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              min="0" 
              step="0.01" 
              className="dark:bg-slate-950 dark:border-white/10"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <Textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="dark:bg-slate-950 dark:border-white/10"
            />
          </div>
          
          {/* --- FILE UPLOAD INPUT --- */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Product Image
            </label>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              ref={fileInputRef}
              className="cursor-pointer dark:bg-slate-950 dark:border-white/10"
            />
            {/* Show a tiny preview of the existing or newly uploaded image */}
            {imageUrl && (
              <div className="mt-2 relative inline-block">
                <img 
                  src={imageUrl} 
                  alt="Preview" 
                  className="h-24 w-24 object-cover rounded-md border dark:border-slate-800" 
                  onError={(e) => { 
                    (e.target as HTMLImageElement).style.display = 'none'; 
                  }}
                />
              </div>
            )}
          </div>

          <Button type="submit" className="w-full mt-2">Save Changes</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}