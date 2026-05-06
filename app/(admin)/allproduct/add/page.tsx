"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Save, Upload, X, Loader2, Plus } from "lucide-react";
import { AppImage as Image } from "@/components/AppImage";

type NewProductPayload = {
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  quantity: number;
};

async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  if (!res.ok) throw new Error("Upload failed");
  const data = await res.json();
  return data.url;
}

export default function AddProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [mainImage, setMainImage] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const galleryImageInputRef = useRef<HTMLInputElement>(null);

  const [product, setProduct] = useState<NewProductPayload>({
    name: "",
    category: "Candles",
    price: 0,
    rating: 0,
    reviews: 0,
    inStock: true,
    description: "",
    quantity: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "quantity" || name === "rating" || name === "reviews" ? Number(value) : value,
    }));
  };

  const handleCategoryChange = (value: string) => {
    setProduct((prev) => ({ ...prev, category: value }));
  };

  async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setMainImage(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Make sure Cloudinary is configured.");
    } finally {
      setIsUploading(false);
      if (mainImageInputRef.current) mainImageInputRef.current.value = "";
    }
  }

  async function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setGalleryImages((prev) => [...prev, url]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image. Make sure Cloudinary is configured.");
    } finally {
      setIsUploading(false);
      if (galleryImageInputRef.current) galleryImageInputRef.current.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...product,
          image: mainImage,
          images: galleryImages.length > 0 ? galleryImages : mainImage ? [mainImage] : [],
          features: [],
          scent: { top: "", middle: "", base: "" },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save product");
      }

      router.push("/allproduct");
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save product. please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative bg-[#F6F4F1] flex flex-col">
      <Headers />

      <main className="flex-grow p-4 pt-24 max-w-5xl mx-auto w-full">
        <Button variant="ghost" className="mb-6 hover:bg-neutral-200 rounded-xl px-0" onClick={() => router.push("/allproduct")}>
          <ChevronLeft size={20} className="mr-2" /> Back to All Products
        </Button>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3 space-y-6">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-xl">Product Images</CardTitle>
                <CardDescription className="font-semibold text-neutral-500">
                  Upload images to Cloudinary. They will be auto-optimised for the storefront.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Image */}
                <div
                  className="aspect-square relative rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 group cursor-pointer"
                  onClick={() => mainImageInputRef.current?.click()}
                >
                  {mainImage ? (
                    <>
                      <Image src={mainImage} alt="Main product image" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" className="bg-white text-black hover:bg-neutral-100 rounded-full font-bold shadow-lg">
                          Change Image
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-400">
                      {isUploading ? (
                        <Loader2 className="h-8 w-8 animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-10 w-10" />
                          <span className="text-sm font-semibold">Upload main image</span>
                        </>
                      )}
                    </div>
                  )}
                  <input
                    ref={mainImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainImageUpload}
                  />
                </div>

                {/* Gallery Images */}
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="aspect-square relative rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 group">
                      <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                      <button
                        onClick={() => removeGalleryImage(idx)}
                        className="absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-amber-500 hover:text-amber-500 transition-all"
                    onClick={() => galleryImageInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        <Plus size={20} />
                        <span className="text-[10px] uppercase font-black">Add</span>
                      </>
                    )}
                  </button>
                  <input
                    ref={galleryImageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleGalleryImageUpload}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:w-2/3 space-y-6">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
              <CardHeader className="border-b border-neutral-100 pb-6">
                <CardTitle className="text-2xl">New Product Details</CardTitle>
                <CardDescription>Fill in the information below to add a product</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="name" className="font-bold ml-1">
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Enchanted Forest"
                      value={product.name}
                      onChange={handleInputChange}
                      className="h-12 bg-white border-neutral-200 rounded-xl focus:ring-amber-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="font-bold ml-1">
                      Category
                    </Label>
                    <Select value={product.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger id="category" className="h-12 bg-white border-neutral-200 rounded-xl">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Candles">Candles</SelectItem>
                        <SelectItem value="Aromatherapy">Aromatherapy</SelectItem>
                        <SelectItem value="Fresh">Fresh</SelectItem>
                        <SelectItem value="Floral">Floral</SelectItem>
                        <SelectItem value="Woodsy">Woodsy</SelectItem>
                        <SelectItem value="Luxury">Luxury</SelectItem>
                        <SelectItem value="Seasonal">Seasonal</SelectItem>
                        <SelectItem value="Scarves">Scarves</SelectItem>
                        <SelectItem value="Jewelry">Jewelry</SelectItem>
                        <SelectItem value="Gift">Gift</SelectItem>
                        <SelectItem value="T-Shirt">T-Shirt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price" className="font-bold ml-1">
                      Price (₹)
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={product.price}
                      onChange={handleInputChange}
                      className="h-12 bg-white border-neutral-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-bold ml-1">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Tell the story of this product..."
                    value={product.description}
                    onChange={handleInputChange}
                    className="min-h-[120px] bg-white border-neutral-200 rounded-2xl resize-none p-4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className="font-bold ml-1">
                      Initial Stock
                    </Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={product.quantity}
                      onChange={handleInputChange}
                      className="h-12 bg-white border-neutral-200 rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold ml-1">Initial Availability</Label>
                    <div className="h-12 flex items-center gap-4 px-1">
                      <button
                        type="button"
                        onClick={() => setProduct((prev) => ({ ...prev, inStock: !prev.inStock }))}
                        className={`px-6 py-2 rounded-full font-bold transition-all ${
                          product.inStock ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-neutral-200 text-neutral-500"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-neutral-50 p-6 md:p-8 flex flex-col-reverse md:flex-row justify-end gap-4 border-t border-neutral-200">
                <Button
                  variant="outline"
                  className="rounded-xl h-10 md:h-12 w-full md:w-auto px-8 font-bold border-neutral-200"
                  onClick={() => router.push("/allproduct")}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-black text-white hover:bg-neutral-800 rounded-xl h-10 md:h-12 w-full md:w-auto px-8 font-bold flex gap-2 shadow-lg shadow-black/10"
                  disabled={isSaving || !product.name}
                  onClick={handleSave}
                >
                  {isSaving ? "Adding..." : (
                    <>
                      <Save size={20} /> Add Product
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
