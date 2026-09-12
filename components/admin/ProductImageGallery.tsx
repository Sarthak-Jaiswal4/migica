"use client";

import { ChevronLeft, ChevronRight, GripVertical, Plus, X } from "lucide-react";
import { AppImage as Image } from "@/components/AppImage";

function isVideo(url: string) {
  return url.includes("/video/upload/") || /\.(mp4|webm|mov)(?:\?|$)/i.test(url);
}

type ProductImageGalleryProps = {
  images: string[];
  isUploading: boolean;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onReorderImages: (fromIndex: number, toIndex: number) => void;
};

export function ProductImageGallery({
  images,
  isUploading,
  onAddImage,
  onRemoveImage,
  onReorderImages,
}: ProductImageGalleryProps) {
  const canReorder = images.length > 1;

  return (
    <div className="space-y-3">
      {canReorder && (
        <p className="text-xs font-medium text-muted-foreground">Gallery order</p>
      )}
      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <div
            key={`${image}-${index}`}
            draggable={canReorder}
            onDragStart={(event) => {
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", String(index));
            }}
            onDragOver={(event) => {
              if (canReorder) event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              const fromIndex = Number(event.dataTransfer.getData("text/plain"));
              if (Number.isInteger(fromIndex) && fromIndex !== index) {
                onReorderImages(fromIndex, index);
              }
            }}
            className={`aspect-square relative rounded-xl bg-neutral-100 overflow-hidden border border-border group ${
              canReorder ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            {isVideo(image) ? <video src={image} muted playsInline className="h-full w-full object-cover" /> : <Image src={image} alt={`Gallery image ${index + 1}`} fill className="object-cover" />}
            {canReorder && (
              <div className="absolute left-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-black/65 text-white opacity-0 transition-opacity sm:flex sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                <GripVertical size={14} aria-hidden="true" />
                <span className="sr-only">Drag image {index + 1} to reorder</span>
              </div>
            )}
            <div className="absolute inset-x-1 bottom-1 flex justify-between opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
              <button
                type="button"
                onClick={() => onReorderImages(index, index - 1)}
                disabled={index === 0}
                aria-label={`Move image ${index + 1} earlier`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onReorderImages(index, index + 1)}
                disabled={index === images.length - 1}
                aria-label={`Move image ${index + 1} later`}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/65 text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => onRemoveImage(index)}
              aria-label={`Remove image ${index + 1}`}
              className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100"
            >
              <X size={14} aria-hidden="true" />
            </button>
            <span className="absolute left-1 top-1 rounded bg-black/65 px-1.5 py-0.5 text-[10px] font-bold text-white sm:bottom-10 sm:top-auto">{index + 1}</span>
          </div>
        ))}
        <button
          type="button"
          aria-label="Add gallery image or video"
          className="aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-amber-500 hover:text-amber-500 transition-all disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onAddImage}
          disabled={isUploading}
        >
          <Plus size={20} aria-hidden="true" />
          <span className="text-[10px] uppercase font-black">Add media</span>
        </button>
      </div>
    </div>
  );
}
