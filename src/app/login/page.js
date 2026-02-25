"use client"

import React, { useState } from 'react';
import { User, Globe, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const pathName = usePathname();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (data.success) {
                alert(data.message);
                localStorage.setItem("user", JSON.stringify(data.user)); 
                router.push("/"); 
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Կապի սխալ սերվերի հետ");
        }
    };

    const linkClass = (path) =>
        `relative pb-1 transition-all
         ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"}
         after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-orange-500 after:transition-all after:duration-300`;

    return (
        <>
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="flex justify-between items-center max-w-[1440px] mx-auto py-6 px-4">
                    <Link href="/"><img src="/logo.svg" alt="Logo" width="160" /></Link>
                    <nav className="hidden md:flex items-center gap-10 font-medium text-sm">
                        <Link className={linkClass("/")} href="/">Գլխավոր</Link>
                        <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
                        <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
                        <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
                    </nav>
                    <div className="flex gap-5 items-center">
                        <button className="text-gray-700 hover:text-orange-500 transition"><Globe className="w-5 h-5" /></button>
                        <Link href="/login" className="text-orange-500"><User className="w-5 h-5" /></Link>
                        <div className="relative">
                            <input type="text" placeholder="Որոնում" className="pl-4 pr-10 py-2 border rounded-3xl text-sm w-64 focus:outline-none" />
                            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>
                </div>
            </header>

            <main className="min-h-[70vh] flex items-center justify-center py-20 px-4">
                <div className="max-w-[540px] w-full bg-white p-10 rounded-[40px] shadow-xl border border-gray-50">
                    <div className="text-center mb-6">
                        <h2 className="text-[22px] font-bold text-[#111827]">Մուտք</h2>
                        <div className="w-full h-px bg-gray-100 mt-4"></div>
                    </div>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-5">
                            <input
                                type="email"
                                placeholder="Էլ. հասցե"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-2xl px-6 py-3 outline-none focus:border-orange-400 transition"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Գաղտնաբառ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-2xl px-6 py-3 outline-none focus:border-orange-400 transition"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FF9D43] hover:bg-[#f38d2f] text-white font-bold py-4 rounded-[30px] text-[18px] transition-all shadow-lg mt-4"
                        >
                            Մուտք
                        </button>
                    </form>

                    <div className="w-full h-px bg-gray-100 my-8"></div>
                    <div className="text-center">
                        <p className="text-[15px] font-bold text-[#111827]">
                            Դեռ գրանցված չե՞ք:{" "}
                            <Link href="/register" className="text-[#FF9D43] hover:text-orange-600 transition ml-1">
                                Գրանցում
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}