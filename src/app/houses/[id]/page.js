"use client"
import { useState, useEffect } from "react";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { fetchData } from "@/lib/api.js";
import { MapPin, X, CheckCircle2, Home, Maximize, Users, Bed, Bath, Waves, Tag, User, Globe, Search, Facebook, Instagram, Phone, Mail, Menu } from "lucide-react";
import Link from "next/link"
import Image from "next/image";

export default function HouseDetails() {
    const { id } = useParams();
    const [house, setHouse] = useState(null);
    const [similarHouses, setSimilarHouses] = useState([]);
    const renderValue = (value, unit = "") => value ? `${value} ${unit}` : "չկա ինֆորմացիա";
    const pathName = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");

    useEffect(() => {
        fetchData(`houses/${id}`).then(data => setHouse(data));

        fetchData(`houses`).then(data => {
            if (data) setSimilarHouses(data.filter(h => h.id !== parseInt(id))).slice(0, 3);
        });
    }, [id]);

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || "");
    }, [searchParams]);

    useEffect(() => {
        fetch("http://localhost:5000/api/profile", { credentials: "include" })
            .then(res => res.ok ? res.json() : Promise.reject())
            .then(data => { setUser(data); setLoading(false); })
            .catch(() => { setUser(null); setLoading(false); });
    }, []);

    const handleSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            router.push(`/?search=${searchQuery}`);
        }
    };

    const handleLogout = async () => {
        await fetch("http://localhost:5000/api/logout", { method: "POST", credentials: "include" });
        setUser(null);
        window.location.href = "/";
    };

    const linkClass = (path) =>
        `relative pb-1 transition-all ${pathName === path ? "text-orange-500 after:w-full" : "text-gray-700 hover:text-orange-500 after:w-0 hover:after:w-full"} 
     after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1px] after:bg-orange-500 after:transition-all after:duration-300`;


    if (!house) return <div className="p-20 text-center text-xl">Բեռնվում է...</div>


    return (
        <>
            <header className="relative bg-white border-b border-gray-100 z-[60]">
                <div className="flex justify-between items-center max-w-[1440px] mx-auto py-7 px-4">
                    <Link href="/"><img src="/logo.svg" alt="Logo" width="170" /></Link>

                    <nav className="hidden min-[1321px]:flex items-center gap-10 font-medium text-sm">
                        <Link className={linkClass("/")} href="/">Գլխավոր</Link>
                        <Link className={linkClass("/sales")} href="/sales">Զեղչեր</Link>
                        <Link className={linkClass("/service")} href="/service">Ծառայություններ</Link>
                        <Link className={linkClass("/about_us")} href="/about_us">Մեր մասին</Link>
                    </nav>

                    <div className="flex gap-5 items-center">
                        <Globe className="w-5 h-5 cursor-pointer text-gray-700 hover:text-orange-500 transition" />

                        <div className="hidden min-[1321px]:flex items-center">
                            {loading ? null : user ? (
                                <div className="flex items-center gap-4">
                                    <Link href="/userPage" className="text-[14px] font-bold text-orange-500 border-b border-orange-500">{user.name}</Link>
                                    <button onClick={handleLogout} className="text-sm text-red-500 hover:underline">Դուրս գալ</button>
                                </div>
                            ) : (
                                <Link href="/login"><User className="w-5 h-5 cursor-pointer text-gray-700" /></Link>
                            )}
                        </div>

                        <div className="relative hidden sm:block">
                            <input
                                type="text"
                                placeholder="Որոնում"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearchKeyDown}
                                className="pl-4 pr-10 py-2 border rounded-3xl text-sm w-48 lg:w-64 focus:outline-none focus:border-orange-400"
                            />
                            <Search className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        </div>

                        <button className="min-[1321px]:hidden p-2 text-gray-700" onClick={() => setIsMenuOpen(true)}>
                            <Menu size={30} />
                        </button>
                    </div>
                </div>

                <div className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] transition-opacity ${isMenuOpen ? "visible opacity-100" : "invisible opacity-0"}`} onClick={() => setIsMenuOpen(false)} />
                <div className={`fixed top-0 right-0 h-full w-[350px] sm:w-[450px] bg-white z-[110] shadow-2xl p-10 flex flex-col transform transition-transform duration-500 ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <button className="absolute top-8 right-8 w-11 h-11 border border-gray-200 rounded-full flex items-center justify-center" onClick={() => setIsMenuOpen(false)}>
                        <X size={24} />
                    </button>
                    <nav className="flex flex-col gap-10 mt-24">
                        <Link href="/" className="text-[20px] font-bold text-gray-900" onClick={() => setIsMenuOpen(false)}>Գլխավոր</Link>
                        <Link href="/sales" className="text-[20px] font-bold text-gray-800" onClick={() => setIsMenuOpen(false)}>Զեղչեր</Link>
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
            </header>

            <main className="max-w-[1440px] mx-auto px-4 py-10">
                <section className="flex justify-between items-center border border-gray-100 p-6 rounded-[25px] mb-8 shadow-sm bg-white">
                    <div className="flex items-center gap-2">
                        <MapPin className="text-orange-500" />
                        <h1 className="text-2xl font-black uppercase text-gray-800">{house.location}</h1>
                    </div>
                    <div className="flex gap-10">
                        <div className="flex flex-col items-end">
                            <span className="text-gray-400 text-sm font-medium">Արժեքը</span>
                            <span className="text-orange-500 text-3xl font-black">{house.price?.toLocaleString()} ֏</span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px] mb-12">
                    <div className="col-span-2 row-span-2 relative overflow-hidden rounded-[30px]">
                        <img src={house.image[0]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Main" />
                    </div>
                    {[1, 2, 3, 4].map((index) => (
                        <div key={index} className="col-span-1 row-span-1 relative overflow-hidden rounded-[20px] bg-gray-100">
                            {house.image[index] ? (
                                <img src={house.image[index]} className="w-full h-full object-cover hover:scale-105 transition duration-500" alt="Detail" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-300 text-xs">Նկար չկա</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <div className="border border-gray-100 p-8 rounded-[35px] shadow-sm bg-white">
                        <h2 className="text-xl font-bold mb-8 text-gray-800 border-b pb-4">Հայտարարության մասին</h2>
                        <ul className="space-y-5">
                            <InfoRow icon={<Tag size={18} />} label="Կոդ" value={house.code} />
                            <InfoRow icon={<Home size={18} />} label="Շինության մակերես" value={renderValue(house.buildingSurface, "քմ")} />
                            <InfoRow icon={<Maximize size={18} />} label="Ընդհանուր մակերես" value={renderValue(house.totalArea, "քմ")} />
                            <InfoRow icon={<Users size={18} />} label="Մարդկանց քանակ" value={renderValue(house.people)} />
                            <InfoRow icon={<Bed size={18} />} label="Սենյակների քանակ" value={renderValue(house.roomsCount)} />
                            <InfoRow icon={<Bath size={18} />} label="Սանհանգույց" value={renderValue(house.bathroomsCount)} />
                            <InfoRow icon={<Waves size={18} />} label="Լողավազան" value={house.swimmingPool || "Չկա"} />
                        </ul>
                    </div>

                    <div className="border border-gray-100 p-8 rounded-[35px] shadow-sm bg-white">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 uppercase tracking-tight">Նշեք Ձեր ցանկալի օրերը</h2>
                        {/* Այստեղ կարող եք տեղադրել ձեր Calendar-ի կոդը */}
                        <div className="bg-gray-50 h-64 rounded-3xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 italic">
                            Օրացույցը բեռնված է...
                        </div>
                    </div>
                </div>

                <div className="border border-gray-100 p-10 rounded-[35px] shadow-sm bg-white mb-12">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Ընդհանուր Նկարագրություն</h2>
                    <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                        {house.description || "Նկարագրություն չկա:"}
                    </p>
                </div>

                {house.amenities && (
                    <div className="border border-gray-100 p-10 rounded-[35px] shadow-sm bg-white mb-12">
                        <h2 className="text-2xl font-bold mb-8 text-gray-800">Առավելություններ</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {house.amenities.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 text-gray-700">
                                    <CheckCircle2 size={20} className="text-orange-500" />
                                    <span className="font-medium text-[15px]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-20">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="h-px bg-gray-200 flex-grow"></div>
                        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Նման առաջարկներ</h2>
                        <div className="h-px bg-gray-200 flex-grow"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {similarHouses.map(item => (
                            <Link key={item.id} href={`/houses/${item.id}`} className="group bg-white rounded-[30px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition">
                                <div className="h-48 relative overflow-hidden">
                                    <img src={item.image[0]} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                                </div>
                                <div className="p-5">
                                    <h4 className="font-bold text-lg">{item.location}</h4>
                                    <p className="text-orange-500 font-bold">{item.price?.toLocaleString()} ֏</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>

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
        </>
    )
}

function InfoRow({ icon, label, value }) {
    return (
        <li className="flex justify-between items-center border-b border-gray-50 pb-2">
            <div className="flex items-center gap-3 text-gray-500">
                {icon} <span className="text-sm">{label}</span>
            </div>
            <span className="font-bold text-gray-800">{value}</span>
        </li>
    );
}