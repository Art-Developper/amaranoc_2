"use client"

import React, { useState, useEffect, useRef } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/api.js";
import {
    MapPin, X, CheckCircle2, Home, Maximize, Users, Bed, Bath, Waves, Tag,
    User, Globe, Search, Menu, ChevronLeft, ChevronRight, LogOut, Phone, Mail, Instagram, Facebook, Heart
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// Լոգիկայի ուղղում՝ դինամիկ ENDPOINT
const ENDPOINT = process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.46:5000";

export default function HouseDetails() {
    const { id } = useParams();
    const router = useRouter();
    const pathName = usePathname();
    const searchParams = useSearchParams();

    const [house, setHouse] = useState(null);
    const [similarHouses, setSimilarHouses] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    const [bookingStep, setBookingStep] = useState(0);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const [selectedDates, setSelectedDates] = useState({ start: null, end: null });
    const [hasNightStay, setHasNightStay] = useState(null);
    const [guestData, setGuestData] = useState({ adults: 2, kids: 0, babies: 0, overnight: 0 });
    const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "" });

    const [viewDate, setViewDate] = useState(new Date());
    const monthNames = ["ՀՈՒՆՎԱՐ", "ՓԵՏՐՎԱՐ", "ՄԱՐՏ", "ԱՊՐԻԼ", "ՄԱՅԻՍ", "ՀՈՒՆԻՍ", "ՀՈՒԼԻՍ", "ՕԳՈՍՏՈՍ", "ՍԵՊՏԵՄԲԵՐ", "ՀՈԿՏԵՄԲԵՐ", "ՆՈՅԵՄԲԵՐ", "ԴԵԿՏԵՄԲԵՐ"];

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push({ date: null, currentMonth: false });
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push({ date: new Date(year, month, i), currentMonth: true });
    const totalSlots = 42;
    while (calendarDays.length < totalSlots) {
        const nextDay = calendarDays.length - firstDayOfMonth - daysInMonth + 1;
        calendarDays.push({ date: new Date(year, month + 1, nextDay), currentMonth: false });
    }

    useEffect(() => {
        // fetchData-ն օգտագործում է քո api.js-ի լոգիկան
        fetchData(`houses/${id}`).then(data => setHouse(data));
        fetchData(`houses`).then(data => {
            if (data) setSimilarHouses(data.filter(h => h.id !== parseInt(id)).slice(0, 3));
        });
    }, [id]);

    useEffect(() => {
        // Լոգիկայի ուղղում (localhost -> ENDPOINT)
        fetch(`${ENDPOINT}/api/profile`, { credentials: "include" })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => { setUser(data); setLoading(false); })
            .catch(() => { setUser(null); setLoading(false); });
    }, []);

    const handleLogout = async () => {
        // Լոգիկայի ուղղում (localhost -> ENDPOINT)
        await fetch(`${ENDPOINT}/api/logout`, { method: "POST", credentials: "include" });
        setUser(null);
        window.location.reload();
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") router.push(`/?search=${searchQuery}`);
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 100;
            window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
        }
    };

    const handleDateClick = (date) => {
        if (!date) return;
        if (!selectedDates.start || (selectedDates.start && selectedDates.end)) {
            setSelectedDates({ start: date, end: null });
        } else {
            if (date < selectedDates.start) setSelectedDates({ start: date, end: null });
            else setSelectedDates({ ...selectedDates, end: date });
        }
    };

    const calculateTotal = () => {
        if (!selectedDates.start || !house) return 0;
        let days = 1;
        if (selectedDates.end) {
            const diff = Math.abs(selectedDates.end - selectedDates.start);
            days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
        }
        let dailyPrice = house.price;
        const extraGuests = (guestData.adults + guestData.kids) - 5;
        if (extraGuests > 0) dailyPrice += extraGuests * 5000;
        return days * dailyPrice;
    };
    const renderValue = (value, unit = "") => value ? `${value} ${unit}` : "չկա ինֆորմացիա";

    const handleStartBooking = () => {
        if (!user) {
            router.push("/login");
            return;
        }
        setBookingStep(1);
    };

    const handleFinalBook = async () => {
        if (!contactForm.name.trim() || !contactForm.phone.trim()) {
            alert("Խնդրում ենք լրացնել Անունը և Հեռախոսահամարը");
            return;
        }
        try {
            // Լոգիկայի ուղղում (localhost -> ENDPOINT)
            const response = await fetch(`${ENDPOINT}/api/book`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    houseId: house.id,
                    startDate: selectedDates.start,
                    endDate: selectedDates.end,
                    guests: guestData,
                    totalPrice: calculateTotal(),
                    contactInfo: contactForm
                }),
                credentials: "include"
            });
            const data = await response.json();
            if (data.success) {
                alert("Շնորհավորում ենք: Ամրագրումը հաջողությամբ կատարվեց:");
                setBookingStep(0);
                router.push("/userPage");
            }
        } catch (error) { alert("Կապի սխալ սերվերի հետ"); }
    };

    const linkClass = (path) =>
        `relative pb-1 transition-all ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;

    const CalendarUI = () => (
        <div className="w-full bg-white overflow-hidden rounded-[30px] border border-gray-100 shadow-sm">
            <div className="bg-[#ff9d43] text-white p-5 flex justify-between items-center">
                <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="hover:bg-white/20 p-1 rounded-full"><ChevronLeft /></button>
                <span className="font-black uppercase tracking-widest text-sm md:text-base">{monthNames[month]} {year}</span>
                <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="hover:bg-white/20 p-1 rounded-full"><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 text-center py-4 bg-gray-50 text-[10px] md:text-[12px] font-bold text-gray-400">
                {['ԵՐԿ', 'ԵՐՔ', 'ՉՈՐ', 'ՀՆԳ', 'ՈՒՐԲ', 'ՇԱԲ', 'ԿԻՐ'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 p-4 md:p-6 text-center">
                {calendarDays.map((item, idx) => {
                    const isStart = selectedDates.start?.toDateString() === item.date?.toDateString();
                    const isEnd = selectedDates.end?.toDateString() === item.date?.toDateString();
                    const inRange = selectedDates.start && selectedDates.end && item.date > selectedDates.start && item.date < selectedDates.end;

                    return (
                        <div key={idx}
                            onClick={() => item.currentMonth && handleDateClick(item.date)}
                            className={`h-10 md:h-12 flex items-center justify-center rounded-xl font-bold text-sm md:text-base cursor-pointer transition-all
                            ${!item.date ? 'pointer-events-none' : 'hover:bg-orange-50'}
                            ${isStart || isEnd ? 'bg-[#ff9d43] text-white shadow-md' : ''}
                            ${inRange ? 'bg-orange-100 text-[#ff9d43]' : ''}
                            ${!item.currentMonth && item.date ? 'text-gray-200' : 'text-gray-800'}`}>
                            {item.date?.getDate()}
                        </div>
                    );
                })}
            </div>
        </div>
    );

    if (!house) return <div className="h-screen flex items-center justify-center font-black text-gray-300 uppercase tracking-widest">Բեռնվում է...</div>;

    return (
        <div className="min-h-screen bg-white">
            <header className="relative bg-white border-b border-gray-100 z-[60]">
                <div className="flex justify-between items-center max-w-[1440px] mx-auto py-7 px-4 md:px-8">
                    <Link href="/"><img src="/logo.svg" alt="Logo" width="160" /></Link>
                    <nav className="hidden min-[1321px]:flex items-center gap-10 font-bold text-[13px] uppercase tracking-wider">
                        <Link className={linkClass("/")} href="/">Գլխավոր</Link>
                        <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
                        <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
                        <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
                    </nav>
                    <div className="flex gap-5 items-center">
                        <Globe className="w-5 h-5 cursor-pointer text-gray-400 hover:text-orange-500 transition" />
                        <div className="hidden min-[1321px]:flex items-center">
                            {user ? (
                                <Link href="/userPage" className="text-sm font-black text-orange-500 border-b-2 border-orange-500 pb-1">{user.name}</Link>
                            ) : (
                                <Link href="/login"><User className="w-5 h-5 text-gray-400 hover:text-orange-500 transition" /></Link>
                            )}
                        </div>
                        <div className="relative hidden sm:block">
                            <input type="text" placeholder="Որոնում" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearchKeyDown} className="pl-4 pr-10 py-2.5 border border-gray-200 rounded-3xl text-sm w-48 lg:w-64 focus:outline-none focus:border-orange-400 transition" />
                            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                        </div>
                        <button className="min-[1321px]:hidden p-2 text-gray-600" onClick={() => setIsMenuOpen(true)}><Menu size={30} /></button>
                    </div>
                </div>
            </header>

            <div className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setIsMenuOpen(false)} />
            <div className={`fixed top-0 right-0 h-full w-[320px] sm:w-[400px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                <button className="absolute top-8 right-8 w-11 h-11 border border-gray-100 rounded-full flex items-center justify-center text-gray-400" onClick={() => setIsMenuOpen(false)}><X size={24} /></button>
                <nav className="flex flex-col gap-10 mt-24">
                    <Link href="/" className="text-2xl font-black text-gray-900 uppercase" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
                    <Link href="/sales" className="text-2xl font-black text-gray-800 uppercase" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
                    <Link href="/service" className="text-2xl font-black text-gray-800 uppercase" onClick={() => setIsMenuOpen(false)}>Ծառայություններ</Link>
                    <Link href="/about_us" className="text-2xl font-black text-gray-800 uppercase" onClick={() => setIsMenuOpen(false)}>Մեր մասին</Link>
                    <hr className="my-2 border-gray-100" />
                    {user ? (
                        <div className="flex flex-col gap-6">
                            <Link href="/userPage" className="text-2xl font-black text-orange-500" onClick={() => setIsMenuOpen(false)}>{user.name}</Link>
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-xl font-bold text-red-500 text-left">ԴՈՒՐՍ ԳԱԼ</button>
                        </div>
                    ) : (
                        <Link href="/login" className="text-2xl font-black text-gray-800" onClick={() => setIsMenuOpen(false)}>ՄՈՒՏՔ</Link>
                    )}
                </nav>
            </div>

            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full flex justify-center px-4 pointer-events-none">
                <div className="bg-[#5b616c]/95 backdrop-blur-lg px-8 py-3.5 rounded-full flex items-center gap-8 shadow-2xl border border-white/10 pointer-events-auto">
                    <button onClick={() => scrollToSection('gallery')} className="text-white text-[13px] font-black uppercase tracking-wider hover:text-orange-400 transition">Նկարներ</button>
                    <button onClick={() => scrollToSection('details')} className="text-white text-[13px] font-black uppercase tracking-wider hover:text-orange-400 transition">Տվյալներ</button>
                    <button onClick={() => scrollToSection('amenities')} className="text-white text-[13px] font-black uppercase tracking-wider hover:text-orange-400 transition">Առավելություններ</button>
                    <button onClick={handleStartBooking} className="bg-[#ff9d43] hover:bg-orange-500 text-white px-10 py-3 rounded-full font-black text-[14px] shadow-lg transition-all ml-4">ԱՄՐԱԳՐԵԼ</button>
                </div>
            </div>

            <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
                <section className="flex flex-col md:flex-row justify-between items-start md:items-center border border-gray-100 p-8 md:p-10 rounded-[40px] mb-10 bg-white shadow-sm gap-6">
                    <div className="flex items-center gap-3">
                        <MapPin className="text-orange-500" size={32} />
                        <h1 className="text-3xl md:text-4xl font-black uppercase text-gray-800 tracking-tighter">{house.location}</h1>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                        <span className="text-gray-400 text-xs font-black uppercase tracking-[0.2em] mb-1">Արժեքը</span>
                        <span className="text-[#ff9d43] text-4xl md:text-5xl font-black">{house.price?.toLocaleString()} ֏</span>
                    </div>
                </section>

                <div id="gallery" className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px] mb-16 scroll-mt-28">
                    <div className="md:col-span-2 h-[300px] md:h-full overflow-hidden rounded-[40px] shadow-sm">
                        <img src={house.image[0]} className="w-full h-full object-cover hover:scale-105 transition duration-700" alt="Main" />
                    </div>
                    <div className="md:col-span-2 grid grid-cols-2 gap-4 h-full">
                        {[1, 2, 3, 4].map((idx) => (
                            <div key={idx} className="overflow-hidden rounded-[30px] bg-gray-50 h-[140px] md:h-full relative shadow-sm">
                                {house.image[idx] ? <img src={house.image[idx]} className="w-full h-full object-cover hover:scale-110 transition duration-700" alt="House" /> : <div className="flex items-center justify-center h-full text-gray-300 font-bold uppercase text-[10px]">Նկար չկա</div>}
                            </div>
                        ))}
                    </div>
                </div>

                <div id="details" className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16 scroll-mt-28">
                    <div className="border border-gray-100 p-10 md:p-12 rounded-[45px] shadow-sm bg-white">
                        <h2 className="text-2xl font-black mb-10 text-gray-900 uppercase tracking-tighter italic border-l-4 border-orange-500 pl-5">Հայտարարության մասին</h2>
                        <ul className="space-y-6">
                            <InfoRow icon={<Tag size={18} />} label="Կոդ" value={house.code} />
                            <InfoRow icon={<Maximize size={18} />} label="Շինության մակերես" value={renderValue(house.buildingSurface, "քմ")} />
                            <InfoRow icon={<Users size={18} />} label="Մարդկանց քանակ" value={house.people} />
                            <InfoRow icon={<Bed size={18} />} label="Սենյակներ" value={house.roomsCount} />
                            <InfoRow icon={<Bath size={18} />} label="Սանհանգույց" value={house.bathroomsCount} />
                            <InfoRow icon={<Waves size={18} />} label="Լողավազան" value={house.swimmingPool || "Ոչ"} />
                        </ul>
                    </div>

                    <div className="flex flex-col gap-6">
                        <h2 className="text-xl font-black text-gray-800 uppercase tracking-widest ml-4 italic">Ամրագրման օրացույց</h2>
                        <CalendarUI />
                        <button onClick={handleStartBooking} className="w-full bg-[#ff9d43] text-white py-6 rounded-[30px] font-black text-xl shadow-xl shadow-orange-100 hover:bg-[#f38d2f] transform hover:-translate-y-1 transition-all uppercase tracking-widest">
                            ԱՄՐԱԳՐԵԼ ՀԻՄԱ
                        </button>
                    </div>
                </div>

                <div className="border border-gray-100 p-10 md:p-14 rounded-[45px] shadow-sm bg-white mb-16">
                    <h2 className="text-2xl font-black mb-8 text-gray-900 uppercase tracking-tighter italic">Ընդհանուր Նկարագրություն</h2>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line text-justify italic font-medium">{house.description}</p>
                </div>

                <div id="amenities" className="border border-gray-100 p-10 md:p-14 rounded-[45px] shadow-sm bg-white mb-20 scroll-mt-28">
                    <h2 className="text-2xl font-black mb-10 text-gray-900 uppercase tracking-tighter italic">Առավելություններ</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {house.amenities?.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4 bg-gray-50 p-5 rounded-[25px] border border-gray-100 group hover:border-orange-400 transition-all">
                                <CheckCircle2 size={26} className="text-[#ff9d43] flex-shrink-0" />
                                <span className="font-bold text-gray-700 group-hover:text-black transition-colors">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div id="similar" className="mt-32 mb-20 scroll-mt-28">
                    <div className="flex items-center gap-6 mb-16">
                        <div className="h-px bg-gray-200 flex-grow"></div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter text-gray-900">Նման առաջարկներ</h2>
                        <div className="h-px bg-gray-200 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {similarHouses.map(item => (
                            <Link key={item.id} href={`/houses/${item.id}`} className="group bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                                <div className="h-60 relative overflow-hidden">
                                    <img src={item.image[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="House" />
                                    <div className="absolute top-5 left-5 bg-white/30 backdrop-blur-md p-2 rounded-full"><Heart size={20} className="text-white" /></div>
                                </div>
                                <div className="p-8">
                                    <h4 className="font-black text-2xl mb-3 text-gray-800">{item.location}</h4>
                                    <p className="text-[#ff9d43] font-black text-2xl">{item.price?.toLocaleString()} ֏</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

            {/* Modals ... (Պահպանված է նույնությամբ) */}
            {bookingStep === 1 && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[45px] w-full max-w-[550px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 border-b flex justify-between items-center">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Ամրագրում</h3>
                            <X className="cursor-pointer text-gray-300 hover:text-black transition" onClick={() => setBookingStep(0)} size={30} />
                        </div>
                        <div className="p-8">
                            <CalendarUI />
                            <div className="mt-10 p-7 bg-gray-50 rounded-[35px] border border-gray-100">
                                <p className="font-black text-gray-800 mb-5 uppercase text-xs tracking-[0.2em]">Գիշերակացի առկայություն</p>
                                <div className="flex gap-12">
                                    <label className="flex items-center gap-4 font-black cursor-pointer group">
                                        <input type="radio" name="night-modal" onChange={() => setHasNightStay('yes')} className="w-7 h-7 accent-[#ff9d43] cursor-pointer" />
                                        <span className="text-lg group-hover:text-orange-500 transition">ԱՅՈ</span>
                                    </label>
                                    <label className="flex items-center gap-4 font-black cursor-pointer group">
                                        <input type="radio" name="night-modal" onChange={() => setHasNightStay('no')} className="w-7 h-7 accent-[#ff9d43] cursor-pointer" />
                                        <span className="text-lg group-hover:text-orange-500 transition">ՈՉ</span>
                                    </label>
                                </div>
                            </div>
                            <button onClick={() => setBookingStep(2)} disabled={!selectedDates.start || !hasNightStay}
                                className={`w-full py-6 mt-8 rounded-full font-black text-xl shadow-xl transition-all transform hover:-translate-y-1
                                ${(!selectedDates.start || !hasNightStay) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-[#ff9d43] text-white hover:bg-orange-500 shadow-orange-100'}`}>
                                ՇԱՐՈՒՆԱԿԵԼ
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {bookingStep === 2 && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[45px] w-full max-w-[550px] shadow-2xl p-10 md:p-14 animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-12">
                            <button onClick={() => setBookingStep(1)} className="p-3 hover:bg-gray-100 rounded-full transition"><ChevronLeft size={35} className="text-gray-400" /></button>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Հյուրեր</h3>
                            <X className="cursor-pointer text-gray-300 hover:text-black" onClick={() => setShowExitConfirm(true)} size={30} />
                        </div>
                        <div className="space-y-6">
                            <GuestCounter label="Մեծահասակներ" val={guestData.adults} onAdd={() => setGuestData({ ...guestData, adults: guestData.adults + 1 })} onRemove={() => setGuestData({ ...guestData, adults: Math.max(1, guestData.adults - 1) })} />
                            <GuestCounter label="Երեխաներ" val={guestData.kids} onAdd={() => setGuestData({ ...guestData, kids: guestData.kids + 1 })} onRemove={() => setGuestData({ ...guestData, kids: Math.max(0, guestData.kids - 1) })} />
                            <GuestCounter label="Մանկահասակներ" val={guestData.babies} onAdd={() => setGuestData({ ...guestData, babies: guestData.babies + 1 })} onRemove={() => setGuestData({ ...guestData, babies: Math.max(0, guestData.babies - 1) })} />
                        </div>
                        <div className="mt-16 flex flex-col md:flex-row justify-between items-center border-t border-dashed pt-10 gap-6">
                            <div className="flex flex-col items-center md:items-start">
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Ընդհանուր գինը</span>
                                <span className="text-4xl font-black text-[#ff9d43]">{calculateTotal().toLocaleString()} ֏</span>
                            </div>
                            <button onClick={() => setBookingStep(3)} className="bg-[#ff9d43] text-white px-16 py-5 rounded-full font-black text-xl shadow-2xl shadow-orange-100 hover:bg-orange-500 transition-all uppercase tracking-widest">ՀԱՍՏԱՏԵԼ</button>
                        </div>
                    </div>
                </div>
            )}

            {bookingStep === 3 && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-[45px] w-full max-w-[550px] shadow-2xl p-10 md:p-14 text-center animate-in zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-12">
                            <button onClick={() => setBookingStep(2)} className="p-3 hover:bg-gray-100 rounded-full transition"><ChevronLeft size={35} className="text-gray-400" /></button>
                            <h3 className="text-3xl font-black uppercase tracking-tighter">Տվյալներ</h3>
                            <X className="cursor-pointer text-gray-300 hover:text-black" onClick={() => setShowExitConfirm(true)} size={30} />
                        </div>
                        <div className="space-y-5 mb-12">
                            <input type="text" placeholder="Անուն Ազգանուն" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} className="w-full border-2 border-gray-100 p-6 rounded-[25px] outline-none focus:border-[#ff9d43] font-black text-lg transition-all" />
                            <div className="flex border-2 border-gray-100 rounded-[25px] overflow-hidden focus-within:border-[#ff9d43] transition-all">
                                <div className="bg-gray-50 px-6 flex items-center border-r-2 border-gray-100 font-black text-gray-400">🇦🇲 +374</div>
                                <input type="tel" placeholder="Հեռախոսահամար" value={contactForm.phone} onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })} className="w-full p-6 outline-none font-black text-lg" />
                            </div>
                            <input type="email" placeholder="Էլ. հասցե" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full border-2 border-gray-100 p-6 rounded-[25px] outline-none focus:border-[#ff9d43] font-black text-lg transition-all" />
                        </div>
                        <button onClick={handleFinalBook} className="w-full bg-[#ff9d43] text-white py-6 rounded-full font-black text-2xl shadow-2xl shadow-orange-100 hover:bg-orange-500 transition-all uppercase tracking-tighter">ԱՎԱՐՏԵԼ ԱՄՐԱԳՐՈՒՄԸ</button>
                    </div>
                </div>
            )}

            {showExitConfirm && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md">
                    <div className="bg-white p-12 rounded-[45px] shadow-2xl text-center max-w-sm w-full animate-in zoom-in-95 duration-200">
                        <h3 className="font-black text-2xl mb-10 uppercase tracking-tighter text-gray-800">Հրաժարվել ամրագրումի՞ց</h3>
                        <div className="flex gap-4">
                            <button onClick={() => setShowExitConfirm(false)} className="flex-1 py-5 border-2 border-gray-100 rounded-[25px] font-black text-gray-400 hover:bg-gray-50 transition uppercase">ՈՉ</button>
                            <button onClick={() => { setShowExitConfirm(false); setBookingStep(0); }} className="flex-1 py-5 bg-red-500 text-white rounded-[25px] font-black shadow-xl shadow-red-100 hover:bg-red-600 transition uppercase">ԱՅՈ</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative text-white py-24 mt-20 overflow-hidden min-h-[500px]">
                <div className="absolute inset-0 z-0">
                    <Image src="/image/background/background.jpg" alt="Background" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
                </div>
                <div className="relative z-10 max-w-6xl mx-auto border border-white/20 rounded-[50px] p-10 md:p-16 text-center backdrop-blur-md bg-white/5 shadow-2xl">
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-widest mb-10">Տեղադրել հայտարարություն</h2>
                    <p className="text-gray-300 mb-12 font-medium italic text-lg leading-relaxed">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 px-4">
                        <input type="text" placeholder="Անուն Ազգանուն" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-orange-400 text-white transition-all placeholder:text-gray-400" />
                        <input type="tel" placeholder="Հեռախոսահամար" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-orange-400 text-white transition-all placeholder:text-gray-400" />
                        <input type="email" placeholder="Էլ․ Հասցե" className="bg-white/10 border border-white/20 rounded-2xl px-6 py-4 outline-none focus:border-orange-400 text-white transition-all placeholder:text-gray-400" />
                        <button className="bg-orange-400 text-black px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl">Ուղարկել</button>
                    </div>
                </div>
            </div>

            <footer className="bg-[#101623] text-white pt-20">
                <h2 className="text-center text-3xl mb-16 tracking-[0.4em] font-light uppercase border-b border-white/5 pb-10">Կոնտակտներ</h2>
                <div className="max-w-[1440px] mx-auto flex flex-wrap justify-center gap-12 md:gap-20 px-4 mb-20 font-black text-gray-300 uppercase tracking-[0.2em] text-[12px]">
                    <div className="flex items-center gap-3"><Phone size={20} className="text-orange-500" /> 041-611-611 / 044-611-611</div>
                    <div className="flex items-center gap-3"><Mail size={20} className="text-orange-500" /> amaranoc.info@gmail.com</div>
                    <div className="flex items-center gap-3"><Instagram size={20} className="text-orange-500" /> amaranoc.am</div>
                    <div className="flex items-center gap-3"><Facebook size={20} className="text-orange-500" /> amaranoc.am</div>
                    <div className="flex items-center gap-3"><MapPin size={20} className="text-orange-500" /> Թումանյան 5</div>
                </div>
                <div className="w-full relative h-48 opacity-40 grayscale hover:grayscale-0 transition duration-1000">
                    <Image src="/image/footer-background.webp" alt="footer" fill className="object-cover" />
                </div>
            </footer>
        </div>
    );
}

