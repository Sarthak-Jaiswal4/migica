"use client"
import gsap from "gsap";
import { ArrowLeft, ChevronRight, Heart, LogOut, ShoppingCart, User, UserCheck, Package, LayoutGrid, Settings2, Images } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetTrigger } from "./ui/sheet";
import { CartSheet } from "./SideCart";
import { useUserStore } from "@/store/store";
import { WishlistSignupNudge } from "@/components/WishlistSignupNudge";
import { CategoryNavDropdown } from "@/components/CategoryNavDropdown";
import { ContactUsOverlay } from "@/components/ContactUsOverlay";
import { SHOP_CATEGORIES, getShopPath } from "@/lib/categories";
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
import Image from "next/image";

export function Headers() {
    const router = useRouter()
    const pathname = usePathname()
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [isDesktopCategoriesOpen, setIsDesktopCategoriesOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [isContactClosing, setIsContactClosing] = useState(false);
    const mobileMainPanelRef = useRef<HTMLDivElement>(null);
    const mobileCategoriesPanelRef = useRef<HTMLDivElement>(null);
    const desktopCategoriesPanelRef = useRef<HTMLDivElement>(null);
    const cartItemCount = useUserStore((state) => state.totalItems());
    const wishlistCount = useUserStore((state) => state.wishlistCount());
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);

    useEffect(() => {
        fetch('/api/auth/me')
            .then(res => res.ok ? res.json() : null)
            .then(data => {
                if (data?.user) {
                    setIsLoggedIn(true);
                    setIsAdmin(data.user.isAdmin === true);
                }
            })
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
        if (!isMobileMenuOpen) return;
        const panel = isMobileCategoriesOpen ? mobileCategoriesPanelRef.current : mobileMainPanelRef.current;
        const items = panel?.querySelectorAll("button");
        if (!items?.length) return;

        gsap.killTweensOf(items);
        gsap.fromTo(items, { y: -16, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.32,
            stagger: 0.055,
            delay: 0.12,
            ease: "power3.out",
        });
    }, [isMobileMenuOpen, isMobileCategoriesOpen]);

    useEffect(() => {
        if (!isDesktopCategoriesOpen) return;
        const items = desktopCategoriesPanelRef.current?.querySelectorAll("a, p");
        if (!items?.length) return;

        gsap.killTweensOf(items);
        gsap.fromTo(items, { y: -12, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.3,
            stagger: 0.035,
            delay: 0.08,
            ease: "power3.out",
        });
    }, [isDesktopCategoriesOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen((open) => !open);
        setIsMobileCategoriesOpen(false);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
        setIsMobileCategoriesOpen(false);
    };

    const openContact = () => {
        closeMobileMenu();
        setIsContactClosing(false);
        setIsContactOpen(true);
    };

    const closeContact = () => {
        setIsContactClosing(true);
        window.setTimeout(() => { setIsContactOpen(false); setIsContactClosing(false); }, 480);
    };

    // Style for header backgrounds based on scroll & pathname
    const desktopHeaderBg = pathname === "/"
        ? (isScrolled ? "bg-card/50 backdrop-blur-md duration-300 ease-in text-black shadow-lg" : "bg-card/30 backdrop-blur-none duration-300 ease-in invert")
        : "bg-card/50 backdrop-blur-md duration-300 ease-in text-black shadow-lg";

    const mobileHeaderBg = pathname === "/"
        ? (isScrolled || isMobileMenuOpen
            ? "bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 duration-300 ease-in text-black shadow-lg"
            : "bg-card/50 backdrop-blur-none duration-300 ease-in invert")
        : "bg-card/80 backdrop-blur-xl supports-[backdrop-filter]:bg-card/70 duration-300 ease-in text-black shadow-lg";

    return (
        <>
            <header className="relative z-50">
                {/* Desktop Header */}
                <div onMouseLeave={() => setIsDesktopCategoriesOpen(false)} className={`hidden md:block w-[92%] lg:w-[85%] min-[1200px]:w-[70%] mx-auto fixed top-4 left-0 right-0 overflow-hidden rounded-2xl border border-border/40 ${desktopHeaderBg}`}>
                    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center px-6 py-2 lg:px-10">
                    <div className="order-2 flex items-center justify-center gap-1 lg:gap-2 min-w-0 overflow-hidden">
                        <span
                            className={`shrink-0 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-base font-medium transition-colors ${pathname === '/' ? 'text-orange-500' : ''}`}
                            onClick={() => router.push("/")}
                        >
                            Home
                        </span>
                        <span
                            className={`shrink-0 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-base font-medium transition-colors ${pathname.startsWith('/shop') ? 'text-orange-500' : ''}`}
                            onClick={() => router.push("/shop/all")}
                        >
                            Shop
                        </span>
                        <span
                            className={`shrink-0 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-base font-medium transition-colors ${pathname === '/about' ? 'text-orange-500' : ''}`}
                            onClick={() => router.push("/about")}
                        >
                            About
                        </span>
                        <span className="shrink-0 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-base font-medium transition-colors" onClick={openContact}>Contact Us</span>
                        <span onMouseEnter={() => setIsDesktopCategoriesOpen(true)} className="shrink-0 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-base font-medium transition-colors flex items-center gap-1">
                            Categories
                            <svg className={`w-3 h-3 opacity-60 transition-transform ${isDesktopCategoriesOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </span>
                        {isLoggedIn && (
                            <span
                                className={`shrink-0 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-base font-medium transition-colors ${pathname === '/my-orders' ? 'text-orange-500' : ''}`}
                                onClick={() => router.push("/my-orders")}
                            >
                                My Orders
                            </span>
                        )}
                        {isAdmin && (
                            <>
                                <span
                                    className="flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-sm font-medium transition-colors"
                                    onClick={() => router.push("/allproduct")}
                                >
                                    <LayoutGrid size={14} />
                                    <span>Products</span>
                                </span>
                                <span
                                    className="flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-sm font-medium transition-colors"
                                    onClick={() => router.push("/orders")}
                                >
                                    <Settings2 size={14} />
                                    <span>Orders</span>
                                </span>
                                <span
                                    className="flex shrink-0 items-center gap-1.5 px-3 py-2 rounded-lg hover:cursor-pointer hover:text-orange-500 text-sm font-medium transition-colors"
                                    onClick={() => router.push("/showcase")}
                                >
                                    <Images size={14} />
                                    <span>Showcase</span>
                                </span>
                            </>
                        )}
                    </div>
                    <div className="order-1 text-3xl font-semibold tracking-tight cursor-pointer font-[style] justify-self-start pr-8 whitespace-nowrap" onClick={() => router.push("/")}>
                        <span>Silver Star</span>
                    </div>
                    <div className="order-3 flex items-center justify-end gap-2 min-[1200px]:gap-3 min-w-0 pl-8">
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
                                <PopoverContent className="w-56 rounded-2xl p-2 bg-card/95 backdrop-blur-md shadow-xl border-border" align="end" alignOffset={-10} sideOffset={8}>
                                    <div className="flex flex-col gap-1">
                                        <button
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-neutral-100 text-sm font-medium text-neutral-700 transition-colors"
                                            onClick={() => router.push('/profile')}
                                        >
                                            <User size={16} className="text-muted-foreground" /> My Profile
                                        </button>
                                        <button
                                            className="flex items-center gap-3 w-full p-2.5 rounded-xl hover:bg-neutral-100 text-sm font-medium text-neutral-700 transition-colors"
                                            onClick={() => router.push('/my-orders')}
                                        >
                                            <Package size={16} className="text-muted-foreground" /> Order History
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
                            className="relative flex h-10 w-10 items-center justify-center rounded-full text-rose-700 transition-all hover:border-rose-300 hover:bg-rose-100 hover:shadow"
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
                                    <ShoppingCart strokeWidth={1.75} className="h-6 w-6 text-foreground" />
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
                    <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${isDesktopCategoriesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div ref={desktopCategoriesPanelRef} className="min-h-0 overflow-hidden"><CategoryNavDropdown /></div>
                    </div>
                </div>

                {/* Mobile/Tablet Header */}
                <div className={`md:hidden flex flex-col w-[90%] mx-auto fixed top-4 left-0 right-0 overflow-hidden rounded-2xl z-50 transition-all duration-300 ${mobileHeaderBg}`}>
                    <div className="flex items-center justify-between py-3 px-6">
                        <div className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => router.push("/")}>
                            <span>Silver Star</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => router.push("/wishlist")}
                                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-rose-700 transition-all hover:bg-rose-100 hover:shadow"
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

                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${isMobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <div className="min-h-0 overflow-hidden">
                            <nav className="h-[min(68vh,540px)] border-t border-border bg-card text-foreground">
                                <div className={`flex h-full w-[200%] transition-transform duration-500 ease-out ${isMobileCategoriesOpen ? "-translate-x-1/2" : "translate-x-0"}`}>
                                    <div ref={mobileMainPanelRef} className="flex h-full w-1/2 flex-col overflow-y-auto px-6 py-2">
                                        <MobileMenuLink label="Home" onClick={() => { closeMobileMenu(); router.push("/"); }} />
                                        <button type="button" onClick={() => setIsMobileCategoriesOpen(true)} className="flex w-full items-center justify-between border-b border-border py-5 text-left text-base font-medium"><span>Shop</span><ChevronRight size={20} /></button>
                                        <MobileMenuLink label="About" onClick={() => { closeMobileMenu(); router.push("/about"); }} />
                                        <MobileMenuLink label="Contact us" onClick={openContact} />
                                        <MobileMenuLink label="Wishlist" onClick={() => { closeMobileMenu(); router.push("/wishlist"); }} />
                                        {isLoggedIn && <MobileMenuLink label="My orders" onClick={() => { closeMobileMenu(); router.push("/my-orders"); }} />}
                                        {isAdmin && <><MobileMenuLink label="Products" onClick={() => { closeMobileMenu(); router.push("/allproduct"); }} /><MobileMenuLink label="Manage orders" onClick={() => { closeMobileMenu(); router.push("/orders"); }} /><MobileMenuLink label="Showcase" onClick={() => { closeMobileMenu(); router.push("/showcase"); }} /></>}
                                        <div className="mt-auto border-t border-border py-5">
                                            {isLoggedIn ? <button type="button" onClick={() => { closeMobileMenu(); router.push("/profile"); }} className="flex items-center gap-3 text-sm font-semibold"><UserCheck size={20} className="text-emerald-700" /> My account</button> : <button type="button" onClick={() => { closeMobileMenu(); router.push("/login"); }} className="flex items-center gap-3 text-sm font-semibold"><User size={20} /> Log in</button>}
                                        </div>
                                    </div>
                                    <div ref={mobileCategoriesPanelRef} className="h-full w-1/2 overflow-y-auto px-6 py-2">
                                        <button type="button" onClick={() => setIsMobileCategoriesOpen(false)} className="flex w-full items-center gap-3 border-b border-border py-5 text-left text-sm font-semibold uppercase tracking-[0.15em]"><ArrowLeft size={19} /> Shop</button>
                                        {SHOP_CATEGORIES.map((category) => <button key={category.slug} type="button" onClick={() => { closeMobileMenu(); router.push(getShopPath(category.slug)); }} className="flex w-full items-center justify-between border-b border-border py-5 text-left text-base font-medium"><span>{category.label}</span><ChevronRight size={20} className="text-muted-foreground" /></button>)}
                                        <button type="button" onClick={() => { closeMobileMenu(); router.push("/shop/all"); }} className="mt-5 w-full rounded-xl bg-[#E7D2C3] px-4 py-3 text-sm font-semibold text-[#3D2314]">View all collections</button>
                                    </div>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>

            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Log Out</AlertDialogTitle>
                        <AlertDialogDescription className="text-muted-foreground">
                            Are you sure you want to log out of your account? You will need to log back in to access your profile and saved details.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel className="rounded-xl border-border">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={async () => {
                                await fetch('/api/auth/logout', { method: 'POST' });
                                setIsLoggedIn(false);
                                setIsAdmin(false);
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
            {isContactOpen && <ContactUsOverlay closing={isContactClosing} onClose={closeContact} />}
        </>
    )
}

function MobileMenuLink({ label, onClick }: { label: string; onClick: () => void }) {
    return <button type="button" onClick={onClick} className="flex w-full items-center justify-between border-b border-border py-5 text-left text-base font-medium"><span>{label}</span><ChevronRight size={20} className="text-muted-foreground" /></button>;
}
