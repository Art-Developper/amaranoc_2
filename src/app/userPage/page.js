"use client"

import React, { useState, useEffect } from "react";
import {
    User, Globe, Search, Facebook, Instagram, Phone, Mail,
    MapPin, Pencil, Trash2, LogOut, X, Menu, Calendar, Users
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function UserPage() {
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [activeModal, setActiveModal] = useState(null);
    const [formData, setFormData] = useState({ name: "", phoneNumber: "" });

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || "");
    }, [searchParams]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = () => {
        fetch("http://localhost:5000/api/profile", { credentials: "include" })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setUser(data);
                setFormData({ name: data.name, phoneNumber: data.phoneNumber || "" });
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                setLoading(false);
                router.push("/login");
            });
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            router.push(`/?search=${searchQuery}`);
        }
    };

    const handleLogout = async () => {
        await fetch("http://localhost:5000/api/logout", {
            method: "POST",
            credentials: "include"
        });
        setActiveModal(null);
        window.location.href = "/login";
    };

    const handleDelete = async () => {
        const res = await fetch("http://localhost:5000/api/user/delete", {
            method: "DELETE",
            credentials: "include"
        });
        if (res.ok) {
            setActiveModal(null);
            window.location.href = "/login";
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            credentials: "include"
        });
        if (res.ok) {
            fetchProfile();
            setActiveModal(null);
        }
    };

    const linkClass = (path) =>
        `relative pb-1 transition-all ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center font-black text-gray-300 uppercase tracking-widest animate-pulse">Բեռնվում է...</div>;
    }

    return (
        <>
            <header className="relative bg-white border-b border-gray-100 z-[60]">
                <div className="flex justify-between items-center max-w-[1440px] mx-auto py-7 px-4">
                    <Link href="/"><img src="/logo.svg" alt="Logo" width="170" /></Link>

                    <nav className="hidden min-[1321px]:flex items-center gap-10 font-medium text-sm text-gray-700 uppercase tracking-widest">
                        <Link className={linkClass("/")} href="/">Գլխավոր</Link>
                        <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
                        <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
                        <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
                    </nav>

                    <div className="flex gap-5 items-center">
                        <Globe className="w-5 h-5 cursor-pointer text-gray-700 hover:text-orange-500 transition" />

                        <div className="hidden min-[1321px]:flex items-center">
                            {user ? (
                                <Link href="/userPage" className="text-[14px] font-black text-orange-500 border-b-2 border-orange-500 pb-1">{user.name}</Link>
                            ) : (
                                <Link href="/login"><User className="w-5 h-5 cursor-pointer text-gray-700 hover:text-orange-500 transition" /></Link>
                            )}
                        </div>

                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Որոնում"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-3xl text-sm w-48 lg:w-64 focus:outline-none focus:border-orange-400 transition"
                            />
                            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>

                        <button className="min-[1321px]:hidden p-2 text-gray-700 hover:text-orange-500 transition-all" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={30} />
                        </button>
                    </div>
                </div>

                <div
                    className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
                    onClick={() => setIsMenuOpen(false)}
                />
                <div className={`fixed top-0 right-0 h-full w-[320px] sm:w-[400px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ease-in-out ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <button className="absolute top-8 right-8 w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-black hover:border-black transition-all" onClick={() => setIsMenuOpen(false)}>
                        <X size={24} />
                    </button>
                    <nav className="flex flex-col gap-10 mt-24">
                        <Link href="/" className="text-xl font-black text-gray-900 uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
                        <Link href="/sales" className="text-xl font-black text-gray-800 uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
                        <Link href="/service" className="text-xl font-black text-gray-800 uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Ծառայություններ</Link>
                        <Link href="/about_us" className="text-xl font-black text-gray-800 uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>Մեր մասին</Link>
                        <hr className="border-gray-100 my-2" />
                        {user ? (
                            <div className="flex flex-col gap-6">
                                <Link href="/userPage" className="text-xl font-black text-orange-500 uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>{user.name}</Link>
                                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-lg font-bold text-red-500 text-left hover:underline">ԴՈՒՐՍ ԳԱԼ</button>
                            </div>
                        ) : (
                            <Link href="/login" className="text-xl font-black text-gray-800 uppercase italic tracking-tighter" onClick={() => setIsMenuOpen(false)}>ՄՈՒՏՔ</Link>
                        )}
                    </nav>
                </div>
            </header>

            <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">

                <div className="bg-white border border-gray-100 shadow-sm rounded-[40px] p-8 flex flex-wrap items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-[#689f38] rounded-full flex items-center justify-center text-white text-3xl font-black uppercase shadow-lg border-4 border-white">
                                {user?.name?.charAt(0)}
                            </div>
                            <button onClick={() => setActiveModal('edit')} className="absolute -bottom-1 -right-1 bg-white border border-gray-200 p-2 rounded-full shadow-md hover:bg-orange-50 transition group">
                                <Pencil size={14} className="text-gray-400 group-hover:text-orange-500" />
                            </button>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Անուն Ազգանուն</span>
                            <span className="text-lg font-black text-gray-700 tracking-tight">{user?.name}</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Հեռախոսահամար</span>
                        <span className="text-lg font-bold text-gray-600 tracking-tight">{user?.phoneNumber || "Նշված չէ"}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em]">Էլ. հասցե</span>
                        <span className="text-lg font-bold text-gray-600 tracking-tight">{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setActiveModal('edit')} className="p-3.5 border border-gray-200 rounded-full hover:bg-gray-50 transition text-gray-400 hover:text-orange-500"><Pencil size={20} /></button>
                        <button onClick={() => setActiveModal('delete')} className="px-8 py-3 border border-gray-200 rounded-full text-gray-800 font-black text-xs uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition">Ջնջել պրոֆիլը</button>
                        <button onClick={() => setActiveModal('logout')} className="px-8 py-3 bg-[#1d2331] text-white rounded-full font-black text-xs uppercase tracking-widest hover:bg-black transition shadow-xl shadow-gray-200 flex items-center gap-3">
                            <LogOut size={16} /> Ելք
                        </button>
                    </div>
                </div>

                <div className="mt-20">
                    <div className="flex items-center gap-6 mb-12">
                        <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter italic border-l-8 border-orange-500 pl-6">Իմ Ամրագրումները</h3>
                        <div className="h-px bg-gray-100 flex-grow"></div>
                    </div>

                    {user?.bookings?.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {user.bookings.map((booking) => (
                                <div key={booking.id} className="bg-white border border-gray-100 rounded-[45px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 group">
                                    <div className="relative h-64 w-full overflow-hidden">
                                        <img
                                            src={booking.houseDetails?.image}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                            alt="House"
                                        />
                                        <div className="absolute top-6 left-6 bg-[#ff9d43] text-white px-5 py-2 rounded-[20px] text-[10px] font-black shadow-xl uppercase tracking-widest">
                                            ԱՄՐԱԳՐՎԱԾ Է
                                        </div>
                                    </div>
                                    <div className="p-10">
                                        <h4 className="text-2xl font-black text-gray-800 mb-6 tracking-tighter uppercase">{booking.houseDetails?.location}</h4>
                                        <div className="flex flex-col gap-4 text-[15px] text-gray-500 mb-8 font-bold">
                                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                                                <Calendar className="text-orange-500" size={22} />
                                                <span>{new Date(booking.startDate).toLocaleDateString('hy-AM')} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString('hy-AM') : '1 օր'}</span>
                                            </div>
                                            <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                                                <Users className="text-orange-500" size={22} />
                                                <span>{booking.guests.adults + booking.guests.kids} անձ</span>
                                            </div>
                                        </div>
                                        <div className="border-t border-dashed border-gray-200 pt-8 flex justify-between items-center">
                                            <span className="text-gray-400 font-black uppercase text-[10px] tracking-[0.2em]">Ընդհանուր արժեք</span>
                                            <span className="text-2xl font-black text-[#1d2331] tracking-tighter">{booking.totalPrice?.toLocaleString()} ֏</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[50px] p-24 text-center flex flex-col items-center gap-8">
                            <div className="bg-white p-8 rounded-full shadow-lg text-gray-100">
                                <Search size={64} />
                            </div>
                            <p className="text-gray-400 font-black text-2xl italic uppercase tracking-tighter">Դուք դեռևս չունեք ամրագրված տներ</p>
                            <Link href="/" className="bg-[#ff9d43] text-white px-12 py-4 rounded-full font-black uppercase tracking-widest text-sm hover:bg-orange-500 transition-all shadow-xl shadow-orange-100">Բացահայտել տները</Link>
                        </div>
                    )}
                </div>
            </div>

            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
                    <div className="bg-white rounded-[45px] p-12 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-300 border border-gray-100">
                        <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 text-gray-300 hover:text-black transition-colors"><X size={32} /></button>

                        {activeModal === 'edit' && (
                            <form onSubmit={handleUpdate} className="flex flex-col gap-8">
                                <h3 className="text-3xl font-black text-center mb-2 text-gray-900 uppercase tracking-tighter italic">Խմբագրել</h3>
                                <div className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Անուն Ազգանուն</label>
                                        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full border-2 border-gray-100 rounded-[25px] p-5 outline-none focus:border-orange-400 font-bold text-lg transition-all" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Հեռախոսահամար</label>
                                        <input type="text" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full border-2 border-gray-100 rounded-[25px] p-5 outline-none focus:border-orange-400 font-bold text-lg transition-all" />
                                    </div>
                                </div>
                                <button type="submit" className="bg-[#ff9d43] text-white py-5 rounded-full font-black text-xl hover:bg-orange-500 shadow-2xl shadow-orange-100 transition-all uppercase tracking-widest">ՊԱՀՊԱՆԵԼ</button>
                            </form>
                        )}

                        {activeModal === 'logout' && (
                            <div className="text-center">
                                <div className="bg-orange-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <LogOut size={48} className="text-orange-500" />
                                </div>
                                <h3 className="text-3xl font-black mb-10 text-gray-800 uppercase tracking-tighter italic">Դուրս գալ հաշվի՞ց</h3>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-5 border-2 border-gray-100 rounded-[25px] font-black text-gray-400 hover:bg-gray-50 transition uppercase tracking-widest text-xs">ՈՉ</button>
                                    <button onClick={handleLogout} className="flex-1 py-5 bg-[#1d2331] text-white rounded-[25px] font-black shadow-2xl shadow-gray-200 hover:bg-black transition uppercase tracking-widest text-xs">ԱՅՈ</button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'delete' && (
                            <div className="text-center">
                                <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Trash2 size={48} className="text-red-500" />
                                </div>
                                <h3 className="text-3xl font-black mb-4 text-gray-800 uppercase tracking-tighter italic">Ջնջե՞լ պրոֆիլը</h3>
                                <p className="text-gray-400 font-bold text-sm mb-10 leading-relaxed">Այս գործողությունը անդառնալի է և ձեր բոլոր տվյալները կջնջվեն:</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-5 border-2 border-gray-100 rounded-[25px] font-black text-gray-400 hover:bg-gray-50 transition uppercase tracking-widest text-xs">ՈՉ</button>
                                    <button onClick={handleDelete} className="flex-1 py-5 bg-red-600 text-white rounded-[25px] font-black shadow-2xl shadow-red-100 hover:bg-red-700 transition uppercase tracking-widest text-xs">ՋՆՋԵԼ</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="relative text-white py-20 mt-20 overflow-hidden min-h-[400px]">
                <div className="absolute inset-0 z-0">
                    <Image src="/image/background/background.jpg" alt="Background" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto border border-gray-700 rounded-3xl p-10 text-center backdrop-blur-sm">
                    <div className="flex justify-center items-center gap-8 mb-10">
                        <div className="w-10 md:w-40 h-px bg-white/30"></div>
                        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-wider">Տեղադրել հայտարարություն</h2>
                        <div className="w-10 md:w-40 h-px bg-white/30"></div>
                    </div>
                    <p className="mb-10 text-gray-300">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <input type="text" placeholder="Անուն Ազգանուն" className="bg-white/10 border border-gray-500 rounded-2xl px-6 py-3 w-full md:w-64 outline-none focus:border-orange-400 text-white" />
                        <input type="tel" placeholder="Հեռախոսահամար" className="bg-white/10 border border-gray-500 rounded-2xl px-6 py-3 w-full md:w-64 outline-none focus:border-orange-400 text-white" />
                        <input type="email" placeholder="Էլ․ Հասցե" className="bg-white/10 border border-gray-500 rounded-2xl px-6 py-3 w-full md:w-64 outline-none focus:border-orange-400 text-white" />
                        <button className="bg-orange-400 text-black px-10 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all">Ուղարկել</button>
                    </div>
                </div>
            </div>

            <footer className="bg-[#101623] text-white pt-10">
                <h2 className="text-center text-3xl mb-10 tracking-widest font-light uppercase">Կոնտակտներ</h2>
                <div className="flex flex-wrap justify-center gap-10 px-4 mb-10">
                    <div className="flex items-center gap-2"><Phone size={20} className="text-orange-500" /> <span className="text-sm">041-611-611 / 044-611-611</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><Mail size={20} className="text-orange-500" /> <span className="text-sm">amaranoc.info@gmail.com</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><Instagram size={20} className="text-orange-500" /> <span className="text-sm font-medium">AMARANOC.AM</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><Facebook size={20} className="text-orange-500" /> <span className="text-sm font-medium">AMARANOC.AM</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><MapPin size={20} className="text-orange-500" /> <span className="text-sm">Թումանյան 5</span></div>
                </div>
                <div className="text-center text-gray-500 text-xs pb-10 space-y-2">
                    <p className="underline cursor-pointer hover:text-orange-500 transition">Գաղտնիության քաղաքականություն</p>
                    <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
                </div>
                <div className="w-full relative h-40">
                    <Image src="/image/footer-background.webp" alt="footer" fill className="object-cover opacity-40" />
                </div>
            </footer>
        </>
    );
}