function InfoRow({ icon, label, value }) {
    return (
        <li className="flex justify-between items-center border-b border-gray-50 pb-5">
            <div className="flex items-center gap-5 text-gray-400 font-black uppercase tracking-[0.2em] text-[11px]">
                <span className="p-3 bg-orange-50 rounded-[20px] text-[#ff9d43] shadow-inner">{icon}</span> {label}
            </div>
            <span className="font-black text-gray-700 text-xl tracking-tighter">{value}</span>
        </li>
    );
}

function GuestCounter({ label, val, onAdd, onRemove }) {
    return (
        <div className="flex justify-between items-center bg-gray-50/50 p-6 rounded-[35px] border border-gray-100 shadow-sm">
            <span className="font-black text-gray-800 text-xl uppercase tracking-tighter italic">{label}</span>
            <div className="flex items-center gap-8">
                <button onClick={onRemove} className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-3xl font-black text-gray-300 hover:text-orange-500 hover:border-orange-500 border border-transparent transition-all">-</button>
                <span className="font-black text-3xl text-gray-900 w-8 text-center">{val}</span>
                <button onClick={onAdd} className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center text-3xl font-black text-gray-300 hover:text-orange-500 hover:border-orange-500 border border-transparent transition-all">+</button>
            </div>
        </div>
    );
}