"use client"

import React from 'react'
import { Headers } from '@/components/Headers'
import { Footer } from '@/components/Footer'
import { products } from '@/lib/products'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Pencil, Plus, Trash2 } from 'lucide-react'

export default function AllProductsPage() {
    const router = useRouter()

    return (
        <div className='min-h-screen w-full relative bg-[#F6F4F1] flex flex-col'>
            <Headers />

            <main className='flex-grow p-4 pt-24 max-w-7xl mx-auto w-full'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h1 className='text-3xl font-black tracking-tight text-neutral-900'>Product Management</h1>
                        <p className='text-neutral-500'>View and manage your entire product catalog</p>
                    </div>
                    <Button
                        className='bg-black text-white hover:bg-neutral-800 rounded-xl px-6 h-12 font-bold transition-all shadow-lg shadow-black/10 flex gap-2'
                        onClick={() => router.push('/allproduct/add')}
                    >
                        <Plus size={20} /> Add New Product
                    </Button>
                </div>

                <Card className='border-none shadow-xl bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden'>
                    <CardHeader className='border-b border-neutral-100 pb-6'>
                        <CardTitle>All Products ({products.length})</CardTitle>
                        <CardDescription>Click on any product to edit its details</CardDescription>
                    </CardHeader>
                    <CardContent className='p-0'>
                        <div className='overflow-x-auto'>
                            <table className='w-full text-left border-collapse'>
                                <thead>
                                    <tr className='bg-neutral-50/50 text-neutral-500 text-xs font-bold uppercase tracking-wider'>
                                        <th className='px-6 py-4'>Product</th>
                                        <th className='px-6 py-4'>Category</th>
                                        <th className='px-6 py-4'>Price</th>
                                        <th className='px-6 py-4'>Stock</th>
                                        <th className='px-6 py-4'>Status</th>
                                        <th className='px-6 py-4 text-right'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-neutral-100'>
                                    {products.map((product) => (
                                        <tr
                                            key={product.id}
                                            className='hover:bg-neutral-50/80 transition-colors cursor-pointer group'
                                            onClick={() => router.push(`/allproduct/${product.id}`)}
                                        >
                                            <td className='px-6 py-4'>
                                                <div className='flex items-center gap-4'>
                                                    <div className='h-12 w-12 rounded-lg bg-neutral-100 overflow-hidden relative border border-neutral-200'>
                                                        <Image
                                                            src={product.image}
                                                            alt={product.name}
                                                            fill
                                                            className='object-cover'
                                                        />
                                                    </div>
                                                    <span className='font-bold text-neutral-900 group-hover:text-amber-600 transition-colors'>
                                                        {product.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4'>
                                                <Badge variant='outline' className='rounded-full px-3 bg-neutral-100/50 text-neutral-600 border-neutral-200'>
                                                    {product.category}
                                                </Badge>
                                            </td>
                                            <td className='px-6 py-4 font-bold text-neutral-900'>
                                                ₹{product.price}
                                            </td>
                                            <td className='px-6 py-4 text-neutral-600'>
                                                {product.quantity} units
                                            </td>
                                            <td className='px-6 py-4'>
                                                {product.inStock ? (
                                                    <Badge className='bg-emerald-50 text-emerald-600 border-emerald-100 rounded-full hover:bg-emerald-50'>
                                                        In Stock
                                                    </Badge>
                                                ) : (
                                                    <Badge variant='destructive' className='rounded-full'>
                                                        Out of Stock
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className='px-6 py-4 text-right'>
                                                <div className='flex items-center justify-end gap-2'>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        className='h-8 w-8 rounded-full hover:bg-amber-50 hover:text-amber-600'
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(`/allproduct/${product.id}`)
                                                        }}
                                                    >
                                                        <Pencil size={16} />
                                                    </Button>
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        className='h-8 w-8 rounded-full hover:bg-red-50 hover:text-red-600'
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            // Delete logic
                                                        }}
                                                    >
                                                        <Trash2 size={16} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </main>

            <Footer />
        </div>
    )
}
