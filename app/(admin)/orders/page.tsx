"use client";

import { useEffect, useState } from "react";
import { Headers } from "@/components/Headers";
import { Footer } from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Package, Clock, CheckCircle } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/admin/orders')
            .then(res => res.json())
            .then(data => {
                if (data.orders) setOrders(data.orders);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const updateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            const res = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                const updated = await res.json();
                setOrders(prev => prev.map(o => o._id === orderId ? updated.order : o));
            }
        } finally {
            setUpdatingId(null);
        }
    };

    const pendingCount = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const deliveredCount = orders.filter(o => o.status === 'delivered').length;

    return (
        <div className="min-h-screen bg-[#F6F4F1] flex flex-col">
            <Headers />
            <main className="flex-grow pt-28 pb-16 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight text-neutral-900 mb-8">Order Management</h1>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
                            <div className="p-4 bg-blue-50 text-blue-600 rounded-xl"><Package size={24} /></div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Total Orders</p>
                                <p className="text-3xl font-bold text-neutral-900">{orders.length}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
                            <div className="p-4 bg-amber-50 text-amber-600 rounded-xl"><Clock size={24} /></div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Pending / Processing</p>
                                <p className="text-3xl font-bold text-neutral-900">{pendingCount}</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-4">
                            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle size={24} /></div>
                            <div>
                                <p className="text-sm text-neutral-500 font-medium">Delivered</p>
                                <p className="text-3xl font-bold text-neutral-900">{deliveredCount}</p>
                            </div>
                        </div>
                    </div>

                    {/* Orders Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-neutral-50 text-neutral-500 uppercase text-xs font-semibold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Order ID & Date</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Items</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center">
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto text-neutral-400" />
                                            </td>
                                        </tr>
                                    ) : orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-neutral-500">
                                                No orders found.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map((order) => (
                                            <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-mono text-xs text-neutral-900 bg-neutral-100 px-2 py-1 rounded inline-block mb-1">
                                                        {order._id.slice(-8).toUpperCase()}
                                                    </div>
                                                    <div className="text-neutral-500 text-xs">
                                                        {new Date(order.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-neutral-900">{order.shippingAddress.name}</div>
                                                    <div className="text-neutral-500 text-xs truncate max-w-[150px]">{order.shippingAddress.city}, {order.shippingAddress.country}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-neutral-900">{order.items?.length || 0} items</div>
                                                    <div className="text-neutral-500 text-xs truncate max-w-[200px]">
                                                        {order.items?.map((i: any) => i.name).join(', ')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-neutral-900">
                                                    ₹{order.totalAmount?.toFixed(2) || '0.00'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Select
                                                        disabled={updatingId === order._id}
                                                        value={order.status}
                                                        onValueChange={(val) => updateStatus(order._id, val)}
                                                    >
                                                        <SelectTrigger className="w-[130px] h-9 text-xs ml-auto">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="pending">Pending</SelectItem>
                                                            <SelectItem value="processing">Processing</SelectItem>
                                                            <SelectItem value="shipped">Shipped</SelectItem>
                                                            <SelectItem value="delivered">Delivered</SelectItem>
                                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
