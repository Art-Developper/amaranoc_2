"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin, ChevronLeft, ChevronRight,
  Tag, HandPlatter, WandSparkles, PartyPopper, Rocket,
  UtensilsCrossed, Video, CarFront, Menu, X
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/api.js"

export default function Service() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState("Սպասարկում");
  const [servicesData, setServicesData] = useState({});
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    fetchData('services').then(data => {
      if (data) {
        setServicesData(data);
      }
    });
  }, []);

  const handleBookService = async (service) => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'service',
          details: {
            title: service.title,
            image: service.image
          },
          totalPrice: service.price,
          contactInfo: { name: user.name, email: user.email } 
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        alert("Ծառայությունը հաջողությամբ ամրագրվեց");
        router.push("/userPage");
      }
    } catch (error) {
      alert("Կապի սխալ");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : Promise.reject())
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

  const activeServices = servicesData[activeTab] || [];

  const categories = [
    { name: "Սպասարկում", icon: <HandPlatter size={28} /> },
    { name: "Շոու", icon: <WandSparkles size={28} /> },
    { name: "Միջոցառումներ", icon: <PartyPopper size={28} /> },
    { name: "Տեխնիկա", icon: <Rocket size={28} /> },
    { name: "Օրավարձով գույք", icon: <UtensilsCrossed size={28} /> },
    { name: "Նկարահանում", icon: <Video size={28} /> },
    { name: "Ուղևորափոխադրում", icon: <CarFront size={28} /> },
  ];

  const linkClass = (path) =>
    `relative pb-1 transition-all
     ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"}
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px]
     after:bg-orange-500 after:transition-all after:duration-300`;

  return (
    <div className="min-h-screen bg-white">

      <header className="relative bg-white border-b border-gray-100 z-[60]">
        <div className="flex justify-between items-center max-w-[1440px] mx-auto py-7 px-4">
          <Link href="/"><img src="/logo.svg" alt="Logo" width="170" /></Link>

          <nav className="hidden min-[1321px]:flex items-center gap-10 font-medium text-sm text-gray-700">
            <Link className={linkClass("/")} href="/">Գլխավոր</Link>
            <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
            <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
            <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
          </nav>

          <div className="flex gap-5 items-center">
            <Globe className="w-5 h-5 cursor-pointer text-gray-700" />

            <div className="hidden min-[1321px]:flex items-center">
              {loading ? null : user ? (
                <div className="flex items-center gap-4">
                  <Link href="/userPage" className="text-[14px] font-bold text-orange-500 border-b border-orange-500">{user.name}</Link>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Դուրս գալ</button>
                </div>
              ) : (
                <Link className={linkClass("/login")} href="/login"><User className="w-5 h-5 cursor-pointer" /></Link>
              )}
            </div>

            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Որոնում"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="pl-4 pr-10 py-2 border rounded-3xl text-sm w-48 lg:w-64 focus:outline-none focus:border-orange-400 transition"
              />
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <button className="min-[1321px]:hidden p-2 text-gray-700 hover:text-orange-500" onClick={() => setIsMenuOpen(true)}>
              <Menu size={30} />
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={() => setIsMenuOpen(false)}
        />
        <div className={`fixed top-0 right-0 h-full w-[350px] sm:w-[450px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
          <button className="absolute top-8 right-8 w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-gray-400" onClick={() => setIsMenuOpen(false)}>
            <X size={24} />
          </button>
          <nav className="flex flex-col gap-10 mt-24">
            <Link href="/" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
            <Link href="/sales" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
            <Link href="/service" className="text-[20px] font-bold text-orange-500" onClick={() => setIsMenuOpen(false)}>Ծառայություններ</Link>
            <Link href="/about_us" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Մեր մասին</Link>

            <hr className="border-gray-100 my-2" />

            {loading ? null : user ? (
              <div className="flex flex-col gap-6">
                <Link href="/userPage" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>{user.name}</Link>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-[20px] font-bold text-red-500 text-left">Դուրս գալ</button>
              </div>
            ) : (
              <Link href="/login" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Մուտք</Link>
            )}
          </nav>
        </div>
      </header>

      <section className="max-w-[1500px] mx-auto px-12 my-12">
        <div className="relative flex items-center group">
          <button className="custom-prev-arrow absolute -left-12 z-10 flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white hover:border-orange-500 transition-all shadow-sm">
            <ChevronLeft size={22} className="text-gray-600" />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={6}
            breakpoints={{
              320: { slidesPerView: 2 },
              640: { slidesPerView: 3 },
              1024: { slidesPerView: 6 }
            }}
            navigation={{
              nextEl: '.custom-next-arrow',
              prevEl: '.custom-prev-arrow'
            }}
            className="w-full border-b border-gray-100 pb-4"
          >
            {categories.map((cat) => (
              <SwiperSlide key={cat.name}>
                <div
                  onClick={() => setActiveTab(cat.name)}
                  className='flex flex-col items-center cursor-pointer group/item'
                >
                  <span className={`mb-3 transition-colors ${activeTab === cat.name ? 'text-orange-500' : 'text-gray-400 group-hover/item:text-black'}`}>
                    {cat.icon}
                  </span>
                  <p className={`text-[14px] font-medium transition-colors ${activeTab === cat.name ? 'text-black' : 'text-gray-500'}`}>
                    {cat.name}
                  </p>
                  <div className={`h-[3px] bg-orange-500 transition-all duration-300 mt-2 rounded-full 
                    ${activeTab === cat.name ? 'w-10 opacity-100' : 'w-0 opacity-0'}`}>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button className="custom-next-arrow absolute -right-12 z-10 flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white hover:border-orange-500 transition-all shadow-sm">
            <ChevronRight size={22} className="text-gray-600" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 my-16">
          {activeServices.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-[1.8rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col border border-gray-100"
            >
              <div className="relative w-full aspect-[16/9.5] overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
              </div>

              <div className="p-5 pt-4 flex flex-col flex-grow">
                <h3 className="text-[17px] font-bold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-[#374151] text-[13.5px] leading-[1.6] line-clamp-3 mb-6 flex-grow">{item.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Tag size={16} className="text-orange-400 rotate-90 stroke-[2.5px]" />
                    <div className="flex items-center gap-1">
                      <span className="text-[20px] font-extrabold text-[#4B5563]">{item.price?.toLocaleString()}</span>
                      <span className="text-[18px] font-bold text-[#4B5563]">֏</span>
                    </div>
                  </div>
                  <button onClick={() => handleBookService(item)} className="px-7 py-1.5 rounded-full border border-orange-400 text-orange-500 font-semibold text-[14px] hover:bg-orange-500 hover:text-white transition-all">Ամրագրել</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

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
    </div>
  );
}