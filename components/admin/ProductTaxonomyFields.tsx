"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getAdminCategoryOptions,
  getAdminSubcategoryOptions,
  PRODUCT_TAG_OPTIONS,
} from "@/lib/categories";

type Props = {
  category: string;
  subcategory: string;
  tags: string[];
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onTagsChange: (tags: string[]) => void;
};

export function ProductTaxonomyFields({
  category,
  subcategory,
  tags,
  onCategoryChange,
  onSubcategoryChange,
  onTagsChange,
}: Props) {
  const subcategoryOptions = getAdminSubcategoryOptions(category);

  const handleCategoryChange = (value: string) => {
    onCategoryChange(value);
    onSubcategoryChange("");
  };

  const toggleTag = (tag: string) => {
    onTagsChange(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="category" className="font-bold ml-1">
          Category
        </Label>
        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger id="category" className="h-12 bg-card border-border rounded-xl">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {getAdminCategoryOptions().map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategory" className="font-bold ml-1">
          Subcategory
        </Label>
        <Select
          value={subcategory || undefined}
          onValueChange={onSubcategoryChange}
          disabled={subcategoryOptions.length === 0}
        >
          <SelectTrigger id="subcategory" className="h-12 bg-card border-border rounded-xl">
            <SelectValue placeholder="Select subcategory" />
          </SelectTrigger>
          <SelectContent>
            {subcategoryOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {subcategoryOptions.length === 0 ? (
          <p className="text-xs text-muted-foreground ml-1">
            Use collection tags below for this category (e.g. New arrivals, Bestsellers).
          </p>
        ) : null}
      </div>

      <div className="space-y-2 col-span-2">
        <Label className="font-bold ml-1">Collection tags</Label>
        <p className="text-xs text-muted-foreground ml-1">
          Tags power shop filters (featured, bestsellers, gift price bands, etc.).
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {PRODUCT_TAG_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleTag(opt.value)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                tags.includes(opt.value)
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-border bg-card text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
