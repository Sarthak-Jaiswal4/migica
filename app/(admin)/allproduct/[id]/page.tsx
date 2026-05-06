"use client"

import React, { useRef, useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Headers } from '@/components/Headers'
import { Footer } from '@/components/Footer'
import type { Product } from '@/lib/product'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Save, Trash2, Upload, X, AlertCircle, Plus, Loader2 } from 'lucide-react'
import { AppImage as Image } from '@/components/AppImage'

async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData()
    formData.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: formData })
    if (!res.ok) throw new Error("Upload failed")
    const data = await res.json()
    return data.url
}

export default function EditProductPage() {
    const params = useParams()
    const router = useRouter()

    const [product, setProduct] = useState<(Product & { _id?: string }) | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const mainImageInputRef = useRef<HTMLInputElement>(null)
    const galleryImageInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`/api/products/${params.id}`)
                const data = await res.json()
                if (data.product) {
                    setProduct({ ...data.product, id: String(data.product._id) })
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchProduct()
    }, [params.id])

    if (isLoading) return <div className='min-h-screen bg-[#F6F4F1] flex items-center justify-center font-bold text-2xl'>Loading Magic...</div>
    if (!product) return <div className='min-h-screen bg-[#F6F4F1] flex items-center justify-center font-bold text-2xl'>Product Not Found</div>

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProduct(prev => prev ? { ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value } : null)
    }

    const handleCategoryChange = (value: string) => {
        setProduct(prev => prev ? { ...prev, category: value } : null)
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            const { _id, ...payload } = product as Product & { _id?: string }
            const res = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Failed to update product')

            router.push('/allproduct')
        } catch (error) {
            console.error('Error updating product:', error)
            alert('Failed to update product')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this product?')) return
        try {
            const res = await fetch(`/api/products/${params.id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to delete product')
            router.push('/allproduct')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('Failed to delete product')
        }
    }

    async function handleMainImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        try {
            const url = await uploadToCloudinary(file)
            setProduct(prev => prev ? { ...prev, image: url } : null)
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload image. Make sure Cloudinary is configured.")
        } finally {
            setIsUploading(false)
            if (mainImageInputRef.current) mainImageInputRef.current.value = ""
        }
    }

    async function handleGalleryImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        try {
            const url = await uploadToCloudinary(file)
            setProduct(prev => {
                if (!prev) return null
                const newImages = [...(prev.images || []), url]
                return { ...prev, images: newImages }
            })
        } catch (error) {
            console.error("Upload error:", error)
            alert("Failed to upload image. Make sure Cloudinary is configured.")
        } finally {
            setIsUploading(false)
            if (galleryImageInputRef.current) galleryImageInputRef.current.value = ""
        }
    }

    const removeImage = (index: number) => {
        setProduct(prev => {
            if (!prev) return null
            const newImages = [...(prev.images || [])]
            newImages.splice(index, 1)
            return { ...prev, images: newImages }
        })
    }

    return (
        <div className='min-h-screen w-full relative bg-[#F6F4F1] flex flex-col'>
            <Headers />

            <main className='flex-grow p-4 pt-24 max-w-5xl mx-auto w-full'>
                <Button
                    variant='ghost'
                    className='mb-6 hover:bg-neutral-200 rounded-xl px-0'
                    onClick={() => router.push('/allproduct')}
                >
                    <ChevronLeft size={20} className='mr-2' /> Back to All Products
                </Button>

                <div className='flex flex-col lg:flex-row gap-8'>
                    {/* Left Column: Images */}
                    <div className='lg:w-1/3 space-y-6'>
                        <Card className='border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden'>
                            <CardHeader>
                                <CardTitle className='text-xl'>Product Images</CardTitle>
                                <CardDescription>Upload and manage product images via Cloudinary</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                {/* Main Image */}
                                <div
                                    className='aspect-square relative rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 group cursor-pointer'
                                    onClick={() => mainImageInputRef.current?.click()}
                                >
                                    {product.image ? (
                                        <>
                                            <Image src={product.image} alt={product.name} fill className='object-cover' />
                                            <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <Button size='sm' className='bg-white text-black hover:bg-neutral-100 rounded-full font-bold shadow-lg'>
                                                    {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                                    Change Main Image
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

                                {/* Gallery */}
                                <div className='grid grid-cols-3 gap-3'>
                                    {(product.images || []).map((img, idx) => (
                                        <div key={idx} className='aspect-square relative rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 group'>
                                            <Image src={img} alt={`Gallery ${idx}`} fill className='object-cover' />
                                            <button
                                                onClick={() => removeImage(idx)}
                                                className='absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        className='aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-amber-500 hover:text-amber-500 transition-all'
                                        onClick={() => galleryImageInputRef.current?.click()}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <Loader2 size={20} className="animate-spin" />
                                        ) : (
                                            <>
                                                <Plus size={20} />
                                                <span className='text-[10px] uppercase font-black'>Add</span>
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

                        <Card className='border-none shadow-xl bg-amber-50/50 rounded-3xl'>
                            <CardContent className='p-6 flex gap-4 text-amber-800'>
                                <AlertCircle className='shrink-0' size={24} />
                                <div className='text-sm space-y-1'>
                                    <p className='font-bold'>Inventory Alert</p>
                                    <p className='text-amber-700/80'>Product stock is low. Consider restocking soon to avoid losing magic.</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Form */}
                    <div className='lg:w-2/3 space-y-6'>
                        <Card className='border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden'>
                            <CardHeader className='border-b border-neutral-100 pb-6'>
                                <CardTitle className='text-2xl'>Edit Details</CardTitle>
                                <CardDescription>Product ID: #{product.id}</CardDescription>
                            </CardHeader>
                            <CardContent className='p-8 space-y-6'>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='space-y-2 col-span-2'>
                                        <Label htmlFor='name' className='font-bold ml-1'>Product Name</Label>
                                        <Input
                                            id='name'
                                            name='name'
                                            value={product.name}
                                            onChange={handleInputChange}
                                            className='h-12 bg-white border-neutral-200 rounded-xl focus:ring-amber-500'
                                        />
                                    </div>

                                    <div className='space-y-2'>
                                        <Label htmlFor='category' className='font-bold ml-1'>Category</Label>
                                        <Select value={product.category} onValueChange={handleCategoryChange}>
                                            <SelectTrigger id='category' className='h-12 bg-white border-neutral-200 rounded-xl'>
                                                <SelectValue placeholder='Select Category' />
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

                                    <div className='space-y-2'>
                                        <Label htmlFor='price' className='font-bold ml-1'>Price (₹)</Label>
                                        <Input
                                            id='price'
                                            name='price'
                                            type='number'
                                            value={product.price}
                                            onChange={handleInputChange}
                                            className='h-12 bg-white border-neutral-200 rounded-xl'
                                        />
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    <Label htmlFor='description' className='font-bold ml-1'>Description</Label>
                                    <Textarea
                                        id='description'
                                        name='description'
                                        value={product.description}
                                        onChange={handleInputChange}
                                        className='min-h-[120px] bg-white border-neutral-200 rounded-2xl resize-none p-4'
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='quantity' className='font-bold ml-1'>Stock Quantity</Label>
                                        <Input
                                            id='quantity'
                                            name='quantity'
                                            type='number'
                                            value={product.quantity}
                                            onChange={handleInputChange}
                                            className='h-12 bg-white border-neutral-200 rounded-xl'
                                        />
                                    </div>
                                    <div className='space-y-2'>
                                        <Label className='font-bold ml-1'>Availability Status</Label>
                                        <div className='h-12 flex items-center gap-4 px-1'>
                                            <button
                                                onClick={() => setProduct(prev => prev ? { ...prev, inStock: !prev.inStock } : null)}
                                                className={`px-6 py-2 rounded-full font-bold transition-all ${product.inStock ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-neutral-200 text-neutral-500'}`}
                                            >
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className='bg-neutral-50  flex-col md:flex-row gap-6 md:gap-0 p-8 flex justify-between items-center border-t border-neutral-200'>
                                <Button 
                                    variant='ghost' 
                                    className='text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl md:w-auto w-full mx-auto bg-red-200 transition-all flex gap-2 font-bold'
                                    onClick={handleDelete}
                                >
                                    <Trash2 size={20} /> Delete Product
                                </Button>
                                <div className='flex gap-4 md:flex-row flex-col md:w-auto w-full'>
                                    <Button variant='outline' className='rounded-xl h-12 px-8 font-bold border-neutral-200' onClick={() => router.push('/allproduct')}>
                                        Cancel
                                    </Button>
                                    <Button
                                        className='bg-black text-white hover:bg-neutral-800 rounded-xl h-12 px-8 font-bold flex gap-2 shadow-lg shadow-black/10'
                                        disabled={isSaving}
                                        onClick={handleSave}
                                    >
                                        {isSaving ? 'Saving...' : <><Save size={20} /> Save Changes</>}
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
