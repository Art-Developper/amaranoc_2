"use client"

import React, { useState, useEffect } from "react";
import {
  User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin,
  Heart, CheckCircle2, X, Star, Users, Menu
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/api";

export default function Sales() {
  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [salesData, setSalesData] = useState({
    discounts: [],
    prices: [],
    salesHouses: []
  })

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Որոնման և Բուրգեր մենյուի սթեյթերը ---
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({ recipientName: '', phoneNumber: '' });

  // 1. Ստանում ենք զեղչերի տվյալները սերվերից
  useEffect(() => {
    fetchData('sales').then(data => {
      if (data) setSalesData(data);
    });
  }, []);

  // 2. Պրոֆիլի ստուգում (սեսիայի համար)
  useEffect(() => {
    fetch("http://localhost:5000/api/profile", { credentials: "include" })
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

  // 3. Սինխրոնացնում ենք որոնման դաշտը URL-ի հետ
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || "");
  }, [searchParams]);

  // --- ՖՈՒՆԿՑԻԱՆԵՐ ---

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") {
      router.push(`/?search=${searchQuery}`);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
    window.location.reload();
  };

  // Նվեր քարտի պատվերի ուղարկում
  const handleOrderSubmit = async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (!formData.recipientName || !formData.phoneNumber) {
      alert("Խնդրում ենք լրացնել բոլոր դաշտերը։");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'giftcard',
          details: {
            giftCardAmount: selectedPrice,
            forWhom: formData.recipientName
          },
          totalPrice: parseInt(selectedPrice.replace(/[^0-9]/g, '')),
          contactInfo: {
            name: user.name,
            email: user.email, // Կարևոր. օգտագործում ենք լոգին եղած մարդու մեյլը
            phone: formData.phoneNumber
          }
        }),
        credentials: "include"
      });

      const data = await response.json();
      if (data.success) {
        setBookingStep(2);
      }
    } catch (error) {
      alert("Կապի սխալ սերվերի հետ");
    }
  };

  const linkClass = (path) =>
    `relative pb-1 transition-all ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;

  return (
    <>
      {/* --- HEADER --- */}
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
            <Globe className="w-5 h-5 cursor-pointer text-gray-700 hover:text-orange-500" />

            {/* Desktop Auth Status */}
            <div className="hidden min-[1321px]:flex items-center">
              {loading ? null : user ? (
                <div className="flex items-center gap-4">
                  <Link href="/userPage" className="text-[14px] font-bold text-orange-500 border-b border-orange-500">{user.name}</Link>
                  <button onClick={handleLogout} className="text-sm text-red-500 hover:underline font-medium">Դուրս գալ</button>
                </div>
              ) : (
                <Link className={linkClass("/login")} href="/login"><User className="w-5 h-5 cursor-pointer text-gray-700" /></Link>
              )}
            </div>

            {/* Search Input */}
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
      </header>

      {/* --- BURGER MENU DRAWER --- */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsMenuOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-[350px] sm:w-[450px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button className="absolute top-8 right-8 w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-gray-400" onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
        <nav className="flex flex-col gap-10 mt-24">
          <Link href="/" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
          <Link href="/sales" className="text-[20px] font-bold text-orange-500" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
          <Link href="/service" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Ծառայություններ</Link>
          <Link href="/about_us" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Մեր մասին</Link>
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

      {/* --- PAGE CONTENT --- */}
      <div className="py-10">
        <h2 className="text-center text-4xl font-bold mb-10 uppercase">ՀԱՏՈՒԿ ԶԵՂՉԵՐ</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-10 gap-8 max-w-[1440px] mx-auto">
          {salesData.discounts.map((item, index) => (
            <div key={index} className="relative rounded-[30px] overflow-hidden shadow-lg h-80 group border border-gray-100">
              <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-end p-8 text-white">
                <div className="text-5xl font-black mb-3 text-orange-400 italic">{item.percent}</div>
                <div className="font-bold text-xl mb-1">{item.title}</div>
                <p className="text-sm opacity-90 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 flex flex-col justify-center">
          <h1 className="text-4xl font-bold leading-snug text-gray-900 uppercase tracking-tighter">
            Պատվիրի՛ր <span className="text-orange-500">Նվեր քարտ</span> <br />
            Քո կամ ընկերերիդ համար
          </h1>
          <div className="border-b-4 border-orange-500 my-5 w-20"></div>
          <p className="text-gray-600 text-lg leading-relaxed font-medium">
            Բաց մի թող մեր բացառիկ նվեր քարտերը։ Եթե պլանավորում ես քո հաջորդ արձակուրդը՝
            ընկերներիդ կամ ընտանիքիդ անդամների հետ, մեր զեղչային քարտերը առաջարկում են
            անգերազանցելի խնայողություններ:
          </p>
        </div>
        <div className="rounded-[40px] p-10 shadow-2xl bg-gradient-to-r from-orange-500 to-orange-600 text-white flex flex-col items-center">
          <img src="https://amaranoc.am/images/white-logo.svg" alt="Logo" className="w-48 mb-10 opacity-90" />
          <div className="flex flex-wrap gap-4 justify-center mb-10">
            {salesData.prices.map((price, i) => (
              <button
                key={i}
                onClick={() => setSelectedPrice(price)}
                className={`px-6 py-2 border-2 border-white rounded-full text-lg font-bold transition 
                    ${selectedPrice === price ? 'bg-white text-orange-600 shadow-xl' : 'hover:bg-white/20'}`}
              >
                {price}
              </button>
            ))}
          </div>
          <button
            onClick={() => {
              if (!user) router.push("/login");
              else if (selectedPrice) setIsModalOpen(true);
              else alert("Ընտրեք արժեքը");
            }}
            className="px-10 py-3 bg-[#1d2331] text-white font-black rounded-full shadow-lg text-lg hover:bg-black transition-all"
          >
            Պատվիրել
          </button>
        </div>
      </div>

      <div className="py-10">
        <h1 className='text-center text-4xl font-black mb-10 uppercase italic tracking-tighter'>Թեժ առաջարկներ</h1>
        <div className="grid grid-cols-1 px-10 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-[1440px] mx-auto">
          {salesData.salesHouses.map((item) => (
            <Link key={item.id} href={`/houses/${item.id}`} className="bg-white rounded-[35px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-gray-50">
              <div className="relative h-64 overflow-hidden">
                <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="" />
                <button className="absolute top-4 right-4 bg-white/30 backdrop-blur-md p-2 rounded-full hover:bg-white transition-all"><Heart className="w-5 h-5 text-gray-800" /></button>
              </div>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between text-gray-500 font-bold uppercase text-[12px]">
                  <span className="flex items-center gap-2"><MapPin size={16} className="text-orange-500" /> {item.location}</span>
                  <span className="flex items-center gap-2"><Users size={16} className="text-orange-500" /> {item.people} հոգի</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="font-black text-2xl text-gray-900 tracking-tighter">{item.price}</p>
                  <span className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-black flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {item.rating}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* --- ԱՆՓՈՓՈԽ AD SECTION --- */}
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
            <input type="text" placeholder="Անուն Ազգանուն" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none focus:border-orange-400 text-white" />
            <input type="tel" placeholder="Հեռախոսահամար" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none focus:border-orange-400 text-white" />
            <input type="email" placeholder="Էլ․ Հասցե" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none focus:border-orange-400 text-white" />
            <button className="bg-orange-400 text-black px-10 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all">Ուղարկել</button>
          </div>
        </div>
      </div>

      {/* --- ԱՆՓՈՓՈԽ FOOTER --- */}
      <div className=" bg-[#101623ff] text-white">
        <div className="flex justify-center items-center">
          <h1 className="text-3xl my-4 font-light tracking-widest">ԿՈՆՏԱԿՏՆԵՐ</h1>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-8 p-4 bg-gray-900 text-white">
          <div className="flex items-center gap-2">
            <Phone size={20} />
            <span className="text-sm">041-611-611 / 044-611-611</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={20} />
            <span className="text-sm text-gray-300 uppercase">AMARANOC.INFO@GMAIL.COM</span>
          </div>
          <a href="#" className="flex items-center gap-2">
            <Instagram size={20} />
            <span className="text-sm font-medium">AMARANOC.AM</span>
          </a>
          <a href="#" className="flex items-center gap-2">
            <Facebook size={20} />
            <span className="text-sm font-medium">AMARANOC.AM</span>
          </a>
          <div className="flex items-center gap-2">
            <MapPin size={20} />
            <span className="text-sm ">ԹՈՒՄԱՆՅԱՆ 5</span>
          </div>
        </div>
        <div className="flex justify-center my-3.5">
          <p className="underline cursor-pointer">Գաղտնիության քաղաքականություն</p>
        </div>
        <div className="flex justify-center my-2.5">
          <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
        </div>
        <div>
          <Image src="/image/footer-background.webp" alt="footer image" width={1920} height={140} />
        </div>
      </div>

      {/* --- GIFT CARD MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full relative shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-black transition"><X size={28} /></button>
            {bookingStep === 1 ? (
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-center text-gray-900 tracking-tighter uppercase italic">Նվեր Քարտ</h3>
                <div className="bg-orange-50 p-5 rounded-3xl text-center">
                  <span className="text-gray-400 font-bold uppercase text-xs block mb-1">Ընտրված արժեք</span>
                  <span className="text-orange-600 font-black text-3xl">{selectedPrice}</span>
                </div>
                <div className="space-y-4">
                  <input type="text" placeholder="Ու՞մ համար (Անուն Ազգանուն)" className="w-full p-5 border-2 border-gray-100 rounded-3xl outline-none focus:border-orange-500 font-bold" onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })} />
                  <input type="tel" placeholder="Հեռախոսահամար" className="w-full p-5 border-2 border-gray-100 rounded-3xl outline-none focus:border-orange-500 font-bold" onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </div>
                <button onClick={handleOrderSubmit} className="w-full py-5 bg-[#ff9d43] text-white font-black rounded-full shadow-xl shadow-orange-100 hover:bg-orange-500 transition-all text-lg">ՀԱՍՏԱՏԵԼ</button>
              </div>
            ) : (
              <div className="text-center py-10">
                <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-green-500" /></div>
                <h3 className="text-3xl font-black mb-4 text-gray-900 uppercase tracking-tighter">Շնորհակալություն</h3>
                <p className="text-gray-500 font-bold text-lg px-4">Ձեր հայտը հաստատվել է: Մենք կկապնվենք Ձեզ հետ շուտով:</p>
                <button onClick={() => { setIsModalOpen(false); setBookingStep(1); }} className="mt-10 w-full py-4 bg-[#1d2331] text-white rounded-full font-black tracking-widest text-sm hover:bg-black transition-all">Փակել</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}