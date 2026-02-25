"use client"

import React, { useState } from 'react';
import { User, Globe, Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();
    const pathName = usePathname();

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        try {
            const response = await fetch("http://localhost:5000/api/register", { // Համոզվեք, որ պորտը ճիշտ է
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, phoneNumber, email, password }),
            });

            const data = await response.json();

            if (data.success) {
                alert("Շնորհավորում ենք, գրանցումը հաջողվեց։");
                router.push("/login");
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("Գրանցման սխալ:", error);
            alert("Կապի սխալ սերվերի հետ");
        }
    };

    const linkClass = (path) =>
        `relative pb-1 transition-all ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"} 
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
                        <Globe className="w-5 h-5 cursor-pointer" />
                        <Link href="/login"><User className="w-5 h-5 cursor-pointer" /></Link>
                    </div>
                </div>
            </header>

            <main className="min-h-[70vh] flex items-center justify-center py-20 px-4">
                <div className="max-w-[540px] w-full bg-white p-10 rounded-[40px] ">
                    <div className="text-center mb-6">
                        <h2 className="text-[22px] font-bold text-[#111827]">Գրանցում</h2>
                        <div className="w-full h-px bg-gray-100 mt-4"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex flex-col gap-5">
                            <input
                                type="text"
                                placeholder="Անուն Ազգանուն"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full border border-gray-300 rounded-2xl px-6 py-3 outline-none focus:border-orange-400"
                                required
                            />
                            <input
                                type="text" // Փոխեցի text, որ phoneNumber-ը ճիշտ գրվի
                                placeholder="Հեռախոսահամար"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full border border-gray-300 rounded-2xl px-6 py-3 outline-none focus:border-orange-400"
                                required
                            />
                            <input
                                type="email"
                                placeholder="Էլ. հասցե"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border border-gray-300 rounded-2xl px-6 py-3 outline-none focus:border-orange-400"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Գաղտնաբառ"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border border-gray-300 rounded-2xl px-6 py-3 outline-none focus:border-orange-400"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FF9D43] hover:bg-[#f38d2f] text-white font-bold py-4 rounded-[30px] text-[18px] transition-all mt-4"
                        >
                            Գրանցվել
                        </button>
                    </form>

                    <div className="w-full h-px bg-gray-100 my-8"></div>
                    <div className="text-center text-[15px] font-bold">
                        Գրանցված ե՞ք: <Link href="/login" className="text-[#FF9D43] ml-1 hover:underline">Մուտք</Link>
                    </div>
                </div>
            </main>
        </>
    );
}