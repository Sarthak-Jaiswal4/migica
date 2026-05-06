"use client";

import Image, { ImageProps } from "next/image";
import { CldImage } from "next-cloudinary";

function isCloudinarySrc(src: unknown): src is string {
    return typeof src === "string" && src.includes("res.cloudinary.com");
}

function extractPublicId(url: string): string {
    const match = url.match(
        /res\.cloudinary\.com\/[^/]+\/image\/upload\/(?:v\d+\/)?(.+?)(?:\.\w{3,4})?$/
    );
    return match ? match[1] : url;
}

type AppImageProps = Omit<ImageProps, "src"> & { src: ImageProps["src"] };

/**
 * Drop-in replacement for next/image.
 * - Empty/missing src → renders a neutral placeholder
 * - Cloudinary URLs → CldImage with auto optimisation
 * - Everything else → standard next/image
 */
export function AppImage({ src, alt, ...props }: AppImageProps) {
    const isEmpty = !src || (typeof src === "string" && src.trim() === "");

    if (isEmpty) {
        const { fill, width, height, className, ...rest } = props as any;
        return (
            <div
                className={`bg-neutral-200 flex items-center justify-center text-neutral-400 ${fill ? "absolute inset-0" : ""} ${className ?? ""}`}
                style={!fill ? { width: width ?? "100%", height: height ?? "100%" } : undefined}
                aria-label={alt}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
        );
    }

    if (isCloudinarySrc(src)) {
        const publicId = extractPublicId(src);
        return <CldImage src={publicId} alt={alt} {...(props as any)} />;
    }

    return <Image src={src} alt={alt} {...props} />;
}
