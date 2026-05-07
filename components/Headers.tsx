"use client"
import { AppImage as Image } from "@/components/AppImage";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import gsap from "gsap";
import { Heart, LogOut, Search, ShoppingCart, User, UserCheck, Package } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { Button } from "./ui/button";
import { CartSheet } from "./SideCart";
import { useUserStore } from "@/store/store";
import { WishlistSignupNudge } from "@/components/WishlistSignupNudge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function Headers() {
    const router = useRouter()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mobileMenuItemsRef = useRef<(HTMLDivElement | null)[]>([]);
    const cartItemCount = useUserStore((state) => state.totalItems());
    const wishlistCount = useUserStore((state) => state.wishlistCount());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => { if (res.ok) setIsLoggedIn(true) })
            .catch(() => { })
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            gsap.fromTo(
                mobileMenuItemsRef.current.filter(Boolean),
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power3.out" }
            );
        }
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    // Style for header backgrounds based on scroll & pathname
    const desktopHeaderBg = pathname === "/"
        ? (isScrolled ? "bg-white/50 backdrop-blur-md duration-300 ease-in text-black shadow-lg" : "bg-white/30 backdrop-blur-none duration-300 ease-in invert")
        : "bg-white/50 backdrop-blur-md duration-300 ease-in text-black shadow-lg";

    const mobileHeaderBg = pathname === "/"
        ? (isScrolled || isMobileMenuOpen
            ? "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 duration-300 ease-in text-black shadow-lg"
            : "bg-white/50 backdrop-blur-none duration-300 ease-in invert")
        : "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 duration-300 ease-in text-black shadow-lg";

    return (
        <>
            <header className="relative z-50">
                {/* Desktop Header */}
                <div className={`hidden md:flex items-center justify-between w-[70%] mx-auto py-1 fixed top-4 left-0 right-0 rounded-2xl px-8 ${desktopHeaderBg}`}>
                    <div className="flex items-center gap-5">
                        <h1 className="p-2 rounded-md hover:cursor-pointer hover:text-orange-500" onClick={() => router.push("/")}>Home</h1>
                        <HoverCard openDelay={20} closeDelay={200}>
                            <HoverCardTrigger asChild>
                                <h1 className="p-2 rounded-md hover:cursor-pointer hover:text-orange-500">Categories</h1>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-full h-full mt-2" align="center">
                                <CategoriesDropDown />
                            </HoverCardContent>
                        </HoverCard>
                        <h1 className="p-2 rounded-md hover:cursor-pointer hover:text-orange-500">Collections</h1>
                    </div>
                    <div className="text-3xl font-semibold absolute tracking-tight left-1/2 -translate-x-1/2 cursor-pointer font-[style]" onClick={() => router.push("/")}>
                        <h1>Silver Star</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        {!isLoggedIn && (
                            <User onClick={() => router.push("/login")} className="hover:cursor-pointer" strokeWidth={1.75} />
                        )}
                        {isLoggedIn && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="p-2 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer text-emerald-600">
                                        <UserCheck className="h-5 w-5" strokeWidth={1.75} />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 rounded-2xl p-2 bg-white/95 backdrop-blur-md shadow-xl border-neutral-100" align="end" alignOffset={-10} sideOffset={8}>
                                    <div className="flex flex-col gap-1">
                                        <button 
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-neutral-100 text-sm font-medium text-neutral-700 transition-colors"
                                            onClick={() => router.push('/profile')}
                                        >
                                            <User size={16} className="text-neutral-500" /> My Profile
                                        </button>
                                        <button 
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-neutral-100 text-sm font-medium text-neutral-700 transition-colors"
                                            onClick={() => router.push('/my-orders')}
                                        >
                                            <Package size={16} className="text-neutral-500" /> Order History
                                        </button>
                                        <div className="h-[1px] bg-neutral-100 my-1 w-full" />
                                        <button 
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                                            onClick={() => setShowLogoutDialog(true)}
                                        >
                                            <LogOut size={16} /> Log Out
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                        <button
                            type="button"
                            onClick={() => router.push("/wishlist")}
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-rose-700 shadow-sm transition-all hover:border-rose-300 hover:bg-rose-100 hover:shadow"
                            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                        >
                            <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "hover:fill-rose-600 hover:text-rose-600" : ""}`} strokeWidth={2} />
                            {wishlistCount > 0 && (
                                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white shadow-sm">
                                    {wishlistCount > 99 ? "99+" : wishlistCount}
                                </span>
                            )}
                        </button>
                        <Sheet>
                            <SheetTrigger asChild>
                                <div className="relative group hover:cursor-pointer p-2 rounded-full hover:bg-neutral-100 transition-colors">
                                    <ShoppingCart strokeWidth={1.75} className="h-6 w-6 text-neutral-800" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </div>
                            </SheetTrigger>
                            <CartSheet />
                        </Sheet>
                    </div>
                </div>

                {/* Mobile/Tablet Header */}
                <div className={`md:hidden flex flex-col w-[90%] mx-auto fixed top-4 left-0 right-0 rounded-2xl z-50 transition-all duration-300 ${mobileHeaderBg}`}>
                    <div className="flex items-center justify-between py-3 px-6">
                        <div className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
                            <h1>magica</h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => router.push("/wishlist")}
                                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-rose-700 shadow-sm transition-all hover:bg-rose-100 hover:shadow"
                                aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ""}`}
                            >
                                <Heart className={`h-5 w-5 ${wishlistCount > 0 ? "hover:fill-rose-600 hover:text-rose-600" : ""}`} strokeWidth={2} />
                                {wishlistCount > 0 && (
                                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white">
                                        {wishlistCount > 99 ? "99+" : wishlistCount}
                                    </span>
                                )}
                            </button>
                            <Sheet>
                                <SheetTrigger asChild>
                                    <div className="relative">
                                        <ShoppingCart strokeWidth={1.75} className="h-6 w-6 cursor-pointer" />
                                        {cartItemCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                                {cartItemCount}
                                            </span>
                                        )}
                                    </div>
                                </SheetTrigger>
                                <CartSheet />
                            </Sheet>

                            {/* Hamburger to Cross icon */}
                            <div className="w-6 h-5 relative cursor-pointer z-50 flex items-center justify-center p-2 mr-1" onClick={toggleMobileMenu}>
                                <span className={`absolute left-0 w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"}`} />
                                <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "opacity-0" : "opacity-100"}`} />
                                <span className={`absolute left-0 w-6 h-[2px] bg-current transition-all duration-300 ${isMobileMenuOpen ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"}`} />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu Options */}
                    <div
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}
                    >
                        <div className="flex flex-col gap-8 px-6 pb-12 pt-6 text-4xl tracking-tight font-semibold">
                            {["Home", "Shop", "Wishlist", "Categories", "Collections", ...(isLoggedIn ? ["Logout"] : ["Login"])].map((item, i) => (
                                <div
                                    key={item}
                                    ref={(el) => { mobileMenuItemsRef.current[i] = el; }}
                                    className="cursor-pointer hover:text-orange-500 will-change-transform"
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        if (item === "Home") router.push("/");
                                        else if (item === "Shop") router.push("/shop/all");
                                        else if (item === "Wishlist") router.push("/wishlist");
                                        else if (item === "Login") router.push("/login");
                                        else if (item === "Logout") {
                                            setShowLogoutDialog(true);
                                        }
                                    }}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Log Out</AlertDialogTitle>
                        <AlertDialogDescription className="text-neutral-500">
                            Are you sure you want to log out of your account? You will need to log back in to access your profile and saved details.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-xl border-neutral-200">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await fetch('/api/auth/logout', { method: 'POST' });
                                setIsLoggedIn(false);
                                setShowLogoutDialog(false);
                                router.push('/');
                            }}
                            className="rounded-xl bg-red-200 font-medium text-red-600 hover:bg-red-300"
                        >
                            Log Out
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <WishlistSignupNudge />
        </>
    )
}

