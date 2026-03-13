"use client"

import React, { useState, useEffect } from "react";
import {
    User, Globe, Search, Facebook, Instagram, Phone, Mail,
    MapPin, Pencil, Trash2, LogOut, X // Ավելացվել են նոր իկոնկաներ
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";

export default function UserPage() {
    const pathName = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const [activeModal, setActiveModal] = useState(null);
    const [formData, setFormData] = useState({ name: "", phoneNumber: "" });

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

    const handleLogout = async () => {
        await fetch("http://localhost:5000/api/logout", {
            method: "POST",
            credentials: "include"
        });
        setActiveModal(null);
        router.push("/login");
    };

    const handleDelete = async () => {
        const res = await fetch("http://localhost:5000/api/user/delete", {
            method: "DELETE",
            credentials: "include"
        });
        if (res.ok) {
            setActiveModal(null);
            router.push("/login");
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
        `relative pb-1 transition-all ${pathName === path ? "after:w-full" : "after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Բեռնվում է...</div>;
    }

    return (
        <>
            <div className="flex justify-between items-center max-w-[1440px] mx-auto py-7 px-4">
                <Link href="/"><img src="/logo.svg" alt="Logo" width="170" /></Link>
                <div className="flex items-center gap-10 font-medium text-sm text-gray-700">
                    <Link className={linkClass("/")} href="/">Գլխավոր</Link>
                    <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
                    <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
                    <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
                </div>
                <div className="flex gap-5 items-center">
                    <Globe className="w-5 h-5 cursor-pointer" />
                    {user ? (
                        <Link href="/userPage" className="text-[14px] font-bold text-orange-500 border-b border-orange-500">{user.name}</Link>
                    ) : (
                        <Link href="/login"><User className="w-5 h-5 cursor-pointer" /></Link>
                    )}
                    <div className="relative">
                        <input type="text" placeholder="Որոնում" className="pl-4 pr-10 py-2 border rounded-3xl text-sm w-64 focus:outline-none" />
                        <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-4 py-10">
                <div className="bg-white border border-gray-100 shadow-sm rounded-[30px] p-6 flex flex-wrap items-center justify-between gap-6">

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="w-16 h-16 bg-[#689f38] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <button onClick={() => setActiveModal('edit')} className="absolute -bottom-1 -right-1 bg-white border border-gray-200 p-1 rounded-full shadow-sm hover:bg-gray-50">
                                <Pencil size={12} className="text-gray-500" />
                            </button>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400 font-medium">Անուն Ազգանուն</span>
                            <span className="text-[15px] font-semibold text-gray-500">{user?.name}</span>
                        </div>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Հեռախոսահամար</span>
                        <span className="text-[15px] font-semibold text-gray-500">{user?.phoneNumber || "Նշված չէ"}</span>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-medium">Էլ. հասցե</span>
                        <span className="text-[15px] font-semibold text-gray-500">{user?.email}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveModal('edit')} className="p-2.5 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                            <Pencil size={18} className="text-gray-400" />
                        </button>
                        <button onClick={() => setActiveModal('delete')} className="px-6 py-2.5 border border-gray-200 rounded-full text-gray-800 font-semibold text-sm hover:bg-red-50 hover:text-red-600 transition">
                            Ջնջել պրոֆիլը
                        </button>
                        <button
                            onClick={() => setActiveModal('logout')}
                            className="px-8 py-2.5 border border-gray-200 rounded-full text-gray-800 font-semibold text-sm hover:bg-gray-100 transition flex items-center gap-2"
                        >
                            Ելք
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-xl font-bold text-[#111827] mb-6">Առաջարկներ չեն գտնվել</h3>
                </div>
            </div>


            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[30px] p-8 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setActiveModal(null)} className="absolute top-5 right-5 text-gray-400 hover:text-black">
                            <X size={24} />
                        </button>

                        {activeModal === 'edit' && (
                            <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                                <h3 className="text-xl font-bold text-center mb-2 text-gray-800">Խմբագրել տվյալները</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs text-gray-400 ml-2">Անուն Ազգանուն</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full border border-gray-200 rounded-2xl p-3 outline-none focus:border-orange-400"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-400 ml-2">Հեռախոսահամար</label>
                                        <input
                                            type="text"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                            className="w-full border border-gray-200 rounded-2xl p-3 outline-none focus:border-orange-400"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="bg-[#FF9D43] text-white py-3 rounded-full font-bold hover:bg-orange-500 transition shadow-lg shadow-orange-200">Պահպանել</button>
                            </form>
                        )}

                        {activeModal === 'logout' && (
                            <div className="text-center">
                                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <LogOut size={30} className="text-orange-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-6 text-gray-800">Ցանկանու՞մ եք դուրս գալ:</h3>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Չեղարկել</button>
                                    <button onClick={handleLogout} className="flex-1 py-3 bg-[#1d2331] text-white rounded-2xl font-bold hover:bg-black transition shadow-lg">Հաստատել</button>
                                </div>
                            </div>
                        )}

                        {activeModal === 'delete' && (
                            <div className="text-center">
                                <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 size={30} className="text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2 text-gray-800">Ջնջե՞լ պրոֆիլը:</h3>
                                <p className="text-gray-400 text-sm mb-6">Այս գործողությունը անդառնալի է և ձեր բոլոր տվյալները կջնջվեն:</p>
                                <div className="flex gap-4">
                                    <button onClick={() => setActiveModal(null)} className="flex-1 py-3 border border-gray-200 rounded-2xl font-bold text-gray-500 hover:bg-gray-50">Չեղարկել</button>
                                    <button onClick={handleDelete} className="flex-1 py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition shadow-lg shadow-red-200">Ջնջել</button>
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
                <div className="relative z-10 max-w-6xl mx-auto border border-gray-700 rounded-3xl p-10 text-center">
                    <div className="flex justify-center items-center gap-8 mb-10">
                        <div className="w-40 h-px bg-white/30"></div>
                        <h2 className="text-3xl font-light uppercase tracking-wider">Տեղադրել հայտարարություն</h2>
                        <div className="w-40 h-px bg-white/30"></div>
                    </div>
                    <p className="mb-10 text-gray-400">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <input type="text" placeholder="Անուն Ազգանուն" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none" />
                        <input type="tel" placeholder="Հեռախոսահամար" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none" />
                        <input type="email" placeholder="Էլ․ Հասցե" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none" />
                        <button className="bg-orange-400 text-black px-10 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all">Ուղարկել</button>
                    </div>
                </div>
            </div>

            <footer className="bg-[#101623] text-white pt-10">
                <h2 className="text-center text-3xl mb-10 tracking-widest uppercase font-light">Կոնտակտներ</h2>
                <div className="flex flex-wrap justify-center gap-10 px-4 mb-10">
                    <div className="flex items-center gap-2"><Phone size={18} className="text-orange-500" /> <span className="text-sm">041-611-611 / 044-611-611</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><Mail size={18} className="text-orange-500" /> <span className="text-sm text-gray-300">amaranoc.info@gmail.com</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><Instagram size={18} className="text-orange-500" /> <span className="text-sm font-medium">AMARANOC.AM</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><Facebook size={18} className="text-orange-500" /> <span className="text-sm font-medium">AMARANOC.AM</span></div>
                    <div className="flex items-center gap-2 uppercase tracking-wide"><MapPin size={18} className="text-orange-500" /> <span className="text-sm">Թումանյան 5</span></div>
                </div>
                <div className="text-center text-gray-500 text-xs pb-10 space-y-2">
                    <p className="underline cursor-pointer hover:text-orange-500 transition">Գաղտնիության քաղաքականություն</p>
                    <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
                </div>
                <div className="w-full relative h-40">
                    <Image src="/image/footer-background.webp" alt="footer" fill className="object-cover opacity-30" />
                </div>
            </footer>
        </>
    );
}