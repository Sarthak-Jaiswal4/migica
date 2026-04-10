"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Headers } from '@/components/Headers'
import { Footer } from '@/components/Footer'
import { addProduct, Product } from '@/lib/products'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronLeft, Save, Plus, X } from 'lucide-react'
import Image from 'next/image'

export default function AddProductPage() {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const [product, setProduct] = useState<Product>(() => ({
        id: Date.now(), // Simple ID generation for demo
        name: '',
        category: 'Candles',
        price: 0,
        image: '/1.jpeg', // Default placeholder
        images: ['/1.jpeg'],
        rating: 0,
        reviews: 0,
        inStock: true,
        description: '',
        quantity: 0,
    }))

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setProduct(prev => ({ ...prev, [name]: name === 'price' || name === 'quantity' ? Number(value) : value }))
    }

    const handleCategoryChange = (value: string) => {
        setProduct(prev => ({ ...prev, category: value }))
    }

    const handleSave = () => {
        setIsSaving(true)
        // Simulate API call
        setTimeout(() => {
            addProduct(product)
            router.push('/allproduct')
            setIsSaving(false)
        }, 1000)
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
                                <CardDescription>Upload images for your new product</CardDescription>
                            </CardHeader>
                            <CardContent className='space-y-4'>
                                <div className='aspect-square relative rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-200 group flex items-center justify-center'>
                                    {product.image ? (
                                        <>
                                            <Image src={product.image} alt="Preview" fill className='object-cover' />
                                            <div className='absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                                                <Button size='sm' className='bg-white text-black hover:bg-neutral-100 rounded-full font-bold shadow-lg'>
                                                    Change Image
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className='flex flex-col items-center gap-2 text-neutral-400'>
                                            <Plus size={40} />
                                            <span className='text-xs font-black uppercase'>Upload Main</span>
                                        </div>
                                    )}
                                </div>

                                <div className='grid grid-cols-3 gap-3'>
                                    {(product.images || []).map((img, idx) => (
                                        <div key={idx} className='aspect-square relative rounded-xl bg-neutral-100 overflow-hidden border border-neutral-200 group'>
                                            <Image src={img} alt={`Gallery ${idx}`} fill className='object-cover' />
                                            <button
                                                onClick={() => {
                                                    const newImages = [...(product.images || [])]
                                                    newImages.splice(idx, 1)
                                                    setProduct(prev => ({ ...prev, images: newImages }))
                                                }}
                                                className='absolute top-1 right-1 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                                            >
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                    <button className='aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:border-amber-500 hover:text-amber-500 transition-all'>
                                        <Plus size={20} />
                                        <span className='text-[10px] uppercase font-black'>Add</span>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Form */}
                    <div className='lg:w-2/3 space-y-6'>
                        <Card className='border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden'>
                            <CardHeader className='border-b border-neutral-100 pb-6'>
                                <CardTitle className='text-2xl'>New Product Details</CardTitle>
                                <CardDescription>Fill in the information below to add a product magic</CardDescription>
                            </CardHeader>
                            <CardContent className='p-8 space-y-6'>
                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='space-y-2 col-span-2'>
                                        <Label htmlFor='name' className='font-bold ml-1'>Product Name</Label>
                                        <Input
                                            id='name'
                                            name='name'
                                            placeholder='e.g. Enchanted Forest'
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
                                                <SelectItem value='Candles'>Candles</SelectItem>
                                                <SelectItem value='fashion Accessories'>Fashion Accessories</SelectItem>
                                                <SelectItem value='Handmade Jewelry'>Handmade Jewelry</SelectItem>
                                                <SelectItem value='Custom Gifts'>Custom Gifts</SelectItem>
                                                <SelectItem value='Custom T-Shirts'>Custom T-Shirts</SelectItem>
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
                                        placeholder='Tell the story of this product...'
                                        value={product.description}
                                        onChange={handleInputChange}
                                        className='min-h-[120px] bg-white border-neutral-200 rounded-2xl resize-none p-4'
                                    />
                                </div>

                                <div className='grid grid-cols-2 gap-6'>
                                    <div className='space-y-2'>
                                        <Label htmlFor='quantity' className='font-bold ml-1'>Initial Stock</Label>
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
                                        <Label className='font-bold ml-1'>Initial Availability</Label>
                                        <div className='h-12 flex items-center gap-4 px-1'>
                                            <button
                                                onClick={() => setProduct(prev => ({ ...prev, inStock: !prev.inStock }))}
                                                className={`px-6 py-2 rounded-full font-bold transition-all ${product.inStock ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'bg-neutral-200 text-neutral-500'}`}
                                            >
                                                {product.inStock ? 'In Stock' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className='bg-neutral-50 p-8 flex justify-end gap-4 border-t border-neutral-200'>
                                <Button variant='outline' className='rounded-xl h-12 px-8 font-bold border-neutral-200' onClick={() => router.push('/allproduct')}>
                                    Cancel
                                </Button>
                                <Button
                                    className='bg-black text-white hover:bg-neutral-800 rounded-xl h-12 px-8 font-bold flex gap-2 shadow-lg shadow-black/10'
                                    disabled={isSaving || !product.name}
                                    onClick={handleSave}
                                >
                                    {isSaving ? 'Adding...' : <><Save size={20} /> Add Product</>}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
