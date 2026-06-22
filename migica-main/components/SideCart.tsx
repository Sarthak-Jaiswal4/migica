"use client"

import { Button } from "@/components/ui/button"
import {
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet"
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react"
import { AppImage as Image } from "@/components/AppImage"
import { Separator } from "@/components/ui/separator"
import { SHIPPING_COST } from "@/lib/constants"
import { useUserStore } from "@/store/store"
import { useRouter } from "next/navigation"

export function CartSheet() {
    const router=useRouter()
    const { items, incrementQuantity, decrementQuantity, removeItem, totalPrice } = useUserStore()

    const subtotal = totalPrice()
    const shipping = items.length > 0 ? SHIPPING_COST : 0
    const total = subtotal + shipping

    return (
        <SheetContent showCloseButton={false} className="flex flex-col w-full sm:max-w-md p-0 gap-0 border-l border-border shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* <div className="p-2 bg-amber-50 rounded-xl">
                        <ShoppingBag className="h-5 w-5 text-amber-600" />
                    </div> */}
                    <div>
                        <SheetTitle className="text-xl font-bold text-foreground">Your Cart</SheetTitle>
                        <SheetDescription className="text-xs font-medium text-muted-foreground">
                            {items.length} {items.length === 1 ? 'item' : 'items'} in your bag
                        </SheetDescription>
                    </div>
                </div>
                <SheetClose className="p-2 text-muted-foreground hover:bg-neutral-100 hover:text-foreground rounded-full transition-colors flex items-center justify-center">
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close cart</span>
                </SheetClose>
            </div>

            {/* Cart Content */}
            <div className="flex-1 overflow-y-auto px-4 scrollbar-thin scrollbar-thumb-neutral-200 scrollbar-track-transparent">
                {items.length > 0 ? (
                    <div className="py-4 space-y-6 bg-gray-200 px-4 rounded-md">
                        {items.map((item) => (
                            <div key={item.id} className="flex gap-4 group">
                                {/* Item Image */}
                                <div className="relative h-24 w-24 rounded-md overflow-hidden bg-neutral-100 border border-border shrink-0">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        className="object-cover transition-transform duration-500"
                                    />
                                </div>

                                {/* Item Details */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <div>
                                            <h3 className="font-semibold text-foreground truncate pr-4">{item.name}</h3>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">{item.category}</p>
                                        </div>
                                        <button
                                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                                            onClick={() => removeItem(item.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <div className="mt-auto flex items-center justify-between">
                                        <div className="flex items-center gap-3 bg-neutral-50 border border-border rounded-lg p-1">
                                            <button
                                                className="p-1 hover:bg-card rounded-lg transition-colors text-neutral-600"
                                                onClick={() => decrementQuantity(item.id)}
                                            >
                                                <Minus className="h-3.5 w-3.5" />
                                            </button>
                                            <span className="text-sm font-bold text-foreground w-4 text-center">{item.quantity}</span>
                                            <button
                                                className="p-1 hover:bg-card rounded-lg transition-colors text-neutral-600"
                                                onClick={() => incrementQuantity(item.id)}
                                            >
                                                <Plus className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                        <span className="font-normal text-md tracking-tight text-foreground">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20 px-10">
                        <div className="p-6 bg-neutral-50 rounded-full mb-4">
                            <ShoppingBag className="h-12 w-12 text-neutral-300" />
                        </div>
                        <h1 className="text-lg leading-6 tracking-wider font-bold text-foreground mb-2 font-[style]">YOUR CART IS EMPTY</h1>
                        <p className="text-sm font-semibold text-muted-foreground mb-8 ">Add some magic to your life with our artisanal scented candles.</p>
                        <Button onClick={()=>router.push('/shop/all')} className="bg-[#F0DDD0] text-[#3D2314] border border-[#DEC4B4] hover:bg-[#E8D0C0] hover:text-[#2C1810] rounded-xl px-8">Start Shopping</Button>
                    </div>
                )}
            </div>

            {/* Footer / Summary */}
            {
                items.length > 0 && (
                    <div className="p-6 border-t border-border bg-neutral-50/50 backdrop-blur-sm">
                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-sm font-medium tracking-wide   text-muted-foreground">
                                <span>Subtotal</span>
                                <span>₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm font-medium tracking-wide   text-muted-foreground">
                                <span>Shipping</span>
                                <span>₹{shipping.toFixed(2)}</span>
                            </div>
                            <Separator className="bg-neutral-200" />
                            <div className="flex justify-between text-lg font-bold tracking-wide text-foreground">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                        <Button 
                            onClick={() => router.push('/checkout')}
                            className="w-full tracking-wide bg-[#F0DDD0] text-[#3D2314] border border-[#DEC4B4] hover:bg-[#E8D0C0] hover:text-[#2C1810] h-12 rounded-md font-semibold shadow-lg shadow-brand/20 transition-all active:scale-[0.98]"
                        >
                            Checkout Now
                        </Button>
                        {/* <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">
                            Secure processing by Stripe
                        </p> */}
                    </div>
                )
            }
        </SheetContent >
    )
}
