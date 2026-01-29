"use client"

import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin, ChevronLeft, ChevronRight, Tag } from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { categories, servicesData } from './servicesData';

export default function Service() {
  const pathName = usePathname();
  const [activeTab, setActiveTab] = useState("Սպասարկում");

  const activeServices = servicesData[activeTab] || [];

  const linkClass = (path) =>
    `relative pb-1 transition-all
     ${pathName === path ? "after:w-full" : "after:w-0 hover:after:w-full"}
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px]
     after:bg-orange-500 after:transition-all after:duration-300`;

  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center items-center gap-74.5 my-7">
        <div className="flex items-start justify-start">
          <Link href="/">
            <img src="/logo.svg" alt="Logo" width="170" />
          </Link>
        </div>
        <div className="flex items-center justify-center gap-10">
          <Link className={linkClass("/")} href="/">Գլխավոր</Link>
          <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
          <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
          <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
        </div>
        <div className="flex gap-5 justify-end items-center">
          <button>
            <Globe className="w-5 h-5" />
          </button>

          <button>
            <User className="w-5 h-5" />
          </button>

          <div className="relative">
            <input
              type="text"
              placeholder="Որոնում"
              className="pl-10 pr-2 py-2 border  rounded-3xl"
            />
            <Search className="w-4 h-4 absolute left-54 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      <section className="max-w-[1500px] mx-auto px-12 my-12">
        <div className="relative flex items-center group">
          <button className="custom-prev-arrow absolute -left-12 z-10 flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white hover:border-orange-500 transition-all shadow-sm">
            <ChevronLeft size={22} className="text-gray-600" />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={6}
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
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-5 pt-4 flex flex-col flex-grow">
                <h3 className="text-[17px] font-bold text-[#111827] mb-2">
                  {item.title}
                </h3>

                <p className="text-[#374151] text-[13.5px] leading-[1.6] line-clamp-3 mb-6 flex-grow">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Tag size={16} className="text-orange-400 rotate-90 stroke-[2.5px]" />
                    <div className="flex items-center gap-1">
                      <span className="text-[20px] font-extrabold text-[#4B5563]">
                        {item.price.toLocaleString()}
                      </span>
                      <span className="text-[18px] font-bold text-[#4B5563]">֏</span>
                    </div>
                  </div>

                  <button className="px-7 py-1.5 rounded-full border border-orange-400 text-orange-500 font-semibold text-[14px] hover:bg-orange-500 hover:text-white transition-all duration-300">
                    Ամրագրել
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-black text-white py-20">
        <div className="max-w-6xl mx-auto border border-gray-800 rounded-3xl p-10 md:p-16">
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-6 mb-8 w-full justify-center">
              <div className="hidden md:block h-px bg-gray-700 flex-grow"></div>
              <h2 className="text-2xl md:text-3xl font-light tracking-wide">ՏԵՂԱԴՐԵԼ ՀԱՅՏԱՐԱՐՈՒԹՅՈՒՆ</h2>
              <div className="hidden md:block h-px bg-gray-700 flex-grow"></div>
            </div>
            <p className="text-gray-400 mb-10">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <input type="text" placeholder="Անուն Ազգանուն" className="bg-transparent border border-gray-700 rounded-full px-6 py-3 outline-none focus:border-orange-500 transition-all" />
              <input type="tel" placeholder="Հեռախոսահամար" className="bg-transparent border border-gray-700 rounded-full px-6 py-3 outline-none focus:border-orange-500 transition-all" />
              <input type="email" placeholder="Էլ․ Հասցե" className="bg-transparent border border-gray-700 rounded-full px-6 py-3 outline-none focus:border-orange-500 transition-all" />
              <button className="bg-orange-500 hover:bg-orange-600 text-white rounded-full py-3 font-semibold transition-all">Ուղարկել</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0B0F19] text-white">
        <div className="py-10 text-center">
          <h2 className="text-2xl tracking-[0.3em] font-light">ԿՈՆՏԱԿՏՆԵՐ</h2>
        </div>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 pb-10 border-b border-gray-800">
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Phone size={18} className="text-orange-500" /> 041-611-611 / 044-611-611
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Mail size={18} className="text-orange-500" /> AMARANOC.INFO@GMAIL.COM
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Instagram size={18} className="text-orange-500" /> AMARANOC.AM
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <Facebook size={18} className="text-orange-500" /> AMARANOC.AM
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors cursor-pointer">
            <MapPin size={18} className="text-orange-500" /> ԹՈՒՄԱՆՅԱՆ 5
          </div>
        </div>

        <div className="flex flex-col items-center py-8 gap-3 text-xs text-gray-500">
          <p className="underline uppercase tracking-widest cursor-pointer hover:text-orange-500 transition-all">Գաղտնիության քաղաքականություն</p>
          <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
        </div>
        <div className="w-full relative h-24">
          <Image
            src="/image/footer-background.webp"
            alt="footer image"
            fill
            className="object-cover opacity-50"
          />
        </div>
      </footer>
    </div>
  );
}