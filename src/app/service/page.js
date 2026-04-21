"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import {
  User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin, ChevronLeft, ChevronRight,
  Tag, HandPlatter, WandSparkles, PartyPopper, Rocket,
  UtensilsCrossed, Video, CarFront, Menu, X, CheckCircle2
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/api.js"

// Լոգիկայի ուղղում՝ դինամիկ ENDPOINT
const ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.46:5000";

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

  // --- ԱՄՐԱԳՐՄԱՆ ՍԹԵՅԹԵՐ ---
  const [bookingStep, setBookingStep] = useState(0); // 0: closed, 1: desc, 2: date, 3: contact
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [contactForm, setContactForm] = useState({ name: "", phone: "" });
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Օրացույցի դիտման համար
  const [viewDate, setViewDate] = useState(new Date());
  const monthNames = ["ՀՈՒՆՎԱՐ", "ՓԵՏՐՎԱՐ", "ՄԱՐՏ", "ԱՊՐԻԼ", "ՄԱՅԻՍ", "ՀՈՒՆԻՍ", "ՀՈՒԼԻՍ", "ՕԳՈՍՏՈՍ", "ՍԵՊՏԵՄԲԵՐ", "ՀՈԿՏԵՄԲԵՐ", "ՆՈՅԵՄԲԵՐ", "ԴԵԿՏԵՄԲԵՐ"];
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));

  // Օրացույցի օրերի գեներացում
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(new Date(year, month, i));

  useEffect(() => {
    // fetchData-ն արդեն օգտագործում է քո api.js լոգիկան
    fetchData('services').then(data => { if (data) setServicesData(data); });

    // Լոգիկայի ուղղում
    fetch(`${ENDPOINT}/api/profile`, { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setUser(data); setLoading(false); setContactForm({ name: data.name, phone: data.phoneNumber || "" }) })
      .catch(() => { setUser(null); setLoading(false); });
  }, []);

  // --- ՖՈՒՆԿՑԻԱՆԵՐ ---
  const handleOpenBooking = (service) => {
    if (!user) { router.push("/login"); return; }
    setSelectedService(service);
    setBookingStep(1);
  };

  const handleFinalBook = async () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) {
      alert("Լրացրեք բոլոր դաշտերը"); return;
    }
    try {
      // Լոգիկայի ուղղում
      const response = await fetch(`${ENDPOINT}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: 'service',
          details: { title: selectedService.title, image: selectedService.image, date: selectedDate },
          totalPrice: selectedService.price,
          contactInfo: contactForm
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        alert("Ծառայությունը ամրագրվեց");
        setBookingStep(0);
        router.push("/userPage");
      }
    } catch (error) { alert("Կապի սխալ"); }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") router.push(`/?search=${searchQuery}`);
  };

  const handleLogout = async () => {
    // Լոգիկայի ուղղում
    await fetch(`${ENDPOINT}/api/logout`, { method: "POST", credentials: "include" });
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
    `relative pb-1 transition-all ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;

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
              <input type="text" placeholder="Որոնում" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} className="pl-4 pr-10 py-2 border rounded-3xl text-sm w-48 lg:w-64 focus:outline-none focus:border-orange-400 transition" />
              <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
            <button className="min-[1321px]:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(true)}><Menu size={30} /></button>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}`} onClick={() => setIsMenuOpen(false)} />
      <div className={`fixed top-0 right-0 h-full w-[350px] sm:w-[450px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <button className="absolute top-8 right-8 w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center text-gray-400" onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
        <nav className="flex flex-col gap-10 mt-24">
          <Link href="/" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
          <Link href="/sales" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
          <Link href="/service" className="text-[20px] font-bold text-orange-500" onClick={() => setIsMenuOpen(false)}>Ծառայություններ</Link>
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

      <section className="max-w-[1500px] mx-auto px-12 my-12">
        <div className="relative flex items-center group">
          <button className="custom-prev-arrow absolute -left-12 z-10 flex items-center justify-center w-10 h-10 border border-gray-300 rounded-full bg-white hover:border-orange-500 transition-all shadow-sm">
            <ChevronLeft size={22} className="text-gray-600" />
          </button>
          <Swiper modules={[Navigation]} spaceBetween={20} slidesPerView={6} navigation={{ nextEl: '.custom-next-arrow', prevEl: '.custom-prev-arrow' }} className="w-full border-b border-gray-100 pb-4">
            {categories.map((cat) => (
              <SwiperSlide key={cat.name}>
                <div onClick={() => setActiveTab(cat.name)} className='flex flex-col items-center cursor-pointer group/item'>
                  <span className={`mb-3 transition-colors ${activeTab === cat.name ? 'text-orange-500' : 'text-gray-400 group-hover/item:text-black'}`}>{cat.icon}</span>
                  <p className={`text-[14px] font-medium transition-colors ${activeTab === cat.name ? 'text-black' : 'text-gray-500'}`}>{cat.name}</p>
                  <div className={`h-[3px] bg-orange-500 transition-all duration-300 mt-2 rounded-full ${activeTab === cat.name ? 'w-10 opacity-100' : 'w-0 opacity-0'}`} />
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
            <div key={item.id} className="bg-white rounded-[1.8rem] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col border border-gray-100 group/card">
              <div className="relative w-full aspect-[16/9.5] overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover group-hover/card:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5 pt-4 flex flex-col flex-grow">
                <h3 className="text-[17px] font-bold text-[#111827] mb-2">{item.title}</h3>
                <p className="text-[#374151] text-[13.5px] leading-[1.6] line-clamp-3 mb-6 flex-grow">{item.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 font-black text-[#4B5563]">
                    <Tag size={16} className="text-orange-400 rotate-90" />
                    <span>{item.price?.toLocaleString()} ֏</span>
                  </div>
                  <button onClick={() => handleOpenBooking(item)} className="px-7 py-1.5 rounded-full border border-orange-400 text-orange-500 font-bold text-[14px] hover:bg-orange-500 hover:text-white transition-all">Ամրագրել</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {bookingStep > 0 && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[40px] w-full max-w-[550px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

            {bookingStep === 1 && (
              <div className="p-10">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-gray-900">{selectedService?.title}</h3>
                  <X className="cursor-pointer text-gray-300 hover:text-black" onClick={() => setBookingStep(0)} />
                </div>
                <p className="text-gray-600 leading-relaxed mb-10 text-[15px] font-medium">{selectedService?.description}</p>
                <div className="flex justify-between items-center pt-6 border-t">
                  <div className="flex items-center gap-2 font-black text-2xl text-gray-800"><Tag className="text-orange-500 rotate-90" /> {selectedService?.price?.toLocaleString()} ֏</div>
                  <button onClick={() => setBookingStep(2)} className="bg-[#ff9d43] text-white px-12 py-3.5 rounded-full font-black shadow-lg hover:bg-orange-500 transition-all">ԱՄՐԱԳՐԵԼ</button>
                </div>
              </div>
            )}

            {bookingStep === 2 && (
              <div className="p-0">
                <div className="p-8 border-b flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <ChevronLeft className="cursor-pointer text-gray-400 hover:text-black" onClick={() => setBookingStep(1)} />
                    <h3 className="text-xl font-black uppercase tracking-tighter">Ընտրեք ամսաթիվը</h3>
                  </div>
                  <X className="cursor-pointer text-gray-300 hover:text-black" onClick={() => setShowExitConfirm(true)} />
                </div>
                <div className="bg-[#ff9d43] text-white flex justify-between items-center px-8 py-4 font-black">
                  <button onClick={prevMonth}><ChevronLeft /></button>
                  <span className="tracking-widest uppercase">{monthNames[month]} {year}</span>
                  <button onClick={nextMonth}><ChevronRight /></button>
                </div>
                <div className="grid grid-cols-7 text-center py-4 bg-gray-50 text-[11px] font-black text-gray-400">
                  {['ԵՐԿ', 'ԵՐՔ', 'ՉՈՐ', 'ՀՆԳ', 'ՈՒՐԲ', 'ՇԱԲ', 'ԿԻՐ'].map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1 p-8 text-center">
                  {calendarDays.map((date, idx) => (
                    <div key={idx}
                      onClick={() => date && setSelectedDate(date)}
                      className={`h-11 flex items-center justify-center rounded-xl font-bold cursor-pointer transition-all
                            ${!date ? 'pointer-events-none' : 'hover:bg-orange-50'}
                            ${selectedDate?.toDateString() === date?.toDateString() ? 'bg-orange-500 text-white shadow-lg' : 'text-gray-800'}`}>
                      {date?.getDate()}
                    </div>
                  ))}
                </div>
                <div className="p-8 border-t flex justify-between items-center">
                  <div className="font-black text-[#ff9d43] text-xl border-2 border-orange-500 px-6 py-2 rounded-full">{selectedService?.price?.toLocaleString()} ֏</div>
                  <button onClick={() => setBookingStep(3)} disabled={!selectedDate} className="bg-[#ff9d43] text-white px-10 py-3.5 rounded-full font-black shadow-lg disabled:opacity-30">ՇԱՐՈՒՆԱԿԵԼ</button>
                </div>
              </div>
            )}

            {bookingStep === 3 && (
              <div className="p-12 text-center">
                <div className="flex justify-between items-center mb-10">
                  <ChevronLeft className="cursor-pointer text-gray-400 hover:text-black" onClick={() => setBookingStep(2)} size={30} />
                  <h3 className="text-2xl font-black uppercase tracking-tighter">Ամրագրում</h3>
                  <X className="cursor-pointer text-gray-300 hover:text-black" onClick={() => setShowExitConfirm(true)} />
                </div>
                <p className="text-gray-500 font-bold mb-10">Կատարեք ամրագրում Ձեր նշած օրվա համար՝ մուտքագրելով Ձեր անունը և հեռախոսահամարը:</p>
                <div className="space-y-4 mb-12">
                  <input type="text" placeholder="Անուն" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} className="w-full border-2 border-gray-100 p-5 rounded-[20px] outline-none focus:border-orange-400 font-bold" />
                  <div className="flex border-2 border-gray-100 rounded-[20px] overflow-hidden focus-within:border-orange-400">
                    <div className="bg-gray-50 px-5 flex items-center border-r font-black text-gray-400">🇦🇲 +374</div>
                    <input type="tel" placeholder="Հեռախոսահամար" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full p-5 outline-none font-bold" />
                  </div>
                </div>
                <button onClick={handleFinalBook} className="w-full bg-[#ff9d43] text-white py-5 rounded-full font-black text-xl shadow-xl hover:bg-orange-500 transition-all">ՀԱՍՏԱՏԵԼ</button>
              </div>
            )}
          </div>
        </div>
      )}

      {showExitConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="bg-white p-10 rounded-[40px] shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95">
            <h3 className="font-black text-xl mb-8 uppercase tracking-tighter">Հրաժարվել ամրագրումի՞ց</h3>
            <div className="flex gap-4">
              <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-4 border-2 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition">ՈՉ</button>
              <button onClick={() => { setShowExitConfirm(false); setBookingStep(0); }} className="flex-1 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-200">ԱՅՈ</button>
            </div>
          </div>
        </div>
      )}

      <div className="relative text-white py-20 mt-20 overflow-hidden min-h-[400px]">
        <div className="absolute inset-0 z-0">
          <Image src="/image/background/background.jpg" alt="Background" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto border border-gray-700 rounded-3xl p-10 text-center backdrop-blur-sm bg-white/5">
          <h2 className="text-3xl font-light uppercase tracking-wider mb-10">Տեղադրել հայտարարություն</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <input type="text" placeholder="Անուն Ազգանուն" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 focus:border-orange-400 outline-none text-white" />
            <input type="tel" placeholder="Հեռախոսահամար" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none text-white" />
            <input type="email" placeholder="Էլ․ Հասցե" className="bg-white/10 border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none text-white" />
            <button className="bg-orange-400 text-black px-10 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all">Ուղարկել</button>
          </div>
        </div>
      </div>

      <footer className="bg-[#0B0F19] text-white pt-10">
        <h2 className="text-center text-3xl mb-10 uppercase tracking-widest font-light">Կոնտակտներ</h2>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 pb-10 border-b border-gray-800 font-bold text-gray-300">
          <div className="flex items-center gap-2"><Phone size={18} className="text-orange-500" /> 041-611-611 / 044-611-611</div>
          <div className="flex items-center gap-2 uppercase tracking-widest text-[12px]"><Mail size={18} className="text-orange-500" /> amaranoc.info@gmail.com</div>
          <div className="flex items-center gap-2 uppercase tracking-widest text-[12px]"><Instagram size={18} className="text-orange-500" /> AMARANOC.AM</div>
          <div className="flex items-center gap-2 uppercase tracking-widest text-[12px]"><MapPin size={18} className="text-orange-500" /> ԹՈՒՄԱՆՅԱՆ 5</div>
        </div>
        <div className="w-full relative h-32 opacity-30"><Image src="/image/footer-background.webp" alt="footer" fill className="object-cover" /></div>
      </footer>
    </div>
  );
}