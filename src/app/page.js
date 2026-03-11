"use client"

import {
  User, Globe, Search, Facebook, Instagram, Phone, Mail, MapPin, Tag, Map, Calendar,
  ChevronRight, ChevronLeft, Home as HomeIcon, Pyramid, Warehouse, Waves, Trees,
  Mountain, Flame, Palmtree, Coffee, Building, Layout, Key, Building2, Plus, Minus, Heart, X
} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { fetchData } from "@/lib/api.js";

export default function Home() {
  const pathName = usePathname();
  const [houses, setHouses] = useState([]);
  const scrollRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegions, setSelectedRegions] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [peopleCount, setPeopleCount] = useState(1);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery) params.append('search', searchQuery);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (peopleCount > 1) params.append('people', peopleCount);

    selectedRegions.forEach(reg => params.append('region', reg));

    fetchData(`houses?${params.toString()}`).then(data => {
      if (data) setHouses(data);
    });
  }, [searchQuery, selectedRegions, minPrice, maxPrice, peopleCount]);

  const getTodayDate = () => {
    return new Date().toLocaleDateString('hy-AM', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/profile", { credentials: "include" })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => { setUser(data); setLoading(false); })
      .catch(() => { setUser(null); setLoading(false); });
  }, []);

  const handleRegionChange = (regionName) => {
    setSelectedRegions(prev =>
      prev.includes(regionName)
        ? prev.filter(r => r !== regionName)
        : [...prev, regionName]
    );
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/logout", { method: "POST", credentials: "include" });
    setUser(null);
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 10);
      setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScroll();
      el.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        el.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const linkClass = (path) =>
    `relative pb-1 transition-all ${pathName === path ? "after:w-full" : "after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;

  const categories = [
    { id: 1, label: "Առանձնատներ", icon: HomeIcon },
    { id: 2, label: "Frame houses", icon: Pyramid },
    { id: 3, label: "Տնակներ", icon: Warehouse },
    { id: 4, label: "Փակ լողավազան", icon: Waves },
    { id: 5, label: "Աղմուկից հեռու", icon: Trees },
    { id: 6, label: "Շքեղ տեսարան", icon: Mountain },
    { id: 7, label: "Պահանջված", icon: Flame },
    { id: 8, label: "Լճի ափին", icon: Palmtree },
    { id: 9, label: "Գետի ափին", icon: Waves },
    { id: 10, label: "Տաղավար", icon: Coffee },
    { id: 11, label: "Հյուրանոցներ", icon: Building },
    { id: 12, label: "Դիզայն", icon: Layout },
    { id: 13, label: "Նոր", icon: Key },
    { id: 14, label: "Բնակարաններ", icon: Building2 },
  ];

  const monthNames = [
    "ՀՈՒՆՎԱՐ", "ՓԵՏՐՎԱՐ", "ՄԱՐՏ", "ԱՊՐԻԼ", "ՄԱՅԻՍ", "ՀՈՒՆԻՍ",
    "ՀՈՒԼԻՍ", "ՕԳՈՍՏՈՍ", "ՍԵՊՏԵՄԲԵՐ", "ՀՈԿՏԵՄԲԵՐ", "ՆՈՅԵՄԲԵՐ", "ԴԵԿՏԵՄԲԵՐ"
  ];
  const nextMonth = () => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)));
  const prevMonth = () => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)));
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays = [];

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, currentMonth: false });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, currentMonth: true });
  }

  const remainingSlots = 42 - calendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({ day: i, currentMonth: false });
  }

  return (
    <div className="min-h-screen bg-white">
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
          {loading ? null : user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold">{user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Դուրս գալ</button>
            </div>
          ) : (
            <Link className={linkClass("/login")} href="/login"><User className="w-5 h-5 cursor-pointer" /></Link>
          )}
          <div className="relative">
            <input
              type="text"
              placeholder="Որոնում"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 border rounded-3xl text-sm w-64 focus:outline-none"
            />
            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 flex gap-10 mt-6">

        <aside className="w-[320px] flex-shrink-0 flex flex-col gap-8 border border-gray-100 rounded-[35px] p-8 h-fit sticky top-5 shadow-sm overflow-y-auto max-h-[90vh] no-scrollbar">
          <section>
            <h3 className="font-bold text-lg mb-4">Տարածաշրջան</h3>
            <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto no-scrollbar pr-2">
              {["Օհանավան", "Բջնի", "Դիլիջան", "Ծաղկաձոր", "Գառնի", "Սևան"].map((t) => (
                <label key={t} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(t)}
                    onChange={() => handleRegionChange(t)}
                    className="w-5 h-5 rounded border-gray-300 accent-black cursor-pointer"
                  />
                  <span className="text-gray-600 text-sm group-hover:text-black">{t}</span>
                </label>
              ))}
            </div>
          </section>

          <hr className="border-gray-50" />

          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Արժեք</h3>
              <div className="flex gap-1.5">
                {["֏", "$", "€", "₽"].map((c, i) => (
                  <button key={c} className={`w-8 h-8 rounded-full border text-xs flex items-center justify-center transition-all ${i === 0 ? "bg-[#1d2331] text-white border-[#1d2331]" : "border-gray-200 hover:border-black"}`}>{c}</button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Սկսած"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50/50"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Մինչև"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2 text-sm bg-gray-50/50"
              />
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-700">Մարդկանց թույլատրելի քանակ</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPeopleCount(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              ><Minus size={18} /></button>
              <input type="text" value={peopleCount} className="w-12 text-center font-bold border-gray-200 border rounded-lg py-1" readOnly />
              <button
                onClick={() => setPeopleCount(prev => prev + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              ><Plus size={18} /></button>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-700">Գիշերակացի առկայություն</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-8 py-2.5 rounded-full bg-[#1d2331] text-white text-sm">Բոլորը</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">Այո</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">Ոչ</button>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-700">Մարդկանց թույլատրելի քանակը գիշերակացով</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setPeopleCount(prev => Math.max(1, prev - 1))}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              ><Minus size={18} /></button>
              <input type="text" value={peopleCount} className="w-12 text-center font-bold border-gray-200 border rounded-lg py-1" readOnly />
              <button
                onClick={() => setPeopleCount(prev => prev + 1)}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              ><Plus size={18} /></button>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-700">Սենյակների քանակ</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-8 py-2.5 rounded-full bg-[#1d2331] text-white text-sm">Բոլորը</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">1</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">2</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">3</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">4</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">5</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">6 և ավելի</button>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-700">Սանհանգույցների քանակ</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-8 py-2.5 rounded-full bg-[#1d2331] text-white text-sm">Բոլորը</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">1</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">2</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">3 և ավելի</button>
            </div>
          </section>

          <section>
            <h3 className="font-bold text-sm mb-4 uppercase text-gray-700">Լողավազան</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-8 py-2.5 rounded-full bg-[#1d2331] text-white text-sm">Բոլորը</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">Բաց</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">Փակ</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">Տաքացվող</button>
              <button className="px-8 py-2.5 rounded-full border border-gray-200 text-sm text-gray-500">Առանց լողավազանի</button>
            </div>
          </section>
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setIsCalendarOpen(true)}
              className="flex items-center justify-center border border-gray-300 rounded-full w-10 h-10 hover:bg-gray-50">
              <Calendar size={18} />
            </button>
          </div>

          {isCalendarOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
              <div className="bg-white rounded-[20px] w-full max-w-[480px] shadow-2xl overflow-hidden border border-gray-100">

                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <h3 className="text-[18px] font-bold text-[#111827]">Նշեք Ձեր ցանկալի օրերը</h3>
                  <button onClick={() => setIsCalendarOpen(false)} className="text-gray-400 hover:text-black transition-colors">
                    <X size={22} />
                  </button>
                </div>

                <div className="bg-[#ff9d43] text-white flex justify-between items-center px-6 py-3">
                  <button onClick={prevMonth} className="p-1 hover:bg-white/20 rounded-full transition-all">
                    <ChevronLeft size={24} />
                  </button>
                  <span className="text-[18px] font-bold tracking-widest uppercase">
                    {monthNames[month]} {year}
                  </span>
                  <button onClick={nextMonth} className="p-1 hover:bg-white/20 rounded-full transition-all">
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-7 text-center py-4 border-b border-gray-100 bg-gray-50/50">
                  {['երկ', 'երք', 'չոր', 'հնգ', 'ուրբ', 'շաբ', 'կիր'].map((day, i) => (
                    <span key={day} className={`text-[13px] font-bold uppercase ${i >= 5 ? 'text-[#ff9d43]' : 'text-gray-400'}`}>
                      {day}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-y-2 px-4 py-6 text-center">
                  {calendarDays.map((item, index) => (
                    <div
                      key={index}
                      className={`
              h-10 flex items-center justify-center text-[15px] font-bold rounded-lg transition-all
              ${item.currentMonth
                          ? 'text-[#111827] cursor-pointer hover:bg-orange-100 hover:text-orange-500'
                          : 'text-gray-200'}
            `}
                    >
                      {item.day}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4 p-6 pt-0 border-t border-gray-50 mt-2">
                  <button
                    onClick={() => setIsCalendarOpen(false)}
                    className="px-8 py-2 text-[15px] font-bold text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                  >
                    Փակել
                  </button>
                  <button
                    className="px-10 py-3 bg-[#f1f2f4] text-gray-400 text-[15px] font-bold rounded-[20px] transition-all"
                  >
                    Հաստատել
                  </button>
                </div>

              </div>
            </div>
          )}

          <div className="relative border-t border-gray-100 pt-8 mb-10 group">
            {showLeft && (
              <button onClick={() => scroll("left")} className="absolute left-0 top-[40%] -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:scale-110 transition-all">
                <ChevronLeft size={18} />
              </button>
            )}
            <div ref={scrollRef} onScroll={checkScroll} className="flex items-center gap-12 overflow-x-auto no-scrollbar scroll-smooth">
              {categories.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center gap-2.5 cursor-pointer group/item min-w-max pb-4">
                  <cat.icon size={24} className="text-gray-500 group-hover/item:text-black transition-colors" />
                  <span className="text-[12px] font-medium text-gray-500 group-hover/item:text-black">{cat.label}</span>
                </div>
              ))}
            </div>
            {showRight && (
              <button onClick={() => scroll("right")} className="absolute right-0 top-[40%] -translate-y-1/2 z-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:scale-110 transition-all">
                <ChevronRight size={18} />
              </button>
            )}
          </div>

          <main>
            <h2 className="text-[22px] font-bold text-gray-800 mb-8 tracking-tight">Լավագույն առաջարկներ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {houses.length > 0 ? houses.map((house) => (
                <div key={house.id} className="bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group/card">
                  <div className="relative h-64 w-full overflow-hidden">
                    <img src={house.image} alt={house.location} className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500" />
                    <div className="absolute bottom-5 right-5 bg-white/40 backdrop-blur-md p-2 rounded-full cursor-pointer hover:bg-white transition-all">
                      <Heart size={20} className="text-gray-800" />
                    </div>
                  </div>
                  <div className="p-6 flex flex-col gap-5">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 font-bold text-[15px] text-gray-800"><MapPin size={17} className="text-orange-400" /> {house.location}</div>
                        <div className="flex items-center gap-2 text-[15px] font-bold text-gray-500"><User size={17} className="text-orange-400" /> {house.people}</div>
                      </div>
                      {house.rating !== "0" && (
                        <div className="bg-orange-400 text-white px-2.5 py-1 rounded-xl text-[13px] font-bold flex items-center gap-1">★ {house.rating}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[22px] font-black text-[#343a4a]">
                      <Tag size={22} className="text-orange-400" /> {house.price} <span className="font-normal text-xl ml-1"></span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-20 text-gray-400 italic">Ոչինչ չի գտնվել</div>
              )}
            </div>
          </main>
        </div>
      </div>

      <div className="bg-black text-white py-20 mt-20">
        <div className="max-w-6xl mx-auto border border-gray-700 rounded-3xl p-10 text-center">
          <div className="flex justify-center items-center gap-8 mb-10">
            <div className="w-40 h-px bg-white/30"></div>
            <h2 className="text-3xl font-light uppercase tracking-wider">Տեղադրել հայտարարություն</h2>
            <div className="w-40 h-px bg-white/30"></div>
          </div>
          <p className="mb-10 text-gray-400">Մուտքագրեք Ձեր տվյալները նշված դաշտերում և մենք կկապնվենք Ձեզ հետ</p>
          <div className="flex flex-wrap justify-center gap-4">
            <input type="text" placeholder="Անուն Ազգանուն" className="bg-transparent border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 focus:border-orange-400 transition-colors outline-none" />
            <input type="tel" placeholder="Հեռախոսահամար" className="bg-transparent border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none" />
            <input type="email" placeholder="Էլ․ Հասցե" className="bg-transparent border border-gray-600 rounded-2xl px-6 py-3 w-full md:w-64 outline-none" />
            <button className="bg-orange-400 text-black px-10 py-3 rounded-2xl font-bold hover:bg-orange-500 transition-all">Ուղարկել</button>
          </div>
        </div>
      </div>

      <div className="bg-[#101623] text-white pt-10">
        <h2 className="text-center text-3xl mb-10">ԿՈՆՏԱԿՏՆԵՐ</h2>
        <div className="flex flex-wrap justify-center gap-10 px-4 mb-10">
          <div className="flex items-center gap-2"><Phone size={20} /> <span className="text-sm">041-611-611 / 044-611-611</span></div>
          <div className="flex items-center gap-2 uppercase"><Mail size={20} /> <span className="text-sm tracking-wider">amaranoc.info@gmail.com</span></div>
          <div className="flex items-center gap-2 uppercase"><Instagram size={20} /> <span className="text-sm tracking-wider">amaranoc.am</span></div>
          <div className="flex items-center gap-2 uppercase"><Facebook size={20} /> <span className="text-sm tracking-wider">amaranoc.am</span></div>
          <div className="flex items-center gap-2 uppercase"><MapPin size={20} /> <span className="text-sm tracking-wider">Թումանյան 5</span></div>
        </div>
        <div className="text-center text-gray-500 text-xs pb-10 space-y-2">
          <p className="underline cursor-pointer">Գաղտնիության քաղաքականություն</p>
          <p>Ամառանոց ՍՊԸ | Amaranoc LLC | Амараноц OOO</p>
        </div>
        <div className="w-full relative h-40">
          <Image src="/image/footer-background.webp" alt="footer" fill className="object-cover opacity-40" />
        </div>
      </div>
    </div>
  );
}