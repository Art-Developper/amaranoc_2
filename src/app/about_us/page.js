"use client"

import React, { useState, useEffect } from 'react';
import {
  User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin,
  Menu, X
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/api.js"

export default function About() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sectionData, setSectionData] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchData('about').then(data => {
      if (data) {
        setSectionData(data);
      }
    });
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

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
    setUser(null);
    window.location.reload();
  };

  const linkClass = (path) =>
    `relative pb-1 transition-all text-white
     ${pathName === path ? "after:w-full" : "after:w-0 hover:after:w-full"}
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[2px]
     after:bg-orange-500 after:transition-all after:duration-300`;

  return (
    <>
      <div className="relative h-screen w-full">
        <div className="absolute inset-0 z-0">
          <Image
            src="/image/first_image.webp"
            alt="Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        <header className="relative z-[60] flex justify-between items-center px-10 py-7 max-w-[1600px] mx-auto">
          <div className="flex items-start justify-start">
            <Link href="/">
              <img src="/logo.svg" alt="Logo" width="170" className="brightness-0 invert" />
            </Link>
          </div>

          <div className="hidden min-[1321px]:flex items-center justify-center gap-10">
            <Link className={linkClass("/")} href="/">Գլխավոր</Link>
            <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
            <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
            <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
          </div>

          <div className="flex gap-5 justify-end items-center text-white">
            <button className="hover:text-orange-400 transition">
              <Globe className="w-5 h-5" />
            </button>

            <div className="hidden min-[1321px]:flex items-center gap-3">
              {loading ? null : user ? (
                <div className="flex items-center gap-3">
                  <Link href="/userPage" className="text-[14px] font-bold text-white border-b border-orange-500">{user.name}</Link>
                  <button onClick={handleLogout} className="text-sm bg-orange-500 hover:bg-orange-600 px-4 py-1 rounded-full transition">Դուրս գալ</button>
                </div>
              ) : (
                <Link href="/login" className="hover:text-orange-400 transition"><User className="w-5 h-5" /></Link>
              )}
            </div>

            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Որոնում"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-4 pr-10 py-2 bg-white/10 border border-white/30 rounded-3xl text-white placeholder:text-gray-300 focus:outline-none focus:bg-white/20 backdrop-blur-sm"
              />
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2" />
            </div>

            <button className="min-[1321px]:hidden p-2 hover:text-orange-400 transition" onClick={() => setIsMenuOpen(true)}>
              <Menu size={30} />
            </button>
          </div>
        </header>
      </div>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-[350px] sm:w-[450px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button className="absolute top-8 right-8 w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-gray-400" onClick={() => setIsMenuOpen(false)}>
          <X size={24} />
        </button>
        <nav className="flex flex-col gap-10 mt-24">
          <Link href="/" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
          <Link href="/sales" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
          <Link href="/service" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Ծառայություններ</Link>
          <Link href="/about_us" className="text-[20px] font-bold text-orange-500" onClick={() => setIsMenuOpen(false)}>Մեր մասին</Link>
          <hr className="border-gray-100 my-2" />
          {user ? (
            <div className="flex flex-col gap-6">
              <Link href="/userPage" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>{user.name}</Link>
              <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-[20px] font-bold text-red-500 text-left">Դուրս գալ</button>
            </div>
          ) : (
            <Link href="/login" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Մուտք</Link>
          )}
        </nav>
      </div>

      <section className="bg-gray-50 pt-16 font-sans">
        <div className="w-full space-y-10">
          {sectionData.map((section, index) => (
            <React.Fragment key={section.id}>
              <div className="max-w-7xl mx-auto px-4 md:px-10 lg:px-20">
                <div className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                  <div className="w-full md:w-1/2">
                    <img src={section.image} alt={section.title} className="w-full h-[400px] object-cover rounded-3xl shadow-lg" />
                  </div>
                  <div className="w-full md:w-1/2 flex flex-col">
                    <div className="flex items-center mb-4">
                      <span className="h-[2px] w-8 bg-black mr-4"></span>
                      <h2 className="text-2xl font-bold tracking-wider">{section.title}</h2>
                      <div className="ml-4 flex-grow h-[1px] bg-gray-300"></div>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-lg text-justify">{section.text}</p>
                  </div>
                </div>
              </div>
              {(index === 1 || index === 4) && (
                <div className="w-full pt-10">
                  <img src={index === 1 ? "/image/second.webp" : "/image/third.webp"} alt="Banner" className="w-full h-[500px] md:h-[600px] object-cover shadow-2xl" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      <div className="relative text-white py-20 mt-2 overflow-hidden min-h-[400px]">
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