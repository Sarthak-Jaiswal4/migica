"use client";

import { useEffect, useState } from "react";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { Loader2, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function MyOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/my-orders')
            .then(res => res.json())
            .then(data => {
                if (data.orders) setOrders(data.orders);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-amber-100 text-amber-700 hover:bg-amber-100';
            case 'processing': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
            case 'shipped': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
            case 'delivered': return 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100';
            case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-100';
            default: return 'bg-neutral-100 text-neutral-700 hover:bg-neutral-100';
        }
    };

    return (
        <div className="min-h-screen bg-[#F6F4F1] flex flex-col">
            <Headers />
            <main className="flex-grow pt-28 pb-16 px-4 sm:px-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 mb-2">My Orders</h1>
                    <p className="text-neutral-500 text-sm font-medium tracking-wide mb-8">View and track your previous purchases</p>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-100 shadow-sm">
                            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
                                <Package size={32} />
                            </div>
                            <h3 className="text-3xl font-bold text-neutral-900 mb-2 font-[style]">No orders yet</h3>
                            <p className="text-neutral-500 text-sm tracking-wide font-medium">When you purchase something, it will appear here.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {orders.map((order) => (
                                <div key={order._id} className="bg-white rounded-3xl p-6 md:p-8 border border-neutral-100 shadow-sm transition-all hover:shadow-md">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-100">
                                        <div>
                                            <p className="text-sm font-medium text-neutral-500 mb-1">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <p className="text-sm text-neutral-400">
                                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge className={`rounded-full px-4 py-1 font-semibold capitalize ${getStatusColor(order.status)} border-none shadow-none`}>
                                                {order.status}
                                            </Badge>
                                            <div className="text-right">
                                                <p className="text-sm text-neutral-500 mb-1">Total</p>
                                                <p className="text-xl font-bold text-neutral-900">₹{order.totalAmount?.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col gap-4">
                                        {order.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-neutral-100 rounded-lg flex-shrink-0 border border-neutral-200 overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900">{item.name}</p>
                                                        <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                                <p className="font-medium text-neutral-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