const Categories = [
    {
        img: "/1.jpeg",
        name: "Scarves",
        description: "Elegant scarves crafted from the finest materials for style and comfort."
    },
    {
        img: "/2.jpeg",
        name: "Candles",
        description: "Artisanal scented candles to bring warmth and fragrance to your home."
    },
    {
        img: "/3.jpeg",
        name: "Jewelry",
        description: "Timeless jewelry pieces that capture the essence of sophistication."
    },
    {
        img: "/4.jpeg",
        name: "Gift",
        description: "Curated boxes and bundles for every celebration."
    },
    {
        img: "/5.jpeg",
        name: "T-Shirt",
        description: "Soft cotton tees with thoughtful details and prints."
    }
]

function CategoriesDropDown() {
    const container = useRef<HTMLDivElement>(null);
    const router = useRouter()

    return (
        <div className="flex flex-wrap w-[560px] mx-auto gap-2 bg-white rounded-lg p-2 hover:cursor-pointer" ref={container}>
            {Categories.map((category, index) => (
                <div key={index} className="flex flex-col px-2" onClick={() => router.push(`/shop/${category.name}`)}>
                    <Image src={category.img} alt={category.name} width={160} height={144} className="w-40 h-36 rounded-lg bg-orange-500 object-cover" />
                    <h1 className="text-lg font-medium pt-2 w-[60px]">{category.name}</h1>
                    <h4 className="text-sm text-gray-500 w-[120px]">{category.description}</h4>
                </div>
            ))}
        </div>
    )
}